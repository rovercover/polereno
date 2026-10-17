import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface MotionPreference {
  enabled: boolean;
  reducedMotion: boolean;
  toggle: () => void;
}

const storageKey = 'still-motion-paused';
const MotionContext = createContext<MotionPreference>({ enabled: true, reducedMotion: false, toggle: () => {} });

export function MotionProvider({ children }: { children: ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
  const [paused, setPaused] = useState(() => {
    try { return localStorage.getItem(storageKey) === 'true'; } catch { return false; }
  });

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(preference.matches);
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  function toggle() {
    setPaused(previous => {
      const next = !previous;
      try { localStorage.setItem(storageKey, String(next)); } catch { /* The preference still works for this visit. */ }
      return next;
    });
  }

  return <MotionContext value={{ enabled: !paused && !reducedMotion, reducedMotion, toggle }}>{children}</MotionContext>;
}

export function useMotion() { return useContext(MotionContext); }

export function MotionToggle() {
  const { enabled, reducedMotion, toggle } = useMotion();
  return <button
    type="button"
    className="motion-toggle"
    onClick={toggle}
    disabled={reducedMotion}
    aria-pressed={!enabled}
    title={reducedMotion ? 'Motion is off to respect your device’s reduced-motion setting.' : undefined}
  >{reducedMotion ? 'Motion off' : enabled ? 'Pause motion' : 'Play motion'}</button>;
}
