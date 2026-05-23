'use client';

import { FormEvent, useEffect, useState } from 'react';

import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminMessage,
  AdminPageHeader,
} from '@/components/admin/AdminUi';
import type { Client } from '@/db/schema';

export default function ClientsManager() {
  const [items, setItems] = useState<Client[]>([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadItems = async () => {
    const response = await fetch('/api/admin/clients');
    const data = await response.json();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const resetForm = () => {
    setName('');
    setEditingId(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);

    const response = await fetch(
      editingId ? `/api/admin/clients/${editingId}` : '/api/admin/clients',
      {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      setMessage({ type: 'error', text: result.error || 'Error al guardar' });
      return;
    }

    setMessage({ type: 'success', text: editingId ? 'Cliente actualizado' : 'Cliente creado' });
    resetForm();
    await loadItems();
  };

  const handleEdit = (item: Client) => {
    setEditingId(item.id);
    setName(item.name);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este cliente?')) return;

    const response = await fetch(`/api/admin/clients/${id}`, { method: 'DELETE' });
    if (!response.ok) {
      setMessage({ type: 'error', text: 'Error al eliminar' });
      return;
    }

    setMessage({ type: 'success', text: 'Cliente eliminado' });
    if (editingId === id) resetForm();
    await loadItems();
  };

  return (
    <div>
      <AdminPageHeader
        title="Nuestros Clientes"
        description="Administra los nombres mostrados en la sección de clientes."
      />

      {message && <AdminMessage type={message.type} message={message.text} />}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <AdminCard>
          <h3 className="font-heading text-lg mb-4 text-primary">
            {editingId ? 'Editar cliente' : 'Nuevo cliente'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <AdminInput
              label="Nombre"
              value={name}
              onChange={setName}
              required
            />
            <div className="flex gap-3">
              <AdminButton type="submit">{editingId ? 'Guardar cambios' : 'Crear cliente'}</AdminButton>
              {editingId && (
                <AdminButton variant="secondary" onClick={resetForm}>
                  Cancelar
                </AdminButton>
              )}
            </div>
          </form>
        </AdminCard>

        <AdminCard>
          <h3 className="font-heading text-lg mb-4 text-primary">Clientes actuales</h3>
          {loading ? (
            <p className="text-sm text-text-secondary">Cargando...</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-text-secondary">No hay clientes registrados.</p>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border border-[#eee] rounded-[5px] p-4"
                >
                  <span className="font-heading text-primary">{item.name}</span>
                  <div className="flex gap-2">
                    <AdminButton variant="secondary" onClick={() => handleEdit(item)}>
                      Editar
                    </AdminButton>
                    <AdminButton variant="danger" onClick={() => handleDelete(item.id)}>
                      Eliminar
                    </AdminButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      </div>
    </div>
  );
}
