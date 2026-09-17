/** Navigation structure — shared by header, mobile nav, and footer. */

export interface NavLink {
  label: string;
  href: string;
  /** Optional short description for expanded/mobile presentations. */
  description?: string;
}

export const primaryNav: NavLink[] = [
  { label: 'Inventory', href: '/inventory', description: 'Browse hand-picked pre-owned vehicles' },
  { label: 'Financing', href: '/financing', description: 'Estimate payments and pre-qualify' },
  { label: 'Trade-In', href: '/trade-in', description: 'Value your car or sell it to us' },
  { label: 'About', href: '/about', description: 'Our story and how we work' },
  { label: 'Contact', href: '/contact', description: 'Visit, call, or message us' },
];

/** Primary call-to-action — the signature 3D entry point. */
export const primaryCta: NavLink = {
  label: 'Explore Showroom',
  href: '/showroom',
  description: 'Step into the immersive 3D showroom',
};

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: 'Shop',
    links: [
      { label: 'All Inventory', href: '/inventory' },
      { label: 'Explore Showroom', href: '/showroom' },
      { label: 'Financing', href: '/financing' },
      { label: 'Trade-In & Sell', href: '/trade-in' },
    ],
  },
  {
    title: 'Visit',
    links: [
      { label: 'Book a Test Drive', href: '/test-drive' },
      { label: 'About Us', href: '/about' },
      { label: 'Contact & Directions', href: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [{ label: 'Privacy Policy', href: '/legal/privacy' }],
  },
];
