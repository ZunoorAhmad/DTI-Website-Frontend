'use client';

import Link from 'next/link';
import {
  ClipboardList,
  FileSearch,
  Upload,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  HelpCircle,
  FileText,
  CreditCard,
  UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PublicLayout } from '@/components/public/PublicLayout';

const STEPS = [
  { icon: ClipboardList, title: 'Select Your Course', description: 'Browse our course directory and select the program that matches your career goals. You can filter by department, duration, and availability.' },
  { icon: FileSearch, title: 'Complete the Application Form', description: 'Fill out the online application with your personal information, educational background, and relevant experience. The form adapts based on your selected course.' },
  { icon: Upload, title: 'Upload Required Documents', description: 'Submit scanned copies of your CNIC, recent photograph, educational certificates, and any other supporting documents through our secure upload portal.' },
  { icon: CheckCircle2, title: 'Submit Your Application', description: 'Review all your information carefully, then submit. You will receive a unique Application ID (e.g., DTI-2026-00125) to track your application status.' },
  { icon: ShieldCheck, title: 'Application Review', description: 'Our admissions team reviews your application within 5-7 working days. You will be notified via email and SMS about the status of your application.' },
];

const REQUIRED_DOCS = [
  { icon: CreditCard, title: 'CNIC Copy', description: 'Scanned copy of your Computerized National Identity Card (both sides)' },
  { icon: UserCheck, title: 'Photograph', description: 'Recent passport-size photograph with white background' },
  { icon: FileText, title: 'Educational Documents', description: 'Copies of your highest qualification certificates and degrees' },
  { icon: FileText, title: 'Experience Certificates', description: 'Any relevant work experience or training certificates (if applicable)' },
];

const FAQS = [
  { q: 'When do admissions open?', a: 'Admissions for the September 2026 intake are currently open. The application deadline is August 31, 2026.' },
  { q: 'How long does the review process take?', a: 'Applications are typically reviewed within 5-7 working days of submission. You will receive updates via email and SMS.' },
  { q: 'Can I apply for multiple courses?', a: 'Yes, you can submit separate applications for different courses. Each application will receive its own unique Application ID.' },
  { q: 'What if I need to change my application after submission?', a: 'You can contact the admissions office with your Application ID to request changes before the review process is complete.' },
  { q: 'Is there an application fee?', a: 'There is no application fee. Course fees are payable only after your application is approved and you confirm enrollment.' },
];

export default function HowToApplyPage() {
  return (
    <PublicLayout>
      <section className="border-b border-border bg-slate-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">How to Apply</h1>
          <p className="mt-2 text-muted-foreground">
            Everything you need to know about the DTI admission process.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {STEPS.map((step, idx) => (
              <div key={step.title} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                    <step.icon className="h-6 w-6" />
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className="mt-2 h-full w-0.5 flex-1 bg-border" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="mb-1 text-xs font-bold text-primary">STEP {idx + 1}</div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Required Documents */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-foreground">Required Documents</h2>
          <p className="mb-8 text-muted-foreground">
            Prepare these documents before starting your application.
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {REQUIRED_DOCS.map((doc) => (
              <Card key={doc.title} className="bg-white">
                <CardContent className="p-6">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <doc.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-1.5 text-sm font-semibold text-foreground">{doc.title}</h3>
                  <p className="text-sm text-muted-foreground">{doc.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <HelpCircle className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <Card key={faq.q}>
                <CardContent className="p-5">
                  <h3 className="mb-2 text-base font-semibold text-foreground">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-12">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white">Ready to Apply?</h2>
          <p className="mt-2 text-primary-foreground/90">
            Start your application now and receive your Application ID in minutes.
          </p>
          <Link href="/apply" className="mt-6 inline-block">
            <Button size="lg" variant="secondary">
              Apply Online <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
