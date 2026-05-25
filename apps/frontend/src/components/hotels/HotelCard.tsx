import type { HotelSuggestion } from '@/services/trip.service';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/format';

interface HotelCardProps {
  hotel: HotelSuggestion;
}

const badgeClasses: Record<HotelSuggestion['type'], string> = {
  budget: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  'mid-range': 'bg-sky-50 text-sky-800 ring-sky-200',
  luxury: 'bg-amber-50 text-amber-800 ring-amber-200',
};

export function HotelCard({ hotel }: HotelCardProps) {
  return (
    <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm transition-all duration-150 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:shadow-navy-950/10">
      <div className="flex items-start justify-between gap-4">
        <h3 className="display text-3xl italic leading-none text-navy-950">{hotel.name}</h3>
        <span className={cn('shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1', badgeClasses[hotel.type])}>
          {hotel.type}
        </span>
      </div>
      <p className="mt-4 font-mono text-lg font-semibold tabular-nums text-navy-950">
        {formatCurrency(hotel.estimatedPricePerNight, hotel.currency)} <span className="font-sans text-sm font-normal text-stone-500">/ night</span>
      </p>
      <ul className="mt-5 space-y-2">
        {hotel.highlights.slice(0, 3).map((highlight) => (
          <li key={highlight} className="flex gap-2 text-sm leading-6 text-stone-600">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-700" />
            {highlight}
          </li>
        ))}
      </ul>
    </article>
  );
}
