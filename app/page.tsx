'use client';

import Link from 'next/link';
import {
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Users,
  BookOpen,
  Building2,
  Award,
  ClipboardList,
  Upload,
  FileSearch,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Briefcase,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PublicLayout } from '@/components/public/PublicLayout';
import { COURSES } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/format';

const STATS = [
  { label: 'Courses Offered', value: '12+', icon: BookOpen },
  { label: 'Students Enrolled', value: '5,800+', icon: Users },
  { label: 'Expert Instructors', value: '45+', icon: Award },
  { label: 'Placement Rate', value: '92%', icon: TrendingUp },
];

const PROCESS_STEPS = [
  { icon: ClipboardList, title: 'Select Course', description: 'Browse and choose from our range of technical and professional courses.' },
  { icon: FileSearch, title: 'Complete Application', description: 'Fill out the online application form with your personal and educational details.' },
  { icon: Upload, title: 'Upload Documents', description: 'Submit required documents including CNIC, photographs, and educational certificates.' },
  { icon: CheckCircle2, title: 'Submit Application', description: 'Review your information and submit your application to receive a tracking ID.' },
  { icon: ShieldCheck, title: 'Application Review', description: 'Our admissions team reviews your application and notifies you of the decision.' },
];

const WHY_CHOOSE = [
  { icon: Award, title: 'Industry-Recognized Certifications', description: 'Courses aligned with international standards including NEBOSH, CSWIP, and IOSH.' },
  { icon: Briefcase, title: 'Job-Ready Skills', description: 'Practical, hands-on training designed to meet real-world industrial requirements.' },
  { icon: Building2, title: 'Modern Facilities', description: 'State-of-the-art workshops and labs equipped with the latest industrial equipment.' },
  { icon: Users, title: 'Experienced Faculty', description: 'Learn from certified instructors with years of field experience in their domains.' },
];

export default function HomePage() {
  const featuredCourses = COURSES.filter((c) => c.status === 'Active').slice(0, 4);

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-slate-50 to-white">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] opacity-50" style={{
          backgroundImage: 'linear-gradient(to right, hsl(214 32% 91%) 1px, transparent 1px), linear-gradient(to bottom, hsl(214 32% 91%) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-success" />
              Admissions Open — September 2026 Intake
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Build Your Future with
              <span className="block text-primary">Technical Excellence</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Descon Technical Institute offers industry-recognized training programs in
              welding, electrical, automation, QHSE, and more. Apply online today and
              take the first step toward a rewarding career.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/apply">
                <Button size="lg" className="w-full sm:w-auto">
                  Apply Online <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Explore Courses
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-border bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Featured Courses</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Explore our most popular training programs designed to launch your career in
              the industrial sector.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredCourses.map((course) => (
              <Card key={course.id} className="group transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <div className="mb-3 inline-flex rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    {course.department}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold leading-snug text-foreground">
                    {course.name}
                  </h3>
                  <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between border-t border-border pt-4 text-sm">
                    <span className="text-muted-foreground">{course.duration}</span>
                    <span className="font-semibold text-foreground">{formatCurrency(course.fee)}</span>
                  </div>
                  <Link href={`/apply?course=${course.id}`}>
                    <Button variant="outline" size="sm" className="mt-4 w-full group-hover:bg-primary group-hover:text-primary-foreground">
                      Apply Now <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/courses">
              <Button variant="outline">
                View All Courses <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Admission Process */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Admission Process</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              A simple five-step process to join DTI. Apply online and track your application
              through our digital platform.
            </p>
          </div>
          <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-5">
            {PROCESS_STEPS.map((step, idx) => (
              <div key={step.title} className="relative text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <step.icon className="h-7 w-7" />
                </div>
                <div className="mb-1 text-xs font-bold text-primary">STEP {idx + 1}</div>
                <h3 className="mb-2 text-base font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
                {idx < PROCESS_STEPS.length - 1 && (
                  <div className="absolute top-8 left-[58%] hidden h-0.5 w-[84%] bg-gradient-to-r from-primary/30 to-transparent lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose DTI */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Why Choose DTI?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              We combine quality education with practical training to produce skilled
              professionals ready for the workforce.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_CHOOSE.map((item) => (
              <Card key={item.title} className="border-border bg-white">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Ready to Start Your Journey?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-primary-foreground/90">
            Join thousands of successful graduates who built their careers with DTI.
            Apply online today.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/apply">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Apply Online <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="w-full border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white sm:w-auto">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-foreground">Visit Us</h3>
              <p className="text-sm text-muted-foreground">
                10-KM Ferozepur Road<br />Lahore, Pakistan
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Phone className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-foreground">Call Us</h3>
              <p className="text-sm text-muted-foreground">
                +92 42 111 111 111<br />Mon - Fri, 9:00 AM - 5:00 PM
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-foreground">Email Us</h3>
              <p className="text-sm text-muted-foreground">
                info@dti.edu.pk<br />admissions@dti.edu.pk
              </p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
