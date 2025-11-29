'use client';

import { ActivityScreen } from '@/components/ActivityScreen';
import { useRouter } from 'next/navigation';

export default function ActivityPage() {
  const router = useRouter();

  const handleNavigate = (screen: string, data?: any) => {
    if (data) {
      router.push(`/${screen}?data=${encodeURIComponent(JSON.stringify(data))}`);
    } else {
      router.push(`/${screen}`);
    }
  };

  return <ActivityScreen onNavigate={handleNavigate} />;
}



