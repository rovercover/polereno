import { useActionState, useEffect, useRef, useState } from 'react';
import { Input, Select, Textarea } from './Field';
import { OutlinedButton } from './OutlinedButton';
import { contactEndpoint, downloadInquiry, draftKey, emptyInquiry, initialInquiryState, poolTypes, submitInquiry } from '../data/inquiry';
import type { Inquiry } from '../data/inquiry';

interface ContactFormProps { onRestart: () => void }

export function ContactForm({ onRestart }: ContactFormProps) {
  const [state, formAction, pending] = useActionState(submitInquiry, initialInquiryState);
  const [values, setValues] = useState<Inquiry>(emptyInquiry);
  const [removed, setRemoved] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const status = useRef<HTMLDivElement>(null);
  const change = (name: keyof Inquiry, value: string) => setValues(current => ({ ...current, [name]: value }));

  useEffect(() => {
    if (state.status === 'error') {
      const invalid = form.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
      (invalid ?? status.current)?.focus();
    }
    if (state.status === 'success') status.current?.focus();
  }, [state]);

  if (state.status === 'success' && state.inquiry) {
    return <div><div ref={status} tabIndex={-1} className="form-status" role="status"><h2 className="text-heading leading-heading mb-24">A good place to begin.</h2><p>{state.message}</p></div><div className="flex flex-wrap gap-16 mt-24"><OutlinedButton onClick={() => state.inquiry && downloadInquiry(state.inquiry)}>Download inquiry</OutlinedButton><OutlinedButton onClick={onRestart}>Write another note</OutlinedButton></div>{state.local && <div className="mt-24 text-caption"><button className="ghost-link border-obsidian" type="button" disabled={removed} onClick={() => { try { localStorage.removeItem(draftKey); setRemoved(true); } catch { setRemoved(false); } }}>{removed ? 'Saved draft removed' : 'Remove draft from this device'}</button><p className="mt-12" aria-live="polite">{removed ? 'Your saved contact details have been removed.' : 'The saved draft contains your contact details.'}</p></div>}</div>;
  }

  return <form ref={form} action={formAction} noValidate aria-label="Pool renovation inquiry" className="flex flex-col gap-24">
    {!contactEndpoint && <p className="text-caption leading-caption border-b border-muted-gold pb-24">Preview form — your inquiry will be saved on this device only. No message will be sent.</p>}
    {state.status === 'error' && <div ref={status} tabIndex={-1} role="alert" className="form-status">{state.message}</div>}
    <div className="form-grid"><Input id="name" name="name" label="Your name" autoComplete="name" required maxLength={100} placeholder="Full name" value={values.name} onChange={event => change('name', event.target.value)} error={state.errors.name} disabled={pending} /><Input id="email" name="email" label="Email address" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" value={values.email} onChange={event => change('email', event.target.value)} error={state.errors.email} disabled={pending} /></div>
    <div className="form-grid"><Input id="phone" name="phone" label="Phone (optional)" type="tel" autoComplete="tel" maxLength={25} placeholder="Your phone number" value={values.phone} onChange={event => change('phone', event.target.value)} error={state.errors.phone} disabled={pending} /><Select id="pool-type" name="poolType" label="Your pool" required value={values.poolType} onChange={event => change('poolType', event.target.value)} error={state.errors.poolType} disabled={pending}><option value="" disabled>Select a pool type</option>{poolTypes.map(type => <option key={type} value={type}>{type}</option>)}</Select></div>
    <Textarea id="message" name="message" label="Tell us about your space" rows={6} required maxLength={5000} placeholder="What would you like to change? Where is your pool, and what do you have in mind?" value={values.message} onChange={event => change('message', event.target.value)} error={state.errors.message} disabled={pending} />
    <p className="text-caption leading-caption">A few thoughts are all we need to get started. All fields except phone are required.</p>
    <div aria-live="polite"><OutlinedButton type="submit" disabled={pending}>{pending ? (contactEndpoint ? 'Sending your inquiry…' : 'Saving your inquiry…') : (contactEndpoint ? 'Send inquiry' : 'Save inquiry')}</OutlinedButton></div>
  </form>;
}
