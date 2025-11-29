'use client';

import { HomeScreen } from '@/components/HomeScreen';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const handleNavigate = (screen: string, data?: any) => {
    if (data) {
      router.push(`/${screen}?data=${encodeURIComponent(JSON.stringify(data))}`);
    } else {
      router.push(`/${screen}`);
    }
  };

  return <HomeScreen onNavigate={handleNavigate} />;
}



