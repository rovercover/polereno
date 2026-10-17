import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Portfolio } from './pages/Portfolio';
import { ProjectDetail } from './pages/ProjectDetail';
import { Process } from './pages/Process';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Story } from './pages/Story';
import { Colophon } from './pages/Colophon';
import { NotFound } from './pages/NotFound';

function RouteReset() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      requestAnimationFrame(() => document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ behavior: 'instant' }));
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);
  return null;
}

export function App() {
  const { pathname } = useLocation();
  return <><RouteReset /><Header theme={pathname === '/' ? 'dark' : 'light'} /><main id="main-content" tabIndex={-1}><Routes><Route path="/" element={<Home />} /><Route path="/portfolio" element={<Portfolio />} /><Route path="/portfolio/:slug" element={<ProjectDetail />} /><Route path="/process" element={<Process />} /><Route path="/about" element={<About />} /><Route path="/contact" element={<Contact />} /><Route path="/stories/after-the-light" element={<Story />} /><Route path="/colophon" element={<Colophon />} /><Route path="*" element={<NotFound />} /></Routes></main><Footer /></>;
}
