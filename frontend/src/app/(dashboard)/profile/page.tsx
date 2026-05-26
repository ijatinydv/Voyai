'use client';

import { useAuth } from '@/hooks/useAuth';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <section className="max-w-3xl">
      <p className="text-sm font-medium uppercase tracking-[0.22em] text-emerald-800">Profile</p>
      <h2 className="display mt-3 text-6xl italic leading-none text-navy-950">{user?.name ?? 'Voyai Traveler'}</h2>
      <div className="mt-8 rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-stone-500">Email</p>
        <p className="mt-2 text-base font-semibold text-navy-950">{user?.email ?? 'traveler@voyai.app'}</p>
      </div>
    </section>
  );
}
