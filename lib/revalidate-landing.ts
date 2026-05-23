import { revalidatePath, revalidateTag } from 'next/cache';

export const LANDING_CONTENT_TAG = 'landing-content';

export function revalidateLandingPage() {
  revalidateTag(LANDING_CONTENT_TAG);
  revalidatePath('/');
}
