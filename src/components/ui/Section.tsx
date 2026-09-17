import { createElement, type ElementType, type ReactNode } from 'react';
import { cn } from '@/lib/utils/format';
import { Reveal } from './Reveal';

/** Constrained, gutter-padded content container. */
export function Container({
  children,
  className,
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  return createElement(Tag, { className: cn('container-content', className) }, children);
}

/** Vertical section wrapper with consistent rhythm. */
export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn('py-section', className)}>
      {children}
    </section>
  );
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        'max-w-prose',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow ? (
        <span className="eyebrow">
          <span className="h-px w-6 bg-brand-500" aria-hidden />
          {eyebrow}
        </span>
      ) : null}
      <h2 className="mt-4 text-display-lg">{title}</h2>
      {description ? <p className="mt-4 text-fog-300 text-lg leading-relaxed">{description}</p> : null}
    </Reveal>
  );
}
