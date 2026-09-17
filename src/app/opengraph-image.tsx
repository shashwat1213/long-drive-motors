import { ImageResponse } from 'next/og';
import { dealership, siteMeta } from '@/config/site';

/**
 * The site-wide social card, rendered as a real PNG.
 *
 * The previous card was an SVG in /public. No major platform renders one —
 * Facebook, X, LinkedIn, WhatsApp, Slack and iMessage all drop SVG Open Graph
 * images and fall back to a bare text link. Generating a PNG here is what makes
 * a shared link actually show a card.
 */

export const alt = `${siteMeta.name} — hand-picked pre-owned vehicles in ${dealership.address.city}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 80,
          backgroundColor: '#0A0B0D',
          backgroundImage:
            'radial-gradient(1000px 520px at 50% -10%, rgba(225,29,42,0.22), rgba(10,11,13,0) 70%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 28,
            letterSpacing: 10,
            color: '#E11D2A',
          }}
        >
          {siteMeta.name.toUpperCase()}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 28,
            fontSize: 84,
            lineHeight: 1.04,
            letterSpacing: -2,
            color: '#F7F7F8',
          }}
        >
          <span>The long drive</span>
          <span style={{ color: '#8B8E96' }}>starts here.</span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: 40,
            fontSize: 26,
            color: '#B9BBC1',
          }}
        >
          <span>{dealership.address.street}</span>
          <span style={{ margin: '0 14px', color: '#2E333D' }}>·</span>
          <span>{dealership.address.city}</span>
          <span style={{ margin: '0 14px', color: '#2E333D' }}>·</span>
          <span>{dealership.phone}</span>
        </div>

        <div style={{ display: 'flex', marginTop: 44, height: 4, width: 160, backgroundColor: '#E11D2A' }} />
      </div>
    ),
    size,
  );
}
