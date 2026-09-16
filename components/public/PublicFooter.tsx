import Link from 'next/link';
import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from 'lucide-react';

const COURSE_LINKS = [
  'Welding Inspector',
  'NEBOSH IGC',
  'Industrial Electrician',
  'PLC with HMI & SCADA',
  'AutoCAD',
];

const QUICK_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Courses', href: '/courses' },
  { label: 'How to Apply', href: '/how-to-apply' },
  { label: 'Apply Online', href: '/apply' },
  { label: 'Contact', href: '/contact' },
];

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold leading-tight text-white">DTI</span>
                <span className="text-[10px] font-medium leading-tight text-slate-400">
                  Descon Technical Institute
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400">
              A premier technical training institute committed to producing skilled
              professionals for Pakistan&rsquo;s industrial and construction sectors.
            </p>
            <div className="flex gap-3">
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-800 text-slate-400 transition-colors hover:bg-primary hover:text-white">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-800 text-slate-400 transition-colors hover:bg-primary hover:text-white">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-800 text-slate-400 transition-colors hover:bg-primary hover:text-white">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Popular Courses</h4>
            <ul className="space-y-2.5">
              {COURSE_LINKS.map((course) => (
                <li key={course}>
                  <Link href="/courses" className="text-sm text-slate-400 transition-colors hover:text-primary">
                    {course}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-slate-400">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>10-KM Ferozepur Road, Lahore, Pakistan</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-slate-400">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <span>+92 42 111 111 111</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-slate-400">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <span>info@dti.edu.pk</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
          <p>&copy; 2026 Descon Technical Institute. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
