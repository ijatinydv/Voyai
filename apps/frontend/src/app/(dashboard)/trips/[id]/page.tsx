import { TripDetailClient } from '@/components/trips/TripDetailClient';
import { getTripByIdServer } from '@/services/trip.server';

interface TripDetailPageProps {
  params: {
    id: string;
  };
}

export default async function TripDetailPage({ params }: TripDetailPageProps) {
  const trip = await getTripByIdServer(params.id);
  return <TripDetailClient initialTrip={trip} />;
}
