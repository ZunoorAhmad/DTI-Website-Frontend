import { ApplicationStatus, StudentStatus, CourseStatus, StaffStatus, StaffRole } from './types';

export function statusBadgeClass(status: ApplicationStatus): string {
  switch (status) {
    case 'New':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Under Review':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Approved':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Rejected':
      return 'bg-red-50 text-red-700 border-red-200';
  }
}

export function studentStatusClass(status: StudentStatus): string {
  switch (status) {
    case 'Active':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Graduated':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Suspended':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'Pending':
      return 'bg-amber-50 text-amber-700 border-amber-200';
  }
}

export function courseStatusClass(status: CourseStatus): string {
  return status === 'Active'
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : 'bg-gray-100 text-gray-500 border-gray-200';
}

export function staffStatusClass(status: StaffStatus): string {
  return status === 'Active'
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : 'bg-gray-100 text-gray-500 border-gray-200';
}

export function roleBadgeClass(role: StaffRole): string {
  switch (role) {
    case 'Super Admin':
      return 'bg-primary/10 text-primary border-primary/20';
    case 'Admissions Staff':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Course Staff':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'Reporting Staff':
      return 'bg-teal-50 text-teal-700 border-teal-200';
  }
}

export function formatDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatCurrency(amount: number): string {
  return 'Rs. ' + amount.toLocaleString('en-PK');
}

export function generateApplicationId(): string {
  const num = Math.floor(125 + Math.random() * 9000);
  return `DTI-2026-${String(num).padStart(5, '0')}`;
}
