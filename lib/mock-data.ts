import {
  Application,
  ActivityEntry,
  Course,
  EmailCampaign,
  Notification,
  StaffMember,
  Student,
} from './types';

export const COURSES: Course[] = [
  {
    id: 'C001',
    name: 'Welding Inspector (CSWIP)',
    department: 'Welding',
    duration: '3 Months',
    description:
      'Comprehensive training in welding inspection techniques, quality control, and international welding standards including CSWIP certification preparation.',
    fee: 45000,
    status: 'Active',
    applications: 320,
    monthlyTrend: 18,
    specificFields: [
      { id: 'exp', label: 'Welding Experience (years)', type: 'text', required: true },
      { id: 'cert', label: 'Existing Certifications', type: 'textarea', required: false },
    ],
  },
  {
    id: 'C002',
    name: 'NEBOSH IGC',
    department: 'QHSE',
    duration: '6 Months',
    description:
      'International General Certificate in Occupational Health and Safety — globally recognized qualification for HSE professionals.',
    fee: 85000,
    status: 'Active',
    applications: 285,
    monthlyTrend: 12,
    specificFields: [
      { id: 'qualification', label: 'Highest Qualification', type: 'text', required: true },
      { id: 'experience', label: 'Relevant Experience (years)', type: 'text', required: true },
    ],
  },
  {
    id: 'C003',
    name: 'Industrial Electrician',
    department: 'Electrical',
    duration: '4 Months',
    description:
      'Practical training in industrial electrical systems, wiring, motor control, and troubleshooting for manufacturing environments.',
    fee: 35000,
    status: 'Active',
    applications: 240,
    monthlyTrend: 8,
    specificFields: [
      { id: 'prev_training', label: 'Previous Electrical Training', type: 'textarea', required: false },
      { id: 'experience', label: 'Experience (years)', type: 'text', required: true },
    ],
  },
  {
    id: 'C004',
    name: 'PLC with HMI & SCADA',
    department: 'Automation',
    duration: '5 Months',
    description:
      'Programmable Logic Controller programming, Human Machine Interface design, and SCADA system integration for industrial automation.',
    fee: 65000,
    status: 'Active',
    applications: 195,
    monthlyTrend: 32,
    specificFields: [
      { id: 'certification', label: 'Existing Automation Certifications', type: 'textarea', required: false },
      { id: 'prev_training', label: 'Previous Training', type: 'text', required: true },
    ],
  },
  {
    id: 'C005',
    name: 'AutoCAD (Mechanical & Civil)',
    department: 'Civil',
    duration: '2 Months',
    description:
      '2D drafting and 3D modeling with AutoCAD for mechanical and civil engineering applications, including drawing standards.',
    fee: 25000,
    status: 'Active',
    applications: 170,
    monthlyTrend: 5,
    specificFields: [
      { id: 'qualification', label: 'Qualification', type: 'text', required: true },
    ],
  },
  {
    id: 'C006',
    name: 'Pipe Fabrication & Fitting',
    department: 'Fabrication',
    duration: '3 Months',
    description:
      'Specialized training in pipe fabrication, cutting, fitting, and welding techniques used in industrial pipeline construction.',
    fee: 38000,
    status: 'Active',
    applications: 145,
    monthlyTrend: 6,
    specificFields: [
      { id: 'experience', label: 'Fabrication Experience (years)', type: 'text', required: true },
    ],
  },
  {
    id: 'C007',
    name: 'IOSH Managing Safely',
    department: 'QHSE',
    duration: '2 Months',
    description:
      'Essential safety management training for supervisors and managers, covering risk assessment and workplace safety protocols.',
    fee: 40000,
    status: 'Active',
    applications: 135,
    monthlyTrend: 10,
    specificFields: [
      { id: 'qualification', label: 'Highest Qualification', type: 'text', required: true },
      { id: 'experience', label: 'Management Experience (years)', type: 'text', required: false },
    ],
  },
  {
    id: 'C008',
    name: 'Structural Steel Fabrication',
    department: 'Fabrication',
    duration: '4 Months',
    description:
      'Advanced structural steel fabrication, cutting, shaping, and assembly for construction and infrastructure projects.',
    fee: 42000,
    status: 'Active',
    applications: 110,
    monthlyTrend: 3,
    specificFields: [
      { id: 'experience', label: 'Steel Work Experience (years)', type: 'text', required: true },
    ],
  },
  {
    id: 'C009',
    name: 'Millwright & Maintenance Technician',
    department: 'Millwright',
    duration: '5 Months',
    description:
      'Precision machinery installation, alignment, maintenance, and troubleshooting for industrial production facilities.',
    fee: 48000,
    status: 'Active',
    applications: 98,
    monthlyTrend: 15,
    specificFields: [
      { id: 'prev_training', label: 'Previous Technical Training', type: 'textarea', required: false },
      { id: 'experience', label: 'Maintenance Experience (years)', type: 'text', required: true },
    ],
  },
  {
    id: 'C010',
    name: 'Carpentry & Woodworking',
    department: 'Carpentry',
    duration: '3 Months',
    description:
      'Modern carpentry techniques, furniture making, wood joints, and finishing for residential and commercial construction.',
    fee: 22000,
    status: 'Active',
    applications: 75,
    monthlyTrend: -2,
    specificFields: [
      { id: 'experience', label: 'Carpentry Experience (years)', type: 'text', required: false },
    ],
  },
  {
    id: 'C011',
    name: 'Advanced SCADA Systems',
    department: 'Automation',
    duration: '4 Months',
    description:
      'Advanced SCADA system architecture, data acquisition, real-time monitoring, and industrial network integration.',
    fee: 72000,
    status: 'Active',
    applications: 88,
    monthlyTrend: 22,
    specificFields: [
      { id: 'certification', label: 'Automation Certifications', type: 'text', required: true },
      { id: 'prev_training', label: 'PLC Training Completed', type: 'select', required: true, options: ['Yes', 'No'] },
    ],
  },
  {
    id: 'C012',
    name: 'Civil Site Supervisor',
    department: 'Civil',
    duration: '6 Months',
    description:
      'Site supervision, project management, quality control, and construction safety for civil engineering projects.',
    fee: 55000,
    status: 'Inactive',
    applications: 62,
    monthlyTrend: -5,
    specificFields: [
      { id: 'qualification', label: 'Highest Qualification', type: 'text', required: true },
      { id: 'experience', label: 'Site Experience (years)', type: 'text', required: true },
    ],
  },
];

