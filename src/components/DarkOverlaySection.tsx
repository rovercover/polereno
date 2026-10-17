import { GhostLink } from './GhostLink';
import { ResponsiveImage } from './ResponsiveImage';

interface DarkOverlaySectionProps { image: string; title: string; label?: string; alt: string; href?: string; linkLabel?: string }

export function DarkOverlaySection({ image, title, label = 'Historier', alt, href = '/stories/after-the-light', linkLabel = 'Read the story' }: DarkOverlaySectionProps) {
  return <section className="editorial-image bg-walnut-shell text-warm-parchment"><ResponsiveImage image={image} alt={alt} className="editorial-background" /><div className="editorial-heading"><h2 className="text-heading lg:text-display leading-display">{title}</h2><span className="text-caption" lang="nb">{label}</span></div><div className="editorial-link"><GhostLink href={href} theme="dark">{linkLabel}</GhostLink></div></section>;
}
