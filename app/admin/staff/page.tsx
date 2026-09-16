'use client';

import { useState } from 'react';
import { Plus, Pencil, Power, Eye } from 'lucide-react';
import { SuperAdminGuard } from '@/components/admin/SuperAdminGuard';
import { PageHeader } from '@/components/shared/PageHeader';
import { PillBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useApp } from '@/lib/store';
import { StaffMember, StaffRole, StaffStatus } from '@/lib/types';
import { roleBadgeClass, staffStatusClass } from '@/lib/format';
import { toast } from 'sonner';

const ROLES: StaffRole[] = ['Super Admin', 'Admissions Staff', 'Course Staff', 'Reporting Staff'];
const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  role: 'Admissions Staff' as StaffRole,
  department: 'Admissions',
  status: 'Active' as StaffStatus,
};

export default function StaffPage() {
  return (
    <SuperAdminGuard>
      <StaffManagement />
    </SuperAdminGuard>
  );
}

function StaffManagement() {
  const { staff, addStaff, updateStaff, toggleStaffStatus } = useApp();
  const [open, setOpen] = useState(false);
  const [viewing, setViewing] = useState<StaffMember | null>(null);
  const [editing, setEditing] = useState<StaffMember | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  };

  const openEdit = (member: StaffMember) => {
    setEditing(member);
    setForm({
      name: member.name,
      email: member.email,
      phone: member.phone,
      role: member.role,
      department: member.department,
      status: member.status,
    });
    setOpen(true);
  };

  const save = () => {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.department.trim()) {
      toast.error('Please fill all required fields');
      return;
    }
    if (editing) {
      updateStaff(editing.id, form);
      toast.success('Staff member updated');
    } else {
      addStaff(form);
      toast.success('Staff member added');
    }
    setOpen(false);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Staff Management"
        description="Add, edit, and control access for internal users."
        action={<Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" /> Add Staff Member</Button>}
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden lg:table-cell">Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden md:table-cell">Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden xl:table-cell">Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell className="hidden md:table-cell text-xs">{member.email}</TableCell>
                  <TableCell className="hidden lg:table-cell text-xs">{member.phone}</TableCell>
                  <TableCell>
                    <PillBadge className={roleBadgeClass(member.role)}>{member.role}</PillBadge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{member.department}</TableCell>
                  <TableCell>
                    <PillBadge className={staffStatusClass(member.status)}>{member.status}</PillBadge>
                  </TableCell>
                  <TableCell className="hidden xl:table-cell text-xs">{member.lastActive}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewing(member)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(member)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          toggleStaffStatus(member.id);
                          toast.success(member.status === 'Active' ? 'Staff deactivated' : 'Staff activated');
                        }}
                      >
                        <Power className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Staff Member' : 'Add Staff Member'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <Field label="Full Name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
            <Field label="Email" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} />
            <Field label="Phone" value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v as StaffRole }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Field label="Department" value={form.department} onChange={(v) => setForm((f) => ({ ...f, department: v }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v as StaffStatus }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>{editing ? 'Save Changes' : 'Add Staff Member'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Staff Details</DialogTitle>
            <DialogDescription>{viewing?.email}</DialogDescription>
          </DialogHeader>
          {viewing && (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Info label="Name" value={viewing.name} />
              <Info label="Role" value={viewing.role} />
              <Info label="Department" value={viewing.department} />
              <Info label="Status" value={viewing.status} />
              <Info label="Phone" value={viewing.phone} />
              <Info label="Last Active" value={viewing.lastActive} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label>{label} <span className="text-destructive">*</span></Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium text-foreground">{value}</p>
    </div>
  );
}
