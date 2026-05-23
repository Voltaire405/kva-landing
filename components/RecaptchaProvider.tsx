'use client';

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

import { isContactTestModeClient } from '@/lib/contact-test-mode';

export default function RecaptchaProvider({ children }: { children: React.ReactNode }) {
  if (isContactTestModeClient()) {
    return <>{children}</>;
  }

  const reCaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

  return (
    <GoogleReCaptchaProvider reCaptchaKey={reCaptchaSiteKey}>
      {children}
    </GoogleReCaptchaProvider>
  );
}
