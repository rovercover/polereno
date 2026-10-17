import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ContactForm } from '../components/ContactForm';
import { draftKey, validateInquiry } from '../data/inquiry';

describe('inquiry form', () => {
  it('rejects invalid details and focuses the first invalid field', async () => {
    const user = userEvent.setup();
    render(<ContactForm onRestart={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: 'Save inquiry' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Please check');
    expect(screen.getByLabelText('Your name')).toHaveFocus();
    expect(localStorage.getItem(draftKey)).toBeNull();
  });
  it('saves a valid local inquiry honestly, then allows its deletion', async () => {
    const user = userEvent.setup();
    render(<ContactForm onRestart={vi.fn()} />);
    await user.type(screen.getByLabelText('Your name'), 'Alex Morgan');
    await user.type(screen.getByLabelText('Email address'), 'alex@example.com');
    await user.selectOptions(screen.getByLabelText('Your pool'), 'Residential pool');
    await user.type(screen.getByLabelText('Tell us about your space'), 'We would love to renew the stone terrace around our garden pool.');
    await user.click(screen.getByRole('button', { name: 'Save inquiry' }));
    expect(await screen.findByRole('status')).toHaveTextContent('No email has been sent');
    expect(JSON.parse(localStorage.getItem(draftKey) ?? '{}')).toMatchObject({ name: 'Alex Morgan', poolType: 'Residential pool' });
    await user.click(screen.getByRole('button', { name: 'Remove draft from this device' }));
    expect(localStorage.getItem(draftKey)).toBeNull();
    expect(screen.getByText('Your saved contact details have been removed.')).toBeVisible();
  });
  it('preserves entered values when validation fails', async () => {
    const user = userEvent.setup();
    render(<ContactForm onRestart={vi.fn()} />);
    await user.type(screen.getByLabelText('Your name'), 'Alex Morgan');
    await user.click(screen.getByRole('button', { name: 'Save inquiry' }));
    expect(await screen.findByRole('alert')).toBeVisible();
    expect(screen.getByLabelText('Your name')).toHaveValue('Alex Morgan');
  });
  it('validates an optional phone and rejects arbitrary pool types', () => {
    expect(validateInquiry({ name: 'Alex', email: 'alex@example.com', phone: 'not-a-number', poolType: 'Injected type', message: 'A thoughtfully renewed garden swimming pool.' })).toMatchObject({ phone: expect.any(String), poolType: expect.any(String) });
  });
});
