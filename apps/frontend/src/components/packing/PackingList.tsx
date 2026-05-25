'use client';

import { useEffect, useMemo, useState } from 'react';
import { PackingCategory } from '@/components/packing/PackingCategory';
import { Button } from '@/components/ui/Button';
import { usePackingList } from '@/hooks/usePackingList';
import { useToast } from '@/hooks/useToast';
import { tripService, type PackingCategory as PackingCategoryModel, type Trip } from '@/services/trip.service';
import { cn } from '@/utils/cn';

interface PackingListProps {
  packingList: PackingCategoryModel[];
  tripId: string;
  destination: string;
  onGenerated?: (trip: Trip) => void;
}

function SuitcaseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className={className}>
      <path d="M11 9V7a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v2M7 9h18a3 3 0 0 1 3 3v12a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V12a3 3 0 0 1 3-3Z" strokeLinejoin="round" />
      <path d="M10 13v11M22 13v11" strokeLinecap="round" />
    </svg>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className={className}>
      <path d="M9 9h10v10H9z" strokeLinejoin="round" />
      <path d="M5 15H4a1 1 0 0 1-1-1V5a2 2 0 0 1 2-2h9a1 1 0 0 1 1 1v1" strokeLinecap="round" />
    </svg>
  );
}

function ResetIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className={className}>
      <path d="M4 12a8 8 0 1 0 2.3-5.7M4 4v6h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PackingList({ packingList, tripId, destination, onGenerated }: PackingListProps) {
  const toast = useToast();
  const [categories, setCategories] = useState(packingList);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const { checkedItems, toggleItem, getProgress, resetAll, exportToClipboard } = usePackingList(
    tripId,
    destination,
    categories,
  );

  useEffect(() => {
    setCategories(packingList);
  }, [packingList]);

  const progress = getProgress();
  const progressPercent = progress.total > 0 ? Math.round((progress.checked / progress.total) * 100) : 0;
  const progressTone = useMemo(() => (progressPercent > 0 ? 'bg-emerald-700' : 'bg-stone-300'), [progressPercent]);

  const generatePackingList = async () => {
    setIsGenerating(true);
    try {
      const trip = await tripService.generatePackingList(tripId);
      setCategories(trip.packingList);
      onGenerated?.(trip);
      toast.success('Packing list generated.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to generate packing list.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyList = async () => {
    try {
      await exportToClipboard();
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Unable to copy packing list.');
    }
  };

  if (categories.length === 0) {
    return (
      <section className="flex min-h-[420px] flex-col items-center justify-center rounded-lg border border-dashed border-stone-300 bg-white px-6 py-12 text-center shadow-sm">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-lg bg-sand-50 text-5xl shadow-inner">
          {isGenerating ? <SuitcaseIcon className="h-12 w-12 animate-[suitcaseBounce_900ms_ease-in-out_infinite] text-emerald-800" /> : '🧳'}
        </div>
        <h3 className="display text-5xl italic leading-none text-navy-950">
          {isGenerating ? 'Packing your essentials' : 'Smart Packing List'}
        </h3>
        <p className="mt-4 max-w-md text-sm leading-6 text-stone-600">
          {isGenerating
            ? 'AI is analyzing your itinerary, destination, activities, and travel rhythm...'
            : 'Generate a destination-aware checklist with clothing, documents, electronics, health items, and activity-specific gear.'}
        </p>
        <Button className="mt-8" size="lg" onClick={generatePackingList} isLoading={isGenerating}>
          <SuitcaseIcon className="h-5 w-5" />
          Generate Packing List
        </Button>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-navy-950">
              {progress.checked} of {progress.total} items packed
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-100">
              <div
                className={cn('h-full rounded-full transition-all duration-300 ease-out', progressTone)}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Reset all packed items"
              onClick={resetAll}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-stone-200 text-stone-500 transition-all duration-150 ease-out hover:border-stone-300 hover:bg-stone-50 hover:text-navy-950"
            >
              <ResetIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={copyList}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-stone-200 px-3 text-sm font-medium text-stone-600 transition-all duration-150 ease-out hover:border-stone-300 hover:bg-stone-50 hover:text-navy-950"
            >
              <CopyIcon className="h-4 w-4" />
              {copied ? 'Copied!' : 'Copy to clipboard'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {categories.map((category) => (
          <PackingCategory
            key={category.category}
            category={category}
            checkedItems={checkedItems}
            onToggleItem={toggleItem}
          />
        ))}
      </div>
    </section>
  );
}
