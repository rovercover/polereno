import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import { MotionProvider, MotionToggle } from '../components/MotionProvider';

function mediaPreference(reduced: boolean) {
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: reduced, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
}

afterEach(() => vi.unstubAllGlobals());

it('lets visitors pause motion and remembers their choice', async () => {
  mediaPreference(false);
  const user = userEvent.setup();
  render(<MotionProvider><MotionToggle /></MotionProvider>);
  await user.click(screen.getByRole('button', { name: 'Pause motion' }));
  expect(screen.getByRole('button', { name: 'Play motion' })).toHaveAttribute('aria-pressed', 'true');
  expect(localStorage.getItem('still-motion-paused')).toBe('true');
  await user.click(screen.getByRole('button', { name: 'Play motion' }));
  expect(localStorage.getItem('still-motion-paused')).toBe('false');
});

it('honors reduced-motion preferences without starting animation', () => {
  mediaPreference(true);
  render(<MotionProvider><MotionToggle /></MotionProvider>);
  expect(screen.getByRole('button', { name: 'Motion off' })).toBeDisabled();
});

it('restores a saved pause preference on the next visit', () => {
  mediaPreference(false);
  localStorage.setItem('still-motion-paused', 'true');
  render(<MotionProvider><MotionToggle /></MotionProvider>);
  expect(screen.getByRole('button', { name: 'Play motion' })).toBeVisible();
});
