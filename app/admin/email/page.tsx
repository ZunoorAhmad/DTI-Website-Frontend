'use client';

import { useMemo, useState } from 'react';
import { SuperAdminGuard } from '@/components/admin/SuperAdminGuard';
import { PageHeader } from '@/components/shared/PageHeader';
import { PillBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useApp } from '@/lib/store';
import { CITIES } from '@/lib/types';
import { CHART_DATA, KPI_DATA } from '@/lib/mock-data';
import { formatDate } from '@/lib/format';
import { toast } from 'sonner';

type RecipientGroup =
  | 'All Staff Members'
  | 'All Registered Students'
  | 'Students of a Specific Course'
  | 'Students of a Specific City'
  | 'Selected Recipients';

export default function EmailPage() {
  return (
    <SuperAdminGuard>
      <EmailNotifications />
    </SuperAdminGuard>
  );
}

function EmailNotifications() {
  const { courses, staff, students, emailHistory, sendEmail, currentUser } = useApp();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [group, setGroup] = useState<RecipientGroup>('All Registered Students');
  const [courseId, setCourseId] = useState('');
  const [city, setCity] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);

  const recipientCount = useMemo(() => {
    switch (group) {
      case 'All Staff Members':
        return staff.filter((s) => s.status === 'Active').length;
      case 'All Registered Students':
        return KPI_DATA.totalStudents;
      case 'Students of a Specific Course': {
        const course = courses.find((c) => c.id === courseId);
        return course?.applications || 0;
      }
      case 'Students of a Specific City':
        return CHART_DATA.byCity.find((c) => c.name === city)?.value || 0;
      case 'Selected Recipients':
        return selectedIds.length;
      default:
        return 0;
    }
  }, [group, staff, courses, courseId, city, selectedIds]);

  const canSend = subject.trim() && message.trim() && recipientCount > 0 &&
    (group !== 'Students of a Specific Course' || !!courseId) &&
    (group !== 'Students of a Specific City' || !!city);

  const handleSend = () => {
    if (!canSend) {
      toast.error('Please complete the email details and recipient group');
      return;
    }
    sendEmail({
      subject: subject.trim(),
      sentBy: currentUser?.name || 'Admin',
      recipientGroup: group,
      recipients: recipientCount,
      body: message.trim(),
    });
    toast.success(`Email sent successfully to ${recipientCount.toLocaleString()} recipients.`);
    setSubject('');
    setMessage('');
    setPreviewOpen(false);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <PageHeader title="Email & Notifications" description="Compose broadcasts and review previously sent campaigns." />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">Compose Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Subject</Label>
              <Input placeholder="Enter email subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Message</Label>
              <Textarea rows={8} placeholder="Write your message..." value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
            <div className="space-y-3">
              <Label>Send To</Label>
              <RadioGroup value={group} onValueChange={(v) => setGroup(v as RecipientGroup)} className="space-y-2">
                {(
                  [
                    'All Staff Members',
                    'All Registered Students',
                    'Students of a Specific Course',
                    'Students of a Specific City',
                    'Selected Recipients',
                  ] as RecipientGroup[]
                ).map((option) => (
                  <label key={option} className="flex items-center gap-2 text-sm">
                    <RadioGroupItem value={option} />
                    {option}
                  </label>
                ))}
              </RadioGroup>
            </div>

            {group === 'Students of a Specific Course' && (
              <div className="space-y-1.5">
                <Label>Course</Label>
                <Select value={courseId} onValueChange={setCourseId}>
                  <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                  <SelectContent>
                    {courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}

            {group === 'Students of a Specific City' && (
              <div className="space-y-1.5">
                <Label>City</Label>
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                  <SelectContent>
                    {CITIES.map((c) => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}

            {group === 'Selected Recipients' && (
              <div className="max-h-40 space-y-2 overflow-y-auto rounded-lg border border-border p-3 scrollbar-thin">
                {students.slice(0, 12).map((s) => (
                  <label key={s.id} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={selectedIds.includes(s.id)}
                      onCheckedChange={() =>
                        setSelectedIds((prev) =>
                          prev.includes(s.id) ? prev.filter((id) => id !== s.id) : [...prev, s.id]
                        )
                      }
                    />
                    {s.name} — {s.courseName}
                  </label>
                ))}
              </div>
            )}

            <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{recipientCount.toLocaleString()}</span> recipients will receive this email.
            </p>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => setPreviewOpen(true)} disabled={!subject || !message}>
                Preview Email
              </Button>
              <Button onClick={handleSend} disabled={!canSend}>Send Email</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Email History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead className="hidden sm:table-cell">Recipients</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emailHistory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <p className="font-medium">{item.subject}</p>
                      <p className="text-xs text-muted-foreground">{item.sentBy} · {formatDate(item.date)}</p>
                      <p className="text-xs text-muted-foreground">{item.recipientGroup}</p>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{item.recipients.toLocaleString()}</TableCell>
                    <TableCell>
                      <PillBadge className="bg-emerald-50 text-emerald-700 border-emerald-200">{item.status}</PillBadge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <p><span className="text-muted-foreground">Subject:</span> <span className="font-medium">{subject}</span></p>
            <p><span className="text-muted-foreground">Send To:</span> {group}</p>
            <p><span className="text-muted-foreground">Recipients:</span> {recipientCount.toLocaleString()}</p>
            <div className="rounded-lg border border-border bg-slate-50 p-3 whitespace-pre-wrap">{message}</div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>Close</Button>
            <Button onClick={handleSend} disabled={!canSend}>Send Email</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
