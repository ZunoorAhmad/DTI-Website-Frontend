'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Search,
  Menu,
  UserCircle,
  Settings,
  LogOut,
  FileText,
  AlertCircle,
  Calendar,
  UserPlus,
  TrendingUp,
  Mail,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useApp } from '@/lib/store';
import { Notification } from '@/lib/types';
import { cn } from '@/lib/utils';

const NOTIF_ICONS: Record<Notification['type'], typeof Bell> = {
  application: FileText,
  review: AlertCircle,
  deadline: Calendar,
  staff: UserPlus,
  course: TrendingUp,
  email: Mail,
};

const NOTIF_COLORS: Record<Notification['type'], string> = {
  application: 'bg-blue-50 text-blue-600',
  review: 'bg-amber-50 text-amber-600',
  deadline: 'bg-red-50 text-red-600',
  staff: 'bg-purple-50 text-purple-600',
  course: 'bg-emerald-50 text-emerald-600',
  email: 'bg-teal-50 text-teal-600',
};

export function AdminHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const { currentUser, notifications, markNotificationRead, markAllNotificationsRead, logout } = useApp();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    router.push('/admin');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button onClick={onMenuClick} className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search applications, students..."
            className="w-64 pl-10 lg:w-80"
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="relative flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                  {unreadCount}
                </span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="flex items-center justify-between border-b border-border p-4">
              <div>
                <p className="text-sm font-semibold text-foreground">Notifications</p>
                <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
              </div>
              <Button variant="ghost" size="sm" onClick={markAllNotificationsRead} className="text-xs">
                Mark all read
              </Button>
            </div>
            <div className="max-h-80 overflow-y-auto scrollbar-thin">
              {notifications.map((notif) => {
                const Icon = NOTIF_ICONS[notif.type];
                return (
                  <button
                    key={notif.id}
                    onClick={() => markNotificationRead(notif.id)}
                    className={cn(
                      'flex w-full items-start gap-3 border-b border-border p-4 text-left transition-colors hover:bg-muted/50',
                      !notif.read && 'bg-primary/5'
                    )}
                  >
                    <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', NOTIF_COLORS[notif.type])}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-medium text-foreground">{notif.title}</p>
                      <p className="text-xs text-muted-foreground">{notif.description}</p>
                      <p className="mt-1 text-[10px] text-muted-foreground">{notif.time}</p>
                    </div>
                    {!notif.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                  </button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {currentUser?.name?.charAt(0) || 'A'}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium text-foreground">{currentUser?.name}</p>
                <p className="text-xs text-muted-foreground">{currentUser?.role}</p>
              </div>
              <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{currentUser?.name}</span>
                <span className="text-xs font-normal text-muted-foreground">{currentUser?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/admin/profile')}>
              <UserCircle className="mr-2 h-4 w-4" /> Profile
            </DropdownMenuItem>
            {currentUser?.role === 'Super Admin' && (
              <DropdownMenuItem onClick={() => router.push('/admin/settings')}>
                <Settings className="mr-2 h-4 w-4" /> Settings
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
