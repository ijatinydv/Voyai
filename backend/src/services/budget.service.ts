import { z } from 'zod';
import type { IBudgetEstimate } from '../types';
import { LLMError } from '../utils/AppError.js';
import { tripInputSchema } from '../utils/validate.js';
import { generateCompletion } from './llm.service.js';

type TripInput = z.infer<typeof tripInputSchema>;
export type BudgetEstimate = IBudgetEstimate;

const JSON_ONLY =
  'Respond ONLY with valid compact JSON. No markdown, no explanation, no comments, no trailing commas, no backticks.';
const BUDGET_SHAPE =
  '{ "flights": 0, "localTransport": 0, "accommodation": 0, "food": 0, "activities": 0, "miscellaneous": 0, "total": 0, "currency": "USD", "notes": "short note" }';

const budgetSchema = z.object({
  flights: z.coerce.number().min(0),
  localTransport: z.coerce.number().min(0).default(0),
  accommodation: z.coerce.number().min(0),
  food: z.coerce.number().min(0),
  activities: z.coerce.number().min(0),
  miscellaneous: z.coerce.number().min(0),
  total: z.coerce.number().min(0),
  currency: z.string().min(1),
  notes: z.string().min(1),
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

function normalizeBudget(budget: z.output<typeof budgetSchema>): BudgetEstimate {
  return {
    ...budget,
    total:
      budget.flights +
      budget.localTransport +
      budget.accommodation +
      budget.food +
      budget.activities +
      budget.miscellaneous,
  };
}

function parseBudget(text: string): BudgetEstimate {
  try {
    return normalizeBudget(budgetSchema.parse(JSON.parse(cleanJson(text))));
  } catch (err) {
    throw new LLMError(err instanceof Error ? err.message : 'Invalid budget JSON response');
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

async function repairBudget(text: string): Promise<BudgetEstimate> {
  const repairPrompt = `${JSON_ONLY}

The previous response was invalid JSON or did not match the required schema.
Return ONLY corrected JSON matching this exact shape:
${BUDGET_SHAPE}

Invalid response:
${text.slice(0, 4000)}`;

  const repaired = await generateCompletion('You repair malformed JSON responses without changing the intended data.', repairPrompt, {
    maxTokens: 900,
    temperature: 0,
  });

  try {
    return parseBudget(repaired);
  } catch (err) {
    logParseFailure('budget-repair', repaired, err);
    throw err;
  }
}

export async function estimateBudget(input: TripInput): Promise<BudgetEstimate> {
  const systemPrompt =
    'You are a travel budgeting expert who estimates realistic trip costs from current destination pricing patterns.';
  const userPrompt = `${JSON_ONLY}

Destination: ${input.destination}
Departure location: ${input.departureLocation || 'Not provided'}
Number of days: ${input.numberOfDays}
Budget type: ${input.budgetType}
Interests: ${input.interests.join(', ') || 'General sightseeing'}

Use realistic USD price ranges for this destination and budget tier. Keep every category grounded in common current travel pricing, not inflated placeholder numbers.
Use the flights field for the main origin-to-destination transportation cost, whether that route is best by flight, train, bus, taxi, ferry, or another transport mode.
If departure location is not provided, set flights to 0 and explain that origin-to-destination transportation is excluded.
The activities field must cover only itinerary activity tickets, entry fees, tour fees, and experience fees. Do not include hotels, meals, local transport, shopping, or miscellaneous purchases in activities.
Make total equal flights + localTransport + accommodation + food + activities + miscellaneous.
Format: ${BUDGET_SHAPE}`;
  const text = await generateCompletion(systemPrompt, userPrompt, { maxTokens: 1000, temperature: 0.2 });

  try {
    return parseBudget(text);
  } catch (err) {
    logParseFailure('budget', text, err);
    return repairBudget(text);
  }
}
