'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Phone, User } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { PillBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/lib/store';
import { formatDate, studentStatusClass } from '@/lib/format';

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = decodeURIComponent(String(params.id || ''));
  const { getStudentById } = useApp();
  const student = getStudentById(id);

  if (!student) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="p-10 text-center">
            <h2 className="text-lg font-semibold">Student not found</h2>
            <Button className="mt-6" onClick={() => router.push('/admin/students')}>Back to Students</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <Link href="/admin/students" className="mb-2 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-1 h-4 w-4" /> Students
        </Link>
        <PageHeader title={student.name} description={student.id} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4 text-primary" /> Student Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <Info label="Student ID" value={student.id} />
            <div>
              <p className="text-muted-foreground">Status</p>
              <div className="mt-1"><PillBadge className={studentStatusClass(student.status)}>{student.status}</PillBadge></div>
            </div>
            <Info label="CNIC" value={student.cnic} />
            <Info label="Gender" value={student.gender} />
            <Info label="Course" value={student.courseName} />
            <Info label="City" value={student.city} />
            <Info label="Campus" value={student.campus} />
            <Info label="Enrollment Date" value={formatDate(student.enrollmentDate)} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="flex items-center gap-2 text-foreground">
              <Mail className="h-4 w-4 text-muted-foreground" /> {student.email}
            </p>
            <p className="flex items-center gap-2 text-foreground">
              <Phone className="h-4 w-4 text-muted-foreground" /> {student.phone}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-medium text-foreground">{value || '—'}</p>
    </div>
  );
}
