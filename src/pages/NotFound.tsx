import { OutlinedButton } from '../components/OutlinedButton';
import { Seo } from '../components/Seo';

export function NotFound() {
  return <><Seo title="Page not found" description="This space could not be found. Return to STILL’s home or explore the portfolio." /><section className="page-container page-intro pb-100"><p className="eyebrow mb-24">404 / A small detour</p><h1>This space isn’t here.</h1><p className="mt-24 mb-40">Let’s find your way back to something familiar.</p><OutlinedButton href="/">Back to the beginning</OutlinedButton></section></>;
}
