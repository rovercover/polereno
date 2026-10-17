import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { GhostLink } from '../components/GhostLink';
import { OutlinedButton } from '../components/OutlinedButton';
import { SectionHeading } from '../components/SectionHeading';
import { PortfolioCard } from '../components/PortfolioCard';
import { TwoColumnProject } from '../components/TwoColumnProject';
import { DarkOverlaySection } from '../components/DarkOverlaySection';
import { Input, Select, Textarea } from '../components/Field';
import { Footer } from '../components/Footer';
import { Portfolio } from '../pages/Portfolio';

function inRouter(ui: ReactNode) { return render(<MemoryRouter>{ui}</MemoryRouter>); }

describe('navigation and semantic components', () => {
  it('opens and closes the menu and exposes every page', async () => {
    const user = userEvent.setup();
    inRouter(<Header theme="dark" />);
    await user.click(screen.getByRole('button', { name: 'Meny' }));
    expect(screen.getByRole('dialog')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Meny' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: /Prosess The approach/ })).toHaveAttribute('href', '/process');
    await user.click(screen.getByRole('button', { name: 'Close menu' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
  it('renders a semantic hero with eager responsive imagery', () => {
    inRouter(<Hero image="courtyard" headline="A new feeling." subline="Thoughtful renovation." />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('A new feeling.');
    expect(screen.getByRole('img')).toHaveAttribute('loading', 'eager');
    expect(screen.getByRole('img')).toHaveAttribute('srcset');
  });
  it('renders outlined actions as links or submit buttons', () => {
    inRouter(<><OutlinedButton href="/contact" variant="onDark">Talk to us</OutlinedButton><OutlinedButton type="submit" disabled>Send</OutlinedButton></>);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/contact');
    expect(screen.getByRole('link')).toHaveClass('button-dark');
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    expect(screen.getByRole('button')).toBeDisabled();
  });
  it('uses a real link and a configurable semantic heading', () => {
    inRouter(<><GhostLink href="/about" theme="dark">The studio</GhostLink><SectionHeading as="h3">Our approach</SectionHeading></>);
    expect(screen.getByRole('link')).toHaveClass('border-muted-gold');
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Our approach');
  });
  it('gives portfolio imagery an accessible name and working project link', () => {
    inRouter(<PortfolioCard image="courtyard" alt="A stone courtyard pool" title="The Courtyard" meta="Full renewal" href="/portfolio/the-courtyard" />);
    expect(screen.getByAltText('A stone courtyard pool')).toHaveAttribute('loading', 'lazy');
    expect(screen.getByRole('link', { name: 'Explore The Courtyard' })).toHaveAttribute('href', '/portfolio/the-courtyard');
    expect(screen.getByText('Full renewal')).toBeVisible();
  });
  it('renders two distinct photographs and their caption', () => {
    render(<TwoColumnProject leftImage={{ image: 'stone-detail', alt: 'Stone detail' }} rightImage={{ image: 'courtyard', alt: 'Courtyard pool' }} caption="The detail and the whole." />);
    expect(screen.getAllByRole('img')).toHaveLength(2);
    expect(screen.getByText('The detail and the whole.').tagName).toBe('FIGCAPTION');
  });
  it('renders the editorial break with its story link', () => {
    inRouter(<DarkOverlaySection image="evening-pool" title="After the light" alt="Pool at dusk" />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('After the light');
    expect(screen.getByRole('link')).toHaveAttribute('href', '/stories/after-the-light');
  });
  it('associates visible field labels and error descriptions', () => {
    render(<><Input id="name" label="Name" error="Please enter a name" /><Select id="pool" label="Pool"><option>Residential</option></Select><Textarea id="message" label="Message" /></>);
    expect(screen.getByLabelText('Name')).toHaveAttribute('aria-describedby', 'name-error');
    expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText('Pool')).toHaveRole('combobox');
    expect(screen.getByLabelText('Message').tagName).toBe('TEXTAREA');
  });
  it('provides footer navigation and concept transparency', () => {
    inRouter(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeVisible();
    expect(screen.getByRole('link', { name: 'About this concept' })).toHaveAttribute('href', '/colophon');
  });
  it('filters portfolio projects and restores the full list', async () => {
    const user = userEvent.setup();
    inRouter(<Portfolio />);
    expect(screen.getAllByRole('article')).toHaveLength(4);
    await user.click(screen.getByRole('button', { name: 'Retreats' }));
    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(screen.getByRole('status')).toHaveTextContent('01 spaces');
    await user.click(screen.getByRole('button', { name: 'All spaces' }));
    expect(screen.getAllByRole('article')).toHaveLength(4);
  });
});
