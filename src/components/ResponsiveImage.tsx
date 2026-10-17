import { useEffect, useRef } from 'react';
import { createWaterMotion } from '../lib/waterMotion';
import type { WaterMotion } from '../lib/waterMotion';
import { useMotion } from './MotionProvider';

interface ResponsiveImageProps {
  image: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function ResponsiveImage({ image, alt, className = '', sizes = '100vw', priority = false }: ResponsiveImageProps) {
  const frame = useRef<HTMLSpanElement>(null);
  const poster = useRef<HTMLImageElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const sync = useRef<() => void>(() => {});
  const { enabled } = useMotion();
  const enabledRef = useRef(enabled);

  useEffect(() => {
    enabledRef.current = enabled;
    sync.current();
  }, [enabled]);

  useEffect(() => {
    const container = frame.current;
    const picture = poster.current;
    const surface = canvas.current;
    if (!container || !picture || !surface || !('IntersectionObserver' in window)) return;

    let renderer: WaterMotion | null = null;
    let visible = false;
    let disposed = false;
    let attempted = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    container.dataset.renderer = 'photo';

    const update = () => {
      const playing = enabledRef.current && visible && !document.hidden;
      container.dataset.motion = playing ? 'playing' : 'paused';
      renderer?.setPlaying(playing);
      if (playing && !renderer && !attempted && picture.complete && picture.naturalWidth) {
        attempted = true;
        // Let the responsive poster paint first, then progressively enhance it.
        timer = setTimeout(() => {
          if (disposed || !enabledRef.current || !visible || document.hidden) { attempted = false; return; }
          renderer = createWaterMotion(surface, picture, image);
          if (renderer) { container.dataset.renderer = 'water'; renderer.setPlaying(true); }
          else container.dataset.renderer = 'photo';
        }, 250);
      }
    };

    const onLoad = () => { renderer?.updateImage(); update(); };
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; update(); }, { threshold: 0.02 });
    const resizeObserver = new ResizeObserver(() => renderer?.resize());
    const contextLost = (event: Event) => {
      event.preventDefault();
      renderer?.dispose();
      renderer = null;
      container.dataset.renderer = 'photo';
    };
    const contextRestored = () => { attempted = false; update(); };
    sync.current = update;
    observer.observe(container);
    resizeObserver.observe(container);
    picture.addEventListener('load', onLoad);
    surface.addEventListener('webglcontextlost', contextLost);
    surface.addEventListener('webglcontextrestored', contextRestored);
    document.addEventListener('visibilitychange', update);

    return () => {
      disposed = true;
      clearTimeout(timer);
      renderer?.dispose();
      observer.disconnect();
      resizeObserver.disconnect();
      picture.removeEventListener('load', onLoad);
      surface.removeEventListener('webglcontextlost', contextLost);
      surface.removeEventListener('webglcontextrestored', contextRestored);
      document.removeEventListener('visibilitychange', update);
      sync.current = () => {};
    };
  }, [image]);

  return (
    <span ref={frame} className={`motion-image block w-full ${className}`} data-motion="paused" data-renderer="photo">
    <img
      ref={poster}
      src={`/images/${image}-1600.webp`}
      srcSet={`/images/${image}-640.webp 640w, /images/${image}-1000.webp 1000w, /images/${image}-1600.webp 1600w`}
      sizes={sizes}
      alt={alt}
      width={1536}
      height={1024}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      draggable={false}
      className="motion-poster block w-full object-cover"
    />
    <canvas ref={canvas} className="motion-canvas" aria-hidden="true" />
    </span>
  );
}
