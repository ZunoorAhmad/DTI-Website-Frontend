'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Shield, User, ArrowRight, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp, UserRole } from '@/lib/store';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function AdminLogin() {
  const { login } = useApp();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole>('Super Admin');
  const [email, setEmail] = useState('admin@dti.edu.pk');
  const [password, setPassword] = useState('dti-admin');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(selectedRole);
      setLoading(false);
      toast.success(`Welcome back! Logged in as ${selectedRole}`);
      router.push('/admin');
    }, 800);
  };

  const roles: { role: UserRole; icon: typeof Shield; desc: string }[] = [
    { role: 'Super Admin', icon: Shield, desc: 'Full system access & management' },
    { role: 'Staff', icon: User, desc: 'Admissions & application management' },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <GraduationCap className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">DTI Admin Portal</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Digital Admission Management System
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white p-8 shadow-sm">
          <h2 className="mb-1 text-lg font-semibold text-foreground">Sign In</h2>
          <p className="mb-6 text-sm text-muted-foreground">Select your role and enter your credentials.</p>

          {/* Role Selection */}
          <div className="mb-6 space-y-2">
            {roles.map(({ role, icon: Icon, desc }) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg border-2 p-3 text-left transition-colors',
                  selectedRole === role
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/30'
                )}
              >
                <div className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg',
                  selectedRole === role ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{role}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
                <div className={cn(
                  'h-4 w-4 rounded-full border-2',
                  selectedRole === role ? 'border-primary bg-primary' : 'border-border'
                )} />
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="admin@dti.edu.pk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="Enter password"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          <div className="mt-6 rounded-lg bg-slate-50 p-3 text-center text-xs text-muted-foreground">
            Demo credentials are pre-filled — just click Sign In to explore the system.
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          &copy; 2026 Descon Technical Institute. All rights reserved.
        </p>
      </div>
    </div>
  );
}
