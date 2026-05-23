export const PASSWORD_MIN_LENGTH = 8;

export type PasswordStrengthLevel = 'empty' | 'insufficient' | 'weak' | 'medium' | 'strong';

export type PasswordStrengthColor = 'gray' | 'red' | 'yellow' | 'green';

export type PasswordStrengthResult = {
  level: PasswordStrengthLevel;
  label: string;
  color: PasswordStrengthColor;
  barWidth: string;
  meetsMinimum: boolean;
  requiresWarning: boolean;
};

function countCharacterTypes(password: string): number {
  let types = 0;

  if (/[a-z]/.test(password)) types++;
  if (/[A-Z]/.test(password)) types++;
  if (/[0-9]/.test(password)) types++;
  if (/[^a-zA-Z0-9]/.test(password)) types++;

  return types;
}

export function evaluatePasswordStrength(password: string): PasswordStrengthResult {
  if (!password) {
    return {
      level: 'empty',
      label: '',
      color: 'gray',
      barWidth: '0%',
      meetsMinimum: false,
      requiresWarning: false,
    };
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return {
      level: 'insufficient',
      label: 'Insuficiente',
      color: 'red',
      barWidth: '33%',
      meetsMinimum: false,
      requiresWarning: false,
    };
  }

  const types = countCharacterTypes(password);
  let score = 0;

  if (password.length >= PASSWORD_MIN_LENGTH) score++;
  if (password.length >= 12) score++;
  if (types >= 2) score++;
  if (types >= 3) score++;
  if (types >= 4) score++;

  if (score <= 2) {
    return {
      level: 'weak',
      label: 'Débil',
      color: 'red',
      barWidth: '33%',
      meetsMinimum: true,
      requiresWarning: true,
    };
  }

  if (score <= 3) {
    return {
      level: 'medium',
      label: 'Media',
      color: 'yellow',
      barWidth: '66%',
      meetsMinimum: true,
      requiresWarning: false,
    };
  }

  return {
    level: 'strong',
    label: 'Fuerte',
    color: 'green',
    barWidth: '100%',
    meetsMinimum: true,
    requiresWarning: false,
  };
}
