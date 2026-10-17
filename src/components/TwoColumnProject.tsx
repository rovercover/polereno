import { ResponsiveImage } from './ResponsiveImage';

interface ProjectImage { image: string; alt: string }
interface TwoColumnProjectProps { leftImage: ProjectImage; rightImage: ProjectImage; caption: string }

export function TwoColumnProject({ leftImage, rightImage, caption }: TwoColumnProjectProps) {
  return <div className="two-column-project"><ResponsiveImage {...leftImage} sizes="(min-width: 1024px) 40vw, 100vw" className="aspect-square" /><figure><ResponsiveImage {...rightImage} sizes="(min-width: 1024px) 60vw, 100vw" className="aspect-landscape" /><figcaption className="p-40 text-caption">{caption}</figcaption></figure></div>;
}
