'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardList,
  User,
  GraduationCap,
  Upload,
  FileText,
  X,
  FileCheck2,
  Copy,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { PublicLayout } from '@/components/public/PublicLayout';
import { COURSES } from '@/lib/mock-data';
import { Course, UploadedDocument, CITIES, PROVINCES, EDUCATION_LEVELS } from '@/lib/types';
import { formatCurrency, generateApplicationId } from '@/lib/format';
import { toast } from 'sonner';

const STEPS = [
  { id: 0, label: 'Course & Location', icon: ClipboardList },
  { id: 1, label: 'Personal Info', icon: User },
  { id: 2, label: 'Education', icon: GraduationCap },
  { id: 3, label: 'Documents', icon: Upload },
  { id: 4, label: 'Review & Submit', icon: CheckCircle2 },
];

function formatCnic(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 13);
  const part1 = digits.slice(0, 5);
  const part2 = digits.slice(5, 12);
  const part3 = digits.slice(12, 13);
  if (digits.length <= 5) return part1;
  if (digits.length <= 12) return `${part1}-${part2}`;
  return `${part1}-${part2}-${part3}`;
}

function formatMobileDigits(raw: string): string {
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('92')) digits = digits.slice(2);
  if (digits.startsWith('0')) digits = digits.slice(1);
  return digits.slice(0, 10);
}

const DOC_CATEGORIES: UploadedDocument['category'][] = [
  'CNIC',
  'Photograph',
  'Educational Documents',
  'Certificates',
  'Other Supporting Documents',
];

interface FormData {
  courseId: string;
  city: string;
  campus: string;
  fullName: string;
  fatherName: string;
  dateOfBirth: string;
  cnic: string;
  gender: string;
  mobile: string;
  email: string;
  address: string;
  applicantCity: string;
  province: string;
  postalAddress: string;
  qualification: string;
  educationLevel: string;
  institution: string;
  yearOfCompletion: string;
  experience: string;
  currentOccupation: string;
  courseSpecific: Record<string, string>;
}

