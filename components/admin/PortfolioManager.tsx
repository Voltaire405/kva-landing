'use client';

import Image from 'next/image';
import { FormEvent, useEffect, useState } from 'react';

import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminMessage,
  AdminPageHeader,
} from '@/components/admin/AdminUi';
import ImageUploader from '@/components/admin/ImageUploader';
import type { PortfolioItem } from '@/db/schema';

type PortfolioForm = {
  imageUrl: string;
  title: string;
  description: string;
};

const emptyForm: PortfolioForm = {
  imageUrl: '',
  title: '',
  description: '',
};

export default function PortfolioManager() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [form, setForm] = useState<PortfolioForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadItems = async () => {
    const response = await fetch('/api/admin/portfolio');
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

    if (!form.imageUrl) {
      setMessage({ type: 'error', text: 'Debes subir una imagen' });
      return;
    }

    const response = await fetch(
      editingId ? `/api/admin/portfolio/${editingId}` : '/api/admin/portfolio',
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

    setMessage({ type: 'success', text: editingId ? 'Proyecto actualizado' : 'Proyecto creado' });
    resetForm();
    await loadItems();
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditingId(item.id);
    setForm({
      imageUrl: item.imageUrl,
      title: item.title,
      description: item.description,
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este proyecto?')) return;

    const response = await fetch(`/api/admin/portfolio/${id}`, { method: 'DELETE' });
    if (!response.ok) {
      setMessage({ type: 'error', text: 'Error al eliminar' });
      return;
    }

    setMessage({ type: 'success', text: 'Proyecto eliminado' });
    if (editingId === id) resetForm();
    await loadItems();
  };

  return (
    <div>
      <AdminPageHeader
        title="Nuestros Trabajos"
        description="Administra proyectos con imagen, título y descripción."
      />

      {message && <AdminMessage type={message.type} message={message.text} />}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <AdminCard>
          <h3 className="font-heading text-lg mb-4 text-primary">
            {editingId ? 'Editar proyecto' : 'Nuevo proyecto'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <ImageUploader
              value={form.imageUrl}
              onChange={(imageUrl) => setForm({ ...form, imageUrl })}
            />
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
              <AdminButton type="submit">{editingId ? 'Guardar cambios' : 'Crear proyecto'}</AdminButton>
              {editingId && (
                <AdminButton variant="secondary" onClick={resetForm}>
                  Cancelar
                </AdminButton>
              )}
            </div>
          </form>
        </AdminCard>

        <AdminCard>
          <h3 className="font-heading text-lg mb-4 text-primary">Proyectos actuales</h3>
          {loading ? (
            <p className="text-sm text-text-secondary">Cargando...</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-text-secondary">No hay proyectos registrados.</p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="border border-[#eee] rounded-[5px] p-4">
                  <div className="flex gap-4">
                    <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-[5px]">
                      <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-heading font-semibold text-primary">{item.title}</h4>
                      <p className="text-sm text-text-secondary mt-1">{item.description}</p>
                      <div className="flex gap-2 mt-3">
                        <AdminButton variant="secondary" onClick={() => handleEdit(item)}>
                          Editar
                        </AdminButton>
                        <AdminButton variant="danger" onClick={() => handleDelete(item.id)}>
                          Eliminar
                        </AdminButton>
                      </div>
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
