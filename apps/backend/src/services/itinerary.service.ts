import { z } from 'zod';
import type { IActivity, IDayPlan } from '../models/Trip.model.js';
import { LLMError } from '../utils/AppError.js';
import { tripInputSchema } from '../utils/validate.js';
import { generateCompletion } from './llm.service.js';

export type TripInput = z.infer<typeof tripInputSchema>;
export type DayPlan = IDayPlan;
export type Activity = IActivity;

const JSON_ONLY = 'Respond ONLY with valid JSON. No markdown, no explanation, no backticks.';

const activitySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  estimatedCost: z.coerce.number().min(0),
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

function parseJson<T>(text: string, schema: z.ZodSchema<T>): T {
  const cleaned = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();

  try {
    return schema.parse(JSON.parse(cleaned));
  } catch (err) {
    throw new LLMError(err instanceof Error ? err.message : 'Invalid LLM JSON response');
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
Number of days: ${input.numberOfDays}
Budget type: ${input.budgetType}
Interests: ${input.interests.join(', ') || 'General sightseeing'}

Create a practical day-by-day itinerary with specific activities that fit the destination and budget.
Format: { "days": [{ "dayNumber": 1, "activities": [{ "id": "uuid", "title": "", "description": "", "estimatedCost": "" }] }] }`;

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const text = await generateCompletion(systemPrompt, userPrompt);

    try {
      return parseJson(text, itinerarySchema).days;
    } catch (err) {
      if (attempt === 2) throw err;
      console.error({ service: 'itinerary', attempt, success: false, error: 'Failed to parse itinerary JSON' });
    }
  }

  throw new LLMError('Failed to generate itinerary');
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
Budget type: ${input.budgetType}
Interests: ${input.interests.join(', ') || 'General sightseeing'}
Existing itinerary:
${itinerarySummary(existingItinerary)}

Regenerate ONLY Day ${dayNumber}. User instruction: ${instruction}
Return activities that fit the rest of the trip and do not duplicate nearby days.
Format: { "activities": [{ "id": "uuid", "title": "", "description": "", "estimatedCost": "" }] }`;

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const text = await generateCompletion(systemPrompt, userPrompt);

    try {
      return parseJson(text, activitiesSchema).activities;
    } catch (err) {
      if (attempt === 2) throw err;
      console.error({ service: 'itinerary-day', attempt, success: false, error: 'Failed to parse day JSON' });
    }
  }

  throw new LLMError('Failed to regenerate itinerary day');
}
