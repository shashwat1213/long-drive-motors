'use client';

import { useEffect, useState } from 'react';
import { detectCapability, type CapabilityReport } from '@/three/core/capability';

const SSR_DEFAULT: CapabilityReport = {
  tier: 'fallback',
  webglSupported: false,
  isMobile: false,
  recommendedDpr: 1,
  reasons: ['pre-mount'],
};

/**
 * Returns the device capability report once mounted on the client.
 * `ready` indicates detection has run — use it to avoid rendering the wrong
 * tier (or a fallback flash) before the client check completes.
 */
export function useCapability(): { report: CapabilityReport; ready: boolean } {
  const [report, setReport] = useState<CapabilityReport>(SSR_DEFAULT);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReport(detectCapability());
    setReady(true);
  }, []);

  return { report, ready };
}
