'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SplashScreen } from '@/components/SplashScreen';
import { TutorialScreen } from '@/components/TutorialScreen';
import { OnboardingScreen } from '@/components/OnboardingScreen';

export default function Home() {
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'tutorial' | 'onboarding'>('splash');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleNavigate = (screen: string, data?: any) => {
    if (screen === 'home') {
      router.push('/home');
    } else if (screen === 'onboarding') {
      setCurrentScreen('onboarding');
    } else {
      // Navigate to other screens using Next.js router
      router.push(`/${screen}${data ? `?data=${encodeURIComponent(JSON.stringify(data))}` : ''}`);
    }
  };

  if (currentScreen === 'splash') {
    return (
      <div className="max-w-2xl mx-auto bg-[#050505] min-h-screen overflow-hidden relative">
        <SplashScreen onComplete={() => setCurrentScreen('tutorial')} />
      </div>
    );
  }

  if (currentScreen === 'tutorial') {
    return (
      <div className="max-w-2xl mx-auto bg-[#050505] min-h-screen overflow-hidden relative">
        <TutorialScreen onComplete={() => setCurrentScreen('onboarding')} />
      </div>
    );
  }

  if (currentScreen === 'onboarding') {
    return (
      <div className="max-w-2xl mx-auto bg-[#050505] min-h-screen overflow-hidden relative">
        <OnboardingScreen onNavigate={handleNavigate} />
      </div>
    );
  }

  return null;
}

