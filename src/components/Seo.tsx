import { useLocation } from 'react-router';

interface SeoProps { title: string; description: string; image?: string }

export function Seo({ title, description, image = 'courtyard' }: SeoProps) {
  const { pathname } = useLocation();
  const origin = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') ?? window.location.origin;
  return <><title>{`${title} — STILL`}</title><meta name="description" content={description} /><meta property="og:title" content={`${title} — STILL`} /><meta property="og:description" content={description} /><meta property="og:type" content="website" /><meta property="og:image" content={`${origin}/images/${image}-1600.webp`} /><meta property="og:url" content={`${origin}${pathname}`} /><link rel="canonical" href={`${origin}${pathname}`} /></>;
}
