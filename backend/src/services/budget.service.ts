import { z } from 'zod';
import type { IBudgetEstimate } from '../types';
import { LLMError } from '../utils/AppError.js';
import { tripInputSchema } from '../utils/validate.js';
import { generateCompletion } from './llm.service.js';

type TripInput = z.infer<typeof tripInputSchema>;
export type BudgetEstimate = IBudgetEstimate;

const JSON_ONLY = 'Respond ONLY with valid JSON. No markdown, no explanation, no backticks.';

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

function parseBudget(text: string): BudgetEstimate {
  const withoutFence = text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  const jsonStart = withoutFence.indexOf('{');
  const jsonEnd = withoutFence.lastIndexOf('}');
  const cleaned = jsonStart >= 0 && jsonEnd >= jsonStart ? withoutFence.slice(jsonStart, jsonEnd + 1) : withoutFence;

  try {
    const budget = budgetSchema.parse(JSON.parse(cleaned));
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
  } catch (err) {
    throw new LLMError(err instanceof Error ? err.message : 'Invalid budget JSON response');
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

Use realistic USD price ranges for this destination and budget tier. Include local transport between neighborhoods or activities.
Use the flights field for the main origin-to-destination transportation cost, whether that route is best by flight, train, bus, taxi, ferry, or another transport mode.
If departure location is not provided, set flights to 0 and explain that origin-to-destination transportation is excluded.
Make total equal flights + localTransport + accommodation + food + activities + miscellaneous.
Format: { "flights": number, "localTransport": number, "accommodation": number, "food": number, "activities": number, "miscellaneous": number, "total": number, "currency": "USD", "notes": string }`;

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const text = await generateCompletion(systemPrompt, userPrompt, 1200);

    try {
      return parseBudget(text);
    } catch (err) {
      if (attempt === 2) throw err;
      console.error({ service: 'budget', attempt, success: false, error: 'Failed to parse budget JSON' });
    }
  }

  throw new LLMError('Failed to estimate budget');
}
