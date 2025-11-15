'use client';

import DashboardScreen from '@/components/DashboardScreen';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  return <DashboardScreen onNavigate={(screen) => router.push(`/${screen}`)} />;
}