const NAMES = [
  'Ahmed Raza', 'Muhammad Bilal', 'Usman Khan', 'Hamza Sheikh', 'Ali Hassan',
  'Fatima Noor', 'Ayesha Siddiqui', 'Zainab Malik', 'Bilal Ahmed', 'Tariq Mehmood',
  'Imran Qureshi', 'Sana Iqbal', 'Kashif Raza', 'Naveed Akhtar', 'Sadia Parveen',
  'Faisal Mahmood', 'Adnan Yousaf', 'Rabia Anwar', 'Suleman Shah', 'Hina Aslam',
  'Zeeshan Ali', 'Asad Ullah', 'Nida Rafique', 'Waseem Akram', 'Maryam Nadeem',
  'Irfan Haider', 'Saima Yousaf', 'Danish Aziz', 'Adeel Rauf', 'Shazia Bibi',
  'Ghulam Abbas', 'Nouman Sattar', 'Amna Khalid', 'Haroon Rasheed', 'Saba Ghulam',
  'Mudassar Iqbal', 'Rashid Minhas', 'Farah Naz', 'Owais Khan', 'Tanveer Hussain',
];

const FATHER_NAMES = [
  'Raza Muhammad', 'Khan Muhammad', 'Sheikh Ahmad', 'Hassan Ali', 'Mehmood Khan',
  'Qureshi Ahmad', 'Iqbal Hassan', 'Akhtar Raza', 'Parveen Bibi', 'Mahmood Ahmad',
  'Yousaf Ali', 'Anwar Khan', 'Shah Noor', 'Aslam Raza', 'Rafique Ahmad',
];

const CITIES_LIST = ['Lahore', 'Sadiqabad', 'Islamabad', 'Karachi', 'Faisalabad', 'Multan', 'Rawalpindi', 'Gujranwala', 'Sialkot', 'Peshawar', 'Quetta'];
const CAMPUSES_LIST = ['Lahore Campus', 'Sadiqabad Campus', 'Islamabad Campus', 'Karachi Campus'];
const STATUSES: Application['status'][] = ['New', 'Under Review', 'Approved', 'Rejected'];

function randomCnic(): string {
  const part = () => String(Math.floor(10000 + Math.random() * 89999));
  return `${part()}-${part().substring(0, 3)}-${part().substring(0, 1)}`;
}

function randomPhone(): string {
  return `+9230${Math.floor(Math.random() * 9)}${String(Math.floor(1000000 + Math.random() * 8999999))}`;
}

function randomDate(daysBack: number): string {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack));
  return d.toISOString().split('T')[0];
}

