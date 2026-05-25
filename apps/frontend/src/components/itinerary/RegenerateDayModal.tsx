'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface RegenerateDayModalProps {
  dayNumber: number | null;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (instruction: string) => Promise<void>;
}

export function RegenerateDayModal({ dayNumber, isLoading = false, onClose, onSubmit }: RegenerateDayModalProps) {
  const [instruction, setInstruction] = useState('');
  const placeholders = ['More outdoor activities', 'Add local food experiences'];
  const placeholder = dayNumber && dayNumber % 2 === 0 ? placeholders[1] : placeholders[0];

  if (!dayNumber) return null;

  const submit = async () => {
    if (!instruction.trim()) return;
    await onSubmit(instruction.trim());
    setInstruction('');
  };

  return (
    <div className="fixed inset-0 z-[420] flex items-center justify-center px-4">
      <button type="button" aria-label="Close modal" onClick={onClose} className="absolute inset-0 bg-navy-950/45 backdrop-blur-sm" />
      <section role="dialog" aria-modal="true" className="relative w-full max-w-lg rounded-lg border border-stone-200 bg-white p-6 shadow-2xl shadow-navy-950/20">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-800">Regenerate Day {dayNumber}</p>
        <h2 className="display mt-3 text-4xl italic leading-none text-navy-950">What would you like to change about Day {dayNumber}?</h2>
        <textarea
          value={instruction}
          onChange={(event) => setInstruction(event.target.value)}
          rows={5}
          placeholder={placeholder}
          className="mt-5 w-full resize-none rounded-lg border border-stone-200 px-4 py-3 text-sm text-navy-950 focus:border-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-700/10"
        />
        <div className="mt-5 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={submit} isLoading={isLoading}>
            Regenerate
          </Button>
        </div>
      </section>
    </div>
  );
}
