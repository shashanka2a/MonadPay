'use client';

import { SuccessScreen } from '@/components/SuccessScreen';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function SuccessPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        setData(JSON.parse(decodeURIComponent(dataParam)));
      } catch (e) {
        // Invalid data, ignore
      }
    }
  }, [searchParams]);

  const handleNavigate = (screen: string, navData?: any) => {
    if (navData) {
      router.push(`/${screen}?data=${encodeURIComponent(JSON.stringify(navData))}`);
    } else {
      router.push(`/${screen}`);
    }
  };

  if (!data) {
    return null;
  }

  return <SuccessScreen onNavigate={handleNavigate} data={data} />;
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessPageContent />
    </Suspense>
  );
}