function randomDob(): string {
  const year = 1985 + Math.floor(Math.random() * 18);
  const month = String(1 + Math.floor(Math.random() * 12)).padStart(2, '0');
  const day = String(1 + Math.floor(Math.random() * 28)).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function genApplications(count: number): Application[] {
  const apps: Application[] = [];
  const qual = ['Matriculation', 'Intermediate', 'Diploma', 'Bachelor', 'Master'];
  const occ = ['Technician', 'Student', 'Unemployed', 'Welder', 'Electrician', 'Supervisor', 'Operator'];
  for (let i = 0; i < count; i++) {
    const course = COURSES[Math.floor(Math.random() * COURSES.length)];
    const name = NAMES[i % NAMES.length];
    const city = CITIES_LIST[Math.floor(Math.random() * CITIES_LIST.length)];
    const campus = CAMPUSES_LIST[Math.floor(Math.random() * CAMPUSES_LIST.length)];
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
    const id = `DTI-2026-${String(120 + i).padStart(5, '0')}`;
    const date = randomDate(90);

    const docTypes = [
      { cat: 'CNIC' as const, name: 'CNIC_Scan.pdf', type: 'PDF' },
      { cat: 'Photograph' as const, name: 'Passport_Photo.jpg', type: 'JPG' },
      { cat: 'Educational Documents' as const, name: 'Degree_Certificate.pdf', type: 'PDF' },
      { cat: 'Certificates' as const, name: 'Experience_Cert.pdf', type: 'PDF' },
    ];
    const docs = docTypes.map((d, idx) => ({
      id: `${id}-D${idx}`,
      category: d.cat,
      fileName: d.name,
      fileType: d.type,
      fileSize: `${Math.floor(200 + Math.random() * 800)} KB`,
      status: 'Uploaded' as const,
    }));

    const courseSpecific: Record<string, string> = {};
    course.specificFields.forEach((f) => {
      if (f.type === 'select' && f.options) {
        courseSpecific[f.id] = f.options[0];
      } else {
        courseSpecific[f.id] = String(Math.floor(Math.random() * 10)) + ' years';
      }
    });

    const history = [];
    const submitDate = date;
    history.push({ id: `${id}-H0`, status: 'New' as const, date: submitDate, actor: 'System', note: 'Application submitted online' });
    if (status === 'Under Review' || status === 'Approved' || status === 'Rejected') {
      history.push({ id: `${id}-H1`, status: 'Under Review' as const, date: submitDate, actor: 'Staff Member', note: 'Application moved to review queue' });
    }
    if (status === 'Approved' || status === 'Rejected') {
      history.push({ id: `${id}-H2`, status: status , date: submitDate, actor: 'Super Admin', note: status === 'Approved' ? 'Application approved for enrollment' : 'Application rejected — incomplete documents' });
    }

    apps.push({
      id,
      applicantName: name,
      fatherName: FATHER_NAMES[i % FATHER_NAMES.length],
      dateOfBirth: randomDob(),
      cnic: randomCnic(),
      gender: Math.random() > 0.3 ? 'Male' : 'Female',
      mobile: randomPhone(),
      email: name.toLowerCase().replace(/\s+/g, '.') + (i < 10 ? '' : i) + '@gmail.com',
      address: `House ${100 + i}, Block ${String.fromCharCode(65 + (i % 6))}, ${city}`,
      city,
      province: ['Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan'][i % 4],
      postalAddress: `${city} - ${Math.floor(38000 + Math.random() * 10000)}`,
      qualification: qual[i % qual.length],
      educationLevel: qual[i % qual.length],
      institution: `Govt. Institute ${city}`,
      yearOfCompletion: String(2010 + (i % 14)),
      experience: `${Math.floor(Math.random() * 15)} years`,
      currentOccupation: occ[i % occ.length],
      courseId: course.id,
      courseName: course.name,
      department: course.department,
      campus,
      date,
      status,
      documents: docs,
      courseSpecific,
      history,
    });
  }
  return apps.sort((a, b) => b.date.localeCompare(a.date));
}

export const APPLICATIONS: Application[] = genApplications(38);

export const STUDENTS: Student[] = APPLICATIONS.filter((a) => a.status === 'Approved').map((a, i) => ({
  id: `STU-2026-${String(1001 + i).padStart(5, '0')}`,
  name: a.applicantName,
  cnic: a.cnic,
  courseId: a.courseId,
  courseName: a.courseName,
  city: a.city,
  campus: a.campus,
  enrollmentDate: a.date,
  status: (['Active', 'Graduated', 'Active', 'Active', 'Pending'] as const)[i % 5],
  email: a.email,
  phone: a.mobile,
  gender: a.gender,
})).slice(0, 24);

export const STAFF: StaffMember[] = [
  { id: 'S001', name: 'Dr. Imran Siddiqui', email: 'imran.siddiqui@dti.edu.pk', phone: '+923001234567', role: 'Super Admin', department: 'Administration', status: 'Active', lastActive: '2026-08-22 09:15' },
  { id: 'S002', name: 'Sarah Ahmed', email: 'sarah.ahmed@dti.edu.pk', phone: '+923211234567', role: 'Admissions Staff', department: 'Admissions', status: 'Active', lastActive: '2026-08-22 08:45' },
  { id: 'S003', name: 'Kamran Raza', email: 'kamran.raza@dti.edu.pk', phone: '+923331234567', role: 'Admissions Staff', department: 'Admissions', status: 'Active', lastActive: '2026-08-21 17:30' },
  { id: 'S004', name: 'Nadia Hussain', email: 'nadia.hussain@dti.edu.pk', phone: '+923451234567', role: 'Course Staff', department: 'Welding', status: 'Active', lastActive: '2026-08-21 16:00' },
  { id: 'S005', name: 'Omar Khalid', email: 'omar.khalid@dti.edu.pk', phone: '+923021234567', role: 'Course Staff', department: 'Automation', status: 'Active', lastActive: '2026-08-20 14:20' },
  { id: 'S006', name: 'Ayesha Khan', email: 'ayesha.khan@dti.edu.pk', phone: '+923121234567', role: 'Reporting Staff', department: 'Analytics', status: 'Active', lastActive: '2026-08-22 10:00' },
  { id: 'S007', name: 'Tariq Mahmood', email: 'tariq.mahmood@dti.edu.pk', phone: '+923001112233', role: 'Course Staff', department: 'Electrical', status: 'Inactive', lastActive: '2026-07-15 11:00' },
];

export const EMAIL_HISTORY: EmailCampaign[] = [
  { id: 'E001', subject: 'Admission Update 2026 — Welding Courses', sentBy: 'Dr. Imran Siddiqui', recipientGroup: 'Students of a Specific Course', recipients: 245, date: '2026-08-20', status: 'Sent', body: 'Dear Students, we are pleased to announce new batch dates for welding courses starting September 2026...' },
  { id: 'E002', subject: 'Document Submission Deadline Reminder', sentBy: 'Sarah Ahmed', recipientGroup: 'All Registered Students', recipients: 2450, date: '2026-08-18', status: 'Sent', body: 'This is a reminder that the document submission deadline is approaching. Please submit all required documents before August 31st.' },
  { id: 'E003', subject: 'New Course Launch — Advanced SCADA Systems', sentBy: 'Omar Khalid', recipientGroup: 'All Staff Members', recipients: 7, date: '2026-08-15', status: 'Sent', body: 'We are launching a new Advanced SCADA Systems course. All staff are requested to review the curriculum.' },
  { id: 'E004', subject: 'Lahore Campus Orientation Schedule', sentBy: 'Kamran Raza', recipientGroup: 'Students of a Specific City', recipients: 680, date: '2026-08-12', status: 'Sent', body: 'Orientation for Lahore Campus students will be held on September 1st, 2026 at 10:00 AM.' },
  { id: 'E005', subject: 'Monthly Progress Report — August 2026', sentBy: 'Ayesha Khan', recipientGroup: 'All Staff Members', recipients: 7, date: '2026-08-10', status: 'Sent', body: 'The monthly progress report for August 2026 is now available for review.' },
  { id: 'E006', subject: 'Admission Open — September 2026 Intake', sentBy: 'Dr. Imran Siddiqui', recipientGroup: 'All Registered Students', recipients: 2450, date: '2026-08-05', status: 'Sent', body: 'Admissions are now open for the September 2026 intake. Apply before the deadline.' },
];

export const NOTIFICATIONS: Notification[] = [
  { id: 'N001', type: 'application', title: '12 new applications received', description: 'New applications have been submitted in the last 24 hours', time: '2 hours ago', read: false },
  { id: 'N002', type: 'review', title: '5 applications require review', description: 'Applications pending review for over 48 hours', time: '4 hours ago', read: false },
  { id: 'N003', type: 'deadline', title: 'Admission deadline approaching', description: 'Application deadline ends in 9 days', time: '6 hours ago', read: false },
  { id: 'N004', type: 'staff', title: 'New staff member added', description: 'Ayesha Khan joined as Reporting Staff', time: '1 day ago', read: false },
  { id: 'N005', type: 'course', title: 'Course applications increased by 20%', description: 'Welding Inspector course seeing increased interest', time: '1 day ago', read: true },
  { id: 'N006', type: 'email', title: 'Email sent to 245 Welding students', description: 'Admission Update email campaign completed', time: '2 days ago', read: true },
  { id: 'N007', type: 'application', title: '3 applications approved', description: 'Applications approved for September 2026 intake', time: '2 days ago', read: true },
  { id: 'N008', type: 'review', title: 'New course "PLC & SCADA" added', description: 'Course has been added to the catalog', time: '3 days ago', read: true },
];

export const ACTIVITY_FEED: ActivityEntry[] = [
  { id: 'A001', actor: 'Ahmed Raza', action: 'submitted a new application', target: 'DTI-2026-00138', time: '10 minutes ago', icon: 'file' },
  { id: 'A002', actor: 'Sarah Ahmed', action: 'changed application to Under Review', target: 'DTI-2026-00125', time: '32 minutes ago', icon: 'check' },
  { id: 'A003', actor: 'System', action: 'added a new course', target: 'PLC with HMI & SCADA', time: '1 hour ago', icon: 'course' },
  { id: 'A004', actor: 'Dr. Imran Siddiqui', action: 'sent email to 245 Welding students', target: 'Admission Update 2026', time: '2 hours ago', icon: 'mail' },
  { id: 'A005', actor: 'Dr. Imran Siddiqui', action: 'added a new staff member', target: 'Ayesha Khan', time: '3 hours ago', icon: 'user' },
  { id: 'A006', actor: 'Kamran Raza', action: 'approved an application', target: 'DTI-2026-00120', time: '5 hours ago', icon: 'check' },
  { id: 'A007', actor: 'System', action: 'generated monthly report', target: 'August 2026 Analytics', time: '6 hours ago', icon: 'settings' },
  { id: 'A008', actor: 'Nadia Hussain', action: 'updated course details', target: 'Welding Inspector (CSWIP)', time: '8 hours ago', icon: 'course' },
];

// Chart data
export const CHART_DATA = {
  applications7Days: [
    { label: 'Mon', value: 28 },
    { label: 'Tue', value: 35 },
    { label: 'Wed', value: 42 },
    { label: 'Thu', value: 31 },
    { label: 'Fri', value: 48 },
    { label: 'Sat', value: 22 },
    { label: 'Sun', value: 18 },
  ],
  applications30Days: Array.from({ length: 30 }, (_, i) => ({
    label: `${i + 1}`,
    value: Math.floor(15 + Math.random() * 40 + (i > 20 ? 10 : 0)),
  })),
  applications90Days: Array.from({ length: 12 }, (_, i) => ({
    label: `W${i + 1}`,
    value: Math.floor(80 + Math.random() * 120 + (i > 6 ? 30 : 0)),
  })),
  byCourse: [
    { name: 'Welding Inspector', value: 320 },
    { name: 'NEBOSH IGC', value: 285 },
    { name: 'Industrial Electrician', value: 240 },
    { name: 'PLC / SCADA', value: 195 },
    { name: 'AutoCAD', value: 170 },
    { name: 'Pipe Fabrication', value: 145 },
    { name: 'IOSH', value: 135 },
  ],
  byCity: [
    { name: 'Lahore', value: 680 },
    { name: 'Sadiqabad', value: 420 },
    { name: 'Islamabad', value: 385 },
    { name: 'Karachi', value: 340 },
    { name: 'Faisalabad', value: 280 },
    { name: 'Multan', value: 220 },
  ],
  byStatus: [
    { name: 'New', value: 342, color: 'hsl(199, 89%, 48%)' },
    { name: 'Under Review', value: 386, color: 'hsl(38, 92%, 50%)' },
    { name: 'Approved', value: 1420, color: 'hsl(142, 71%, 45%)' },
    { name: 'Rejected', value: 118, color: 'hsl(0, 84%, 60%)' },
  ],
  weeklyComparison: { thisWeek: 224, lastWeek: 190, change: 17.9 },
  monthlyComparison: { thisMonth: 968, lastMonth: 858, change: 12.8 },
};

export const KPI_DATA = {
  totalApplications: 2486,
  totalApplicationsChange: 12.8,
  newApplications: 342,
  approved: 1420,
  underReview: 386,
  rejected: 118,
  totalStudents: 5840,
  totalCourses: 12,
  activeStaff: 6,
};
