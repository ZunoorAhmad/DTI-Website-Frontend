'use client';

import { useState } from 'react';
import { SuperAdminGuard } from '@/components/admin/SuperAdminGuard';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CITIES } from '@/lib/types';
import { toast } from 'sonner';

export default function SettingsPage() {
  return (
    <SuperAdminGuard>
      <SettingsContent />
    </SuperAdminGuard>
  );
}

function SettingsContent() {
  const [general, setGeneral] = useState({
    instituteName: 'Descon Technical Institute',
    email: 'info@dti.edu.pk',
    phone: '+92 42 111 111 111',
    website: 'https://www.dti.edu.pk',
    address: '10-KM Ferozepur Road, Lahore, Pakistan',
  });
  const [admission, setAdmission] = useState({
    status: 'Open',
    startDate: '2026-08-01',
    endDate: '2026-09-30',
    prefix: 'DTI-2026-',
  });
  const [campuses, setCampuses] = useState(CITIES.map((c) => c.name));
  const [newCampus, setNewCampus] = useState('');
  const [application, setApplication] = useState({
    documents: true,
    fileTypes: 'PDF, JPG, PNG',
    maxSize: '5',
    extraFields: true,
  });
  const [notifications, setNotifications] = useState({
    email: true,
    submission: true,
    statusChange: true,
  });

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <PageHeader title="Settings" description="Configure institute, admission, and application preferences." />

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="h-auto flex-wrap">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="admission">Admission</TabsTrigger>
          <TabsTrigger value="campus">Campus</TabsTrigger>
          <TabsTrigger value="application">Application</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader><CardTitle className="text-base">General Settings</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Institute Name" value={general.instituteName} onChange={(v) => setGeneral((s) => ({ ...s, instituteName: v }))} />
              <Field label="Contact Email" value={general.email} onChange={(v) => setGeneral((s) => ({ ...s, email: v }))} />
              <Field label="Contact Phone" value={general.phone} onChange={(v) => setGeneral((s) => ({ ...s, phone: v }))} />
              <Field label="Website" value={general.website} onChange={(v) => setGeneral((s) => ({ ...s, website: v }))} />
              <div className="sm:col-span-2">
                <Field label="Address" value={general.address} onChange={(v) => setGeneral((s) => ({ ...s, address: v }))} />
              </div>
              <div className="sm:col-span-2">
                <Button onClick={() => toast.success('General settings saved')}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admission">
          <Card>
            <CardHeader><CardTitle className="text-base">Admission Settings</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Admission Status</Label>
                <Select value={admission.status} onValueChange={(v) => setAdmission((s) => ({ ...s, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Field label="Application ID Prefix" value={admission.prefix} onChange={(v) => setAdmission((s) => ({ ...s, prefix: v }))} />
              <div className="space-y-1.5">
                <Label>Application Start Date</Label>
                <Input type="date" value={admission.startDate} onChange={(e) => setAdmission((s) => ({ ...s, startDate: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Application End Date</Label>
                <Input type="date" value={admission.endDate} onChange={(e) => setAdmission((s) => ({ ...s, endDate: e.target.value }))} />
              </div>
              <div className="sm:col-span-2">
                <Button onClick={() => toast.success('Admission settings saved')}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campus">
          <Card>
            <CardHeader><CardTitle className="text-base">Campus Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input placeholder="Add campus / city" value={newCampus} onChange={(e) => setNewCampus(e.target.value)} />
                <Button
                  onClick={() => {
                    if (!newCampus.trim()) return;
                    setCampuses((prev) => [...prev, newCampus.trim()]);
                    setNewCampus('');
                    toast.success('Campus added');
                  }}
                >
                  Add
                </Button>
              </div>
              <ul className="divide-y divide-border rounded-lg border border-border">
                {campuses.map((name) => (
                  <li key={name} className="flex items-center justify-between px-4 py-2 text-sm">
                    <span>{name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCampuses((prev) => prev.filter((c) => c !== name))}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="application">
          <Card>
            <CardHeader><CardTitle className="text-base">Application Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <ToggleRow
                label="Required documents"
                description="Ask applicants to upload CNIC, photo, and educational documents."
                checked={application.documents}
                onChange={(v) => setApplication((s) => ({ ...s, documents: v }))}
              />
              <ToggleRow
                label="Application fields"
                description="Include education, experience, and course-specific fields."
                checked={application.extraFields}
                onChange={(v) => setApplication((s) => ({ ...s, extraFields: v }))}
              />
              <Field label="Allowed file types" value={application.fileTypes} onChange={(v) => setApplication((s) => ({ ...s, fileTypes: v }))} />
              <Field label="Maximum upload size (MB)" value={application.maxSize} onChange={(v) => setApplication((s) => ({ ...s, maxSize: v }))} />
              <Button onClick={() => toast.success('Application settings saved')}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader><CardTitle className="text-base">Notification Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <ToggleRow label="Email notifications" description="Send outbound email from the platform." checked={notifications.email} onChange={(v) => setNotifications((s) => ({ ...s, email: v }))} />
              <ToggleRow label="Application submission" description="Notify staff when a new application is submitted." checked={notifications.submission} onChange={(v) => setNotifications((s) => ({ ...s, submission: v }))} />
              <ToggleRow label="Status change" description="Notify applicants when application status changes." checked={notifications.statusChange} onChange={(v) => setNotifications((s) => ({ ...s, statusChange: v }))} />
              <Button onClick={() => toast.success('Notification settings saved')}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader><CardTitle className="text-base">Appearance</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Logo</Label>
                <Input type="file" />
                <p className="text-xs text-muted-foreground">PNG or SVG, recommended 200×200.</p>
              </div>
              <div className="space-y-1.5">
                <Label>Interface density</Label>
                <Select defaultValue="comfortable">
                  <SelectTrigger className="max-w-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comfortable">Comfortable</SelectItem>
                    <SelectItem value="compact">Compact</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => toast.success('Appearance preferences saved')}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
