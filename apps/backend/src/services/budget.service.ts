import { z } from 'zod';
import type { IBudgetEstimate } from '../models/Trip.model.js';
import { LLMError } from '../utils/AppError.js';
import { tripInputSchema } from '../utils/validate.js';
import { generateCompletion } from './llm.service.js';

type TripInput = z.infer<typeof tripInputSchema>;
export type BudgetEstimate = IBudgetEstimate;

const JSON_ONLY = 'Respond ONLY with valid JSON. No markdown, no explanation, no backticks.';

const budgetSchema = z.object({
  flights: z.coerce.number().min(0),
  accommodation: z.coerce.number().min(0),
  food: z.coerce.number().min(0),
  activities: z.coerce.number().min(0),
  miscellaneous: z.coerce.number().min(0),
  total: z.coerce.number().min(0),
  currency: z.string().min(1),
  notes: z.string().min(1),
});

function parseBudget(text: string): BudgetEstimate {
  const cleaned = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();

  try {
    return budgetSchema.parse(JSON.parse(cleaned));
  } catch (err) {
    throw new LLMError(err instanceof Error ? err.message : 'Invalid budget JSON response');
  }
}

export async function estimateBudget(input: TripInput): Promise<BudgetEstimate> {
  const systemPrompt =
    'You are a travel budgeting expert who estimates realistic trip costs from current destination pricing patterns.';
  const userPrompt = `${JSON_ONLY}

Destination: ${input.destination}
Number of days: ${input.numberOfDays}
Budget type: ${input.budgetType}
Interests: ${input.interests.join(', ') || 'General sightseeing'}

Base amounts on realistic destination pricing for the given budgetType. Return estimated total trip costs in USD.
Format: { "flights": number, "accommodation": number, "food": number, "activities": number, "miscellaneous": number, "total": number, "currency": "USD", "notes": string }`;

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const text = await generateCompletion(systemPrompt, userPrompt, 2048);

    try {
      return parseBudget(text);
    } catch (err) {
      if (attempt === 2) throw err;
      console.error({ service: 'budget', attempt, success: false, error: 'Failed to parse budget JSON' });
    }
  }

  throw new LLMError('Failed to estimate budget');
}
