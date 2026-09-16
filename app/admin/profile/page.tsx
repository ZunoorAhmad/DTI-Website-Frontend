'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useApp } from '@/lib/store';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { currentUser, logout } = useApp();
  const router = useRouter();
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [password, setPassword] = useState({ current: '', next: '', confirm: '' });

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <PageHeader title="Admin Profile" description="Manage your account details and password." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Profile</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Info label="Role" value={currentUser?.role || '—'} />
            <Info label="Department" value={currentUser?.department || '—'} />
            <Info label="Last login" value={currentUser?.lastLogin || '—'} />
            <div className="sm:col-span-2 flex flex-wrap gap-2">
              <Button onClick={() => toast.success('Profile updated')}>Edit Profile</Button>
              <Button variant="outline" onClick={() => setPasswordOpen(true)}>Change Password</Button>
              <Button
                variant="outline"
                className="text-destructive"
                onClick={() => {
                  logout();
                  router.push('/admin');
                }}
              >
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center p-8 text-center">
            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              {currentUser?.name?.charAt(0)}
            </div>
            <p className="font-semibold text-foreground">{currentUser?.name}</p>
            <p className="text-sm text-muted-foreground">{currentUser?.role}</p>
            <p className="mt-1 text-xs text-muted-foreground">{currentUser?.email}</p>
          </CardContent>
        </Card>
      </div>

      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Current password</Label>
              <Input type="password" value={password.current} onChange={(e) => setPassword((p) => ({ ...p, current: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>New password</Label>
              <Input type="password" value={password.next} onChange={(e) => setPassword((p) => ({ ...p, next: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Confirm password</Label>
              <Input type="password" value={password.confirm} onChange={(e) => setPassword((p) => ({ ...p, confirm: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                if (!password.current || !password.next || password.next !== password.confirm) {
                  toast.error('Please complete the password fields correctly');
                  return;
                }
                toast.success('Password updated');
                setPasswordOpen(false);
                setPassword({ current: '', next: '', confirm: '' });
              }}
            >
              Update Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium text-foreground">{value}</p>
    </div>
  );
}
