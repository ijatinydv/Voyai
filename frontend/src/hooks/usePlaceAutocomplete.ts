'use client';

import { useEffect, useState } from 'react';
import { searchPlaces } from '@/services/place.service';
import type { PlaceSuggestion } from '@/types';

export function usePlaceAutocomplete(query: string) {
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const text = query.trim();
    if (text.length < 3) {
      setSuggestions([]);
      setIsLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setIsLoading(true);

      searchPlaces(text, controller.signal)
        .then(setSuggestions)
        .catch((error) => {
          if (error instanceof DOMException && error.name === 'AbortError') return;
          setSuggestions([]);
        })
        .finally(() => {
          if (!controller.signal.aborted) setIsLoading(false);
        });
    }, 300);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return { suggestions, isLoading };
}
