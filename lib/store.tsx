'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import {
  Application,
  ApplicationStatus,
  Course,
  EmailCampaign,
  Notification,
  StaffMember,
  Student,
  ActivityEntry,
} from './types';
import {
  APPLICATIONS,
  COURSES,
  EMAIL_HISTORY,
  NOTIFICATIONS,
  STAFF,
  STUDENTS,
  ACTIVITY_FEED,
} from './mock-data';

export type UserRole = 'Super Admin' | 'Staff';

interface AdminUser {
  name: string;
  email: string;
  role: UserRole;
  department: string;
  lastLogin: string;
}

interface AppState {
  // Auth
  currentUser: AdminUser | null;
  login: (role: UserRole) => void;
  logout: () => void;

  // Data
  applications: Application[];
  students: Student[];
  courses: Course[];
  staff: StaffMember[];
  emailHistory: EmailCampaign[];
  notifications: Notification[];
  activity: ActivityEntry[];

  // Actions
  updateApplicationStatus: (id: string, status: ApplicationStatus) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  addCourse: (course: Omit<Course, 'id' | 'applications' | 'monthlyTrend'>) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  toggleCourseStatus: (id: string) => void;
  addStaff: (staff: Omit<StaffMember, 'id' | 'lastActive'>) => void;
  updateStaff: (id: string, updates: Partial<StaffMember>) => void;
  toggleStaffStatus: (id: string) => void;
  sendEmail: (campaign: Omit<EmailCampaign, 'id' | 'date' | 'status'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addActivity: (entry: Omit<ActivityEntry, 'id' | 'time'>) => void;
  getApplicationById: (id: string) => Application | undefined;
  getStudentById: (id: string) => Student | undefined;
}

const AppContext = createContext<AppState | undefined>(undefined);

const AUTH_KEY = 'dti-admin-user';

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [applications, setApplications] = useState<Application[]>(APPLICATIONS);
  const [students] = useState<Student[]>(STUDENTS);
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [staff, setStaff] = useState<StaffMember[]>(STAFF);
  const [emailHistory, setEmailHistory] = useState<EmailCampaign[]>(EMAIL_HISTORY);
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);
  const [activity, setActivity] = useState<ActivityEntry[]>(ACTIVITY_FEED);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (raw) setCurrentUser(JSON.parse(raw));
    } catch {
      localStorage.removeItem(AUTH_KEY);
    }
  }, []);

  const login = useCallback((role: UserRole) => {
    const isSuper = role === 'Super Admin';
    const user: AdminUser = {
      name: isSuper ? 'Dr. Imran Siddiqui' : 'Sarah Ahmed',
      email: isSuper ? 'imran.siddiqui@dti.edu.pk' : 'sarah.ahmed@dti.edu.pk',
      role,
      department: isSuper ? 'Administration' : 'Admissions',
      lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setCurrentUser(user);
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_KEY);
  }, []);

  const addActivity = useCallback((entry: Omit<ActivityEntry, 'id' | 'time'>) => {
    setActivity((prev) => [
      { ...entry, id: `A${Date.now()}`, time: 'Just now' },
      ...prev,
    ]);
  }, []);

  const updateApplicationStatus = useCallback((id: string, status: ApplicationStatus) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== id) return app;
        const newHistory = [
          ...app.history,
          {
            id: `${id}-H${app.history.length}`,
            status,
            date: new Date().toISOString().split('T')[0],
            actor: currentUser?.name || 'Staff Member',
            note: `Status changed to ${status}`,
          },
        ];
        return { ...app, status, history: newHistory };
      })
    );
    addActivity({
      actor: currentUser?.name || 'Staff Member',
      action: `changed application to ${status}`,
      target: id,
      icon: 'check',
    });
  }, [currentUser, addActivity]);

  const updateApplication = useCallback((id: string, updates: Partial<Application>) => {
    setApplications((prev) => prev.map((app) => (app.id === id ? { ...app, ...updates } : app)));
  }, []);

  const addCourse = useCallback((course: Omit<Course, 'id' | 'applications' | 'monthlyTrend'>) => {
    const newCourse: Course = {
      ...course,
      id: `C${String(Date.now()).slice(-6)}`,
      applications: 0,
      monthlyTrend: 0,
    };
    setCourses((prev) => [...prev, newCourse]);
    addActivity({
      actor: currentUser?.name || 'Admin',
      action: 'added a new course',
      target: course.name,
      icon: 'course',
    });
  }, [currentUser, addActivity]);

  const updateCourse = useCallback((id: string, updates: Partial<Course>) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }, []);

  const toggleCourseStatus = useCallback((id: string) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c
      )
    );
  }, []);

  const addStaff = useCallback((newStaff: Omit<StaffMember, 'id' | 'lastActive'>) => {
    const staffMember: StaffMember = {
      ...newStaff,
      id: `S${String(Date.now()).slice(-6)}`,
      lastActive: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setStaff((prev) => [...prev, staffMember]);
    addActivity({
      actor: currentUser?.name || 'Super Admin',
      action: 'added a new staff member',
      target: newStaff.name,
      icon: 'user',
    });
  }, [currentUser, addActivity]);

  const updateStaff = useCallback((id: string, updates: Partial<StaffMember>) => {
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  }, []);

  const toggleStaffStatus = useCallback((id: string) => {
    setStaff((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s
      )
    );
  }, []);

  const sendEmail = useCallback((campaign: Omit<EmailCampaign, 'id' | 'date' | 'status'>) => {
    const newCampaign: EmailCampaign = {
      ...campaign,
      id: `E${String(Date.now()).slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Sent',
    };
    setEmailHistory((prev) => [newCampaign, ...prev]);
    addActivity({
      actor: currentUser?.name || 'Admin',
      action: `sent email to ${campaign.recipients} recipients`,
      target: campaign.subject,
      icon: 'mail',
    });
  }, [currentUser, addActivity]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const getApplicationById = useCallback(
    (id: string) => applications.find((a) => a.id === id),
    [applications]
  );

  const getStudentById = useCallback(
    (id: string) => students.find((s) => s.id === id),
    [students]
  );

  const value: AppState = {
    currentUser,
    login,
    logout,
    applications,
    students,
    courses,
    staff,
    emailHistory,
    notifications,
    activity,
    updateApplicationStatus,
    updateApplication,
    addCourse,
    updateCourse,
    toggleCourseStatus,
    addStaff,
    updateStaff,
    toggleStaffStatus,
    sendEmail,
    markNotificationRead,
    markAllNotificationsRead,
    addActivity,
    getApplicationById,
    getStudentById,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
