import type { FC } from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { GameModesSection } from '../components/home/GameModesSection';
import { SocialPreviewSection } from '../components/home/SocialPreviewSection';

export const Home: FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <HeroSection />
      <GameModesSection />
      <SocialPreviewSection />
    </div>
  );
};
