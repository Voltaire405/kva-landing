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

export function validateEmail(value: unknown): string | NextResponse {
  const email = validateRequiredString(value, 'email', 254);
  if (email instanceof NextResponse) {
    return email;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
  }

  return email;
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
