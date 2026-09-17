/** Small, dependency-free formatting + className helpers. */

/** Join class names, dropping falsy values. Avoids a clsx/tailwind-merge dep. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

const cadFormatter = new Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency: 'CAD',
  maximumFractionDigits: 0,
});

export function formatPrice(value: number): string {
  return cadFormatter.format(value);
}

const kmFormatter = new Intl.NumberFormat('en-CA', { maximumFractionDigits: 0 });

export function formatMileage(km: number): string {
  return `${kmFormatter.format(km)} km`;
}

/** Estimate a monthly payment (amortized). Illustrative only — not an offer. */
export function estimateMonthlyPayment(
  principal: number,
  aprPercent: number,
  termMonths: number,
): number {
  if (principal <= 0 || termMonths <= 0) return 0;
  const monthlyRate = aprPercent / 100 / 12;
  if (monthlyRate === 0) return principal / termMonths;
  const factor = Math.pow(1 + monthlyRate, termMonths);
  return (principal * monthlyRate * factor) / (factor - 1);
}
