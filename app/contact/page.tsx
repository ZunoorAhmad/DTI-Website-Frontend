'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PublicLayout } from '@/components/public/PublicLayout';
import { toast } from 'sonner';

const CONTACT_INFO = [
  { icon: MapPin, title: 'Address', lines: ['10-KM Ferozepur Road', 'Lahore, Pakistan'] },
  { icon: Phone, title: 'Phone', lines: ['+92 42 111 111 111', '+92 42 111 111 112'] },
  { icon: Mail, title: 'Email', lines: ['info@dti.edu.pk', 'admissions@dti.edu.pk'] },
  { icon: Clock, title: 'Office Hours', lines: ['Monday - Friday', '9:00 AM - 5:00 PM'] },
];

const CAMPUSES = [
  { name: 'Lahore Campus', address: '10-KM Ferozepur Road, Lahore', phone: '+92 42 111 111 111' },
  { name: 'Sadiqabad Campus', address: 'Industrial Estate, Sadiqabad', phone: '+92 68 222 333 444' },
];

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success('Message sent successfully! We will get back to you within 24 hours.');
      (e.target as HTMLFormElement).reset();
    }, 1200);
  };

  return (
    <PublicLayout>
      <section className="border-b border-border bg-slate-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Contact Us</h1>
          <p className="mt-2 text-muted-foreground">
            Get in touch with our admissions team for any questions.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Contact Form */}
            <Card>
              <CardContent className="p-8">
                <h2 className="mb-6 text-xl font-semibold text-foreground">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input id="name" required placeholder="Enter your name" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" required placeholder="you@example.com" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" placeholder="+92 3XX XXXXXXX" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input id="subject" required placeholder="How can we help?" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea id="message" required rows={5} placeholder="Write your message here..." />
                  </div>
                  <Button type="submit" disabled={submitting} className="w-full">
                    {submitting ? 'Sending...' : 'Send Message'}
                    {!submitting && <Send className="ml-2 h-4 w-4" />}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {CONTACT_INFO.map((info) => (
                  <Card key={info.title}>
                    <CardContent className="p-6">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <info.icon className="h-5 w-5" />
                      </div>
                      <h3 className="mb-2 text-sm font-semibold text-foreground">{info.title}</h3>
                      {info.lines.map((line) => (
                        <p key={line} className="text-sm text-muted-foreground">{line}</p>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4 text-sm font-semibold text-foreground">Our Campuses</h3>
                  <div className="space-y-4">
                    {CAMPUSES.map((campus) => (
                      <div key={campus.name} className="flex items-start gap-3 border-b border-border pb-4 last:border-0 last:pb-0">
                        <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{campus.name}</p>
                          <p className="text-sm text-muted-foreground">{campus.address}</p>
                          <p className="text-sm text-muted-foreground">{campus.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
