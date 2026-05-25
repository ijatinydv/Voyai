'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface AddActivityFormProps {
  onSubmit: (data: { title: string; description: string; estimatedCost: number }) => Promise<void>;
  onCancel: () => void;
}

export function AddActivityForm({ onSubmit, onCancel }: AddActivityFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('0');
  const [isSaving, setIsSaving] = useState(false);

  const submit = async () => {
    if (!title.trim() || !description.trim()) return;

    setIsSaving(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        estimatedCost: Math.max(0, Number(estimatedCost) || 0),
      });
      setTitle('');
      setDescription('');
      setEstimatedCost('0');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="ml-8 mt-4 rounded-lg border border-stone-200 bg-stone-50 p-4">
      <div className="grid gap-3">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Activity title"
          className="rounded-lg border border-stone-200 px-3 py-2 text-sm font-medium text-navy-950 focus:border-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-700/10"
        />
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Short description"
          rows={3}
          className="resize-none rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-700 focus:border-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-700/10"
        />
        <input
          value={estimatedCost}
          onChange={(event) => setEstimatedCost(event.target.value)}
          inputMode="decimal"
          placeholder="Estimated cost"
          className="rounded-lg border border-stone-200 px-3 py-2 text-sm text-navy-950 focus:border-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-700/10"
        />
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button size="sm" onClick={submit} isLoading={isSaving}>
          Add Activity
        </Button>
      </div>
    </div>
  );
}
