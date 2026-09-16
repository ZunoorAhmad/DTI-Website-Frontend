'use client';

import { useCallback, useEffect, useLayoutEffect, useState, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  FileText,
  Upload,
  Layers,
  Search,
  ListChecks,
  Users,
  BarChart3,
  Clock,
  Monitor,
  Smartphone,
  IdCard,
  ArrowRight,
  GraduationCap,
  LayoutDashboard,
  MapPin,
  Send,
  CheckCircle2,
  PieChart,
  TrendingUp,
  Building2,
  Settings,
  Briefcase,
  UserCog,
  ClipboardList,
  Network,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const TOTAL = 15;
const W = 1920;
const H = 1080;
const DARK = new Set([0, 11, 13, 14]);

export function ProposalDeck() {
  const [index, setIndex] = useState(0);
  const [scale, setScale] = useState(1);

  const go = useCallback((next: number) => {
    setIndex(Math.min(TOTAL - 1, Math.max(0, next)));
  }, []);

  useLayoutEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / W, window.innerHeight / H));
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        setIndex((i) => Math.min(TOTAL - 1, i + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || e.key === 'Backspace') {
        e.preventDefault();
        setIndex((i) => Math.max(0, i - 1));
      } else if (e.key === 'Home') {
        e.preventDefault();
        go(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        go(TOTAL - 1);
      } else if (e.key.toLowerCase() === 'f') {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
        else document.exitFullscreen?.();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  const slides = [
    <CoverSlide />,
    <WhoWeAreSlide />,
    <TeamSlide />,
    <ChallengeSlide />,
    <SolutionSlide />,
    <FlowSlide />,
    <FeaturesSlide />,
    <DashboardSlide />,
    <InsightsSlide />,
    <DtiBenefitsSlide />,
    <StudentBenefitsSlide />,
    <GrowthSlide />,
    <PrototypeSlide />,
    <WalkthroughSlide />,
    <ClosingSlide />,
  ];

  const dark = DARK.has(index);

  return (
    <div
      className="flex h-screen w-screen select-none items-center justify-center overflow-hidden bg-[#070b12]"
      onClick={() => setIndex((i) => Math.min(TOTAL - 1, i + 1))}
      onContextMenu={(e) => {
        e.preventDefault();
        setIndex((i) => Math.max(0, i - 1));
      }}
    >
      <div
        className="relative overflow-hidden"
        style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: 'center center' }}
      >
        <div key={index} className="h-full w-full">
          {slides[index]}
        </div>

        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between px-20 pb-6 text-[12px]"
          style={{ color: dark ? 'rgba(255,255,255,0.42)' : '#8a97a6' }}
        >
          <span>Visible Winner · Descon Technical Institute</span>
          <div className="flex items-center gap-4">
            <span className="tracking-wide">← → · F</span>
            <span className="tabular-nums" style={{ color: dark ? 'rgba(255,255,255,0.7)' : '#5c6b7c' }}>
              {String(index + 1).padStart(2, '0')} / {TOTAL}
            </span>
          </div>
        </div>
        <div className="proposal-progress z-20" style={{ width: `${((index + 1) / TOTAL) * 100}%` }} />
      </div>
    </div>
  );
}

function Pad({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('relative flex h-full w-full flex-col px-20 pb-16 pt-14', className)}>{children}</div>;
}

function Eyebrow({ children, light, n }: { children: ReactNode; light?: boolean; n?: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      {n && (
        <span className="text-[12px] font-semibold tabular-nums tracking-[0.22em]" style={{ color: light ? 'var(--accent)' : 'var(--primary)' }}>
          {n}
        </span>
      )}
      {n && <span className="h-px w-8" style={{ background: light ? 'rgba(255,255,255,0.25)' : 'var(--line)' }} />}
      <p
        className="text-[12px] font-semibold uppercase tracking-[0.22em]"
        style={{ color: light ? 'rgba(255,255,255,0.55)' : 'var(--muted)' }}
      >
        {children}
      </p>
    </div>
  );
}

function Title({ children, light, className }: { children: ReactNode; light?: boolean; className?: string }) {
  return (
    <h1
      className={cn('max-w-[1100px] text-[42px] font-semibold leading-[1.15] tracking-tight', className)}
      style={{ color: light ? '#fff' : 'var(--ink)' }}
    >
      {children}
    </h1>
  );
}

function IconBox({ icon: Icon, dark }: { icon: LucideIcon; dark?: boolean }) {
  return (
    <div
      className="flex h-12 w-12 items-center justify-center rounded-xl"
      style={{
        background: dark ? 'rgba(255,255,255,0.08)' : 'var(--primary-soft)',
        color: dark ? '#fff' : 'var(--primary)',
      }}
    >
      <Icon className="h-5 w-5" strokeWidth={1.75} />
    </div>
  );
}

function CountUp({ value }: { value: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 900);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{n.toLocaleString('en-US')}</>;
}

