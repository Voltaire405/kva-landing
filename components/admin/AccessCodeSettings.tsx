'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminMessage,
  AdminPageHeader,
} from '@/components/admin/AdminUi';
import {
  PasswordStrengthIndicator,
  WeakPasswordWarning,
} from '@/components/admin/PasswordStrengthIndicator';
import { evaluatePasswordStrength } from '@/lib/password-strength';

export default function AccessCodeSettings() {
  const router = useRouter();
  const [configuredInDatabase, setConfiguredInDatabase] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );
  const [form, setForm] = useState({
    currentCode: '',
    newCode: '',
    confirmCode: '',
  });
  const [weakPasswordAcknowledged, setWeakPasswordAcknowledged] = useState(false);

  const newCodeStrength = evaluatePasswordStrength(form.newCode);
  const showWeakPasswordWarning =
    newCodeStrength.requiresWarning && form.newCode.length > 0;
  const canSubmitWeakPassword = !showWeakPasswordWarning || weakPasswordAcknowledged;

  const handleNewCodeChange = (newCode: string) => {
    setForm({ ...form, newCode });
    setWeakPasswordAcknowledged(false);
  };

  useEffect(() => {
    const loadSettings = async () => {
      const response = await fetch('/api/admin/settings');
      const data = await response.json();
      setConfiguredInDatabase(Boolean(data.configuredInDatabase));
      setLoading(false);
    };

    loadSettings();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);

    if (!newCodeStrength.meetsMinimum) {
      setMessage({
        type: 'error',
        text: 'El nuevo código debe tener al menos 8 caracteres.',
      });
      return;
    }

    if (showWeakPasswordWarning && !weakPasswordAcknowledged) {
      setMessage({
        type: 'error',
        text: 'Debes confirmar que deseas usar una contraseña débil.',
      });
      return;
    }

    setSubmitting(true);

    const response = await fetch('/api/admin/settings/access-code', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const result = await response.json();
    setSubmitting(false);

    if (!response.ok) {
      setMessage({ type: 'error', text: result.error || 'Error al actualizar el código' });
      return;
    }

    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div>
      <AdminPageHeader
        title="Configuración"
        description="Administra la seguridad del panel de administración."
      />

      {message && <AdminMessage type={message.type} message={message.text} />}

      <AdminCard>
        {loading ? (
          <p className="text-sm text-text-secondary">Cargando...</p>
        ) : (
          <div className="max-w-xl space-y-6">
            <div
              className={`rounded-[5px] px-4 py-3 text-sm ${
                configuredInDatabase
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              {configuredInDatabase
                ? 'El código de acceso se valida exclusivamente desde la base de datos.'
                : 'El código de acceso se valida desde la variable de entorno ADMIN_ACCESS_CODE (bootstrap). Al guardar un nuevo código aquí, la variable de entorno dejará de usarse para el login.'}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AdminInput
                label="Código actual"
                type="password"
                value={form.currentCode}
                onChange={(currentCode) => setForm({ ...form, currentCode })}
                required
              />
              <AdminInput
                label="Nuevo código"
                type="password"
                value={form.newCode}
                onChange={handleNewCodeChange}
                required
              />
              <PasswordStrengthIndicator password={form.newCode} />
              {showWeakPasswordWarning && (
                <WeakPasswordWarning
                  acknowledged={weakPasswordAcknowledged}
                  onAcknowledgeChange={setWeakPasswordAcknowledged}
                />
              )}
              <AdminInput
                label="Confirmar nuevo código"
                type="password"
                value={form.confirmCode}
                onChange={(confirmCode) => setForm({ ...form, confirmCode })}
                required
              />
              <AdminButton
                type="submit"
                disabled={
                  submitting ||
                  !canSubmitWeakPassword ||
                  (form.newCode.length > 0 && !newCodeStrength.meetsMinimum)
                }
              >
                {submitting ? 'Guardando...' : 'Actualizar código'}
              </AdminButton>
            </form>
          </div>
        )}
      </AdminCard>
    </div>
  );
}
