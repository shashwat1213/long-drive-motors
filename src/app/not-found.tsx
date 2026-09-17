import { Container, Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <Section>
      <Container className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <span className="eyebrow">
          <span className="h-px w-6 bg-brand-500" aria-hidden />
          404
        </span>
        <h1 className="mt-5 text-display-lg">This road doesn’t lead anywhere</h1>
        <p className="mt-4 max-w-prose text-fog-400">
          The page you’re looking for may have moved or never existed. Let’s get you back on track.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/">Back home</Button>
          <Button href="/inventory" variant="ghost">
            Browse inventory
          </Button>
        </div>
      </Container>
    </Section>
  );
}
