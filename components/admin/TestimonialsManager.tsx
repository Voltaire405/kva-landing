'use client';

import { FormEvent, useEffect, useState } from 'react';

import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminMessage,
  AdminPageHeader,
} from '@/components/admin/AdminUi';
import type { Testimonial } from '@/db/schema';

type TestimonialForm = {
  quote: string;
  authorName: string;
  authorRole: string;
};

const emptyForm: TestimonialForm = {
  quote: '',
  authorName: '',
  authorRole: '',
};

export default function TestimonialsManager() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [form, setForm] = useState<TestimonialForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadItems = async () => {
    const response = await fetch('/api/admin/testimonials');
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
      editingId ? `/api/admin/testimonials/${editingId}` : '/api/admin/testimonials',
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

    setMessage({ type: 'success', text: editingId ? 'Testimonio actualizado' : 'Testimonio creado' });
    resetForm();
    await loadItems();
  };

  const handleEdit = (item: Testimonial) => {
    setEditingId(item.id);
    setForm({
      quote: item.quote,
      authorName: item.authorName,
      authorRole: item.authorRole,
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este testimonio?')) return;

    const response = await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
    if (!response.ok) {
      setMessage({ type: 'error', text: 'Error al eliminar' });
      return;
    }

    setMessage({ type: 'success', text: 'Testimonio eliminado' });
    if (editingId === id) resetForm();
    await loadItems();
  };

  return (
    <div>
      <AdminPageHeader
        title="Testimonios"
        description="Administra la cita, el nombre y el cargo del cliente."
      />

      {message && <AdminMessage type={message.type} message={message.text} />}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <AdminCard>
          <h3 className="font-heading text-lg mb-4 text-primary">
            {editingId ? 'Editar testimonio' : 'Nuevo testimonio'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <AdminInput
              label="Cita"
              type="textarea"
              value={form.quote}
              onChange={(quote) => setForm({ ...form, quote })}
              required
            />
            <AdminInput
              label="Nombre del cliente"
              value={form.authorName}
              onChange={(authorName) => setForm({ ...form, authorName })}
              required
            />
            <AdminInput
              label="Cargo del cliente"
              value={form.authorRole}
              onChange={(authorRole) => setForm({ ...form, authorRole })}
              required
            />
            <div className="flex gap-3">
              <AdminButton type="submit">
                {editingId ? 'Guardar cambios' : 'Crear testimonio'}
              </AdminButton>
              {editingId && (
                <AdminButton variant="secondary" onClick={resetForm}>
                  Cancelar
                </AdminButton>
              )}
            </div>
          </form>
        </AdminCard>

        <AdminCard>
          <h3 className="font-heading text-lg mb-4 text-primary">Testimonios actuales</h3>
          {loading ? (
            <p className="text-sm text-text-secondary">Cargando...</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-text-secondary">No hay testimonios registrados.</p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="border border-[#eee] rounded-[5px] p-4">
                  <p className="text-sm italic mb-3">&quot;{item.quote}&quot;</p>
                  <p className="font-heading text-sm text-primary">{item.authorName}</p>
                  <p className="text-xs text-text-secondary mt-1">{item.authorRole}</p>
                  <div className="flex gap-2 mt-3">
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
