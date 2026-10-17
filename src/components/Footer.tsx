import { Link } from 'react-router';
import { GhostLink } from './GhostLink';

export function Footer() {
  return <footer className="bg-walnut-shell text-warm-parchment"><div className="page-container footer-inner"><div className="footer-top"><div><Link to="/" className="wordmark">STILL</Link><p className="text-caption mt-24">Pool renovation.<br />Thoughtfully considered.</p></div><div className="footer-links"><GhostLink href="/portfolio" theme="dark">Portefølje</GhostLink><GhostLink href="/process" theme="dark">Prosess</GhostLink><GhostLink href="/about" theme="dark">Om oss</GhostLink><GhostLink href="/contact" theme="dark">Kontakt</GhostLink></div><div className="footer-note"><p className="text-heading-sm leading-heading-sm mb-24">Good things begin<br />with an open conversation.</p><GhostLink href="/contact" theme="dark">Tell us about your space</GhostLink></div></div><div className="footer-bottom"><p>© {new Date().getFullYear()} STILL Studio</p><p>Independent spirit. Considered craft.</p><GhostLink href="/colophon" theme="dark">About this concept</GhostLink></div></div></footer>;
}
