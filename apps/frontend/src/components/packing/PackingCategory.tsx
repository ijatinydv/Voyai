'use client';

import { useState } from 'react';
import type { PackingCategory as PackingCategoryModel } from '@/services/trip.service';
import { cn } from '@/utils/cn';

interface PackingCategoryProps {
  category: PackingCategoryModel;
  checkedItems: Set<string>;
  onToggleItem: (itemId: string) => void;
}

function CheckIcon({ checked }: { checked: boolean }) {
  return (
    <span
      className={cn(
        'flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-all duration-150 ease-out',
        checked ? 'border-navy-950 bg-navy-950' : 'border-stone-300 bg-white',
      )}
    >
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-4 w-4">
        <path
          d="M3.5 8.2 6.5 11 12.8 4.8"
          className={cn('packing-check-path stroke-white', checked && 'packing-check-path--checked')}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function PackingCategory({ category, checkedItems, onToggleItem }: PackingCategoryProps) {
  const [isOpen, setIsOpen] = useState(true);
  const packedCount = category.items.filter((item) => checkedItems.has(item.id)).length;

  return (
    <section className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-150 ease-out hover:bg-stone-50"
      >
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">{category.category}</h3>
          <p className="mt-1 text-sm text-stone-400">{packedCount} of {category.items.length} packed</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-600">
            {packedCount}/{category.items.length}
          </span>
          <span className={cn('text-stone-400 transition-transform duration-150 ease-out', isOpen && 'rotate-180')}>⌄</span>
        </div>
      </button>

      {isOpen ? (
        <div className="divide-y divide-stone-100 border-t border-stone-100">
          {category.items.map((item) => {
            const checked = checkedItems.has(item.id);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onToggleItem(item.id)}
                className="group flex w-full items-center gap-3 px-5 py-3 text-left transition-colors duration-150 ease-out hover:bg-stone-50"
              >
                <CheckIcon checked={checked} />
                <span className={cn('min-w-0 flex-1 text-sm font-medium text-navy-950 transition-all duration-150 ease-out', checked && 'opacity-50 line-through')}>
                  {item.name}
                </span>
                {item.quantity !== null ? (
                  <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-500">x{item.quantity}</span>
                ) : null}
                {item.essential ? (
                  <span className="relative rounded-full bg-amber-50 px-2 py-1 text-xs text-amber-700 ring-1 ring-amber-200" title="Essential item">
                    ⭐
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
