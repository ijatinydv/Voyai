import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { ApiResponse } from '@/types';
import type { Trip } from '@/services/trip.service';

const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';
const baseURL = rawBaseUrl.replace(/\/$/, '');

function endpoint(path: string): string {
  if (baseURL.endsWith('/api') && path.startsWith('/api/')) {
    return `${baseURL}${path.replace(/^\/api/, '')}`;
  }

  return `${baseURL}${path}`;
}

export async function getTripByIdServer(id: string): Promise<Trip> {
  const token = cookies().get('accessToken')?.value;

  if (!token) redirect('/login');

  const response = await fetch(endpoint(`/api/trips/${id}`), {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (response.status === 401) redirect('/login');
  if (!response.ok) {
    throw new Error('Unable to load this trip.');
  }

  const payload = (await response.json()) as ApiResponse<Trip>;
  return payload.data;
}
