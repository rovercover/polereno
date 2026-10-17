import { useState } from 'react';
import { PortfolioCard } from '../components/PortfolioCard';
import { ContactInvite } from '../components/ContactInvite';
import { Seo } from '../components/Seo';
import { projects } from '../data/projects';

type Filter = 'All spaces' | 'Residential' | 'Retreats';
const filters: Filter[] = ['All spaces', 'Residential', 'Retreats'];

export function Portfolio() {
  const [filter, setFilter] = useState<Filter>('All spaces');
  const visible = projects.filter(project => filter === 'All spaces' || project.category === filter);
  return <><Seo title="Portefølje" description="Explore STILL’s concept portfolio: pool renewal studies shaped by natural stone, considered lighting, and the surrounding landscape." /><section className="page-container page-intro"><div className="page-intro-grid"><div><p className="eyebrow mb-24" lang="nb">Portefølje / Our work</p><h1>Every space has<br />another story to tell.</h1></div><p className="prose-width">A collection of possibilities. Four concept studies exploring the relationship between water, architecture, and the way we live outside.</p></div></section><section className="page-container pb-100" aria-label="Project portfolio"><div className="filter-bar"><div className="filter-options" role="group" aria-label="Filter projects">{filters.map(item => <button type="button" className="filter-button" key={item} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>)}</div><p role="status" className="text-caption">{visible.length.toString().padStart(2, '0')} spaces</p></div><div className="portfolio-grid">{visible.map((project, index) => <PortfolioCard key={project.slug} {...project} href={`/portfolio/${project.slug}`} meta={`${project.setting} · ${project.scope}`} number={`0${projects.indexOf(project) + 1}`} wide={filter === 'All spaces' && (index === 0 || index === 3)} />)}</div><p className="concept-note">An illustrative portfolio. All project imagery is generated; these studies are not completed client commissions.</p></section><ContactInvite title="What could your space become?" /></>;
}
