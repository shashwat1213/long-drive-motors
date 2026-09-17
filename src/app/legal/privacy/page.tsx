import type { Metadata } from 'next';
import { Container, Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/layout/PageHeader';
import { buildMetadata } from '@/lib/seo/metadata';
import { dealership } from '@/config/site';

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy',
  description: 'How Long Drive Motors collects, uses, and protects your information.',
  path: '/legal/privacy',
  noindex: true,
});

const sections = [
  {
    heading: 'Information we collect',
    body: 'When you contact us, request a test drive, or start a trade-in appraisal, we collect the details you provide — such as your name, phone number, email address, and information about the vehicle you are interested in.',
  },
  {
    heading: 'How we use your information',
    body: 'We use your information to respond to your enquiry, arrange appointments, prepare appraisals, and — where you have asked us to — follow up about vehicles that may suit you. We do not sell your personal information.',
  },
  {
    heading: 'Sharing',
    body: 'We share information only where it is necessary to serve you, such as with financing partners when you ask us to arrange financing, and where required by law.',
  },
  {
    heading: 'Your choices',
    body: 'You may ask us to correct or delete the information we hold about you, or to stop contacting you, at any time by calling or emailing the dealership.',
  },
  {
    heading: 'Contact us',
    body: 'Questions about this policy can be directed to the dealership at the address and phone number listed on our contact page.',
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy" />
      <Section>
        <Container>
          <div className="max-w-prose space-y-8">
            <p className="leading-relaxed text-fog-300">
              {dealership.legalName} respects your privacy. This policy explains what we collect
              when you use this website or contact us, and how we handle it.
            </p>
            {sections.map((s) => (
              <div key={s.heading}>
                <h2 className="font-display text-xl text-fog-50">{s.heading}</h2>
                <p className="mt-2 leading-relaxed text-fog-300">{s.body}</p>
              </div>
            ))}
            <p className="text-sm text-fog-500">
              This policy should be reviewed by legal counsel and finalised before public launch.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
