'use client';

import { useMemo, useState } from 'react';
import { Plus, Pencil, Power } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { PillBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useApp } from '@/lib/store';
import { Course, CourseStatus, Department } from '@/lib/types';
import { courseStatusClass, formatCurrency } from '@/lib/format';
import { toast } from 'sonner';

const DEPARTMENTS: Department[] = [
  'QHSE', 'Automation', 'Welding', 'Fabrication', 'Electrical', 'Civil', 'Millwright', 'Carpentry',
];

const EMPTY_FORM = {
  name: '',
  department: 'Welding' as Department,
  duration: '',
  description: '',
  fee: '',
  status: 'Active' as CourseStatus,
};

export default function CoursesManagementPage() {
  const { courses, addCourse, updateCourse, toggleCourseStatus, currentUser } = useApp();
  const isSuperAdmin = currentUser?.role === 'Super Admin';
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const totals = useMemo(
    () => ({
      active: courses.filter((c) => c.status === 'Active').length,
      applications: courses.reduce((sum, c) => sum + c.applications, 0),
    }),
    [courses]
  );

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  };

  const openEdit = (course: Course) => {
    setEditing(course);
    setForm({
      name: course.name,
      department: course.department,
      duration: course.duration,
      description: course.description,
      fee: String(course.fee),
      status: course.status,
    });
    setOpen(true);
  };

  const save = () => {
    if (!form.name.trim() || !form.duration.trim() || !form.description.trim() || !form.fee) {
      toast.error('Please fill all required fields');
      return;
    }
    const payload = {
      name: form.name.trim(),
      department: form.department,
      duration: form.duration.trim(),
      description: form.description.trim(),
      fee: Number(form.fee) || 0,
      status: form.status,
      specificFields: editing?.specificFields || [],
    };
    if (editing) {
      updateCourse(editing.id, payload);
      toast.success('Course updated');
    } else {
      addCourse(payload);
      toast.success('Course added');
    }
    setOpen(false);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Courses"
        description="Manage course catalog, status, and admissions volume."
        action={
          isSuperAdmin ? (
            <Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" /> Add Course</Button>
          ) : undefined
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Summary label="Total Courses" value={courses.length} />
        <Summary label="Active" value={totals.active} />
        <Summary label="Applications" value={totals.applications} />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.name}</TableCell>
                  <TableCell>{course.department}</TableCell>
                  <TableCell>{course.duration}</TableCell>
                  <TableCell>{formatCurrency(course.fee)}</TableCell>
                  <TableCell>{course.applications}</TableCell>
                  <TableCell>
                    <PillBadge className={courseStatusClass(course.status)}>{course.status}</PillBadge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {isSuperAdmin && (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => openEdit(course)}>
                            <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              toggleCourseStatus(course.id);
                              toast.success(course.status === 'Active' ? 'Course deactivated' : 'Course activated');
                            }}
                          >
                            <Power className="mr-1 h-3.5 w-3.5" />
                            {course.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Course' : 'Add Course'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="space-y-1.5">
              <Label>Course Name <span className="text-destructive">*</span></Label>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Department</Label>
                <Select value={form.department} onValueChange={(v) => setForm((f) => ({ ...f, department: v as Department }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Duration <span className="text-destructive">*</span></Label>
                <Input value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} placeholder="e.g. 3 Months" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Description <span className="text-destructive">*</span></Label>
              <Textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Fee <span className="text-destructive">*</span></Label>
                <Input type="number" value={form.fee} onChange={(e) => setForm((f) => ({ ...f, fee: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v as CourseStatus }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>{editing ? 'Save Changes' : 'Add Course'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
