import type { ReactNode } from 'react';
import { Link } from 'react-router';

interface GhostLinkProps { href: string; theme?: 'dark' | 'light'; children: ReactNode; className?: string }

export function GhostLink({ href, theme = 'light', children, className = '' }: GhostLinkProps) {
  const classes = `ghost-link ${theme === 'dark' ? 'border-muted-gold' : 'border-obsidian'} ${className}`;
  return /^(mailto:|https?:)/.test(href)
    ? <a href={href} className={classes}>{children}</a>
    : <Link to={href} className={classes}>{children}</Link>;
}
