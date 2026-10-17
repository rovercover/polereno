export interface Inquiry {
  name: string;
  email: string;
  phone: string;
  poolType: string;
  message: string;
}

export type InquiryErrors = Partial<Record<keyof Inquiry, string>>;
export interface InquiryState { status: 'idle' | 'error' | 'success'; errors: InquiryErrors; message: string; inquiry?: Inquiry; local?: boolean }
export const emptyInquiry: Inquiry = { name: '', email: '', phone: '', poolType: '', message: '' };
export const initialInquiryState: InquiryState = { status: 'idle', errors: {}, message: '' };
export const draftKey = 'still-inquiry-draft';
export const poolTypes = ['Residential pool', 'Hotel or retreat', 'Estate pool', 'Something else'] as const;
export const contactEndpoint = (import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined)?.trim();

export function validateInquiry(inquiry: Inquiry): InquiryErrors {
  const errors: InquiryErrors = {};
  if (inquiry.name.length < 2 || inquiry.name.length > 100) errors.name = 'Please enter your name (2–100 characters).';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email) || inquiry.email.length > 254) errors.email = 'Please enter a valid email address.';
  if (inquiry.phone && !/^[+\d()\s.\-]{6,25}$/.test(inquiry.phone)) errors.phone = 'Please enter a valid phone number, or leave this blank.';
  if (!poolTypes.some(type => type === inquiry.poolType)) errors.poolType = 'Please select a pool type.';
  if (inquiry.message.length < 20 || inquiry.message.length > 5000) errors.message = 'Please share a little more about your plans (20–5,000 characters).';
  return errors;
}

export async function submitInquiry(_previous: InquiryState, data: FormData): Promise<InquiryState> {
  const value = (key: keyof Inquiry) => String(data.get(key) ?? '').trim();
  const inquiry: Inquiry = { name: value('name'), email: value('email'), phone: value('phone'), poolType: value('poolType'), message: value('message') };
  const errors = validateInquiry(inquiry);
  if (Object.keys(errors).length) return { status: 'error', errors, message: 'Please check the highlighted fields below.' };
  try {
    if (contactEndpoint) {
      const response = await fetch(contactEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(inquiry), signal: AbortSignal.timeout(10000) });
      if (!response.ok) throw new Error('Delivery failed');
      return { status: 'success', errors: {}, message: 'Thank you. Your inquiry has been sent. We look forward to hearing more about your space.', inquiry, local: false };
    }
    localStorage.setItem(draftKey, JSON.stringify({ ...inquiry, savedAt: new Date().toISOString() }));
    return { status: 'success', errors: {}, message: 'Your inquiry is saved on this device. No email has been sent. You can download a copy of your note below.', inquiry, local: true };
  } catch {
    return { status: 'error', errors: {}, message: contactEndpoint ? 'Your inquiry could not be sent. Your details are still here; please try again.' : 'Your browser could not save this draft. Your details are still here; please enable local storage and try again.' };
  }
}

export function downloadInquiry(inquiry: Inquiry) {
  const content = `STILL — Pool renovation inquiry\n\nName: ${inquiry.name}\nEmail: ${inquiry.email}\nPhone: ${inquiry.phone || 'Not provided'}\nPool type: ${inquiry.poolType}\n\n${inquiry.message}\n`;
  const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'still-pool-inquiry.txt';
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
