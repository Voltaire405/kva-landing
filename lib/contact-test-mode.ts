export function isContactTestMode() {
  return process.env.CONTACT_TEST_MODE === 'true';
}

export function isContactTestModeClient() {
  return process.env.NEXT_PUBLIC_CONTACT_TEST_MODE === 'true';
}
