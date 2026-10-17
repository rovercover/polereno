import type { ReactNode } from 'react';
import { ResponsiveImage } from './ResponsiveImage';
import { GhostLink } from './GhostLink';

interface HeroProps { image: string; headline: ReactNode; subline: string }

export function Hero({ image, headline, subline }: HeroProps) {
  return (
    <section className="hero bg-walnut-shell text-warm-parchment" aria-labelledby="hero-heading">
      <ResponsiveImage image={image} alt="A renewed courtyard pool in warm limestone, reflecting a softly lit residence at dusk" priority className="hero-image" />
      <div className="hero-content">
        <div><p className="eyebrow mb-20">A considered approach to water & space</p><h1 id="hero-heading" className="text-heading lg:text-display leading-display font-regular">{headline}</h1><p className="hero-subline mt-20 text-caption">{subline}</p></div>
        <div className="hero-caption text-caption"><p className="mb-8">01 — The Courtyard</p><GhostLink href="/portfolio/the-courtyard" theme="dark">Explore the concept</GhostLink></div>
      </div>
    </section>
  );
}
