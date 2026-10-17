import { useState } from 'react';
import { ContactForm } from '../components/ContactForm';
import { GhostLink } from '../components/GhostLink';
import { ResponsiveImage } from '../components/ResponsiveImage';
import { Seo } from '../components/Seo';

export function Contact() {
  const [formVersion, setFormVersion] = useState(0);
  return <><Seo title="Kontakt" description="Tell us about your pool and what you have in mind. Every considered transformation begins with a conversation." image="water-detail" /><section className="page-container page-intro"><p className="eyebrow mb-24" lang="nb">Kontakt / Let’s begin</p><h1>A little room<br />for possibility.</h1></section><section className="page-container pb-100 contact-layout"><div><p className="text-heading-sm leading-heading-sm">Your space.<br />Your next chapter.</p><p className="mt-24">You don’t need a finished plan. Just a sense that your pool could be something more. Tell us a little about it.</p><GhostLink href="/process" className="mt-36">What happens next</GhostLink><ResponsiveImage image="water-detail" alt="Afternoon sunlight moves across a green mineral pool finish beside warm natural stone" sizes="(min-width: 1024px) 400px, 100vw" className="mt-60 aspect-square mobile-bleed" /></div><ContactForm key={formVersion} onRestart={() => setFormVersion(version => version + 1)} /></section></>;
}
