import { z } from 'zod';
import type { IActivity, IDayPlan } from '../types';
import { LLMError } from '../utils/AppError.js';
import { tripInputSchema } from '../utils/validate.js';
import { generateCompletion } from './llm.service.js';

export type TripInput = z.infer<typeof tripInputSchema>;
export type DayPlan = IDayPlan;
export type Activity = IActivity;

const JSON_ONLY =
  'Respond ONLY with valid compact JSON. No markdown, no explanation, no comments, no trailing commas, no backticks.';
const ITINERARY_SHAPE =
  '{ "days": [{ "dayNumber": 1, "activities": [{ "id": "uuid", "title": "Activity name", "description": "Short description", "estimatedCost": 0 }] }] }';
const ACTIVITIES_SHAPE =
  '{ "activities": [{ "id": "uuid", "title": "Activity name", "description": "Short description", "estimatedCost": 0 }] }';

const estimatedCostSchema = z.union([z.number(), z.string(), z.null(), z.undefined()]).transform((value): number => {
  if (typeof value === 'number') return Number.isFinite(value) && value >= 0 ? value : 0;
  if (typeof value !== 'string') return 0;

  const numeric = Number(value.trim());
  return Number.isFinite(numeric) && numeric >= 0 ? numeric : 0;
});

const activitySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  estimatedCost: estimatedCostSchema,
});

const itinerarySchema = z.object({
  days: z.array(
    z.object({
      dayNumber: z.coerce.number().int().min(1),
      activities: z.array(activitySchema),
    }),
  ),
});

const activitiesSchema = z.object({
  activities: z.array(activitySchema),
});

function cleanJson(text: string): string {
  const withoutFence = text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  const jsonStart = withoutFence.indexOf('{');
  const jsonEnd = withoutFence.lastIndexOf('}');
  return jsonStart >= 0 && jsonEnd >= jsonStart ? withoutFence.slice(jsonStart, jsonEnd + 1) : withoutFence;
}

function parseJson<TSchema extends z.ZodTypeAny>(text: string, schema: TSchema): z.output<TSchema> {
  try {
    return schema.parse(JSON.parse(cleanJson(text)));
  } catch (err) {
    throw new LLMError(err instanceof Error ? err.message : 'Invalid LLM JSON response');
  }
}

function logParseFailure(service: string, text: string, err: unknown): void {
  console.error({
    service,
    success: false,
    error: 'Failed to parse LLM JSON',
    reason: err instanceof Error ? err.message : 'Unknown parse error',
    responseLength: text.length,
    responsePreview: text.slice(0, 1000),
  });
}

async function repairJson<TSchema extends z.ZodTypeAny>(
  service: string,
  text: string,
  schema: TSchema,
  shape: string,
  maxTokens: number,
): Promise<z.output<TSchema>> {
  const repairPrompt = `${JSON_ONLY}

The previous response was invalid JSON or did not match the required schema.
Return ONLY corrected JSON matching this exact shape:
${shape}

Invalid response:
${text.slice(0, 6000)}`;

  const repaired = await generateCompletion('You repair malformed JSON responses without changing the intended data.', repairPrompt, {
    maxTokens,
    temperature: 0,
  });

  try {
    return parseJson(repaired, schema);
  } catch (err) {
    logParseFailure(`${service}-repair`, repaired, err);
    throw err;
  }
}

function itinerarySummary(days: DayPlan[]): string {
  return days
    .map((day) => `Day ${day.dayNumber}: ${day.activities.map((activity) => activity.title).join(', ')}`)
    .join('\n');
}

export async function generateItinerary(input: TripInput): Promise<DayPlan[]> {
  const systemPrompt =
    'You are an expert travel planner with deep knowledge of global destinations. Generate realistic, specific, and culturally accurate travel itineraries.';
  const userPrompt = `${JSON_ONLY}

Destination: ${input.destination}
Departure location: ${input.departureLocation || 'Not provided'}
Number of days: ${input.numberOfDays}
Budget type: ${input.budgetType}
Interests: ${input.interests.join(', ') || 'General sightseeing'}

Create a practical day-by-day itinerary with specific activities that fit the destination and budget.
Plan nearby activities together. Include realistic travel time, transport mode, and transport cost from the previous stop inside each activity description.
Use numeric estimatedCost values only, without currency symbols or text. estimatedCost must mean only the activity ticket, entry fee, tour fee, or experience fee. Do not include hotels, food, intercity travel, local transport, or shopping. Use 0 for free public sights and keep each cost realistic for the selected budget tier.
Return exactly ${input.numberOfDays} days.
Format: ${ITINERARY_SHAPE}`;
  const maxTokens = Math.min(3200, 900 + input.numberOfDays * 450);
  const text = await generateCompletion(systemPrompt, userPrompt, { maxTokens, temperature: 0.2 });

  try {
    return parseJson(text, itinerarySchema).days;
  } catch (err) {
    logParseFailure('itinerary', text, err);
    return (await repairJson('itinerary', text, itinerarySchema, ITINERARY_SHAPE, maxTokens)).days;
  }
}

export async function regenerateSingleDay(
  input: TripInput,
  dayNumber: number,
  existingItinerary: DayPlan[],
  instruction: string,
): Promise<Activity[]> {
  const systemPrompt =
    'You are an expert travel planner with deep knowledge of global destinations. Generate realistic, specific, and culturally accurate travel itineraries.';
  const userPrompt = `${JSON_ONLY}

Destination: ${input.destination}
Departure location: ${input.departureLocation || 'Not provided'}
Budget type: ${input.budgetType}
Interests: ${input.interests.join(', ') || 'General sightseeing'}
Existing itinerary:
${itinerarySummary(existingItinerary)}

Regenerate ONLY Day ${dayNumber}. User instruction: ${instruction}
Return activities that fit the rest of the trip and do not duplicate nearby days.
Plan nearby activities together. Include realistic travel time, transport mode, and transport cost from the previous stop inside each activity description.
Use numeric estimatedCost values only, without currency symbols or text. estimatedCost must mean only the activity ticket, entry fee, tour fee, or experience fee. Do not include hotels, food, intercity travel, local transport, or shopping. Use 0 for free public sights and keep each cost realistic for the selected budget tier.
Format: ${ACTIVITIES_SHAPE}`;
  const text = await generateCompletion(systemPrompt, userPrompt, { maxTokens: 1200, temperature: 0.2 });

  try {
    return parseJson(text, activitiesSchema).activities;
  } catch (err) {
    logParseFailure('itinerary-day', text, err);
    return (await repairJson('itinerary-day', text, activitiesSchema, ACTIVITIES_SHAPE, 1200)).activities;
  }
}
