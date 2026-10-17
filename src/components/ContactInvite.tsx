import { OutlinedButton } from './OutlinedButton';

interface ContactInviteProps { title?: string; text?: string }

export function ContactInvite({ title = 'A new chapter for your pool.', text = 'Every transformation begins with a conversation. Tell us what you have in mind.' }: ContactInviteProps) {
  return <section className="page-container section-space contact-invite"><div><p className="eyebrow mb-24">Let’s begin</p><h2 className="text-heading lg:text-display leading-display">{title}</h2><p className="mt-24 prose-width">{text}</p></div><OutlinedButton href="/contact">Start a conversation</OutlinedButton></section>;
}