function ApplyForm() {
  const searchParams = useSearchParams();
  const preselectedCourse = searchParams.get('course');

  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState('');
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);

  const [form, setForm] = useState<FormData>({
    courseId: preselectedCourse || '',
    city: '',
    campus: '',
    fullName: '',
    fatherName: '',
    dateOfBirth: '',
    cnic: '',
    gender: '',
    mobile: '',
    email: '',
    address: '',
    applicantCity: '',
    province: '',
    postalAddress: '',
    qualification: '',
    educationLevel: '',
    institution: '',
    yearOfCompletion: '',
    experience: '',
    currentOccupation: '',
    courseSpecific: {},
  });

  const selectedCourse = useMemo(
    () => COURSES.find((c) => c.id === form.courseId),
    [form.courseId]
  );

  const availableCampuses = useMemo(
    () => CITIES.find((c) => c.name === form.city)?.campuses || [],
    [form.city]
  );

  useEffect(() => {
    if (form.city && !availableCampuses.includes(form.campus)) {
      setForm((prev) => ({ ...prev, campus: '' }));
    }
  }, [form.city, availableCampuses, form.campus]);

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateCourseSpecific = (fieldId: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      courseSpecific: { ...prev.courseSpecific, [fieldId]: value },
    }));
  };

  const simulateUpload = (category: UploadedDocument['category']) => {
    const fakeFiles: Record<string, { name: string; type: string }> = {
      CNIC: { name: 'CNIC_Scan.pdf', type: 'PDF' },
      Photograph: { name: 'Passport_Photo.jpg', type: 'JPG' },
      'Educational Documents': { name: 'Degree_Certificate.pdf', type: 'PDF' },
      Certificates: { name: 'Experience_Cert.pdf', type: 'PDF' },
      'Other Supporting Documents': { name: 'Supporting_Doc.pdf', type: 'PDF' },
    };
    const file = fakeFiles[category];
    const newDoc: UploadedDocument = {
      id: `DOC-${Date.now()}-${category}`,
      category,
      fileName: file.name,
      fileType: file.type,
      fileSize: `${Math.floor(200 + Math.random() * 800)} KB`,
      status: 'Uploaded',
    };
    setDocuments((prev) => {
      const filtered = prev.filter((d) => d.category !== category);
      return [...filtered, newDoc];
    });
    toast.success(`${category} uploaded successfully`);
  };

  const removeDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const validateStep = (): boolean => {
    switch (step) {
      case 0:
        if (!form.courseId) { toast.error('Please select a course'); return false; }
        if (!form.city) { toast.error('Please select a city'); return false; }
        if (!form.campus) { toast.error('Please select a campus'); return false; }
        return true;
      case 1:
        if (!form.fullName || !form.fatherName || !form.dateOfBirth || !form.gender || !form.email) {
          toast.error('Please fill all required fields');
          return false;
        }
        if (!/^\d{5}-\d{7}-\d$/.test(form.cnic)) {
          toast.error('Please enter a valid CNIC (XXXXX-XXXXXXX-X)');
          return false;
        }
        if (!/^\+92 \d{10}$/.test(form.mobile)) {
          toast.error('Please enter a valid 10-digit mobile number');
          return false;
        }
        return true;
      case 2:
        if (!form.qualification || !form.educationLevel || !form.institution || !form.yearOfCompletion) {
          toast.error('Please fill all required education fields');
          return false;
        }
        if (selectedCourse) {
          for (const field of selectedCourse.specificFields) {
            if (field.required && !form.courseSpecific[field.id]) {
              toast.error(`Please fill: ${field.label}`);
              return false;
            }
          }
        }
        return true;
      case 3:
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = () => {
    const id = generateApplicationId();
    setApplicationId(id);
    setSubmitted(true);
    toast.success('Application submitted successfully!');
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  if (submitted) {
    return (
      <PublicLayout>
        <div className="mx-auto flex max-w-2xl items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
          <Card className="w-full">
            <CardContent className="p-8 text-center sm:p-12">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10 text-success">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h1 className="mb-3 text-2xl font-bold text-foreground">Application Submitted Successfully</h1>
              <p className="mb-6 text-muted-foreground">
                Thank you for applying to Descon Technical Institute. Your application has been
                received and is now under review.
              </p>
              <div className="mx-auto mb-8 max-w-sm rounded-xl border border-border bg-slate-50 p-6">
                <p className="mb-1 text-sm text-muted-foreground">Your Application ID</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-bold tracking-wide text-primary">{applicationId}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(applicationId);
                      toast.success('Application ID copied to clipboard');
                    }}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Save this ID to track your application status.
                </p>
              </div>
              <div className="mb-8 space-y-2 text-left text-sm">
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Course</span>
                  <span className="font-medium text-foreground">{selectedCourse?.name}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Campus</span>
                  <span className="font-medium text-foreground">{form.campus}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Applicant</span>
                  <span className="font-medium text-foreground">{form.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Documents Uploaded</span>
                  <span className="font-medium text-foreground">{documents.length}</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button onClick={() => window.location.href = '/'}>
                  Return to Home
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/courses'}>
                  Browse More Courses
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <section className="border-b border-border bg-slate-50 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Online Application</h1>
          <p className="mt-2 text-muted-foreground">
            Complete the application form below to apply for admission at DTI.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Stepper */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {STEPS.map((s, idx) => (
                <div key={s.id} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                        idx < step
                          ? 'border-success bg-success text-success-foreground'
                          : idx === step
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-white text-muted-foreground'
                      }`}
                    >
                      {idx < step ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
                    </div>
                    <span className={`mt-2 hidden text-xs font-medium sm:block ${
                      idx <= step ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {s.label}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className={`mx-2 h-0.5 flex-1 ${idx < step ? 'bg-success' : 'bg-border'}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Progress value={progress} className="h-2" />
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Step {step + 1} of {STEPS.length} — {STEPS[step].label}
              </p>
            </div>
          </div>

          {/* Step Content */}
          <Card>
            <CardContent className="p-6 sm:p-8">
              {/* Step 0: Course & Location */}
              {step === 0 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="mb-1 text-lg font-semibold text-foreground">Course & Location</h2>
                    <p className="text-sm text-muted-foreground">Select the course and your preferred campus location.</p>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Course <span className="text-destructive">*</span></Label>
                    <Select value={form.courseId} onValueChange={(v) => updateField('courseId', v)}>
                      <SelectTrigger><SelectValue placeholder="Select a course" /></SelectTrigger>
                      <SelectContent>
                        {COURSES.filter((c) => c.status === 'Active').map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name} — {c.department}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {selectedCourse && (
                    <div className="rounded-lg border border-border bg-slate-50 p-4">
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <span className="font-medium text-foreground">{selectedCourse.name}</span>
                        <span className="text-muted-foreground">{selectedCourse.duration}</span>
                        <span className="font-semibold text-primary">{formatCurrency(selectedCourse.fee)}</span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{selectedCourse.description}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label>City <span className="text-destructive">*</span></Label>
                      <Select value={form.city} onValueChange={(v) => updateField('city', v)}>
                        <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                        <SelectContent>
                          {CITIES.map((c) => (
                            <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Campus <span className="text-destructive">*</span></Label>
                      <Select value={form.campus} onValueChange={(v) => updateField('campus', v)} disabled={!form.city}>
                        <SelectTrigger><SelectValue placeholder="Select campus" /></SelectTrigger>
                        <SelectContent>
                          {availableCampuses.map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Personal Info */}
              {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="mb-1 text-lg font-semibold text-foreground">Personal Information</h2>
                    <p className="text-sm text-muted-foreground">Enter your personal details as they appear on your CNIC.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label>Full Name <span className="text-destructive">*</span></Label>
                      <Input value={form.fullName} onChange={(e) => updateField('fullName', e.target.value)} placeholder="Enter your full name" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Father&rsquo;s Name <span className="text-destructive">*</span></Label>
                      <Input value={form.fatherName} onChange={(e) => updateField('fatherName', e.target.value)} placeholder="Enter father's name" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Date of Birth <span className="text-destructive">*</span></Label>
                      <Input type="date" value={form.dateOfBirth} onChange={(e) => updateField('dateOfBirth', e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>CNIC <span className="text-destructive">*</span></Label>
                      <Input
                        value={form.cnic}
                        onChange={(e) => updateField('cnic', formatCnic(e.target.value))}
                        placeholder="XXXXX-XXXXXXX-X"
                        inputMode="numeric"
                        maxLength={15}
                        autoComplete="off"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Gender <span className="text-destructive">*</span></Label>
                      <Select value={form.gender} onValueChange={(v) => updateField('gender', v)}>
                        <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Mobile Number <span className="text-destructive">*</span></Label>
                      <div className="flex">
                        <span className="inline-flex h-10 items-center rounded-l-md border border-r-0 border-input bg-slate-50 px-3 text-sm font-medium text-muted-foreground">
                          +92
                        </span>
                        <Input
                          className="rounded-l-none"
                          value={formatMobileDigits(form.mobile)}
                          onChange={(e) => {
                            const digits = formatMobileDigits(e.target.value);
                            updateField('mobile', digits ? `+92 ${digits}` : '');
                          }}
                          placeholder="3XXXXXXXXX"
                          inputMode="numeric"
                          maxLength={10}
                          autoComplete="tel-national"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Email <span className="text-destructive">*</span></Label>
                      <Input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} placeholder="you@example.com" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Province</Label>
                      <Select value={form.province} onValueChange={(v) => updateField('province', v)}>
                        <SelectTrigger><SelectValue placeholder="Select province" /></SelectTrigger>
                        <SelectContent>
                          {PROVINCES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label>Address</Label>
                      <Input value={form.address} onChange={(e) => updateField('address', e.target.value)} placeholder="House #, Street, Area" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>City</Label>
                      <Input value={form.applicantCity} onChange={(e) => updateField('applicantCity', e.target.value)} placeholder="Your city" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Postal Address</Label>
                      <Input value={form.postalAddress} onChange={(e) => updateField('postalAddress', e.target.value)} placeholder="Postal code / address" />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Education & Experience + Course-Specific */}
              {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="mb-1 text-lg font-semibold text-foreground">Education & Experience</h2>
                    <p className="text-sm text-muted-foreground">Provide your educational background and work experience.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label>Highest Qualification <span className="text-destructive">*</span></Label>
                      <Input value={form.qualification} onChange={(e) => updateField('qualification', e.target.value)} placeholder="e.g. Bachelor of Science" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Education Level <span className="text-destructive">*</span></Label>
                      <Select value={form.educationLevel} onValueChange={(v) => updateField('educationLevel', v)}>
                        <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                        <SelectContent>
                          {EDUCATION_LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Institution <span className="text-destructive">*</span></Label>
                      <Input value={form.institution} onChange={(e) => updateField('institution', e.target.value)} placeholder="Institution name" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Year of Completion <span className="text-destructive">*</span></Label>
                      <Input value={form.yearOfCompletion} onChange={(e) => updateField('yearOfCompletion', e.target.value)} placeholder="e.g. 2020" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Relevant Experience</Label>
                      <Input value={form.experience} onChange={(e) => updateField('experience', e.target.value)} placeholder="e.g. 5 years" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Current Occupation</Label>
                      <Input value={form.currentOccupation} onChange={(e) => updateField('currentOccupation', e.target.value)} placeholder="e.g. Electrician" />
                    </div>
                  </div>

                  {/* Course-Specific Fields */}
                  {selectedCourse && selectedCourse.specificFields.length > 0 && (
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-5">
                      <div className="mb-4 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <h3 className="text-sm font-semibold text-foreground">
                          Course-Specific Information — {selectedCourse.name}
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {selectedCourse.specificFields.map((field) => (
                          <div key={field.id} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                            <div className="space-y-1.5">
                              <Label>
                                {field.label}
                                {field.required && <span className="text-destructive"> *</span>}
                              </Label>
                              {field.type === 'textarea' ? (
                                <Textarea
                                  value={form.courseSpecific[field.id] || ''}
                                  onChange={(e) => updateCourseSpecific(field.id, e.target.value)}
                                  placeholder={`Enter ${field.label.toLowerCase()}`}
                                  rows={3}
                                />
                              ) : field.type === 'select' ? (
                                <Select
                                  value={form.courseSpecific[field.id] || ''}
                                  onValueChange={(v) => updateCourseSpecific(field.id, v)}
                                >
                                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                  <SelectContent>
                                    {field.options?.map((opt) => (
                                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Input
                                  value={form.courseSpecific[field.id] || ''}
                                  onChange={(e) => updateCourseSpecific(field.id, e.target.value)}
                                  placeholder={`Enter ${field.label.toLowerCase()}`}
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Documents */}
              {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="mb-1 text-lg font-semibold text-foreground">Document Upload</h2>
                    <p className="text-sm text-muted-foreground">
                      Upload the required documents. Accepted formats: PDF, JPG, PNG (max 5MB each).
                    </p>
                  </div>
                  <div className="space-y-4">
                    {DOC_CATEGORIES.map((category) => {
                      const doc = documents.find((d) => d.category === category);
                      return (
                        <div key={category} className="rounded-lg border border-border p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                                doc ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                              }`}>
                                {doc ? <FileCheck2 className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">{category}</p>
                                {doc ? (
                                  <p className="text-xs text-muted-foreground">
                                    {doc.fileName} · {doc.fileType} · {doc.fileSize}
                                  </p>
                                ) : (
                                  <p className="text-xs text-muted-foreground">No file uploaded</p>
                                )}
                              </div>
                            </div>
                            {doc ? (
                              <Button variant="outline" size="sm" onClick={() => removeDocument(doc.id)}>
                                <X className="mr-1 h-3.5 w-3.5" /> Remove
                              </Button>
                            ) : (
                              <Button variant="outline" size="sm" onClick={() => simulateUpload(category)}>
                                <Upload className="mr-1 h-3.5 w-3.5" /> Upload
                              </Button>
                            )}
                          </div>
                          {doc && (
                            <div className="mt-3 flex items-center gap-2 rounded-md bg-success/5 px-3 py-2 text-xs text-success">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Uploaded successfully</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                    <p className="font-medium">Note:</p>
                    <p>Ensure all documents are clearly scanned and legible. Incomplete document submissions may delay your application review.</p>
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {step === 4 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="mb-1 text-lg font-semibold text-foreground">Review Your Application</h2>
                    <p className="text-sm text-muted-foreground">Please review all information before submitting.</p>
                  </div>

                  {/* Course & Location */}
                  <div className="rounded-lg border border-border p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <ClipboardList className="h-4 w-4 text-primary" /> Course & Location
                      </h3>
                      <Button variant="ghost" size="sm" onClick={() => setStep(0)}>Edit</Button>
                    </div>
                    <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                      <div><dt className="text-muted-foreground">Course</dt><dd className="font-medium text-foreground">{selectedCourse?.name || '—'}</dd></div>
                      <div><dt className="text-muted-foreground">Department</dt><dd className="font-medium text-foreground">{selectedCourse?.department || '—'}</dd></div>
                      <div><dt className="text-muted-foreground">City</dt><dd className="font-medium text-foreground">{form.city || '—'}</dd></div>
                      <div><dt className="text-muted-foreground">Campus</dt><dd className="font-medium text-foreground">{form.campus || '—'}</dd></div>
                    </dl>
                  </div>

                  {/* Personal Info */}
                  <div className="rounded-lg border border-border p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <User className="h-4 w-4 text-primary" /> Personal Information
                      </h3>
                      <Button variant="ghost" size="sm" onClick={() => setStep(1)}>Edit</Button>
                    </div>
                    <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                      <div><dt className="text-muted-foreground">Full Name</dt><dd className="font-medium text-foreground">{form.fullName || '—'}</dd></div>
                      <div><dt className="text-muted-foreground">Father&rsquo;s Name</dt><dd className="font-medium text-foreground">{form.fatherName || '—'}</dd></div>
                      <div><dt className="text-muted-foreground">Date of Birth</dt><dd className="font-medium text-foreground">{form.dateOfBirth || '—'}</dd></div>
                      <div><dt className="text-muted-foreground">CNIC</dt><dd className="font-medium text-foreground">{form.cnic || '—'}</dd></div>
                      <div><dt className="text-muted-foreground">Gender</dt><dd className="font-medium text-foreground">{form.gender || '—'}</dd></div>
                      <div><dt className="text-muted-foreground">Mobile</dt><dd className="font-medium text-foreground">{form.mobile || '—'}</dd></div>
                      <div><dt className="text-muted-foreground">Email</dt><dd className="font-medium text-foreground">{form.email || '—'}</dd></div>
                      <div><dt className="text-muted-foreground">Address</dt><dd className="font-medium text-foreground">{form.address || '—'}</dd></div>
                    </dl>
                  </div>

                  {/* Education */}
                  <div className="rounded-lg border border-border p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <GraduationCap className="h-4 w-4 text-primary" /> Education & Experience
                      </h3>
                      <Button variant="ghost" size="sm" onClick={() => setStep(2)}>Edit</Button>
                    </div>
                    <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                      <div><dt className="text-muted-foreground">Qualification</dt><dd className="font-medium text-foreground">{form.qualification || '—'}</dd></div>
                      <div><dt className="text-muted-foreground">Education Level</dt><dd className="font-medium text-foreground">{form.educationLevel || '—'}</dd></div>
                      <div><dt className="text-muted-foreground">Institution</dt><dd className="font-medium text-foreground">{form.institution || '—'}</dd></div>
                      <div><dt className="text-muted-foreground">Year of Completion</dt><dd className="font-medium text-foreground">{form.yearOfCompletion || '—'}</dd></div>
                      <div><dt className="text-muted-foreground">Experience</dt><dd className="font-medium text-foreground">{form.experience || '—'}</dd></div>
                      <div><dt className="text-muted-foreground">Current Occupation</dt><dd className="font-medium text-foreground">{form.currentOccupation || '—'}</dd></div>
                    </dl>
                    {selectedCourse && selectedCourse.specificFields.length > 0 && (
                      <div className="mt-4 border-t border-border pt-4">
                        <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Course-Specific Information</p>
                        <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                          {selectedCourse.specificFields.map((f) => (
                            <div key={f.id}>
                              <dt className="text-muted-foreground">{f.label}</dt>
                              <dd className="font-medium text-foreground">{form.courseSpecific[f.id] || '—'}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    )}
                  </div>

                  {/* Documents */}
                  <div className="rounded-lg border border-border p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Upload className="h-4 w-4 text-primary" /> Documents
                      </h3>
                      <Button variant="ghost" size="sm" onClick={() => setStep(3)}>Edit</Button>
                    </div>
                    {documents.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No documents uploaded.</p>
                    ) : (
                      <ul className="space-y-2">
                        {documents.map((doc) => (
                          <li key={doc.id} className="flex items-center gap-2 text-sm">
                            <FileCheck2 className="h-4 w-4 text-success" />
                            <span className="font-medium text-foreground">{doc.category}</span>
                            <span className="text-muted-foreground">— {doc.fileName}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
                <Button variant="outline" onClick={prevStep} disabled={step === 0}>
                  <ArrowLeft className="mr-1 h-4 w-4" /> Previous
                </Button>
                {step < STEPS.length - 1 ? (
                  <Button onClick={nextStep}>
                    Next <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} size="lg">
                    Submit Application <CheckCircle2 className="ml-1 h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </PublicLayout>
  );
}

export default function ApplyPage() {
  return (
    <Suspense fallback={null}>
      <ApplyForm />
    </Suspense>
  );
}
