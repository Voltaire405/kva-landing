import { config } from 'dotenv';

config({ path: '.env.local' });
config();

import { persistAccessCode } from '../lib/admin-settings';
import { PASSWORD_MIN_LENGTH } from '../lib/password-strength';

async function addAdmin() {
  const code = process.env.NEW_ADMIN_CODE?.trim();

  if (!code || code.length < PASSWORD_MIN_LENGTH) {
    throw new Error(`NEW_ADMIN_CODE es obligatorio (mínimo ${PASSWORD_MIN_LENGTH} caracteres)`);
  }

  const admin = await persistAccessCode(code);
  console.log(`Admin registrado con id ${admin.id}.`);
}

addAdmin().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
