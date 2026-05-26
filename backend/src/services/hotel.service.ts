import { z } from 'zod';
import type { IHotelSuggestion } from '../types';
import { LLMError } from '../utils/AppError.js';
import { generateCompletion } from './llm.service.js';

export type HotelSuggestion = IHotelSuggestion;

const JSON_ONLY =
  'Respond ONLY with valid compact JSON. No markdown, no explanation, no comments, no trailing commas, no backticks.';
const HOTELS_SHAPE =
  '{ "hotels": [{ "name": "Hotel or area name", "type": "budget", "estimatedPricePerNight": 0, "currency": "USD", "highlights": ["short highlight"] }] }';

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
    .min(3)
    .max(5),
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

function parseHotels(text: string): HotelSuggestion[] {
  try {
    return hotelsSchema.parse(JSON.parse(cleanJson(text))).hotels;
  } catch (err) {
    throw new LLMError(err instanceof Error ? err.message : 'Invalid hotels JSON response');
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

async function repairHotels(text: string): Promise<HotelSuggestion[]> {
  const repairPrompt = `${JSON_ONLY}

The previous response was invalid JSON or did not match the required schema.
Return ONLY corrected JSON matching this exact shape:
${HOTELS_SHAPE}

Invalid response:
${text.slice(0, 4000)}`;

  const repaired = await generateCompletion('You repair malformed JSON responses without changing the intended data.', repairPrompt, {
    maxTokens: 900,
    temperature: 0,
  });

  try {
    return parseHotels(repaired);
  } catch (err) {
    logParseFailure('hotels-repair', repaired, err);
    throw err;
  }
}

export async function suggestHotels(destination: string, budgetType: string): Promise<HotelSuggestion[]> {
  const systemPrompt =
    'You are a hotel research assistant who suggests realistic accommodation options for travel planning.';
  const userPrompt = `${JSON_ONLY}

Destination: ${destination}
Budget type: ${budgetType}

Suggest 3-5 realistic hotels or hotel-style areas/options that fit this budget. Use specific USD nightly estimates that match typical current pricing for that destination, not broad placeholder numbers.
Use type "budget" for low budget, "mid-range" for medium budget, and "luxury" for high budget.
Format: ${HOTELS_SHAPE}`;
  const text = await generateCompletion(systemPrompt, userPrompt, { maxTokens: 1000, temperature: 0.2 });

  try {
    return parseHotels(text);
  } catch (err) {
    logParseFailure('hotels', text, err);
    return repairHotels(text);
  }
}
