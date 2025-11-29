'use client';

import { usePathname } from 'next/navigation';
import { BottomNav } from '@/components/BottomNav';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentScreen = pathname?.split('/').pop() || 'home';

  const showBottomNav = ['home', 'send', 'activity', 'settings', 'scanner'].includes(currentScreen);

  return (
    <div className="max-w-2xl mx-auto bg-[#050505] min-h-screen overflow-hidden relative">
      {children}
      {showBottomNav && (
        <BottomNav currentScreen={currentScreen} onNavigate={() => {}} />
      )}
    </div>
  );
}

