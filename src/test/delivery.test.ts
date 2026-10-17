import { afterEach, describe, expect, it, vi } from 'vitest';

function validData() {
  const data = new FormData();
  Object.entries({ name: 'Alex Morgan', email: 'alex@example.com', phone: '', poolType: 'Residential pool', message: 'We would like to renovate our garden pool and terrace.' }).forEach(([key, value]) => data.set(key, value));
  return data;
}

afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.resetModules(); });

describe('configured inquiry delivery', () => {
  it('posts validated details and confirms only after a successful response', async () => {
    vi.stubEnv('VITE_CONTACT_ENDPOINT', 'https://example.com/inquiries');
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 201 }));
    vi.stubGlobal('fetch', fetchMock);
    const { submitInquiry, initialInquiryState } = await import('../data/inquiry');
    const state = await submitInquiry(initialInquiryState, validData());
    expect(fetchMock).toHaveBeenCalledWith('https://example.com/inquiries', expect.objectContaining({ method: 'POST' }));
    expect(state).toMatchObject({ status: 'success', local: false });
  });
  it('reports server errors without claiming successful delivery', async () => {
    vi.stubEnv('VITE_CONTACT_ENDPOINT', 'https://example.com/inquiries');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 500 })));
    const { submitInquiry, initialInquiryState } = await import('../data/inquiry');
    const state = await submitInquiry(initialInquiryState, validData());
    expect(state.status).toBe('error');
    expect(state.message).toContain('could not be sent');
  });
  it('does not send invalid details', async () => {
    vi.stubEnv('VITE_CONTACT_ENDPOINT', 'https://example.com/inquiries');
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const { submitInquiry, initialInquiryState } = await import('../data/inquiry');
    expect((await submitInquiry(initialInquiryState, new FormData())).status).toBe('error');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
