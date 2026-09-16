'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Clock, BookOpen, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PublicLayout } from '@/components/public/PublicLayout';
import { COURSES } from '@/lib/mock-data';
import { formatCurrency, courseStatusClass } from '@/lib/format';
import { Department } from '@/lib/types';

const DEPARTMENTS: (Department | 'All')[] = [
  'All', 'QHSE', 'Automation', 'Welding', 'Fabrication', 'Electrical', 'Civil', 'Millwright', 'Carpentry',
];

export default function CoursesPage() {
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState<string>('All');

  const filtered = COURSES.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchDept = dept === 'All' || c.department === dept;
    return matchSearch && matchDept;
  });

  return (
    <PublicLayout>
      <section className="border-b border-border bg-slate-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Course Directory</h1>
          <p className="mt-2 text-muted-foreground">
            Browse our full range of technical and professional training programs.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={dept} onValueChange={setDept}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((d) => (
                  <SelectItem key={d} value={d}>{d === 'All' ? 'All Departments' : d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4 text-sm text-muted-foreground">
            {filtered.length} course{filtered.length !== 1 ? 's' : ''} found
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((course) => (
              <Card key={course.id} className="group flex flex-col transition-shadow hover:shadow-md">
                <CardContent className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="inline-flex rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                      {course.department}
                    </span>
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${courseStatusClass(course.status)}`}>
                      {course.status}
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold leading-snug text-foreground">
                    {course.name}
                  </h3>
                  <p className="mb-4 flex-1 text-sm text-muted-foreground">
                    {course.description}
                  </p>
                  <div className="space-y-2 border-t border-border pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="h-4 w-4" /> Duration
                      </span>
                      <span className="font-medium text-foreground">{course.duration}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <BookOpen className="h-4 w-4" /> Fee
                      </span>
                      <span className="font-medium text-foreground">{formatCurrency(course.fee)}</span>
                    </div>
                  </div>
                  <Link href={`/apply?course=${course.id}`}>
                    <Button className="mt-4 w-full group-hover:bg-primary/90">
                      Apply Now <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-muted-foreground">No courses found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
