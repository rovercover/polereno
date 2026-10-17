import { Link } from 'react-router';
import { ResponsiveImage } from './ResponsiveImage';

interface PortfolioCardProps { image: string; alt: string; title: string; meta?: string; href: string; number?: string; wide?: boolean }

export function PortfolioCard({ image, alt, title, meta, href, number, wide = false }: PortfolioCardProps) {
  return (
    <article className={`portfolio-card ${wide ? 'portfolio-card-wide' : ''}`}>
      <Link to={href} className="project-image-link" aria-label={`Explore ${title}`}><ResponsiveImage image={image} alt={alt} sizes={wide ? '(min-width: 1280px) 1120px, 100vw' : '(min-width: 1024px) 560px, 100vw'} className="project-image" /></Link>
      <div className="project-caption"><div><Link to={href} className="project-title">{title}</Link>{meta && <p className="text-caption mt-8 text-aged-bronze">{meta}</p>}</div>{number && <span className="text-caption" aria-hidden="true">{number}</span>}</div>
    </article>
  );
}
