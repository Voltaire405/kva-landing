'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { href: '/admin', label: 'Inicio' },
  { href: '/admin/services', label: 'Servicios' },
  { href: '/admin/portfolio', label: 'Trabajos' },
  { href: '/admin/clients', label: 'Clientes' },
  { href: '/admin/testimonials', label: 'Testimonios' },
  { href: '/admin/contact', label: 'Contacto' },
  { href: '/admin/settings', label: 'Configuración' },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-light">
      <div className="flex min-h-screen">
        <aside className="w-64 bg-primary text-white p-6 flex flex-col">
          <div className="mb-8">
            <h1 className="font-heading text-xl font-bold">KvaTel Admin</h1>
            <p className="text-sm text-white/70 mt-1">Panel de contenido</p>
          </div>
          <nav className="flex flex-col gap-2 flex-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-[5px] px-4 py-2 text-sm transition-colors ${
                    active ? 'bg-white/20 font-semibold' : 'hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-6 rounded-[5px] border border-white/30 px-4 py-2 text-sm hover:bg-white/10 transition-colors"
          >
            Cerrar sesión
          </button>
        </aside>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
