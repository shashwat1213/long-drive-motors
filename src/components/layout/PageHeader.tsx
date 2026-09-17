import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';

/** Consistent hero band for interior pages. */
export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden border-b border-line">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(60% 120% at 15% 0%, rgba(225,29,42,0.10), transparent 60%)',
        }}
      />
      <Container className="relative py-section">
        <Reveal>
          <span className="eyebrow">
            <span className="h-px w-6 bg-brand-500" aria-hidden />
            {eyebrow}
          </span>
          <h1 className="mt-5 max-w-3xl text-display-xl">{title}</h1>
          {description ? (
            <p className="mt-5 max-w-prose text-lg leading-relaxed text-fog-300">{description}</p>
          ) : null}
          {children ? <div className="mt-8">{children}</div> : null}
        </Reveal>
      </Container>
    </div>
  );
}
