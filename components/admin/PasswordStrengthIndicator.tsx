'use client';

import { evaluatePasswordStrength, PASSWORD_MIN_LENGTH } from '@/lib/password-strength';

const barColors = {
  gray: 'bg-gray-300',
  red: 'bg-red-500',
  yellow: 'bg-yellow-400',
  green: 'bg-green-500',
} as const;

const textColors = {
  gray: 'text-text-secondary',
  red: 'text-red-600',
  yellow: 'text-yellow-600',
  green: 'text-green-600',
} as const;

export function PasswordStrengthIndicator({ password }: { password: string }) {
  const strength = evaluatePasswordStrength(password);

  if (strength.level === 'empty') {
    return null;
  }

  return (
    <div className="space-y-2 -mt-1">
      <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-200 ${barColors[strength.color]}`}
          style={{ width: strength.barWidth }}
        />
      </div>
      <p className={`text-xs font-medium ${textColors[strength.color]}`}>
        Seguridad: {strength.label}
        {strength.level === 'insufficient' && ` (mínimo ${PASSWORD_MIN_LENGTH} caracteres)`}
      </p>
      {strength.level === 'insufficient' && (
        <p className="text-xs text-text-secondary">Usa al menos 8 caracteres.</p>
      )}
    </div>
  );
}

export function WeakPasswordWarning({
  acknowledged,
  onAcknowledgeChange,
}: {
  acknowledged: boolean;
  onAcknowledgeChange: (acknowledged: boolean) => void;
}) {
  return (
    <div className="rounded-[5px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 space-y-3">
      <p>
        Esta contraseña es débil y puede ser fácil de adivinar. Se recomienda usar mayúsculas,
        minúsculas, números y símbolos.
      </p>
      <label className="flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={acknowledged}
          onChange={(event) => onAcknowledgeChange(event.target.checked)}
          className="mt-0.5"
        />
        <span>Entiendo el riesgo y deseo usar esta contraseña débil.</span>
      </label>
    </div>
  );
}
