'use client';

import { FormEvent, useEffect, useState } from 'react';

import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminMessage,
  AdminPageHeader,
} from '@/components/admin/AdminUi';
import IconPicker from '@/components/admin/IconPicker';
import type { Service } from '@/db/schema';

type ServiceForm = {
  icon: string;
  title: string;
  description: string;
};

const emptyForm: ServiceForm = {
  icon: 'home',
  title: '',
  description: '',
};

export default function ServicesManager() {
  const [items, setItems] = useState<Service[]>([]);
  const [form, setForm] = useState<ServiceForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadItems = async () => {
    const response = await fetch('/api/admin/services');
    const data = await response.json();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);

    const response = await fetch(
      editingId ? `/api/admin/services/${editingId}` : '/api/admin/services',
      {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      setMessage({ type: 'error', text: result.error || 'Error al guardar' });
      return;
    }

    setMessage({ type: 'success', text: editingId ? 'Servicio actualizado' : 'Servicio creado' });
    resetForm();
    await loadItems();
  };

  const handleEdit = (item: Service) => {
    setEditingId(item.id);
    setForm({
      icon: item.icon,
      title: item.title,
      description: item.description,
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este servicio?')) return;

    const response = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
    if (!response.ok) {
      setMessage({ type: 'error', text: 'Error al eliminar' });
      return;
    }

    setMessage({ type: 'success', text: 'Servicio eliminado' });
    if (editingId === id) resetForm();
    await loadItems();
  };

  return (
    <div>
      <AdminPageHeader
        title="Nuestros Servicios"
        description="Administra título, descripción e icono de cada servicio."
      />

      {message && <AdminMessage type={message.type} message={message.text} />}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <AdminCard>
          <h3 className="font-heading text-lg mb-4 text-primary">
            {editingId ? 'Editar servicio' : 'Nuevo servicio'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <IconPicker value={form.icon} onChange={(icon) => setForm({ ...form, icon })} />
            <AdminInput
              label="Título"
              value={form.title}
              onChange={(title) => setForm({ ...form, title })}
              required
            />
            <AdminInput
              label="Descripción"
              type="textarea"
              value={form.description}
              onChange={(description) => setForm({ ...form, description })}
              required
            />
            <div className="flex gap-3">
              <AdminButton type="submit">{editingId ? 'Guardar cambios' : 'Crear servicio'}</AdminButton>
              {editingId && (
                <AdminButton variant="secondary" onClick={resetForm}>
                  Cancelar
                </AdminButton>
              )}
            </div>
          </form>
        </AdminCard>

        <AdminCard>
          <h3 className="font-heading text-lg mb-4 text-primary">Servicios actuales</h3>
          {loading ? (
            <p className="text-sm text-text-secondary">Cargando...</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-text-secondary">No hay servicios registrados.</p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="border border-[#eee] rounded-[5px] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2 text-primary">
                        <i className="material-icons text-base">{item.icon}</i>
                        <h4 className="font-heading font-semibold">{item.title}</h4>
                      </div>
                      <p className="text-sm text-text-secondary">{item.description}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <AdminButton variant="secondary" onClick={() => handleEdit(item)}>
                        Editar
                      </AdminButton>
                      <AdminButton variant="danger" onClick={() => handleDelete(item.id)}>
                        Eliminar
                      </AdminButton>
                    </div>
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
