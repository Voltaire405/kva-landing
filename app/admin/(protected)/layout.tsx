import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

import AdminShell from '@/components/admin/AdminShell';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export const metadata: Metadata = {
  title: 'Admin | KvaTel',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect('/admin/login');
  }

  return <AdminShell>{children}</AdminShell>;
}
