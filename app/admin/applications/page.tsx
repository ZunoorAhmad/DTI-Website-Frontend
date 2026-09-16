'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  SlidersHorizontal,
  X,
  MoreHorizontal,
  Eye,
  Pencil,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/lib/store';
import { Application, ApplicationStatus, CITIES } from '@/lib/types';
import { formatDate } from '@/lib/format';
import {
  ApplicationFilterState,
  DATE_PRESETS,
  EMPTY_FILTERS,
  countActiveFilters,
  filterApplications,
  toggleFilterValue,
} from '@/lib/admin-filters';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 10;
const STATUSES: ApplicationStatus[] = ['New', 'Under Review', 'Approved', 'Rejected'];

export default function ApplicationsPage() {
  const router = useRouter();
  const { applications, courses, updateApplicationStatus, updateApplication } = useApp();

  const [draft, setDraft] = useState<ApplicationFilterState>(EMPTY_FILTERS);
  const [applied, setApplied] = useState<ApplicationFilterState>(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [page, setPage] = useState(1);

  const [statusTarget, setStatusTarget] = useState<Application | null>(null);
  const [nextStatus, setNextStatus] = useState<ApplicationStatus>('Under Review');
  const [editTarget, setEditTarget] = useState<Application | null>(null);
  const [editForm, setEditForm] = useState({ applicantName: '', email: '', mobile: '', city: '', campus: '' });

  const campuses = useMemo(
    () => Array.from(new Set(CITIES.flatMap((c) => c.campuses))),
    []
  );

  const filtered = useMemo(
    () => filterApplications(applications, applied),
    [applications, applied]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const activeCount = countActiveFilters(applied);

  const applyFilters = () => {
    setApplied({ ...draft });
    setPage(1);
  };

  const clearFilters = () => {
    setDraft(EMPTY_FILTERS);
    setApplied(EMPTY_FILTERS);
    setPage(1);
  };

  const onSearchChange = (value: string) => {
    const next = { ...draft, search: value };
    setDraft(next);
    setApplied({ ...applied, search: value });
    setPage(1);
  };

  const openEdit = (app: Application) => {
    setEditTarget(app);
    setEditForm({
      applicantName: app.applicantName,
      email: app.email,
      mobile: app.mobile,
      city: app.city,
      campus: app.campus,
    });
  };

  const saveEdit = () => {
    if (!editTarget) return;
    if (!editForm.applicantName.trim() || !editForm.email.trim() || !editForm.mobile.trim()) {
      toast.error('Please fill all required fields');
      return;
    }
    updateApplication(editTarget.id, editForm);
    toast.success('Application updated');
    setEditTarget(null);
  };

  const saveStatus = () => {
    if (!statusTarget) return;
    updateApplicationStatus(statusTarget.id, nextStatus);
    toast.success(`Status updated to ${nextStatus}`);
    setStatusTarget(null);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Applications"
        description="Search, filter, and review admission applications."
      />

      <Card>
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={draft.search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by name, CNIC, email, phone, or application ID"
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setFiltersOpen((v) => !v)}>
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
                {activeCount > 0 && (
                  <span className="ml-2 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                    {activeCount}
                  </span>
                )}
              </Button>
              {activeCount > 0 && (
                <Button variant="ghost" onClick={clearFilters}>
                  <X className="mr-1 h-4 w-4" /> Clear
                </Button>
              )}
            </div>
          </div>

          {filtersOpen && (
            <div className="mt-5 space-y-5 border-t border-border pt-5">
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-4">
                <FilterGroup
                  label="Course"
                  options={courses.map((c) => ({ id: c.id, label: c.name }))}
                  selected={draft.courses}
                  onToggle={(id) => setDraft((prev) => ({ ...prev, courses: toggleFilterValue(prev.courses, id) }))}
                />
                <FilterGroup
                  label="City"
                  options={CITIES.map((c) => ({ id: c.name, label: c.name }))}
                  selected={draft.cities}
                  onToggle={(id) => setDraft((prev) => ({ ...prev, cities: toggleFilterValue(prev.cities, id) }))}
                />
                <FilterGroup
                  label="Campus"
                  options={campuses.map((c) => ({ id: c, label: c }))}
                  selected={draft.campuses}
                  onToggle={(id) => setDraft((prev) => ({ ...prev, campuses: toggleFilterValue(prev.campuses, id) }))}
                />
                <FilterGroup
                  label="Status"
                  options={STATUSES.map((s) => ({ id: s, label: s }))}
                  selected={draft.statuses}
                  onToggle={(id) => setDraft((prev) => ({ ...prev, statuses: toggleFilterValue(prev.statuses, id as ApplicationStatus) }))}
                />
              </div>

              <div>
                <Label className="mb-2 block">Date</Label>
                <div className="flex flex-wrap gap-2">
                  {DATE_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() =>
                        setDraft((prev) => ({
                          ...prev,
                          datePreset: prev.datePreset === preset.id ? '' : preset.id,
                          dateFrom: '',
                          dateTo: '',
                        }))
                      }
                      className={cn(
                        'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                        draft.datePreset === preset.id
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-white text-muted-foreground hover:border-primary/40 hover:text-foreground'
                      )}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:max-w-md">
                  <div className="space-y-1.5">
                    <Label className="text-xs">From Date</Label>
                    <Input
                      type="date"
                      value={draft.dateFrom}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, datePreset: 'custom', dateFrom: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">To Date</Label>
                    <Input
                      type="date"
                      value={draft.dateTo}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, datePreset: 'custom', dateTo: e.target.value }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button onClick={applyFilters}>Apply Filters</Button>
                <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{filtered.length}</span> applications found
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Application ID</TableHead>
                <TableHead>Applicant Name</TableHead>
                <TableHead className="hidden md:table-cell">CNIC</TableHead>
                <TableHead className="hidden xl:table-cell">Phone</TableHead>
                <TableHead className="hidden xl:table-cell">Email</TableHead>
                <TableHead>Course</TableHead>
                <TableHead className="hidden lg:table-cell">City</TableHead>
                <TableHead className="hidden lg:table-cell">Campus</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="py-12 text-center text-sm text-muted-foreground">
                    No applications match the current filters.
                  </TableCell>
                </TableRow>
              ) : (
                pageRows.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">
                      <Link href={`/admin/applications/${encodeURIComponent(app.id)}`} className="text-primary hover:underline">
                        {app.id}
                      </Link>
                    </TableCell>
                    <TableCell>{app.applicantName}</TableCell>
                    <TableCell className="hidden md:table-cell font-mono text-xs">{app.cnic}</TableCell>
                    <TableCell className="hidden xl:table-cell text-xs">{app.mobile}</TableCell>
                    <TableCell className="hidden xl:table-cell text-xs">{app.email}</TableCell>
                    <TableCell className="max-w-[180px] truncate">{app.courseName}</TableCell>
                    <TableCell className="hidden lg:table-cell">{app.city}</TableCell>
                    <TableCell className="hidden lg:table-cell">{app.campus}</TableCell>
                    <TableCell className="hidden md:table-cell">{formatDate(app.date)}</TableCell>
                    <TableCell><StatusBadge status={app.status} /></TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/admin/applications/${encodeURIComponent(app.id)}`)}>
                            <Eye className="mr-2 h-4 w-4" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEdit(app)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setStatusTarget(app);
                              setNextStatus(app.status);
                            }}
                          >
                            <RefreshCw className="mr-2 h-4 w-4" /> Change Status
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filtered.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft className="mr-1 h-4 w-4" /> Previous
            </Button>
            <Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => setPage((p) => p + 1)}>
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <Dialog open={!!statusTarget} onOpenChange={(open) => !open && setStatusTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Status</DialogTitle>
            <DialogDescription>
              Update the review status for {statusTarget?.id}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={nextStatus} onValueChange={(v) => setNextStatus(v as ApplicationStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusTarget(null)}>Cancel</Button>
            <Button onClick={saveStatus}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Application</DialogTitle>
            <DialogDescription>
              Update contact and location details for {editTarget?.id}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="space-y-1.5">
              <Label>Applicant Name <span className="text-destructive">*</span></Label>
              <Input value={editForm.applicantName} onChange={(e) => setEditForm((f) => ({ ...f, applicantName: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Email <span className="text-destructive">*</span></Label>
              <Input value={editForm.email} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Phone <span className="text-destructive">*</span></Label>
              <Input value={editForm.mobile} onChange={(e) => setEditForm((f) => ({ ...f, mobile: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>City</Label>
                <Select value={editForm.city} onValueChange={(v) => setEditForm((f) => ({ ...f, city: v, campus: '' }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CITIES.map((c) => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Campus</Label>
                <Select value={editForm.campus} onValueChange={(v) => setEditForm((f) => ({ ...f, campus: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select campus" /></SelectTrigger>
                  <SelectContent>
                    {(CITIES.find((c) => c.name === editForm.city)?.campuses || []).map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>Cancel</Button>
            <Button onClick={saveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FilterGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: { id: string; label: string }[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div>
      <Label className="mb-2 block">{label}</Label>
      <div className="max-h-40 space-y-2 overflow-y-auto rounded-lg border border-border p-3 scrollbar-thin">
        {options.map((opt) => (
          <label key={opt.id} className="flex cursor-pointer items-center gap-2 text-sm">
            <Checkbox checked={selected.includes(opt.id)} onCheckedChange={() => onToggle(opt.id)} />
            <span className="truncate">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
