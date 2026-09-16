import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ApplicationStatus } from '@/lib/types';
import { statusBadgeClass } from '@/lib/format';

interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        statusBadgeClass(status),
        className
      )}
    >
      {status}
    </span>
  );
}

export function PillBadge({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        className
      )}
    >
      {children}
    </span>
  );
}
