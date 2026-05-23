import Link from 'next/link';

import { AdminCard, AdminPageHeader } from '@/components/admin/AdminUi';

const sections = [
  {
    href: '/admin/services',
    title: 'Servicios',
    description: 'Título, descripción e icono de cada servicio.',
  },
  {
    href: '/admin/portfolio',
    title: 'Trabajos',
    description: 'Imagen, título y descripción de cada proyecto.',
  },
  {
    href: '/admin/clients',
    title: 'Clientes',
    description: 'Nombres mostrados en la sección de clientes.',
  },
  {
    href: '/admin/testimonials',
    title: 'Testimonios',
    description: 'Citas con nombre y cargo del cliente.',
  },
  {
    href: '/admin/contact',
    title: 'Contacto',
    description: 'Teléfono, email y dirección.',
  },
  {
    href: '/admin/settings',
    title: 'Configuración',
    description: 'Código de acceso al panel de administración.',
  },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <AdminPageHeader
        title="Panel de administración"
        description="Selecciona una sección para editar el contenido de la landing page."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <Link key={section.href} href={section.href}>
            <AdminCard>
              <h3 className="font-heading text-lg text-primary mb-2">{section.title}</h3>
              <p className="text-sm text-text-secondary">{section.description}</p>
            </AdminCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
