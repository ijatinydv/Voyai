import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import type { IDayPlan, IPackingCategory, IPackingItem } from '../types';
import { tripInputSchema } from '../utils/validate.js';

type TripInput = z.infer<typeof tripInputSchema>;
export type PackingCategory = IPackingCategory;

const categories = [
  'Clothing',
  'Documents',
  'Electronics',
  'Toiletries',
  'Health & Safety',
  'Destination-Specific',
] as const;

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

function makeItem(name: string, essential = true, quantity: number | null = null): IPackingItem {
  return { id: randomUUID(), name, essential, quantity };
}

function addItem(list: IPackingItem[], name: string, essential = true, quantity: number | null = null): void {
  if (list.some((item) => item.name.toLowerCase() === name.toLowerCase())) return;
  list.push(makeItem(name, essential, quantity));
}

function compactItems(items: IPackingItem[]): IPackingItem[] {
  return items.slice(0, 5);
}

export async function generatePackingList(trip: TripInput & { itinerary: IDayPlan[] }): Promise<PackingCategory[]> {
  const season = currentTravelSeason();
  const signalText = `${trip.destination} ${trip.interests.join(' ')} ${activityTitles(trip.itinerary)}`.toLowerCase();
  const days = Math.max(1, trip.numberOfDays);

  const itemsByCategory = new Map<(typeof categories)[number], IPackingItem[]>(
    categories.map((category) => [category, []]),
  );

  const clothing = itemsByCategory.get('Clothing')!;
  addItem(clothing, 'Breathable day outfits', true, Math.min(days, 7));
  addItem(clothing, 'Comfortable walking shoes', true, 1);
  addItem(clothing, 'Sleepwear', false, Math.ceil(days / 3));
  if (season === 'winter') addItem(clothing, 'Warm outer layer', true, 1);
  if (season === 'spring' || season === 'autumn') addItem(clothing, 'Light rain shell', false, 1);

  const documents = itemsByCategory.get('Documents')!;
  addItem(documents, 'Government ID or passport', true, 1);
  addItem(documents, 'Travel insurance details', false, 1);
  addItem(documents, 'Hotel and booking confirmations', true, 1);
  addItem(documents, 'Emergency contact list', false, 1);

  const electronics = itemsByCategory.get('Electronics')!;
  addItem(electronics, 'Phone charger', true, 1);
  addItem(electronics, 'Power bank', true, 1);
  addItem(electronics, 'Universal travel adapter', false, 1);
  addItem(electronics, 'Offline maps downloaded', true, 1);

  const toiletries = itemsByCategory.get('Toiletries')!;
  addItem(toiletries, 'Toothbrush and toothpaste', true, 1);
  addItem(toiletries, 'Sunscreen', true, 1);
  addItem(toiletries, 'Deodorant', true, 1);
  addItem(toiletries, 'Travel-size shampoo', false, 1);

  const health = itemsByCategory.get('Health & Safety')!;
  addItem(health, 'Personal medication', true, null);
  addItem(health, 'Basic first-aid kit', false, 1);
  addItem(health, 'Hand sanitizer', true, 1);
  addItem(health, 'Reusable water bottle', true, 1);

  const specific = itemsByCategory.get('Destination-Specific')!;
  if (/beach|island|coast|goa|bali|maldives|phuket|surf|snorkel/.test(signalText)) {
    addItem(specific, 'Swimwear', true, 2);
    addItem(specific, 'Reef-safe sunscreen', true, 1);
    addItem(specific, 'Dry bag or waterproof pouch', false, 1);
  }
  if (/hike|trek|trail|mountain|nature|adventure|park/.test(signalText)) {
    addItem(specific, 'Moisture-wicking hiking clothes', true, 2);
    addItem(specific, 'Trail socks', true, 2);
    addItem(specific, 'Compact daypack', true, 1);
  }
  if (/temple|shrine|mosque|church|culture|history|heritage/.test(signalText)) {
    addItem(specific, 'Modest outfit for cultural sites', true, 1);
    addItem(specific, 'Slip-on shoes', false, 1);
  }
  if (/nightlife|fine dining|premium|luxury/.test(signalText)) addItem(specific, 'Smart evening outfit', false, 1);
  if (/shopping|market|bazaar/.test(signalText)) addItem(specific, 'Foldable shopping tote', false, 1);
  if (specific.length === 0) addItem(specific, `${trip.destination} day-trip essentials`, false, 1);

  return categories.map((category) => ({
    category,
    items: compactItems(itemsByCategory.get(category)!),
  }));
}
