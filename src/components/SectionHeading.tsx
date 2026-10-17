import type { ReactNode } from 'react';

interface SectionHeadingProps { children: ReactNode; as?: 'h1' | 'h2' | 'h3'; className?: string }

export function SectionHeading({ children, as: Tag = 'h2', className = '' }: SectionHeadingProps) {
  return <Tag className={`text-heading leading-heading font-medium ${className}`}>{children}</Tag>;
}
