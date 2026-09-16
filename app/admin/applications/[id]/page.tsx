'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  FileText,
  User,
  GraduationCap,
  Upload,
  Clock,
  Building2,
  CheckCircle2,
  Pencil,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useApp } from '@/lib/store';
import { ApplicationStatus, CITIES } from '@/lib/types';
import { formatDate } from '@/lib/format';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const STATUSES: ApplicationStatus[] = ['New', 'Under Review', 'Approved', 'Rejected'];

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = decodeURIComponent(String(params.id || ''));
  const { getApplicationById, updateApplicationStatus, updateApplication, courses } = useApp();
  const app = getApplicationById(id);

  const [statusOpen, setStatusOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [nextStatus, setNextStatus] = useState<ApplicationStatus>(app?.status || 'New');
  const [editForm, setEditForm] = useState({
    applicantName: '',
    fatherName: '',
    email: '',
    mobile: '',
    address: '',
    city: '',
    campus: '',
  });

  const timeline = useMemo(() => {
    if (!app) return [];
    return app.history;
  }, [app]);

  if (!app) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="p-10 text-center">
            <h2 className="text-lg font-semibold">Application not found</h2>
            <p className="mt-2 text-sm text-muted-foreground">The requested application could not be located.</p>
            <Button className="mt-6" onClick={() => router.push('/admin/applications')}>Back to Applications</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const openEdit = () => {
    setEditForm({
      applicantName: app.applicantName,
      fatherName: app.fatherName,
      email: app.email,
      mobile: app.mobile,
      address: app.address,
      city: app.city,
      campus: app.campus,
    });
    setEditOpen(true);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link href="/admin/applications" className="mb-2 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-1 h-4 w-4" /> Applications
          </Link>
          <PageHeader title={app.id} description={`${app.applicantName} · ${app.courseName}`} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={openEdit}>
            <Pencil className="mr-2 h-4 w-4" /> Edit Application
          </Button>
          <Button onClick={() => { setNextStatus(app.status); setStatusOpen(true); }}>
            Change Status
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-primary" /> Application Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <Info label="Application ID" value={app.id} />
              <Info label="Date" value={formatDate(app.date)} />
              <div>
                <p className="text-muted-foreground">Status</p>
                <div className="mt-1"><StatusBadge status={app.status} /></div>
              </div>
              <Info label="Course" value={app.courseName} />
              <Info label="Department" value={app.department} />
              <Info label="City" value={app.city} />
              <Info label="Campus" value={app.campus} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4 text-primary" /> Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <Info label="Full Name" value={app.applicantName} />
              <Info label="Father's Name" value={app.fatherName} />
              <Info label="Date of Birth" value={formatDate(app.dateOfBirth)} />
              <Info label="CNIC" value={app.cnic} />
              <Info label="Gender" value={app.gender} />
              <Info label="Mobile" value={app.mobile} />
              <Info label="Email" value={app.email} />
              <Info label="Province" value={app.province} />
              <Info label="Address" value={app.address} />
              <Info label="Postal Address" value={app.postalAddress} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <GraduationCap className="h-4 w-4 text-primary" /> Education & Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <Info label="Highest Qualification" value={app.qualification} />
              <Info label="Education Level" value={app.educationLevel} />
              <Info label="Institution" value={app.institution} />
              <Info label="Year of Completion" value={app.yearOfCompletion} />
              <Info label="Relevant Experience" value={app.experience} />
              <Info label="Current Occupation" value={app.currentOccupation} />
            </CardContent>
          </Card>

          {Object.keys(app.courseSpecific).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Building2 className="h-4 w-4 text-primary" /> Course-Specific Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                {Object.entries(app.courseSpecific).map(([key, value]) => {
                  const field = courses.find((c) => c.id === app.courseId)?.specificFields.find((f) => f.id === key);
                  return <Info key={key} label={field?.label || key} value={value} />;
                })}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Upload className="h-4 w-4 text-primary" /> Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {app.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{doc.category}</p>
                    <p className="text-xs text-muted-foreground">
                      {doc.fileName} · {doc.fileType} · {doc.fileSize}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-emerald-600">{doc.status}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4 text-primary" /> Application History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="relative space-y-6 border-l border-border pl-5">
                {timeline.map((entry, idx) => (
                  <li key={entry.id} className="relative">
                    <span
                      className={cn(
                        'absolute -left-[27px] flex h-5 w-5 items-center justify-center rounded-full border bg-white',
                        idx === timeline.length - 1 ? 'border-primary text-primary' : 'border-border text-muted-foreground'
                      )}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </span>
                    <div className="flex items-center justify-between gap-2">
                      <StatusBadge status={entry.status} />
                      <span className="text-xs text-muted-foreground">{formatDate(entry.date)}</span>
                    </div>
                    <p className="mt-1 text-sm text-foreground">{entry.note}</p>
                    <p className="text-xs text-muted-foreground">{entry.actor}</p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={statusOpen} onOpenChange={setStatusOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={nextStatus} onValueChange={(v) => setNextStatus(v as ApplicationStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              updateApplicationStatus(app.id, nextStatus);
              toast.success(`Status updated to ${nextStatus}`);
              setStatusOpen(false);
            }}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Application</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="space-y-1.5">
              <Label>Full Name</Label>
              <Input value={editForm.applicantName} onChange={(e) => setEditForm((f) => ({ ...f, applicantName: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Father&rsquo;s Name</Label>
              <Input value={editForm.fatherName} onChange={(e) => setEditForm((f) => ({ ...f, fatherName: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input value={editForm.email} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Mobile</Label>
                <Input value={editForm.mobile} onChange={(e) => setEditForm((f) => ({ ...f, mobile: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Address</Label>
              <Input value={editForm.address} onChange={(e) => setEditForm((f) => ({ ...f, address: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>City</Label>
                <Select value={editForm.city} onValueChange={(v) => setEditForm((f) => ({ ...f, city: v, campus: '' }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CITIES.map((c) => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Campus</Label>
                <Select value={editForm.campus} onValueChange={(v) => setEditForm((f) => ({ ...f, campus: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(CITIES.find((c) => c.name === editForm.city)?.campuses || []).map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              updateApplication(app.id, editForm);
              toast.success('Application updated');
              setEditOpen(false);
            }}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
