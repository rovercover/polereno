import { useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { MotionToggle } from './MotionProvider';

interface HeaderProps { theme: 'dark' | 'light' }

const navigation = [
  ['/', 'Hjem', 'Home'],
  ['/portfolio', 'Portefølje', 'Our work'],
  ['/process', 'Prosess', 'The approach'],
  ['/about', 'Om oss', 'The studio'],
  ['/contact', 'Kontakt', 'Start a conversation'],
] as const;

export function Header({ theme }: HeaderProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const location = useLocation();

  const closeMenu = () => {
    dialog.current?.close();
    document.body.classList.remove('menu-open');
    menuButton.current?.setAttribute('aria-expanded', 'false');
  };

  useEffect(() => {
    dialog.current?.close();
    document.body.classList.remove('menu-open');
    menuButton.current?.setAttribute('aria-expanded', 'false');
  }, [location.pathname]);

  useEffect(() => () => document.body.classList.remove('menu-open'), []);

  function openMenu() {
    dialog.current?.showModal();
    document.body.classList.add('menu-open');
    menuButton.current?.setAttribute('aria-expanded', 'true');
  }

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className={`site-header ${theme === 'dark' ? 'text-warm-parchment' : 'text-obsidian'}`}>
        <Link to="/" aria-label="STILL — home" className="wordmark">STILL</Link>
        <span className="header-description text-caption">Pool renovation, thoughtfully considered.</span>
        <nav aria-label="Main navigation" className="flex items-center gap-24">
          <MotionToggle />
          <NavLink to="/portfolio" lang="nb" className={({ isActive }) => `header-portfolio outlined-button ${theme === 'dark' ? 'button-dark' : 'button-cream'} ${isActive ? 'nav-active' : ''}`}>Portefølje</NavLink>
          <button ref={menuButton} type="button" lang="nb" className="menu-trigger" aria-expanded="false" aria-controls="site-menu" onClick={openMenu}>Meny</button>
        </nav>
      </header>
      <dialog ref={dialog} id="site-menu" className="menu-dialog" aria-labelledby="menu-title" onClose={closeMenu} onCancel={closeMenu}>
        <div className="flex items-center justify-between">
          <Link to="/" className="wordmark" onClick={closeMenu}>STILL</Link>
          <button type="button" className="outlined-button button-dark" onClick={closeMenu}>Close menu</button>
        </div>
        <div className="menu-content">
          <div><p id="menu-title" className="eyebrow mb-24">A little room for possibility.</p><p className="text-heading leading-heading">Water. Space.<br />A new beginning.</p></div>
          <nav aria-label="All pages" className="menu-links">
            {navigation.map(([href, label, caption]) => <NavLink key={href} to={href} aria-label={`${label} ${caption}`} end className={({ isActive }) => `menu-link ${isActive ? 'nav-active' : ''}`} onClick={closeMenu}><span lang="nb">{label}</span><span className="text-caption">{caption}</span></NavLink>)}
          </nav>
        </div>
        <p className="text-caption border-t border-muted-gold pt-24">Considered spaces. Lasting impressions.</p>
      </dialog>
    </>
  );
}
