'use client';

import { useMemo, useState, ReactNode } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Download } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/lib/store';
import { CHART_DATA } from '@/lib/mock-data';
import { DatePreset, DATE_PRESETS, filterApplications } from '@/lib/admin-filters';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function ReportsPage() {
  const { applications, students, courses } = useApp();
  const [preset, setPreset] = useState<DatePreset>('last30');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const filteredApps = useMemo(
    () =>
      filterApplications(applications, {
        search: '',
        courses: [],
        cities: [],
        campuses: [],
        statuses: [],
        datePreset: preset,
        dateFrom: from,
        dateTo: to,
      }),
    [applications, preset, from, to]
  );

  const byCourse = useMemo(() => {
    const map = new Map<string, number>();
    filteredApps.forEach((a) => map.set(a.courseName, (map.get(a.courseName) || 0) + 1));
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredApps]);

  const byCity = useMemo(() => {
    const map = new Map<string, number>();
    filteredApps.forEach((a) => map.set(a.city, (map.get(a.city) || 0) + 1));
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredApps]);

  const byCampus = useMemo(() => {
    const map = new Map<string, number>();
    filteredApps.forEach((a) => map.set(a.campus, (map.get(a.campus) || 0) + 1));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [filteredApps]);

  const byStatus = useMemo(() => {
    const map = new Map<string, number>();
    filteredApps.forEach((a) => map.set(a.status, (map.get(a.status) || 0) + 1));
    const colors: Record<string, string> = {
      New: 'hsl(199, 89%, 48%)',
      'Under Review': 'hsl(38, 92%, 50%)',
      Approved: 'hsl(142, 71%, 45%)',
      Rejected: 'hsl(0, 84%, 60%)',
    };
    return ['New', 'Under Review', 'Approved', 'Rejected'].map((name) => ({
      name,
      value: map.get(name) || 0,
      color: colors[name],
    }));
  }, [filteredApps]);

  const trending = [...courses].sort((a, b) => b.applications - a.applications);
  const growing = [...courses].filter((c) => c.monthlyTrend > 0).sort((a, b) => b.monthlyTrend - a.monthlyTrend);
  const least = [...courses].sort((a, b) => a.applications - b.applications).slice(0, 3);

  const exportCsv = () => {
    const rows = [
      ['Application ID', 'Applicant', 'Course', 'City', 'Campus', 'Date', 'Status'],
      ...filteredApps.map((a) => [a.id, a.applicantName, a.courseName, a.city, a.campus, a.date, a.status]),
    ];
    const csv = rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dti-application-report.csv';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Report exported');
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Reports & Analytics"
        description="Application, student, and course performance reports."
        action={
          <Button onClick={exportCsv}>
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
        }
      />

      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-end">
          <div className="flex flex-wrap gap-2">
            {DATE_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => { setPreset(p.id); setFrom(''); setTo(''); }}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium',
                  preset === p.id && preset !== 'custom'
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-muted-foreground hover:text-foreground'
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <div className="space-y-1">
              <Label className="text-xs">From</Label>
              <Input type="date" value={from} onChange={(e) => { setFrom(e.target.value); setPreset('custom'); }} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">To</Label>
              <Input type="date" value={to} onChange={(e) => { setTo(e.target.value); setPreset('custom'); }} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Summary label="Applications" value={filteredApps.length} />
        <Summary label="Students" value={students.length} />
        <Summary label="Approved" value={filteredApps.filter((a) => a.status === 'Approved').length} />
        <Summary label="Under Review" value={filteredApps.filter((a) => a.status === 'Under Review').length} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard title="Applications by Course">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={byCourse.length ? byCourse : CHART_DATA.byCourse} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(199, 89%, 48%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Applications by City">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={byCity.length ? byCity : CHART_DATA.byCity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Applications by Campus">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={byCampus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(280, 65%, 60%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Applications by Status">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={byStatus} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90}>
                {byStatus.map((s) => <Cell key={s.name} fill={s.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ListCard title="Most Applied Courses" items={trending.slice(0, 5).map((c) => `${c.name} — ${c.applications}`)} />
        <ListCard title="Fast-Growing Courses" items={growing.slice(0, 5).map((c) => `${c.name} — +${c.monthlyTrend}%`)} />
        <ListCard title="Least Applied Courses" items={least.map((c) => `${c.name} — ${c.applications}`)} />
      </div>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-bold">{value.toLocaleString()}</p>
      </CardContent>
    </Card>
  );
}

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">{title}</CardTitle></CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function ListCard({ title, items }: { title: string; items: string[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">{title}</CardTitle></CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          {items.map((item) => (
            <li key={item} className="rounded-lg border border-border px-3 py-2">{item}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
