'use client';

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'yomiru:terms:acceptedAt';

export function useTermsConsent() {
  const [accepted, setAccepted] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const val = window.localStorage.getItem(STORAGE_KEY);
    setAccepted(!!val);
  }, []);

  const accept = useCallback(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    setAccepted(true);
  }, []);

  return { accepted, accept };
}
