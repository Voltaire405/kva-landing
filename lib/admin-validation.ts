import { NextResponse } from 'next/server';

import { PASSWORD_MIN_LENGTH } from '@/lib/password-strength';

export function parseId(value: string): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export function validateRequiredString(
  value: unknown,
  field: string,
  maxLength = 500
): string | NextResponse {
  if (typeof value !== 'string' || !value.trim()) {
    return NextResponse.json({ error: `${field} es requerido` }, { status: 400 });
  }

  const trimmed = value.trim();
  if (trimmed.length > maxLength) {
    return NextResponse.json(
      { error: `${field} excede ${maxLength} caracteres` },
      { status: 400 }
    );
  }

  return trimmed;
}

const LOCAL_PART_PATTERN = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/;
const DOMAIN_LABEL_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmailFormat(email: string): boolean {
  if (email.length > 254) {
    return false;
  }

  const atIndex = email.indexOf('@');
  if (atIndex <= 0 || atIndex !== email.lastIndexOf('@')) {
    return false;
  }

  const localPart = email.slice(0, atIndex);
  const domain = email.slice(atIndex + 1);

  if (localPart.length > 64 || domain.length === 0 || domain.length > 253) {
    return false;
  }

  if (
    localPart.startsWith('.') ||
    localPart.endsWith('.') ||
    localPart.includes('..') ||
    !LOCAL_PART_PATTERN.test(localPart)
  ) {
    return false;
  }

  const labels = domain.split('.');
  if (labels.length < 2) {
    return false;
  }

  const tld = labels.at(-1);
  if (!tld || tld.length < 2 || !/^[a-z]+$/.test(tld)) {
    return false;
  }

  for (const label of labels) {
    if (label.length === 0 || label.length > 63 || !DOMAIN_LABEL_PATTERN.test(label)) {
      return false;
    }
  }

  return true;
}

export function validateEmail(value: unknown): string | NextResponse {
  const email = validateRequiredString(value, 'email', 254);
  if (email instanceof NextResponse) {
    return email;
  }

  const normalized = normalizeEmail(email);

  if (!isValidEmailFormat(normalized)) {
    return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
  }

  return normalized;
}

export function validateSortOrder(value: unknown): number {
  const sortOrder = Number(value);
  return Number.isInteger(sortOrder) && sortOrder >= 0 ? sortOrder : 0;
}

export function validateAccessCode(value: unknown): string | NextResponse {
  const code = validateRequiredString(value, 'code', 128);
  if (code instanceof NextResponse) {
    return code;
  }

  if (code.length < PASSWORD_MIN_LENGTH) {
    return NextResponse.json(
      { error: `El código debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres` },
      { status: 400 }
    );
  }

  return code;
}
