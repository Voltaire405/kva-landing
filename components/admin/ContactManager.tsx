'use client';

import { FormEvent, useEffect, useState } from 'react';

import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminMessage,
  AdminPageHeader,
} from '@/components/admin/AdminUi';
import type { ContactInfo } from '@/db/schema';

export default function ContactManager() {
  const [form, setForm] = useState<Pick<ContactInfo, 'phone' | 'email' | 'address'>>({
    phone: '',
    email: '',
    address: '',
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const loadContact = async () => {
      const response = await fetch('/api/admin/contact');
      const data = await response.json();
      setForm({
        phone: data.phone,
        email: data.email,
        address: data.address,
      });
      setLoading(false);
    };

    loadContact();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);

    const response = await fetch('/api/admin/contact', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const result = await response.json();

    if (!response.ok) {
      setMessage({ type: 'error', text: result.error || 'Error al guardar' });
      return;
    }

    setMessage({ type: 'success', text: 'Información de contacto actualizada' });
  };

  return (
    <div>
      <AdminPageHeader
        title="Información de Contacto"
        description="Administra teléfono, email y dirección mostrados en la landing."
      />

      {message && <AdminMessage type={message.type} message={message.text} />}

      <AdminCard>
        {loading ? (
          <p className="text-sm text-text-secondary">Cargando...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
            <AdminInput
              label="Teléfono"
              type="textarea"
              value={form.phone}
              onChange={(phone) => setForm({ ...form, phone })}
              required
            />
            <p className="text-xs text-text-secondary -mt-2">
              Puedes usar varias líneas para mostrar más de un número.
            </p>
            <AdminInput
              label="Email"
              type="email"
              value={form.email}
              onChange={(email) => setForm({ ...form, email })}
              required
            />
            <AdminInput
              label="Dirección"
              type="textarea"
              value={form.address}
              onChange={(address) => setForm({ ...form, address })}
              required
            />
            <AdminButton type="submit">Guardar cambios</AdminButton>
          </form>
        )}
      </AdminCard>
    </div>
  );
}
