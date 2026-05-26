import { z } from 'zod';
import type { IHotelSuggestion } from '../types';
import { LLMError } from '../utils/AppError.js';
import { generateCompletion } from './llm.service.js';

export type HotelSuggestion = IHotelSuggestion;

const JSON_ONLY = 'Respond ONLY with valid JSON. No markdown, no explanation, no backticks.';

const hotelsSchema = z.object({
  hotels: z
    .array(
      z.object({
        name: z.string().min(1),
        type: z.enum(['budget', 'mid-range', 'luxury']),
        estimatedPricePerNight: z.coerce.number().min(0),
        currency: z.string().min(1),
        highlights: z.array(z.string().min(1)),
      }),
    )
    .min(4)
    .max(5),
});

function parseHotels(text: string): HotelSuggestion[] {
  const cleaned = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();

  try {
    return hotelsSchema.parse(JSON.parse(cleaned)).hotels;
  } catch (err) {
    throw new LLMError(err instanceof Error ? err.message : 'Invalid hotels JSON response');
  }
}

export async function suggestHotels(destination: string, budgetType: string): Promise<HotelSuggestion[]> {
  const systemPrompt =
    'You are a hotel research assistant who suggests realistic accommodation options for travel planning.';
  const userPrompt = `${JSON_ONLY}

Destination: ${destination}
Budget type: ${budgetType}

Suggest 4-5 realistic hotels or hotel-style areas/options that fit this budget. Use USD estimates.
Format: { "hotels": [{ "name": "", "type": "budget"|"mid-range"|"luxury", "estimatedPricePerNight": number, "currency": "USD", "highlights": [""] }] }`;

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const text = await generateCompletion(systemPrompt, userPrompt, 2048);

    try {
      return parseHotels(text);
    } catch (err) {
      if (attempt === 2) throw err;
      console.error({ service: 'hotels', attempt, success: false, error: 'Failed to parse hotels JSON' });
    }
  }

  throw new LLMError('Failed to suggest hotels');
}
