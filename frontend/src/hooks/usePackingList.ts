'use client';

import { useMemo, useRef, useState } from 'react';
import type { TripPackingCategory, UsePackingListResult } from '@/types';

const checkedItemsByKey = new Map<string, Set<string>>();

function getSessionSet(key: string): Set<string> {
  const existing = checkedItemsByKey.get(key);
  if (existing) return existing;

  const next = new Set<string>();
  checkedItemsByKey.set(key, next);
  return next;
}

function formatPackingList(destination: string, categories: TripPackingCategory[], checkedItems: Set<string>): string {
  const lines = [`VOYAI PACKING LIST — ${destination}`, ''];

  categories.forEach((category) => {
    lines.push(`📦 ${category.category}`);
    category.items.forEach((item) => {
      const mark = checkedItems.has(item.id) ? '☑' : '☐';
      const quantity = item.quantity !== null ? ` (x${item.quantity})` : '';
      lines.push(`${mark} ${item.name}${quantity}`);
    });
    lines.push('');
  });

  return lines.join('\n').trim();
}

export function usePackingList(
  tripId: string,
  destination: string,
  categories: TripPackingCategory[],
): UsePackingListResult {
  const key = typeof window === 'undefined' ? `packing:${tripId}` : `packing:${window.location.pathname}`;
  const checkedItemsRef = useRef<Set<string>>(getSessionSet(key));
  const [, setVersion] = useState(0);

  const itemIds = useMemo(
    () => new Set(categories.flatMap((category) => category.items.map((item) => item.id))),
    [categories],
  );

  const rerender = () => setVersion((version) => version + 1);

  const toggleItem = (itemId: string) => {
    if (checkedItemsRef.current.has(itemId)) checkedItemsRef.current.delete(itemId);
    else checkedItemsRef.current.add(itemId);
    rerender();
  };

  const getProgress = () => {
    let checked = 0;
    checkedItemsRef.current.forEach((itemId) => {
      if (itemIds.has(itemId)) checked += 1;
    });

    return {
      checked,
      total: itemIds.size,
    };
  };

  const resetAll = () => {
    checkedItemsRef.current.clear();
    rerender();
  };

  const exportToClipboard = async () => {
    const text = formatPackingList(destination, categories, checkedItemsRef.current);
    await navigator.clipboard.writeText(text);
  };

  return {
    checkedItems: checkedItemsRef.current,
    toggleItem,
    getProgress,
    resetAll,
    exportToClipboard,
  };
}
