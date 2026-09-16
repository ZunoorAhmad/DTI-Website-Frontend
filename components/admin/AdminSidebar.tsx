'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  Users,
  BookOpen,
  UserCog,
  Mail,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  LogOut,
  UserCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp, UserRole } from '@/lib/store';

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  section: 'main' | 'management' | 'system';
  superAdminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, section: 'main' },
  { href: '/admin/applications', label: 'Applications', icon: FileText, section: 'main' },
  { href: '/admin/students', label: 'Students', icon: Users, section: 'main' },
  { href: '/admin/courses', label: 'Courses', icon: BookOpen, section: 'main' },
  { href: '/admin/staff', label: 'Staff Management', icon: UserCog, section: 'management', superAdminOnly: true },
  // { href: '/admin/email', label: 'Email & Notifications', icon: Mail, section: 'management', superAdminOnly: true },
  { href: '/admin/reports', label: 'Reports & Analytics', icon: BarChart3, section: 'system' },
  { href: '/admin/settings', label: 'Settings', icon: Settings, section: 'system', superAdminOnly: true },
];

const SECTION_LABELS: Record<string, string> = {
  main: 'MAIN',
  management: 'MANAGEMENT',
  system: 'SYSTEM',
};

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const isSuperAdmin = currentUser?.role === 'Super Admin';
  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.superAdminOnly || isSuperAdmin
  );

  const sections = ['main', 'management', 'system'] as const;

  const handleLogout = () => {
    logout();
    router.push('/admin');
  };

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300',
        collapsed ? 'w-[68px]' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-4">
        <Link href="/admin" className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent text-white">
            <GraduationCap className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold leading-tight text-white">DTI Admin</span>
              <span className="text-[10px] leading-tight text-sidebar-muted-foreground">
                Admission Management
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4">
        {sections.map((section) => {
          const items = visibleItems.filter((i) => i.section === section);
          if (items.length === 0) return null;
          return (
            <div key={section} className="mb-6">
              {!collapsed && (
                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-sidebar-muted-foreground">
                  {SECTION_LABELS[section]}
                </p>
              )}
              <div className="space-y-1">
                {items.map((item) => {
                  const isActive = pathname === item.href ||
                    (item.href !== '/admin' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-sidebar-accent text-white'
                          : 'text-sidebar-muted-foreground hover:bg-sidebar-muted hover:text-white'
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Bottom: Profile & Logout */}
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-sm font-bold text-white">
            {currentUser?.name?.charAt(0) || 'A'}
          </div>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-white">{currentUser?.name}</p>
              <p className="truncate text-xs text-sidebar-muted-foreground">{currentUser?.role}</p>
            </div>
          )}
        </div>
        <div className="mt-2 space-y-1">
          <Link
            href="/admin/profile"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              pathname === '/admin/profile'
                ? 'bg-sidebar-muted text-white'
                : 'text-sidebar-muted-foreground hover:bg-sidebar-muted hover:text-white'
            )}
            title={collapsed ? 'Profile' : undefined}
          >
            <UserCircle className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Profile</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-muted-foreground transition-colors hover:bg-sidebar-muted hover:text-white"
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="flex h-10 items-center justify-center border-t border-sidebar-border text-sidebar-muted-foreground transition-colors hover:bg-sidebar-muted hover:text-white"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
}

export function getNavItemsForRole(role: UserRole): NavItem[] {
  return NAV_ITEMS.filter((item) => !item.superAdminOnly || role === 'Super Admin');
}
