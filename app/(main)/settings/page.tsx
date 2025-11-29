'use client';

import { SettingsScreen } from '@/components/SettingsScreen';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();

  const handleNavigate = (screen: string, data?: any) => {
    if (data) {
      router.push(`/${screen}?data=${encodeURIComponent(JSON.stringify(data))}`);
    } else {
      router.push(`/${screen}`);
    }
  };

  return <SettingsScreen onNavigate={handleNavigate} />;
}


