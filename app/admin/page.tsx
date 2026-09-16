'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  UserCheck,
  CheckCircle2,
  Clock,
  XCircle,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Plus,
  UserPlus,
  Mail,
  BarChart3,
  Settings,
  Flame,
  ChevronRight,
  Building2,
  BookOpen,
} from 'lucide-react';
import {
  AreaChart,
  Area,
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { KpiCard } from '@/components/shared/KpiCard';
import { useApp } from '@/lib/store';
import { KPI_DATA, CHART_DATA } from '@/lib/mock-data';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';

const ACTIVITY_ICONS = {
  file: { icon: FileText, color: 'bg-blue-50 text-blue-600' },
  check: { icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
  course: { icon: BookOpen, color: 'bg-purple-50 text-purple-600' },
  mail: { icon: Mail, color: 'bg-teal-50 text-teal-600' },
  user: { icon: UserPlus, color: 'bg-amber-50 text-amber-600' },
  settings: { icon: Settings, color: 'bg-slate-100 text-slate-600' },
};

const QUICK_ACTIONS = [
  { label: 'Review Applications', href: '/admin/applications', icon: FileText, color: 'bg-blue-50 text-blue-600' },
  { label: 'Add Course', href: '/admin/courses', icon: Plus, color: 'bg-purple-50 text-purple-600' },
  { label: 'Add Staff', href: '/admin/staff', icon: UserPlus, color: 'bg-amber-50 text-amber-600' },
  { label: 'Send Email', href: '/admin/email', icon: Mail, color: 'bg-teal-50 text-teal-600' },
  { label: 'View Reports', href: '/admin/reports', icon: BarChart3, color: 'bg-emerald-50 text-emerald-600' },
  { label: 'Admission Settings', href: '/admin/settings', icon: Settings, color: 'bg-slate-100 text-slate-600' },
];

export default function AdminDashboard() {
  const { applications, activity, courses, currentUser } = useApp();
  const [chartPeriod, setChartPeriod] = useState<'7' | '30' | '90'>('30');

  const chartData =
    chartPeriod === '7' ? CHART_DATA.applications7Days :
    chartPeriod === '30' ? CHART_DATA.applications30Days :
    CHART_DATA.applications90Days;

  const recentApplications = applications.slice(0, 7);
  const trendingCourses = [...courses].sort((a, b) => b.monthlyTrend - a.monthlyTrend).slice(0, 4);
  const growingCourses = [...courses].filter((c) => c.monthlyTrend > 0).sort((a, b) => b.monthlyTrend - a.monthlyTrend).slice(0, 3);
  const isSuperAdmin = currentUser?.role === 'Super Admin';

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Welcome */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome back, {currentUser?.name?.split(' ').slice(0, 2).join(' ')}
        </h1>
        <p className="text-sm text-muted-foreground">
          Here&rsquo;s what&rsquo;s happening with admissions at DTI today.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard label="Total Applications" value={KPI_DATA.totalApplications.toLocaleString()} icon={FileText} change={KPI_DATA.totalApplicationsChange} changeLabel="vs last month" color="blue" />
        <KpiCard label="New" value={KPI_DATA.newApplications} icon={Clock} color="amber" />
        <KpiCard label="Approved" value={KPI_DATA.approved.toLocaleString()} icon={CheckCircle2} color="green" />
        <KpiCard label="Under Review" value={KPI_DATA.underReview} icon={UserCheck} color="purple" />
        <KpiCard label="Rejected" value={KPI_DATA.rejected} icon={XCircle} color="red" />
        <KpiCard label="Total Students" value={KPI_DATA.totalStudents.toLocaleString()} icon={Users} color="teal" />
      </div>

      {/* Period Comparison */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">This Week vs Last Week</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {CHART_DATA.weeklyComparison.thisWeek} <span className="text-base font-normal text-muted-foreground">applications</span>
              </p>
              <p className="mt-1 text-sm text-emerald-600">
                <TrendingUp className="mr-1 inline h-3.5 w-3.5" />
                {CHART_DATA.weeklyComparison.change}% more than last week
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="h-7 w-7" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">This Month vs Last Month</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {CHART_DATA.monthlyComparison.thisMonth} <span className="text-base font-normal text-muted-foreground">applications</span>
              </p>
              <p className="mt-1 text-sm text-emerald-600">
                <TrendingUp className="mr-1 inline h-3.5 w-3.5" />
                {CHART_DATA.monthlyComparison.change}% more than last month
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <BarChart3 className="h-7 w-7" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1: Applications Overview + Status */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Applications Overview */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base font-semibold">Applications Overview</CardTitle>
            <Tabs value={chartPeriod} onValueChange={(v) => setChartPeriod(v as '7' | '30' | '90')}>
              <TabsList className="h-8">
                <TabsTrigger value="7" className="text-xs">7 Days</TabsTrigger>
                <TabsTrigger value="30" className="text-xs">30 Days</TabsTrigger>
                <TabsTrigger value="90" className="text-xs">90 Days</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'hsl(215, 16%, 47%)' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(215, 16%, 47%)' }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid hsl(214, 32%, 91%)',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="value" stroke="hsl(199, 89%, 48%)" strokeWidth={2} fill="url(#colorApps)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Application Status Donut */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Application Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={CHART_DATA.byStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {CHART_DATA.byStatus.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(214, 32%, 91%)', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 space-y-1.5">
              {CHART_DATA.byStatus.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2: By Course + By City */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Applications by Course</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={CHART_DATA.byCourse} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: 'hsl(215, 16%, 47%)' }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'hsl(215, 16%, 47%)' }} tickLine={false} axisLine={false} width={100} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(214, 32%, 91%)', fontSize: '12px' }} />
                <Bar dataKey="value" fill="hsl(199, 89%, 48%)" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Applications by City</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={CHART_DATA.byCity}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(215, 16%, 47%)' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(215, 16%, 47%)' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(214, 32%, 91%)', fontSize: '12px' }} />
                <Bar dataKey="value" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Trending Courses + Quick Actions */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Trending Courses */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-amber-500" />
              <CardTitle className="text-base font-semibold">Trending Courses</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {trendingCourses.map((course, idx) => (
              <div key={course.id} className="flex items-center gap-4 rounded-lg border border-border p-3">
                <div className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold',
                  idx === 0 ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-600'
                )}>
                  {idx === 0 ? <Flame className="h-5 w-5" /> : `#${idx + 1}`}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{course.name}</p>
                  <p className="text-xs text-muted-foreground">{course.applications} applications this month</p>
                </div>
                <div className={cn(
                  'flex items-center gap-1 text-xs font-semibold',
                  course.monthlyTrend >= 0 ? 'text-emerald-600' : 'text-red-600'
                )}>
                  {course.monthlyTrend >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  {course.monthlyTrend >= 0 ? '+' : ''}{course.monthlyTrend}%
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.filter((a) => isSuperAdmin || (!a.href.includes('staff') && !a.href.includes('settings'))).map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex flex-col items-center gap-2 rounded-lg border border-border p-4 text-center transition-colors hover:border-primary/30 hover:bg-primary/5"
              >
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', action.color)}>
                  <action.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-foreground">{action.label}</span>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Growing Courses Banner */}
      <Card className="border-emerald-200 bg-emerald-50/50">
        <CardContent className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            <h3 className="text-sm font-semibold text-foreground">Growing Courses</h3>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {growingCourses.map((course) => (
              <div key={course.id} className="rounded-lg border border-emerald-200 bg-white p-4">
                <p className="text-sm font-semibold text-foreground">{course.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{course.department}</p>
                <div className="mt-2 flex items-center gap-1 text-sm font-semibold text-emerald-600">
                  <TrendingUp className="h-3.5 w-3.5" />+{course.monthlyTrend}% compared to last month
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Applications + Activity Feed */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Recent Applications */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base font-semibold">Recent Applications</CardTitle>
            <Link href="/admin/applications">
              <Button variant="ghost" size="sm" className="text-xs">
                View All <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Application ID</TableHead>
                  <TableHead>Applicant</TableHead>
                  <TableHead className="hidden sm:table-cell">Course</TableHead>
                  <TableHead className="hidden md:table-cell">City</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead className="pr-6">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentApplications.map((app) => (
                  <TableRow key={app.id} className="cursor-pointer">
                    <TableCell className="pl-6 font-medium text-primary">{app.id}</TableCell>
                    <TableCell className="font-medium">{app.applicantName}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">{app.courseName}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{app.city}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">{formatDate(app.date)}</TableCell>
                    <TableCell className="pr-6"><StatusBadge status={app.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="max-h-96 space-y-3 overflow-y-auto scrollbar-thin pr-1">
              {activity.map((entry) => {
                const { icon: Icon, color } = ACTIVITY_ICONS[entry.icon];
                return (
                  <div key={entry.id} className="flex gap-3">
                    <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', color)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 pb-3 border-b border-border last:border-0">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{entry.actor}</span>{' '}
                        {entry.action}
                        {entry.target && <span className="font-medium"> {entry.target}</span>}
                      </p>
                      <p className="text-xs text-muted-foreground">{entry.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
