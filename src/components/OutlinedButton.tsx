import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router';

interface OutlinedButtonProps {
  variant?: 'onDark' | 'onCream';
  href?: string;
  children: ReactNode;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export function OutlinedButton({ variant = 'onCream', href, children, type = 'button', disabled, onClick, className = '' }: OutlinedButtonProps) {
  const classes = `outlined-button ${variant === 'onDark' ? 'button-dark' : 'button-cream'} ${className}`;
  return href ? (
    <Link to={href} className={classes}>{children}</Link>
  ) : (
    <button type={type} className={classes} disabled={disabled} onClick={onClick}>{children}</button>
  );
}
