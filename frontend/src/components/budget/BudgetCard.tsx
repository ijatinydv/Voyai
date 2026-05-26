import { formatCurrency } from '@/utils/format';

interface BudgetCardProps {
  icon: string;
  label: string;
  amount: number;
  total: number;
  currency: string;
}

export function BudgetCard({ icon, label, amount, total, currency }: BudgetCardProps) {
  const fill = total > 0 ? Math.min(100, Math.round((amount / total) * 100)) : 0;

  return (
    <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-2xl">{icon}</p>
          <h3 className="mt-3 text-sm font-medium text-stone-500">{label}</h3>
        </div>
        <p className="font-mono text-xl font-semibold tabular-nums text-navy-950">{formatCurrency(amount, currency)}</p>
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-stone-100">
        <div className="h-full rounded-full bg-emerald-700" style={{ width: `${fill}%` }} />
      </div>
    </article>
  );
}
