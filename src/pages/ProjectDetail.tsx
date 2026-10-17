import { useParams } from 'react-router';
import { projects } from '../data/projects';
import { ResponsiveImage } from '../components/ResponsiveImage';
import { TwoColumnProject } from '../components/TwoColumnProject';
import { GhostLink } from '../components/GhostLink';
import { ContactInvite } from '../components/ContactInvite';
import { Seo } from '../components/Seo';
import { NotFound } from './NotFound';

export function ProjectDetail() {
  const { slug } = useParams();
  const project = projects.find(item => item.slug === slug);
  if (!project) return <NotFound />;
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return <><Seo title={project.title} description={project.description} image={project.image} /><section className="page-container page-intro"><GhostLink href="/portfolio" className="mb-40">Back to the portfolio</GhostLink><div className="page-intro-grid"><div><p className="eyebrow mb-24">Concept study / {project.category}</p><h1>{project.title}</h1></div><p>{project.setting}<br />{project.scope}</p></div></section><ResponsiveImage image={project.image} alt={project.alt} priority className="aspect-landscape" /><section className="page-container section-space project-info"><div><h2 className="text-heading leading-heading mb-36">A sense of belonging.</h2><p>{project.description}</p></div><dl className="project-facts"><div><dt>Setting</dt><dd>{project.setting}</dd></div><div><dt>Scope</dt><dd>{project.scope}</dd></div><div><dt>Materials</dt><dd>{project.material}</dd></div><div><dt>Status</dt><dd>Illustrative concept</dd></div></dl></section><section className="page-container pb-100"><TwoColumnProject leftImage={{ image: project.detailImage, alt: project.detailAlt }} rightImage={{ image: project.image, alt: project.alt }} caption="The whole, considered through the detail." /><div className="flex justify-between items-center gap-24 mt-60"><p className="text-caption">Continue exploring</p><GhostLink href={`/portfolio/${next.slug}`}>Next space — {next.title}</GhostLink></div></section><ContactInvite /></>;
}
