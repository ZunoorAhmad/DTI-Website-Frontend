'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { useApp } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function SuperAdminGuard({ children }: { children: ReactNode }) {
  const { currentUser } = useApp();

  if (currentUser?.role !== 'Super Admin') {
    return (
      <div className="flex items-center justify-center p-6 sm:p-10">
        <Card className="w-full max-w-lg">
          <CardContent className="p-8 text-center sm:p-10">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600">
              <ShieldAlert className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Access Restricted</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              This section is available to Super Admin accounts only. Contact your administrator if you need access.
            </p>
            <Button asChild className="mt-6">
              <Link href="/admin">Back to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
