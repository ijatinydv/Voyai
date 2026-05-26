import type { GeoapifyAutocompleteResponse, PlaceSuggestion } from '@/types';

const GEOAPIFY_AUTOCOMPLETE_URL = 'https://api.geoapify.com/v1/geocode/autocomplete';

export async function searchPlaces(query: string, signal?: AbortSignal): Promise<PlaceSuggestion[]> {
  const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
  const text = query.trim();

  if (!apiKey || text.length < 3) return [];

  const params = new URLSearchParams({
    text,
    type: 'city',
    limit: '6',
    apiKey,
  });

  const response = await fetch(`${GEOAPIFY_AUTOCOMPLETE_URL}?${params.toString()}`, { signal });
  if (!response.ok) return [];

  const payload = (await response.json()) as GeoapifyAutocompleteResponse;
  const uniquePlaces = new Map<string, PlaceSuggestion>();

  (payload.features ?? []).forEach((feature) => {
    const properties = feature.properties;
    const label = properties?.formatted?.trim();
    if (!label) return;

    uniquePlaces.set(label, {
      id: properties?.place_id ?? label,
      label,
      ...(properties?.city ? { city: properties.city } : {}),
      ...(properties?.country ? { country: properties.country } : {}),
    });
  });

  return Array.from(uniquePlaces.values());
}
