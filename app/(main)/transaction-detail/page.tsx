'use client';

import { TransactionDetailScreen } from '@/components/TransactionDetailScreen';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function TransactionDetailPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [transaction, setTransaction] = useState<any>(null);

  useEffect(() => {
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const parsed = JSON.parse(decodeURIComponent(dataParam));
        setTransaction(parsed.transaction || parsed);
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

  if (!transaction) {
    return null;
  }

  return <TransactionDetailScreen onNavigate={handleNavigate} transaction={transaction} />;
}

export default function TransactionDetailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TransactionDetailPageContent />
    </Suspense>
  );
}

