import type { Metadata } from 'next';
import { Container, Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { ContactForm } from '@/components/forms/ContactForm';
import { JsonLd } from '@/components/seo/JsonLd';
import { autoDealerSchema, breadcrumbSchema } from '@/lib/seo/structured-data';
import { buildMetadata } from '@/lib/seo/metadata';
import { dealership, directionsUrl, mapEmbedUrl } from '@/config/site';

export const metadata: Metadata = buildMetadata({
  title: 'Contact & Directions',
  description:
    'Visit Long Drive Motors at 3725 Lake Shore Blvd W, Toronto. Call +1 437-298-5226, get directions, view hours, or send us a message.',
  path: '/contact',
});

function formatHour(value: string): string {
  const [h, m] = value.split(':').map(Number);
  const hh = h ?? 0;
  const mm = m ?? 0;
  const period = hh >= 12 ? 'PM' : 'AM';
  const hour12 = hh % 12 === 0 ? 12 : hh % 12;
  return mm === 0 ? hour12 + ' ' + period : hour12 + ':' + String(mm).padStart(2, '0') + ' ' + period;
}

export default function ContactPage() {
  const { address, phone, phoneHref, hours, legalName } = dealership;

  return (
    <>
      <JsonLd
        data={[
          autoDealerSchema(),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Contact', path: '/contact' },
          ]),
        ]}
      />

      <PageHeader
        eyebrow="Contact"
        title="Visit Long Drive Motors"
        description="Come see the lineup in person, give us a call, or send a message — we’re here throughout the week."
      >
        <div className="flex flex-wrap gap-3">
          <Button href={'tel:' + phoneHref}>Call {phone}</Button>
          <Button href={directionsUrl} variant="ghost">
            Get Directions
          </Button>
        </div>
      </PageHeader>

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
            {/* Info + hours */}
            <div className="space-y-6">
              <div className="rounded-card border border-line bg-ink-800/60 p-7">
                <h2 className="text-xs uppercase tracking-eyebrow text-fog-500">Dealership</h2>
                <p className="mt-3 font-display text-lg text-fog-50">{legalName}</p>
                <address className="mt-2 not-italic leading-relaxed text-fog-300">
                  {address.street}
                  <br />
                  {address.city}, {address.region} {address.postalCode}
                  <br />
                  {address.country}
                </address>
                <p className="mt-4">
                  <a
                    href={'tel:' + phoneHref}
                    className="font-display text-lg text-fog-50 hover:text-brand-400"
                  >
                    {phone}
                  </a>
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <a
                    href={'tel:' + phoneHref}
                    className="rounded-pill bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
                  >
                    Call Us
                  </a>
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-pill border border-line px-4 py-2 text-sm text-fog-100 hover:bg-white/5"
                  >
                    Get Directions
                  </a>
                </div>
              </div>

              <div className="rounded-card border border-line bg-ink-800/60 p-7">
                <h2 className="text-xs uppercase tracking-eyebrow text-fog-500">Hours</h2>
                <ul className="mt-4 space-y-1.5 text-sm">
                  {hours.map((h) => (
                    <li key={h.day} className="flex justify-between gap-4 text-fog-300">
                      <span className="text-fog-400">{h.day}</span>
                      <span>
                        {formatHour(h.open)} – {formatHour(h.close)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Map + form */}
            <div className="space-y-6">
              <div className="overflow-hidden rounded-card border border-line">
                <iframe
                  title={'Map to ' + legalName}
                  src={mapEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-64 w-full border-0 grayscale-[0.2]"
                />
              </div>
              <div className="rounded-card border border-line bg-ink-800/60 p-7">
                <h2 className="font-display text-xl text-fog-50">Send a message</h2>
                <p className="mt-1.5 text-sm text-fog-400">
                  We’ll get back to you as soon as we can.
                </p>
                <div className="mt-6">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>

          {/* Closing CTA */}
          <div className="mt-14 flex flex-col items-center gap-4 rounded-card border border-line bg-ink-800/60 px-gutter py-12 text-center">
            <h2 className="text-display-md">Ready to visit?</h2>
            <p className="max-w-prose text-fog-300">
              Book a test drive ahead of time, or browse the full inventory before you arrive.
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              <Button href="/test-drive" size="lg">Book a Test Drive</Button>
              <Button href="/inventory" variant="ghost" size="lg">Browse Inventory</Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
