'use client';

import { ReactNode } from 'react';
import { AppProvider } from '@/lib/store';
import { AdminShell } from '@/components/admin/AdminShell';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <AdminShell>{children}</AdminShell>
    </AppProvider>
  );
}
