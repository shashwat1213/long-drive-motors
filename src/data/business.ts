import type { FaqItem, FinancingPlanExample } from '@/lib/content/types';

/**
 * Business demonstration data. Financing figures are illustrative examples used
 * to present the experience and are not credit offers.
 */

export const financingPlanExamples: FinancingPlanExample[] = [
  {
    id: 'standard-60',
    label: 'Standard',
    aprPercent: 7.99,
    termMonths: 60,
    note: 'Illustrative rate for well-qualified buyers.',
  },
  {
    id: 'extended-72',
    label: 'Extended Term',
    aprPercent: 8.99,
    termMonths: 72,
    note: 'Lower monthly payment over a longer term.',
  },
  {
    id: 'rebuild-48',
    label: 'Credit Rebuild',
    aprPercent: 12.99,
    termMonths: 48,
    note: 'Designed to help re-establish credit history.',
  },
];

export const faqs: FaqItem[] = [
  {
    topic: 'general',
    question: 'Are the vehicles inspected before sale?',
    answer:
      'Yes. Every vehicle is hand-picked and inspected before it is listed, so you can shop with confidence.',
  },
  {
    topic: 'financing',
    question: 'Can I get pre-approved online?',
    answer:
      'Yes. You can explore payment estimates and start a pre-approval online, then finalize the details with our finance team.',
  },
  {
    topic: 'financing',
    question: 'Do you work with different credit situations?',
    answer:
      'We work with a wide range of credit situations, including first-time buyers and credit rebuilding. The figures shown are illustrative examples.',
  },
  {
    topic: 'trade-in',
    question: 'How does the trade-in appraisal work?',
    answer:
      'Share your vehicle\u2019s details for an estimated range, then bring it in for a confirmed appraisal that can be applied toward your next vehicle.',
  },
  {
    topic: 'test-drive',
    question: 'How do I book a test drive?',
    answer:
      'Choose a vehicle and a time that works for you, and we\u2019ll have it ready when you arrive at the showroom.',
  },
];
