import { Hero } from '../components/Hero';
import { GhostLink } from '../components/GhostLink';
import { PortfolioCard } from '../components/PortfolioCard';
import { DarkOverlaySection } from '../components/DarkOverlaySection';
import { ContactInvite } from '../components/ContactInvite';
import { SectionHeading } from '../components/SectionHeading';
import { Seo } from '../components/Seo';
import { projects, services } from '../data/projects';

export function Home() {
  return <>
    <Seo title="A familiar place. A new feeling." description="A considered approach to pool renovation. Discover natural materials, thoughtful details, and a new possibility for your outdoor space." />
    <Hero image="courtyard" headline={<>A familiar place.<br />A new feeling.</>} subline="Thoughtful pool renovation. Made for the way you live." />
    <section className="page-container section-space" aria-labelledby="introduction">
      <div className="intro-layout"><p className="eyebrow">01 / A new perspective</p><div className="intro-copy"><h2 id="introduction" className="text-heading lg:text-display leading-display">Not a new place.<br />A new way to feel at home.</h2><p className="mt-36">We see the possibilities in what’s already there. Through natural materials, quiet details, and a considered approach, we reimagine pools and the spaces around them.</p><GhostLink href="/about" className="mt-36">A little about us</GhostLink></div></div>
      <div className="services-grid">{services.map(service => <article key={service.id} className="service-item"><span className="text-caption">{service.number}</span><h3>{service.title}</h3><p>{service.text}</p><GhostLink href={`/process#${service.id}`}>Explore {service.title.toLowerCase()}</GhostLink></article>)}</div>
    </section>
    <section className="page-container pb-100" aria-labelledby="selected-work"><div className="section-topline"><div><p className="eyebrow mb-16">02 / Selected spaces</p><SectionHeading><span id="selected-work">A different kind of transformation.</span></SectionHeading></div><GhostLink href="/portfolio">View the portfolio</GhostLink></div><div className="portfolio-grid">{projects.slice(0, 2).map((project, index) => <PortfolioCard key={project.slug} {...project} href={`/portfolio/${project.slug}`} meta={`${project.setting} · ${project.scope}`} number={`0${index + 1}`} />)}</div><p className="concept-note mt-16">Concept studies in water, material, and atmosphere.</p></section>
    <DarkOverlaySection image="evening-pool" title="When the day slows down." alt="Concept of a softly illuminated stone pool pavilion, reflected in dark still water after sunset" />
    <ContactInvite />
  </>;
}
