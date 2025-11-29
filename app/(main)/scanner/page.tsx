'use client';

import { QRScannerScreen } from '@/components/QRScannerScreen';
import { useRouter } from 'next/navigation';

export default function ScannerPage() {
  const router = useRouter();

  const handleNavigate = (screen: string, data?: any) => {
    if (data) {
      router.push(`/${screen}?data=${encodeURIComponent(JSON.stringify(data))}`);
    } else {
      router.push(`/${screen}`);
    }
  };

  return <QRScannerScreen onNavigate={handleNavigate} />;
}


