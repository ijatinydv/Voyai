import { z } from 'zod';
import type { IDayPlan, IPackingCategory } from '../types';
import { LLMError } from '../utils/AppError.js';
import { tripInputSchema } from '../utils/validate.js';
import { generateCompletion } from './llm.service.js';

type TripInput = z.infer<typeof tripInputSchema>;
export type PackingCategory = IPackingCategory;

const JSON_ONLY = 'Respond ONLY with valid JSON. No markdown, no explanation, no backticks.';

const packingSchema = z.object({
  categories: z.array(
    z.object({
      category: z.enum([
        'Clothing',
        'Documents',
        'Electronics',
        'Toiletries',
        'Health & Safety',
        'Destination-Specific',
      ]),
      items: z.array(
        z.object({
          id: z.string().min(1),
          name: z.string().min(1),
          essential: z.boolean(),
          quantity: z.coerce.number().int().min(1).nullable(),
        }),
      ),
    }),
  ),
});

function currentTravelSeason(): string {
  const month = new Date().getMonth();
  if (month <= 1 || month === 11) return 'winter';
  if (month <= 4) return 'spring';
  if (month <= 7) return 'summer';
  return 'autumn';
}

function activityTitles(itinerary: IDayPlan[]): string {
  return itinerary
    .flatMap((day) => day.activities.map((activity) => activity.title))
    .filter(Boolean)
    .join(', ');
}

function parsePackingList(text: string): PackingCategory[] {
  const cleaned = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();

  try {
    return packingSchema.parse(JSON.parse(cleaned)).categories;
  } catch (err) {
    throw new LLMError(err instanceof Error ? err.message : 'Invalid packing list JSON response');
  }
}

export async function generatePackingList(trip: TripInput & { itinerary: IDayPlan[] }): Promise<PackingCategory[]> {
  const systemPrompt =
    'You are a seasoned travel packer who creates highly specific, destination-aware packing lists based on the exact activities a traveler will be doing.';
  const userPrompt = `${JSON_ONLY}

Destination: ${trip.destination}
Current travel season: ${currentTravelSeason()}
Number of days: ${trip.numberOfDays}
Budget type: ${trip.budgetType}
Full activity list: ${activityTitles(trip.itinerary) || 'No activities generated yet'}

Infer what items are needed from the activities. Temple visits require slip-on shoes. Beach days require reef-safe sunscreen. Hiking days require moisture-wicking clothing. Be specific to this trip, not generic.
Use exactly these categories: Clothing, Documents, Electronics, Toiletries, Health & Safety, Destination-Specific.
Format: { "categories": [{ "category": "Clothing", "items": [{ "id": "uuid", "name": "", "essential": true, "quantity": 2 }] }] }`;

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const text = await generateCompletion(systemPrompt, userPrompt);

    try {
      return parsePackingList(text);
    } catch (err) {
      if (attempt === 2) throw err;
      console.error({ service: 'packing', attempt, success: false, error: 'Failed to parse packing JSON' });
    }
  }

  throw new LLMError('Failed to generate packing list');
}
