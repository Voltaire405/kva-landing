'use client';

import { useEffect, useState } from 'react';

import {
  AdminButton,
  AdminCard,
  AdminMessage,
  AdminPageHeader,
} from '@/components/admin/AdminUi';
import type { ContactMessage } from '@/db/schema';

const MESSAGE_PREVIEW_LENGTH = 80;

function formatDate(date: string) {
  return new Date(date).toLocaleString('es-CO', { timeZone: 'America/Bogota' });
}

function truncateMessage(message: string) {
  if (message.length <= MESSAGE_PREVIEW_LENGTH) return message;
  return `${message.slice(0, MESSAGE_PREVIEW_LENGTH)}…`;
}

export default function MessageManager() {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadItems = async () => {
    const response = await fetch('/api/admin/messages');
    const data = await response.json();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este mensaje?')) return;

    const response = await fetch(`/api/admin/messages?id=${id}`, { method: 'DELETE' });
    if (!response.ok) {
      setMessage({ type: 'error', text: 'Error al eliminar' });
      return;
    }

    if (expandedId === id) setExpandedId(null);
    setMessage({ type: 'success', text: 'Mensaje eliminado' });
    await loadItems();
  };

  const toggleExpanded = (id: number) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  return (
    <div>
      <AdminPageHeader
        title="Mensajes recibidos"
        description="Mensajes enviados desde el formulario de contacto de la landing."
      />

      {message && <AdminMessage type={message.type} message={message.text} />}

      <AdminCard>
        {loading ? (
          <p className="text-sm text-text-secondary">Cargando...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-text-secondary">No hay mensajes registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#eee] text-left text-text-secondary">
                  <th className="pb-3 pr-4 font-medium">Fecha</th>
                  <th className="pb-3 pr-4 font-medium">Nombre</th>
                  <th className="pb-3 pr-4 font-medium">Email</th>
                  <th className="pb-3 pr-4 font-medium">Teléfono</th>
                  <th className="pb-3 pr-4 font-medium">Mensaje</th>
                  <th className="pb-3 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const isExpanded = expandedId === item.id;
                  return (
                    <tr key={item.id} className="border-b border-[#eee] align-top">
                        <td className="py-3 pr-4 whitespace-nowrap">{formatDate(item.createdAt)}</td>
                        <td className="py-3 pr-4 font-medium text-primary">{item.name}</td>
                        <td className="py-3 pr-4">{item.email}</td>
                        <td className="py-3 pr-4">{item.phone || '—'}</td>
                        <td className="py-3 pr-4 max-w-xs">
                          {isExpanded ? (
                            <p className="whitespace-pre-wrap">{item.message}</p>
                          ) : (
                            <p>{truncateMessage(item.message)}</p>
                          )}
                        </td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <AdminButton variant="secondary" onClick={() => toggleExpanded(item.id)}>
                              {isExpanded ? 'Ocultar' : 'Ver'}
                            </AdminButton>
                            <AdminButton variant="danger" onClick={() => handleDelete(item.id)}>
                              Eliminar
                            </AdminButton>
                          </div>
                        </td>
                      </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </div>
  );
}
