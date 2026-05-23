'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import { AdminButton, AdminInput, AdminMessage } from '@/components/admin/AdminUi';

export default function AdminLoginPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const response = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error || 'Código inválido');
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push('/admin');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-light flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-[10px] p-8 shadow-[0_5px_15px_rgba(0,0,0,0.05)]">
        <h1 className="font-heading text-2xl font-bold text-primary text-center mb-2">
          KvaTel Admin
        </h1>
        <p className="text-sm text-text-secondary text-center mb-6">
          Ingresa el código de acceso para continuar.
        </p>

        {error && <AdminMessage type="error" message={error} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <AdminInput
            label="Código de acceso"
            value={code}
            onChange={setCode}
            required
          />
          <AdminButton type="submit" disabled={loading}>
            {loading ? 'Verificando...' : 'Entrar'}
          </AdminButton>
        </form>
      </div>
    </div>
  );
}
