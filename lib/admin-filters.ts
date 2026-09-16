import { Application, ApplicationStatus } from './types';

export type DatePreset =
  | ''
  | 'today'
  | 'yesterday'
  | 'last7'
  | 'last30'
  | 'thisMonth'
  | 'prevMonth'
  | 'thisYear'
  | 'custom';

export interface ApplicationFilterState {
  search: string;
  courses: string[];
  cities: string[];
  campuses: string[];
  statuses: ApplicationStatus[];
  datePreset: DatePreset;
  dateFrom: string;
  dateTo: string;
}

export const EMPTY_FILTERS: ApplicationFilterState = {
  search: '',
  courses: [],
  cities: [],
  campuses: [],
  statuses: [],
  datePreset: '',
  dateFrom: '',
  dateTo: '',
};

export const DATE_PRESETS: { id: DatePreset; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: 'last7', label: 'Last 7 Days' },
  { id: 'last30', label: 'Last 30 Days' },
  { id: 'thisMonth', label: 'This Month' },
  { id: 'prevMonth', label: 'Previous Month' },
  { id: 'thisYear', label: 'This Year' },
];

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function toISO(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function addDays(iso: string, days: number) {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  return toISO(date);
}

export function resolveDateBounds(
  preset: DatePreset,
  dateFrom: string,
  dateTo: string
): { start: string; end: string } | null {
  if (!preset) return null;

  const today = toISO(new Date());
  const now = new Date();

  switch (preset) {
    case 'today':
      return { start: today, end: today };
    case 'yesterday': {
      const y = addDays(today, -1);
      return { start: y, end: y };
    }
    case 'last7':
      return { start: addDays(today, -6), end: today };
    case 'last30':
      return { start: addDays(today, -29), end: today };
    case 'thisMonth':
      return { start: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-01`, end: today };
    case 'prevMonth': {
      const firstThis = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastPrev = new Date(firstThis.getTime() - 86400000);
      const firstPrev = `${lastPrev.getFullYear()}-${pad(lastPrev.getMonth() + 1)}-01`;
      return { start: firstPrev, end: toISO(lastPrev) };
    }
    case 'thisYear':
      return { start: `${now.getFullYear()}-01-01`, end: today };
    case 'custom':
      if (!dateFrom && !dateTo) return null;
      return {
        start: dateFrom || '0000-01-01',
        end: dateTo || today,
      };
    default:
      return null;
  }
}

function toggleValue(list: string[], value: string) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function toggleFilterValue<T extends string>(list: T[], value: T): T[] {
  return toggleValue(list, value) as T[];
}

export function filterApplications(
  applications: Application[],
  filters: ApplicationFilterState
): Application[] {
  const q = filters.search.trim().toLowerCase();
  const bounds = resolveDateBounds(filters.datePreset, filters.dateFrom, filters.dateTo);

  return applications.filter((app) => {
    if (q) {
      const haystack = [
        app.id,
        app.applicantName,
        app.cnic,
        app.email,
        app.mobile,
        app.courseName,
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    if (filters.courses.length && !filters.courses.includes(app.courseId)) return false;
    if (filters.cities.length && !filters.cities.includes(app.city)) return false;
    if (filters.campuses.length && !filters.campuses.includes(app.campus)) return false;
    if (filters.statuses.length && !filters.statuses.includes(app.status)) return false;

    if (bounds) {
      if (app.date < bounds.start || app.date > bounds.end) return false;
    }

    return true;
  });
}

export function countActiveFilters(filters: ApplicationFilterState) {
  let n = 0;
  if (filters.search.trim()) n += 1;
  if (filters.courses.length) n += 1;
  if (filters.cities.length) n += 1;
  if (filters.campuses.length) n += 1;
  if (filters.statuses.length) n += 1;
  if (filters.datePreset) n += 1;
  return n;
}
