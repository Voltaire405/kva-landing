import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

import { isAdminAuthenticated } from '@/lib/admin-auth';

export const metadata: Metadata = {
  title: 'Admin Login | KvaTel',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = await isAdminAuthenticated();

  if (authenticated) {
    redirect('/admin');
  }

  return children;
}
