'use client';

import { RequestScreen } from '@/components/RequestScreen';
import { useRouter } from 'next/navigation';

export default function RequestPage() {
  const router = useRouter();

  const handleNavigate = (screen: string, data?: any) => {
    if (data) {
      router.push(`/${screen}?data=${encodeURIComponent(JSON.stringify(data))}`);
    } else {
      router.push(`/${screen}`);
    }
  };

  return <RequestScreen onNavigate={handleNavigate} />;
}