function AreaSpark({ values, id }: { values: number[]; id: string }) {
  const w = 440;
  const h = 168;
  const padX = 8;
  const padY = 12;
  const max = Math.max(...values);
  const min = Math.min(...values) * 0.72;
  const pts = values.map((v, i) => {
    const x = padX + (i * (w - padX * 2)) / (values.length - 1);
    const y = h - padY - ((v - min) / (max - min)) * (h - padY * 2);
    return [x, y] as const;
  });
  const line = `M ${pts.map(([x, y]) => `${x},${y}`).join(' L ')}`;
  const area = `M ${pts[0][0]},${h - padY} L ${pts.map(([x, y]) => `${x},${y}`).join(' L ')} L ${pts[pts.length - 1][0]},${h - padY} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1A7A9C" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#1A7A9C" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} className="d-in d2" />
      <path d={line} fill="none" stroke="#1A7A9C" strokeWidth="2.75" strokeLinecap="round" className="d-draw" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="4.5" fill="#1A7A9C" className="d-scale d6" />
    </svg>
  );
}

function CoverSlide() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[var(--ink)] text-white">
      <img src="/presentation/campus.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(105deg, rgba(11,22,40,0.97) 0%, rgba(11,22,40,0.92) 42%, rgba(11,22,40,0.55) 68%, rgba(11,22,40,0.28) 100%)',
        }}
      />
      <div className="absolute left-0 top-0 h-full w-[7px] bg-[var(--primary)]" />
      <div className="absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full opacity-30" style={{ background: 'radial-gradient(circle, #1A7A9C 0%, transparent 70%)' }} />

      <Pad className="justify-between">
        <div className="d-in flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-[13px] font-bold tracking-tight text-[var(--ink)]">
            VW
          </div>
          <span className="text-[15px] font-medium tracking-wide text-white/80">Visible Winner</span>
        </div>

        <div className="grid grid-cols-[1.05fr_0.95fr] items-end gap-10">
          <div className="pb-6">
            <div className="d-up">
              <Eyebrow light>A proposal for Descon Technical Institute</Eyebrow>
            </div>
            <h1 className="d-up d2 max-w-[820px] text-[58px] font-semibold leading-[1.08] tracking-tight text-white">
              Centralizing the Admissions System of DTI
            </h1>
            <p className="d-up d3 mt-7 max-w-[640px] text-[20px] leading-relaxed text-white/70">
              A Digital Admission Management Platform for a Faster, Smarter & More Organized Admission Process
            </p>
            <div className="d-up d4 mt-10 h-[2px] w-16 bg-[var(--accent)]" />
          </div>

          <div className="relative h-[430px]">
            <div className="d-right d3 proposal-card absolute left-8 top-6 w-[280px] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">Online application</p>
              <p className="mt-3 text-[15px] font-semibold text-[var(--ink)]">Welding Inspector</p>
              <div className="mt-4 h-2 rounded-full bg-[var(--paper)]">
                <div className="d-width d6 h-2 w-[70%] rounded-full bg-[var(--primary)]" />
              </div>
            </div>
            <div className="d-right d5 proposal-card absolute right-0 top-[148px] w-[250px] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">Dashboard</p>
              <p className="mt-3 text-[28px] font-semibold tabular-nums text-[var(--ink)]">2,486</p>
              <p className="text-[13px] text-[var(--muted)]">Total Applications</p>
            </div>
            <div className="d-right d7 proposal-card absolute bottom-2 left-16 w-[300px] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">Analytics</p>
              <div className="mt-2 h-[72px]">
                <AreaSpark values={[38, 44, 41, 52, 48, 61, 58, 72]} id="coverSpark" />
              </div>
            </div>
          </div>
        </div>

        <div className="d-in d6 flex items-end justify-between pb-2">
          <div>
            <p className="text-[13px] text-white/45">Presented by</p>
            <p className="mt-1 text-[16px] font-medium text-white">Visible Winner</p>
          </div>
          <p className="text-[13px] text-white/45">DTI Head Office · September 2026</p>
        </div>
      </Pad>
    </div>
  );
}

function WhoWeAreSlide() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[var(--paper)]">
      <div className="proposal-grid absolute inset-0 opacity-80" />
      <div className="absolute right-0 top-0 h-full w-[38%] bg-[var(--ink)]" />
      <Pad>
        <div className="d-up">
          <Eyebrow>Introduction</Eyebrow>
          <Title>Who We Are</Title>
        </div>
        <div className="relative mt-10 grid flex-1 grid-cols-[1.15fr_0.85fr] items-center gap-16">
          <div className="relative flex h-full flex-col justify-center">
            <p className="pointer-events-none absolute -bottom-6 left-0 whitespace-nowrap text-[88px] font-semibold tracking-tight text-[var(--ink)] opacity-[0.05]">
              VISIBLE WINNER
            </p>
            <div className="d-up d2 relative mb-8 flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--ink)] text-[18px] font-bold text-white shadow-[var(--shadow)]">
                VW
              </div>
              <div>
                <p className="text-[32px] font-semibold tracking-tight text-[var(--ink)]">Visible Winner</p>
                <p className="text-[15px] text-[var(--muted)]">Product & software partner</p>
              </div>
            </div>
            <p className="d-up d3 relative max-w-[640px] text-[20px] leading-relaxed text-[var(--muted)]">
              We design and build practical digital systems that help institutions organize operations, serve people more clearly, and make better decisions.
            </p>
          </div>
          <div className="d-right d3 relative z-10 rounded-2xl border border-white/10 bg-white/[0.06] p-10 text-white backdrop-blur-sm">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-white/45">Today’s purpose</p>
            <p className="mt-6 text-[26px] font-semibold leading-snug">
              Present a centralized digital admissions platform for DTI — and show how it can work.
            </p>
            <div className="mt-8 h-[2px] w-12 bg-[var(--accent)]" />
          </div>
        </div>
      </Pad>
    </div>
  );
}

function TeamSlide() {
  const team = [
    { n: '01', initials: 'AK', name: 'Ali Kamran', role: 'CEO', focus: 'Business leadership' },
    { n: '02', initials: 'ZA', name: 'Zunoor Ahmad', role: 'Senior Full Stack Developer', focus: 'Product development' },
    { n: '03', initials: 'HM', name: 'Hassan Mustafa', role: 'Senior Software Engineer', focus: 'Engineering' },
  ];
  return (
    <div className="h-full w-full bg-white">
      <Pad>
        <div className="d-up">
          <Eyebrow>The people</Eyebrow>
          <Title>The Team Behind the Solution</Title>
          <p className="mt-4 max-w-[760px] text-[18px] text-[var(--muted)]">
            Business leadership, product development, and engineering — aligned around one admissions platform for DTI.
          </p>
        </div>
        <div className="relative mt-16 grid flex-1 grid-cols-3 gap-8">
          <div className="absolute left-[16%] right-[16%] top-[86px] hidden h-px bg-[var(--line)] lg:block" />
          {team.map((member, i) => (
            <div key={member.name} className={cn('proposal-card relative flex flex-col p-9', 'd-up', `d${i + 2}`)}>
              <span className="absolute right-8 top-8 text-[13px] font-semibold tabular-nums tracking-[0.18em] text-[var(--primary)]">
                {member.n}
              </span>
              <div
                className="flex h-[84px] w-[84px] items-center justify-center rounded-full text-[20px] font-semibold text-white"
                style={{ background: 'linear-gradient(145deg, #1A7A9C 0%, #0B1628 100%)', boxShadow: '0 0 0 6px #E7F4F8' }}
              >
                {member.initials}
              </div>
              <p className="mt-8 text-[24px] font-semibold text-[var(--ink)]">{member.name}</p>
              <p className="mt-2 text-[15px] font-medium text-[var(--primary)]">{member.role}</p>
              <p className="mt-6 text-[14px] text-[var(--muted)]">{member.focus}</p>
            </div>
          ))}
        </div>
      </Pad>
    </div>
  );
}

function ChallengeSlide() {
  const current = [
    { icon: GraduationCap, t: 'Applicant' },
    { icon: ClipboardList, t: 'Forms / Different sources' },
    { icon: Layers, t: 'Scattered information' },
    { icon: Search, t: 'Difficult management' },
  ];
  const next = [
    { icon: GraduationCap, t: 'Applicant' },
    { icon: LayoutDashboard, t: 'DTI Admission System' },
    { icon: Layers, t: 'Organized information' },
    { icon: CheckCircle2, t: 'Better management' },
  ];
  return (
    <div className="h-full w-full bg-[var(--paper)]">
      <Pad>
        <div className="d-up max-w-[1100px]">
          <Eyebrow n="01">The situation</Eyebrow>
          <Title>The Admission Process Needs to Be Centralized</Title>
          <p className="mt-5 text-[17px] leading-relaxed text-[var(--muted)]">
            When admissions are handled through manual processes and external forms, information can become scattered — making it harder to manage applications, search records, monitor status, and generate useful insights.
          </p>
          <p className="mt-4 text-[17px] font-medium text-[var(--ink)]">
            DTI needs one centralized system where admissions information can be collected, managed, monitored and analyzed from one place.
          </p>
        </div>

        <div className="mt-10 grid flex-1 grid-cols-2 gap-8">
          <div className="d-left d3 rounded-2xl border border-[var(--line)] bg-white p-8 shadow-[var(--shadow)]">
            <p className="mb-6 text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Today</p>
            <div className="space-y-3">
              {current.map((s, i) => (
                <div
                  key={s.t}
                  className={cn('d-up flex items-center gap-4 rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3', `d${i + 3}`)}
                  style={{ transform: `translateX(${i * 10}px)` }}
                >
                  <s.icon className="h-4 w-4 text-[var(--muted)]" strokeWidth={1.75} />
                  <span className="text-[15px] font-medium text-[var(--ink)]">{s.t}</span>
                  {i < current.length - 1 && <ArrowRight className="ml-auto h-4 w-4 text-[var(--line)]" />}
                </div>
              ))}
            </div>
          </div>
          <div className="d-right d3 rounded-2xl bg-[var(--ink)] p-8 text-white shadow-[var(--shadow-lg)]">
            <p className="mb-6 text-[12px] font-semibold uppercase tracking-[0.18em] text-white/40">With a centralized system</p>
            <div className="space-y-3">
              {next.map((s, i) => (
                <div key={s.t} className={cn('d-up flex items-center gap-4 rounded-xl bg-white/10 px-4 py-3', `d${i + 3}`)}>
                  <s.icon className="h-4 w-4 text-[var(--accent)]" strokeWidth={1.75} />
                  <span className="text-[15px] font-medium">{s.t}</span>
                  {i < next.length - 1 && <ArrowRight className="ml-auto h-4 w-4 text-white/20" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Pad>
    </div>
  );
}

function SolutionSlide() {
  const nodes = [
    { label: 'Students / Applicants', icon: GraduationCap, a: -90 },
    { label: 'Applications', icon: FileText, a: -38 },
    { label: 'Courses', icon: BookOpen, a: 14 },
    { label: 'Staff', icon: UserCog, a: 66 },
    { label: 'Student Records', icon: Users, a: 118 },
    { label: 'Reports', icon: BarChart3, a: 170 },
    { label: 'Management', icon: Briefcase, a: -142 },
  ];
  const r = 220;
  return (
    <div className="h-full w-full bg-white">
      <Pad>
        <div className="d-up">
          <Eyebrow n="02">The proposal</Eyebrow>
          <Title>Our Solution</Title>
          <p className="mt-3 text-[22px] font-medium text-[var(--ink)]">
            A Centralized Digital Admission Management System for DTI
          </p>
          <p className="mt-3 max-w-[920px] text-[16px] text-[var(--muted)]">
            The platform brings the complete admission process into one environment — from course selection and application to review, records, and management insight.
          </p>
        </div>

        <div className="relative mx-auto mt-2 h-[520px] w-[860px]">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 860 520">
            <circle cx="430" cy="260" r="220" fill="none" stroke="#E3E9EF" strokeDasharray="5 7" />
            {nodes.map((n) => {
              const rad = (n.a * Math.PI) / 180;
              const x = 430 + Math.cos(rad) * r;
              const y = 260 + Math.sin(rad) * r;
              return (
                <line
                  key={n.label}
                  x1="430"
                  y1="260"
                  x2={x}
                  y2={y}
                  stroke="#1A7A9C"
                  strokeOpacity="0.28"
                  strokeWidth="1.5"
                  className="d-draw"
                />
              );
            })}
          </svg>
          <div className="d-scale absolute left-1/2 top-1/2 z-10 flex h-[148px] w-[210px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-[var(--ink)] px-6 text-center text-[16px] font-semibold leading-snug text-white shadow-[var(--shadow-lg)]">
            DTI Digital Admission System
          </div>
          {nodes.map((n, i) => {
            const rad = (n.a * Math.PI) / 180;
            const x = Math.cos(rad) * r;
            const y = Math.sin(rad) * r;
            return (
              <div
                key={n.label}
                className={cn('d-scale proposal-card absolute flex w-[156px] -translate-x-1/2 -translate-y-1/2 flex-col items-center px-3 py-3', `d${i + 2}`)}
                style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
              >
                <n.icon className="mb-1.5 h-4 w-4 text-[var(--primary)]" strokeWidth={1.75} />
                <span className="text-center text-[12px] font-semibold leading-snug text-[var(--ink)]">{n.label}</span>
              </div>
            );
          })}
        </div>
        <p className="d-up d6 text-center text-[16px] font-medium text-[var(--ink)]">
          One system. One source of admission information. Better visibility.
        </p>
      </Pad>
    </div>
  );
}

function FlowSlide() {
  const steps = [
    { n: '01', t: 'Select Course', icon: BookOpen },
    { n: '02', t: 'Choose City / Campus', icon: MapPin },
    { n: '03', t: 'Complete Application', icon: FileText },
    { n: '04', t: 'Upload Documents', icon: Upload },
    { n: '05', t: 'Submit Application', icon: Send },
    { n: '06', t: 'DTI Reviews Application', icon: Search },
    { n: '07', t: 'Application Status Updated', icon: ListChecks },
  ];
  return (
    <div className="h-full w-full bg-[var(--paper)]">
      <Pad>
        <div className="d-up">
          <Eyebrow>The journey</Eyebrow>
          <Title>From Application to Admission — One Centralized Flow</Title>
        </div>
        <div className="relative mt-20 flex flex-1 items-start">
          <div className="absolute left-[6%] right-[6%] top-[34px] h-[2px] bg-[var(--line)]" />
          <div className="d-width d3 absolute left-[6%] top-[34px] h-[2px] w-[88%] bg-[var(--primary)]" />
          <div className="grid w-full grid-cols-7 gap-4">
            {steps.map((s, i) => (
              <div key={s.n} className={cn('d-up relative flex flex-col items-center text-center', `d${i + 2}`)}>
                <div className="relative z-10 flex h-[68px] w-[68px] items-center justify-center rounded-full bg-[var(--ink)] text-white shadow-[var(--shadow)]">
                  <s.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <p className="mt-5 text-[13px] font-semibold tabular-nums tracking-[0.16em] text-[var(--primary)]">{s.n}</p>
                <p className="mt-2 max-w-[150px] text-[15px] font-semibold leading-snug text-[var(--ink)]">{s.t}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="d-up d6 pt-4 text-[15px] text-[var(--muted)]">
          The applicant journey stays the same. The information now lives in one place from start to review.
        </p>
      </Pad>
    </div>
  );
}

function FeaturesSlide() {
  const features = [
    { icon: BookOpen, title: 'Online Course Registration', text: 'Students select a course and begin admission online.' },
    { icon: FileText, title: 'Dynamic Application Forms', text: 'Application fields can adapt to the selected course.' },
    { icon: Upload, title: 'Document Management', text: 'Required documents are provided digitally, in one file.' },
    { icon: Layers, title: 'Centralized Applications', text: 'All applications sit in one organized system.' },
    { icon: Search, title: 'Advanced Search & Filters', text: 'Find records by course, city, campus, status, details and dates.' },
    { icon: ListChecks, title: 'Application Status Management', text: 'Track New, Under Review, Approved and Rejected.' },
    { icon: Users, title: 'Student & Course Management', text: 'Maintain student records and course information together.' },
    { icon: BarChart3, title: 'Reports & Analytics', text: 'See admission activity through dashboards and reports.' },
  ];
  return (
    <div className="h-full w-full bg-white">
      <Pad>
        <div className="d-up">
          <Eyebrow>The platform</Eyebrow>
          <Title>Key Features</Title>
        </div>
        <div className="mt-10 grid flex-1 grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div key={f.title} className={cn('proposal-card flex flex-col p-7', 'd-up', `d${(i % 8) + 2}`)}>
              <IconBox icon={f.icon} />
              <p className="mt-6 text-[17px] font-semibold leading-snug text-[var(--ink)]">{f.title}</p>
              <p className="mt-3 text-[14px] leading-relaxed text-[var(--muted)]">{f.text}</p>
            </div>
          ))}
        </div>
      </Pad>
    </div>
  );
}

function DashboardSlide() {
  const kpis = [
    { l: 'Total Applications', v: 2486 },
    { l: 'New', v: 342 },
    { l: 'Under Review', v: 386 },
    { l: 'Approved', v: 1420 },
    { l: 'Rejected', v: 118 },
    { l: 'Total Students', v: 5840 },
  ];
  const courses = [
    { n: 'Welding Inspector', w: '92%' },
    { n: 'NEBOSH IGC', w: '82%' },
    { n: 'Industrial Electrician', w: '70%' },
    { n: 'PLC / SCADA', w: '56%' },
  ];
  const cities = [
    { n: 'Lahore', w: '88%' },
    { n: 'Sadiqabad', w: '62%' },
    { n: 'Islamabad', w: '55%' },
    { n: 'Karachi', w: '48%' },
  ];
  return (
    <div className="h-full w-full bg-[var(--paper)]">
      <Pad>
        <div className="d-up flex items-end justify-between">
          <div>
            <Eyebrow n="03">For management</Eyebrow>
            <Title>A Dashboard Built for DTI Management</Title>
          </div>
          <p className="mb-1 rounded-full border border-[var(--line)] bg-white px-4 py-1.5 text-[12px] text-[var(--muted)]">
            Illustrative dashboard data for discussion
          </p>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-[var(--shadow-lg)]">
          <div className="flex items-center gap-2 border-b border-[var(--line)] bg-[var(--paper)] px-5 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#E8B4B4]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#E8D9A8]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#B8D4C2]" />
            <span className="ml-3 text-[12px] text-[var(--muted)]">DTI Admissions · Overview</span>
          </div>

          <div className="grid grid-cols-6 gap-3 p-5">
            {kpis.map((k, i) => (
              <div key={k.l} className={cn('rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3', 'd-up', `d${i + 1}`)}>
                <p className="text-[11px] text-[var(--muted)]">{k.l}</p>
                <p className="mt-1 text-[24px] font-semibold tabular-nums text-[var(--ink)]">
                  <CountUp value={k.v} />
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 px-5">
            <div className="rounded-xl border border-[var(--line)] p-5">
              <p className="text-[14px] font-semibold text-[var(--ink)]">Applications over time</p>
              <div className="mt-2 h-[150px]">
                <AreaSpark values={[38, 44, 41, 52, 48, 61, 58, 72]} id="dashArea" />
              </div>
              <div className="flex justify-between text-[11px] text-[var(--muted)]">
                <span>Jan</span>
                <span>Aug</span>
              </div>
            </div>
            <div className="rounded-xl border border-[var(--line)] p-5">
              <p className="text-[14px] font-semibold text-[var(--ink)]">Applications by course</p>
              <div className="mt-4 space-y-3">
                {courses.map((c, i) => (
                  <div key={c.n}>
                    <p className="mb-1 text-[12px] text-[var(--muted)]">{c.n}</p>
                    <div className="h-2 overflow-hidden rounded-full bg-[var(--paper)]">
                      <div className={cn('d-width h-2 rounded-full bg-[var(--ink)]', `d${i + 3}`)} style={{ width: c.w }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-[var(--line)] p-5">
              <p className="text-[14px] font-semibold text-[var(--ink)]">Applications by city</p>
              <div className="mt-4 space-y-3">
                {cities.map((c, i) => (
                  <div key={c.n}>
                    <p className="mb-1 text-[12px] text-[var(--muted)]">{c.n}</p>
                    <div className="h-2 overflow-hidden rounded-full bg-[var(--paper)]">
                      <div className={cn('d-width h-2 rounded-full bg-[var(--primary)]', `d${i + 3}`)} style={{ width: c.w }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 p-5">
            <div className="flex items-center gap-5 rounded-xl border border-[var(--line)] px-5 py-4">
              <StatusDonut />
              <div className="flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">Status breakdown</p>
                <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[12px] text-[var(--muted)]">
                  <span>Approved <b className="text-[var(--ink)]">1,420</b></span>
                  <span>Review <b className="text-[var(--ink)]">386</b></span>
                  <span>New <b className="text-[var(--ink)]">342</b></span>
                  <span>Rejected <b className="text-[var(--ink)]">118</b></span>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-[var(--line)] px-5 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">Trending course</p>
              <p className="mt-2 text-[18px] font-semibold text-[var(--ink)]">Welding Inspector</p>
              <p className="mt-1 flex items-center gap-1.5 text-[14px] text-[var(--primary)]">
                <TrendingUp className="h-4 w-4" /> +18% applications vs last month
              </p>
            </div>
            <div className="rounded-xl border border-[var(--line)] px-5 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">Application trend</p>
              <p className="mt-2 text-[18px] font-semibold text-[var(--ink)]">This month · +12.8%</p>
              <p className="mt-1 text-[14px] text-[var(--muted)]">Compared with last month</p>
            </div>
          </div>
        </div>
      </Pad>
    </div>
  );
}

function StatusDonut() {
  const r = 28;
  const c = 2 * Math.PI * r;
  const segs = [
    { p: 0.571, color: '#1A7A9C' },
    { p: 0.155, color: '#0B1628' },
    { p: 0.138, color: '#C4964A' },
    { p: 0.047, color: '#94A3B8' },
  ];
  let offset = 0;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" className="d-scale d3 shrink-0">
      <circle cx="36" cy="36" r={r} fill="none" stroke="#E3E9EF" strokeWidth="8" />
      {segs.map((s, i) => {
        const dash = s.p * c;
        const el = (
          <circle
            key={i}
            cx="36"
            cy="36"
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth="8"
            strokeDasharray={`${dash} ${c - dash}`}
            strokeDashoffset={-offset}
            transform="rotate(-90 36 36)"
            strokeLinecap="butt"
          />
        );
        offset += dash;
        return el;
      })}
    </svg>
  );
}

function InsightsSlide() {
  const questions = [
    { q: 'Which courses are most popular?', a: 'Course application ranking' },
    { q: 'Which cities generate the most applications?', a: 'City-based application analytics' },
    { q: 'Are applications increasing or decreasing?', a: 'Weekly and monthly trends' },
    { q: 'Which applications require attention?', a: 'New / Under Review tracking' },
    { q: 'What changed compared to last month?', a: 'Period-over-period comparison' },
  ];
  const cities = [
    { n: 'Lahore', w: '88%' },
    { n: 'Sadiqabad', w: '62%' },
    { n: 'Islamabad', w: '55%' },
    { n: 'Karachi', w: '48%' },
  ];
  return (
    <div className="h-full w-full bg-white">
      <Pad>
        <div className="d-up">
          <Eyebrow>Decision support</Eyebrow>
          <Title>Turn Admission Data Into Useful Insights</Title>
        </div>
        <div className="mt-8 grid flex-1 grid-cols-[1.05fr_0.95fr] gap-8">
          <div className="space-y-3">
            {questions.map((item, i) => (
              <div key={item.q} className={cn('d-left flex items-center justify-between gap-4 rounded-xl border border-[var(--line)] bg-[var(--paper)] px-6 py-4', `d${i + 2}`)}>
                <p className="text-[15px] font-medium text-[var(--ink)]">{item.q}</p>
                <p className="shrink-0 text-[13px] text-[var(--muted)]">{item.a}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-rows-[auto_auto_1fr] gap-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Illustrative dashboard data</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="d-up d2 rounded-2xl border border-[var(--line)] p-5">
                <p className="text-[12px] text-[var(--muted)]">Last month</p>
                <p className="mt-2 text-[32px] font-semibold tabular-nums text-[var(--ink)]">1,120</p>
                <p className="text-[12px] text-[var(--muted)]">applications</p>
              </div>
              <div className="d-up d3 rounded-2xl border border-[var(--line)] p-5">
                <p className="text-[12px] text-[var(--muted)]">This month</p>
                <p className="mt-2 text-[32px] font-semibold tabular-nums text-[var(--ink)]">1,340</p>
                <p className="text-[12px] text-[var(--muted)]">applications</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="d-scale d4 flex flex-col justify-between rounded-2xl bg-[var(--ink)] p-6 text-white">
                <p className="text-[12px] text-white/50">Growth</p>
                <p className="text-[52px] font-semibold leading-none">+19.6%</p>
                <div className="h-[56px]">
                  <AreaSpark values={[38, 44, 41, 52, 48, 61, 58, 72]} id="insSpark" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="d-up d5 rounded-2xl border border-[var(--line)] p-5">
                  <p className="text-[12px] text-[var(--muted)]">Most trending course</p>
                  <p className="mt-2 text-[18px] font-semibold text-[var(--ink)]">Welding Inspector</p>
                </div>
                <div className="d-up d6 rounded-2xl border border-[var(--line)] p-5">
                  <p className="mb-3 text-[12px] text-[var(--muted)]">Applications by City</p>
                  <div className="space-y-2">
                    {cities.map((c) => (
                      <div key={c.n} className="flex items-center gap-2">
                        <span className="w-20 text-[11px] text-[var(--muted)]">{c.n}</span>
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--paper)]">
                          <div className="d-width h-1.5 rounded-full bg-[var(--primary)]" style={{ width: c.w }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Pad>
    </div>
  );
}

function DtiBenefitsSlide() {
  const cols = [
    {
      icon: Layers,
      title: 'Better Management',
      items: ['Centralized application records', 'Faster access to information', 'Easier application tracking', 'Organized student data'],
    },
    {
      icon: PieChart,
      title: 'Better Decision Making',
      items: ['Course popularity insights', 'City-wise application trends', 'Application performance', 'Management reports'],
    },
    {
      icon: Settings,
      title: 'Better Operations',
      items: ['Less manual handling', 'Easier application review', 'Staff work from one system', 'Structured admission workflow'],
    },
  ];
  return (
    <div className="h-full w-full bg-[var(--paper)]">
      <Pad>
        <div className="d-up">
          <Eyebrow>Value for the institute</Eyebrow>
          <Title>How This Helps DTI</Title>
        </div>
        <div className="mt-12 grid flex-1 grid-cols-3 gap-7">
          {cols.map((col, i) => (
            <div key={col.title} className={cn('proposal-card relative overflow-hidden p-9', 'd-up', `d${i + 2}`)}>
              <div className="absolute left-0 top-0 h-1 w-full" style={{ background: i === 1 ? 'var(--accent)' : 'var(--primary)' }} />
              <IconBox icon={col.icon} />
              <p className="mt-8 text-[22px] font-semibold text-[var(--ink)]">{col.title}</p>
              <ul className="mt-6 space-y-4">
                {col.items.map((item) => (
                  <li key={item} className="flex gap-3 text-[15px] text-[var(--muted)]">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--primary)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Pad>
    </div>
  );
}

function StudentBenefitsSlide() {
  const items = [
    { icon: FileText, t: 'Simple', d: 'Apply online instead of relying on manual processes.' },
    { icon: Monitor, t: 'Accessible', d: 'Complete the application from desktop or mobile.' },
    { icon: Layers, t: 'Organized', d: 'Personal information, course details and documents in one application.' },
    { icon: IdCard, t: 'Transparent', d: 'Receive an application ID, with status tracking available through the system in the future.' },
    { icon: Clock, t: 'Faster experience', d: 'A structured digital process makes the journey easier to follow.' },
  ];
  return (
    <div className="h-full w-full bg-white">
      <Pad>
        <div className="d-up">
          <Eyebrow>The applicant experience</Eyebrow>
          <Title>A Better Admission Experience for Students</Title>
        </div>
        <div className="mt-8 grid flex-1 grid-cols-[0.92fr_1.08fr] gap-10">
          <div className="d-left d2 relative overflow-hidden rounded-2xl shadow-[var(--shadow-lg)]">
            <img src="/presentation/workshop.jpg" alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 flex items-center gap-2 text-[13px] text-white/80">
              <Smartphone className="h-4 w-4" /> Desktop and mobile
            </div>
          </div>
          <div className="grid grid-rows-5 gap-3">
            {items.map((item, i) => (
              <div key={item.t} className={cn('proposal-card flex items-start gap-4 px-6 py-4', 'd-right', `d${i + 2}`)}>
                <IconBox icon={item.icon} />
                <div>
                  <p className="text-[17px] font-semibold text-[var(--ink)]">{item.t}</p>
                  <p className="mt-1 text-[14px] leading-relaxed text-[var(--muted)]">{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Pad>
    </div>
  );
}

function GrowthSlide() {
  const around = [
    { t: 'Centralized Student Records', icon: Users, a: -90 },
    { t: 'Advanced Reporting', icon: BarChart3, a: -38 },
    { t: 'Course Management', icon: BookOpen, a: 14 },
    { t: 'Staff Management', icon: UserCog, a: 66 },
    { t: 'Multi-Campus Management', icon: Building2, a: 118 },
    { t: 'Admission Analytics', icon: PieChart, a: 170 },
    { t: 'Future System Integrations', icon: Network, a: -142 },
  ];
  const r = 240;
  return (
    <div className="relative h-full w-full overflow-hidden bg-[var(--ink)] text-white">
      <div className="absolute -left-20 top-20 h-[380px] w-[380px] rounded-full opacity-25" style={{ background: 'radial-gradient(circle, #1A7A9C, transparent 70%)' }} />
      <div className="absolute -right-10 bottom-10 h-[300px] w-[300px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #C4964A, transparent 70%)' }} />
      <Pad>
        <div className="d-up">
          <Eyebrow light>Looking ahead</Eyebrow>
          <Title light>Built as the Foundation for DTI&rsquo;s Digital Admissions</Title>
        </div>
        <div className="relative mx-auto h-[620px] w-[980px]">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 980 620">
            <circle cx="490" cy="310" r="240" fill="none" stroke="rgba(255,255,255,0.12)" strokeDasharray="4 8" />
            {around.map((n) => {
              const rad = (n.a * Math.PI) / 180;
              return (
                <line
                  key={n.t}
                  x1="490"
                  y1="310"
                  x2={490 + Math.cos(rad) * r}
                  y2={310 + Math.sin(rad) * r}
                  stroke="rgba(26,122,156,0.55)"
                  strokeWidth="1.5"
                  className="d-draw"
                />
              );
            })}
          </svg>
          <div className="d-scale absolute left-1/2 top-1/2 z-10 flex h-[150px] w-[250px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-white px-6 text-center text-[16px] font-semibold leading-snug text-[var(--ink)] shadow-[var(--shadow-lg)]">
            DTI Digital Admission Platform
          </div>
          {around.map((n, i) => {
            const rad = (n.a * Math.PI) / 180;
            return (
              <div
                key={n.t}
                className={cn('d-scale absolute flex w-[200px] -translate-x-1/2 -translate-y-1/2 items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm', `d${i + 2}`)}
                style={{ left: `calc(50% + ${Math.cos(rad) * r}px)`, top: `calc(50% + ${Math.sin(rad) * r}px)` }}
              >
                <n.icon className="h-4 w-4 shrink-0 text-[var(--accent)]" strokeWidth={1.75} />
                <span className="text-[12px] font-medium leading-snug">{n.t}</span>
              </div>
            );
          })}
        </div>
        <p className="d-up d6 text-center text-[17px] font-medium text-white">
          Start with admissions. Build a stronger digital foundation for DTI.
        </p>
      </Pad>
    </div>
  );
}

function PrototypeSlide() {
  return (
    <div className="h-full w-full bg-[var(--paper)]">
      <Pad>
        <div className="d-up max-w-[1100px]">
          <Eyebrow n="04">Proof of direction</Eyebrow>
          <Title>From Proposal to Working Prototype</Title>
          <p className="mt-4 text-[22px] font-medium text-[var(--ink)]">
            We didn&rsquo;t just propose the idea — we built the experience.
          </p>
          <p className="mt-3 max-w-[860px] text-[15px] text-[var(--muted)]">
            A functional prototype is ready to show how the proposed system can work for DTI. It demonstrates the intended experience and structure — not the final production system.
          </p>
        </div>

        <div className="relative mt-4 h-[560px]">
          <div className="d-left d2 absolute left-[40px] top-[90px] z-[1] w-[460px] -rotate-3">
            <BrowserFrame label="Online Application">
              <div className="space-y-3 bg-white p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">Select a course</p>
                <div className="h-10 rounded-lg border border-[var(--line)] bg-[var(--paper)] px-3 text-[13px] leading-10 text-[var(--ink)]">Welding Inspector</div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-10 rounded-lg border border-[var(--line)] bg-[var(--paper)] px-3 text-[12px] leading-10 text-[var(--muted)]">City</div>
                  <div className="h-10 rounded-lg border border-[var(--line)] bg-[var(--paper)] px-3 text-[12px] leading-10 text-[var(--muted)]">Campus</div>
                </div>
                <div className="ml-auto h-9 w-28 rounded-lg bg-[var(--ink)] text-center text-[12px] font-medium leading-9 text-white">Continue</div>
              </div>
            </BrowserFrame>
            <p className="mt-3 text-center text-[13px] font-medium text-[var(--muted)]">Course, city and campus first</p>
          </div>

          <div className="d-right d3 absolute right-[40px] top-[70px] z-[1] w-[480px] rotate-3">
            <BrowserFrame label="Application Management">
              <div className="space-y-2 bg-white p-5">
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {['Course', 'City', 'Campus', 'Status', 'Last 30 Days'].map((f) => (
                    <span key={f} className="rounded-full border border-[var(--line)] bg-[var(--paper)] px-2.5 py-1 text-[10px] text-[var(--muted)]">{f}</span>
                  ))}
                </div>
                {['DTI-2026-00155', 'DTI-2026-00129', 'DTI-2026-00130'].map((id) => (
                  <div key={id} className="flex items-center justify-between rounded-lg border border-[var(--line)] bg-[var(--paper)] px-3 py-2.5">
                    <span className="text-[12px] font-medium text-[var(--ink)]">{id}</span>
                    <span className="rounded-full bg-[var(--primary-soft)] px-2 py-0.5 text-[10px] font-medium text-[var(--primary)]">New</span>
                  </div>
                ))}
              </div>
            </BrowserFrame>
            <p className="mt-3 text-center text-[13px] font-medium text-[var(--muted)]">One organized applications list</p>
          </div>

          <div className="d-scale d4 absolute left-1/2 top-[58px] z-10 w-[700px] -translate-x-1/2">
            <BrowserFrame label="Admin Dashboard">
              <div className="grid grid-cols-3 gap-3 bg-white p-5">
                {['2,486', '342', '386'].map((v) => (
                  <div key={v} className="rounded-xl border border-[var(--line)] bg-[var(--paper)] p-3">
                    <div className="h-1.5 w-12 rounded bg-[var(--line)]" />
                    <p className="mt-2 text-[20px] font-semibold text-[var(--ink)]">{v}</p>
                  </div>
                ))}
                <div className="col-span-3 h-[120px] rounded-xl border border-[var(--line)] bg-[var(--paper)] px-3 pt-2">
                  <AreaSpark values={[38, 44, 41, 52, 48, 61, 58, 72]} id="protoSpark" />
                </div>
              </div>
            </BrowserFrame>
            <p className="mt-3 text-center text-[13px] font-medium text-[var(--muted)]">Admission activity at a glance</p>
          </div>
        </div>
      </Pad>
    </div>
  );
}

function BrowserFrame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-[var(--shadow-lg)]">
      <div className="flex items-center gap-2 border-b border-[var(--line)] bg-[var(--paper)] px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-[#E8B4B4]" />
        <span className="h-2 w-2 rounded-full bg-[#E8D9A8]" />
        <span className="h-2 w-2 rounded-full bg-[#B8D4C2]" />
        <span className="ml-2 text-[11px] font-medium text-[var(--muted)]">{label}</span>
      </div>
      <div className="bg-white">{children}</div>
    </div>
  );
}

function WalkthroughSlide() {
  const steps = [
    { t: 'Student Application', icon: GraduationCap },
    { t: 'Application Management', icon: FileText },
    { t: 'Dashboard & Analytics', icon: LayoutDashboard },
    { t: 'Management Insights', icon: BarChart3 },
  ];
  return (
    <div className="relative h-full w-full overflow-hidden bg-[var(--ink)] text-white">
      <div className="absolute right-0 top-0 h-full w-[42%] opacity-30">
        <img src="/presentation/training.jpg" alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[var(--ink)]" />
      </div>
      <div className="absolute left-0 top-0 h-full w-[7px] bg-[var(--primary)]" />
      <Pad className="justify-center">
        <div className="d-up">
          <Eyebrow light>Next</Eyebrow>
          <h1 className="text-[56px] font-semibold tracking-tight text-white">Let&rsquo;s Experience the System</h1>
          <p className="mt-5 max-w-[680px] text-[18px] text-white/60">
            We will now move from the presentation to the working prototype.
          </p>
        </div>
        <div className="mt-16 flex items-center gap-3">
          {steps.map((s, i) => (
            <div key={s.t} className={cn('d-up flex items-center gap-3', `d${i + 3}`)}>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-sm">
                <s.icon className="h-5 w-5 text-[var(--accent)]" strokeWidth={1.75} />
                <span className="text-[15px] font-medium">{s.t}</span>
              </div>
              {i < steps.length - 1 && <ArrowRight className="h-5 w-5 text-white/25" />}
            </div>
          ))}
        </div>
      </Pad>
    </div>
  );
}

function ClosingSlide() {
  const outcomes = [
    { t: 'For Students', d: 'A simpler and more accessible application experience.' },
    { t: 'For Staff', d: 'A centralized system to manage and process applications efficiently.' },
    { t: 'For Management', d: 'Clear visibility into admissions, courses, trends and performance.' },
  ];
  return (
    <div className="relative h-full w-full overflow-hidden bg-[var(--ink)] text-white">
      <img src="/presentation/campus.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(11,22,40,0.88) 0%, rgba(11,22,40,0.94) 100%)' }} />
      <div className="absolute left-0 top-0 h-full w-[7px] bg-[var(--primary)]" />
      <Pad className="justify-between">
        <div className="d-up pt-4">
          <Eyebrow light>Closing</Eyebrow>
          <h1 className="max-w-[1000px] text-[46px] font-semibold tracking-tight text-white">
            Centralizing the Admissions System of DTI
          </h1>
          <p className="mt-5 max-w-[720px] text-[20px] text-white/70">
            From scattered admission processes to one organized digital platform.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {outcomes.map((o, i) => (
            <div key={o.t} className={cn('d-up rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm', `d${i + 3}`)}>
              <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">{o.t}</p>
              <p className="mt-4 text-[16px] leading-relaxed text-white/75">{o.d}</p>
            </div>
          ))}
        </div>
        <div className="d-up d6 pb-2">
          <p className="max-w-[920px] text-[17px] leading-relaxed text-white/70">
            Our goal is simple: make DTI&rsquo;s admission process more organized, more accessible and easier to manage through one centralized digital system.
          </p>
          <div className="mt-10 flex items-end justify-between">
            <div>
              <p className="text-[36px] font-semibold text-white">Thank You</p>
              <p className="mt-1 text-[15px] text-white/50">Visible Winner</p>
            </div>
            <p className="text-[14px] text-white/40">We welcome your questions and discussion.</p>
          </div>
        </div>
      </Pad>
    </div>
  );
}
