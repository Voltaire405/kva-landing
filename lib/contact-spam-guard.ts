import { isContactTestMode } from '@/lib/contact-test-mode';

export const MIN_FORM_SUBMIT_MS = 3000;
export const HONEYPOT_FIELD = 'website';

export type ContactSpamPayload = {
  website?: string;
  formLoadedAt?: number;
};

export type ContactSpamResult =
  | { isBot: false }
  | { isBot: true; reason: 'honeypot' | 'too_fast' | 'missing_timestamp' };

export function validateContactSpam(payload: ContactSpamPayload): ContactSpamResult {
  if (isContactTestMode()) {
    return { isBot: false };
  }

  if (payload.website?.trim()) {
    return { isBot: true, reason: 'honeypot' };
  }

  if (typeof payload.formLoadedAt !== 'number' || !Number.isFinite(payload.formLoadedAt)) {
    return { isBot: true, reason: 'missing_timestamp' };
  }

  const elapsed = Date.now() - payload.formLoadedAt;
  if (elapsed < MIN_FORM_SUBMIT_MS) {
    return { isBot: true, reason: 'too_fast' };
  }

  return { isBot: false };
}
