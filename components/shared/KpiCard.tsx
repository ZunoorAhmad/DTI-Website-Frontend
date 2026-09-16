import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  change?: number;
  changeLabel?: string;
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'teal';
}

const COLOR_MAP = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  red: 'bg-red-50 text-red-600',
  purple: 'bg-purple-50 text-purple-600',
  teal: 'bg-teal-50 text-teal-600',
};

export function KpiCard({ label, value, icon: Icon, change, changeLabel, color = 'blue' }: KpiCardProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className={cn('flex h-11 w-11 items-center justify-center rounded-lg', COLOR_MAP[color])}>
            <Icon className="h-5 w-5" />
          </div>
          {change !== undefined && (
            <div className={cn(
              'flex items-center gap-1 text-xs font-semibold',
              change >= 0 ? 'text-emerald-600' : 'text-red-600'
            )}>
              {change >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              {change >= 0 ? '+' : ''}{change}%
            </div>
          )}
        </div>
        <div className="mt-4">
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
          {changeLabel && <p className="mt-1 text-xs text-muted-foreground">{changeLabel}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
