export type ApplicationStatus = 'New' | 'Under Review' | 'Approved' | 'Rejected';
export type StudentStatus = 'Active' | 'Graduated' | 'Suspended' | 'Pending';
export type CourseStatus = 'Active' | 'Inactive';
export type StaffRole = 'Super Admin' | 'Admissions Staff' | 'Course Staff' | 'Reporting Staff';
export type StaffStatus = 'Active' | 'Inactive';
export type Gender = 'Male' | 'Female' | 'Other';
export type Department =
  | 'QHSE'
  | 'Automation'
  | 'Welding'
  | 'Fabrication'
  | 'Electrical'
  | 'Civil'
  | 'Millwright'
  | 'Carpentry';

export interface CourseSpecificField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  required: boolean;
  options?: string[];
}

export interface Course {
  id: string;
  name: string;
  department: Department;
  duration: string;
  description: string;
  fee: number;
  status: CourseStatus;
  applications: number;
  monthlyTrend: number;
  specificFields: CourseSpecificField[];
}

export interface UploadedDocument {
  id: string;
  category: 'CNIC' | 'Photograph' | 'Educational Documents' | 'Certificates' | 'Other Supporting Documents';
  fileName: string;
  fileType: string;
  fileSize: string;
  status: 'Uploaded' | 'Pending';
}

export interface ApplicationHistoryEntry {
  id: string;
  status: ApplicationStatus;
  date: string;
  actor: string;
  note?: string;
}

export interface Application {
  id: string;
  applicantName: string;
  fatherName: string;
  dateOfBirth: string;
  cnic: string;
  gender: Gender;
  mobile: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postalAddress: string;
  qualification: string;
  educationLevel: string;
  institution: string;
  yearOfCompletion: string;
  experience: string;
  currentOccupation: string;
  courseId: string;
  courseName: string;
  department: Department;
  campus: string;
  date: string;
  status: ApplicationStatus;
  documents: UploadedDocument[];
  courseSpecific: Record<string, string>;
  history: ApplicationHistoryEntry[];
}

export interface Student {
  id: string;
  name: string;
  cnic: string;
  courseId: string;
  courseName: string;
  city: string;
  campus: string;
  enrollmentDate: string;
  status: StudentStatus;
  email: string;
  phone: string;
  gender: Gender;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  department: string;
  status: StaffStatus;
  lastActive: string;
  avatar?: string;
}

export interface EmailCampaign {
  id: string;
  subject: string;
  sentBy: string;
  recipientGroup: string;
  recipients: number;
  date: string;
  status: 'Sent' | 'Draft' | 'Scheduled';
  body: string;
}

export interface Notification {
  id: string;
  type: 'application' | 'review' | 'deadline' | 'staff' | 'course' | 'email';
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export interface ActivityEntry {
  id: string;
  actor: string;
  action: string;
  target?: string;
  time: string;
  icon: 'file' | 'check' | 'course' | 'mail' | 'user' | 'settings';
}

export interface City {
  name: string;
  campuses: string[];
}

export const CITIES: City[] = [
  { name: 'Lahore', campuses: ['Lahore Campus'] },
  { name: 'Sadiqabad', campuses: ['Sadiqabad Campus'] },
  { name: 'Islamabad', campuses: ['Islamabad Campus'] },
  { name: 'Rawalpindi', campuses: ['Rawalpindi Campus'] },
  { name: 'Karachi', campuses: ['Karachi Campus'] },
  { name: 'Faisalabad', campuses: ['Faisalabad Campus'] },
  { name: 'Multan', campuses: ['Multan Campus'] },
  { name: 'Gujranwala', campuses: ['Gujranwala Campus'] },
  { name: 'Sialkot', campuses: ['Sialkot Campus'] },
  { name: 'Peshawar', campuses: ['Peshawar Campus'] },
  { name: 'Quetta', campuses: ['Quetta Campus'] },
  { name: 'Other', campuses: ['Main Campus'] },
];

export const PROVINCES = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Gilgit-Baltistan',
  'Azad Jammu & Kashmir',
  'Islamabad Capital Territory',
];

export const EDUCATION_LEVELS = [
  'Middle',
  'Matriculation',
  'Intermediate',
  'Diploma',
  'Bachelor',
  'Master',
  'Other',
];
