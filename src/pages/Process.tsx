import { useLocation } from 'react-router';
import { ResponsiveImage } from '../components/ResponsiveImage';
import { ContactInvite } from '../components/ContactInvite';
import { DarkOverlaySection } from '../components/DarkOverlaySection';
import { Seo } from '../components/Seo';
import { services } from '../data/projects';

const steps = [
  ['01', 'First, we listen.', 'Your space, your routines, and what you want to feel when you step outside. We begin with an open conversation and a close look at the pool you already have.'],
  ['02', 'We find the possibilities.', 'The condition of the pool and its surroundings guide the design. Together, we explore materials, surface finishes, lighting, and the relationship to your home. A clear scope comes before any work begins.'],
  ['03', 'We consider every detail.', 'The meeting of tile and stone. The width of a step. The temperature of the light. A material palette and an agreed plan bring all the decisions into one coherent picture.'],
  ['04', 'A careful transformation.', 'Work follows the agreed scope and sequence, with clear communication along the way. We close with a walk-through of the finished space and practical guidance for looking after it.'],
] as const;
const serviceDetails: Record<string, string> = {
  surfaces: 'From a fresh mineral plaster finish to carefully selected tile, we consider texture, tone, and how the material meets the water. Existing surfaces and waterproofing are assessed before a renewal approach is chosen.',
  surroundings: 'Coping, decking, planting, and the paths between them shape the way a pool feels. We explore natural stone and timber, considered drainage, and transitions that connect your water to the wider garden.',
  lighting: 'A warm, restrained lighting plan extends the life of the space into the evening. We consider underwater light, subtle path illumination, and the texture of surrounding architecture as a single composition.',
  renewal: 'For spaces ready for a complete rethink, we bring surfaces, surroundings, lighting, and pool systems into one coordinated plan. The condition of the existing pool determines what to retain, repair, and renew.',
};

export function Process() {
  const { hash } = useLocation();
  return <><Seo title="Prosess" description="A clear, considered path from the first conversation to a renewed pool. Discover STILL’s approach to materials, design, and transformation." image="stone-detail" /><section className="page-container page-intro"><div className="page-intro-grid"><div><p className="eyebrow mb-24" lang="nb">Prosess / The approach</p><h1>Good spaces begin<br />with good questions.</h1></div><p>A renovation is a conversation between what’s there and what could be. We take the time to understand both.</p></div></section><section className="page-container pb-100"><ResponsiveImage image="stone-detail" alt="Close study of warm travertine coping and mineral green pool water, exploring materials for a renovation" priority className="aspect-landscape mobile-bleed" /><div className="mt-64">{steps.slice(0, 2).map(([number, title, text]) => <article className="process-step" key={number}><h2>{number} / {title}</h2><p>{text}</p></article>)}</div></section><DarkOverlaySection image="evening-pool" title="The details make the difference." label="Our philosophy" alt="Subtle lighting reveals the warm textures of a stone pool pavilion and the calm water beside it" href="/about" linkLabel="Meet the studio" /><section className="page-container section-space">{steps.slice(2).map(([number, title, text]) => <article className="process-step" key={number}><h2>{number} / {title}</h2><p>{text}</p></article>)}</section><section className="page-container pb-100 intro-layout"><div><p className="eyebrow mb-24">What we consider</p><h2 className="text-heading leading-heading">A complete view<br />of your space.</h2></div><div>{services.map(service => <details key={`${service.id}-${hash}`} id={service.id} className="service-detail" open={hash === `#${service.id}`}><summary>{service.title}</summary><p>{serviceDetails[service.id]}</p></details>)}</div></section><ContactInvite /></>;
}
