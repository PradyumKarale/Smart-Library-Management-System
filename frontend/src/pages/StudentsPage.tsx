import React, { useEffect, useState, useCallback } from 'react';
import { studentService } from '../services/studentService';
import { StudentProfileRecord, UpdateStudentRequest } from '../types/student';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { useToast } from '../components/common/Toast';
import { ApiError } from '../services/apiClient';
import { Users, Search, Pencil, Power } from 'lucide-react';

export const StudentsPage: React.FC = () => {
  const { success, error: toastError } = useToast();
  const [students, setStudents] = useState<StudentProfileRecord[]>([]);
  const [filtered, setFiltered] = useState<StudentProfileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [editStudent, setEditStudent] = useState<StudentProfileRecord | null>(null);
  const [form, setForm] = useState<UpdateStudentRequest>({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [toggleStudent, setToggleStudent] = useState<StudentProfileRecord | null>(null);
  const [toggling, setToggling] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await studentService.getAll();
      setStudents(data);
      setFiltered(data);
    } catch {
      toastError('Failed to load students');
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      q
        ? students.filter(s =>
            s.user.fullName.toLowerCase().includes(q) ||
            s.user.email.toLowerCase().includes(q) ||
            s.enrollmentNo.toLowerCase().includes(q) ||
            s.department.toLowerCase().includes(q)
          )
        : students
    );
  }, [search, students]);

  const openEdit = (s: StudentProfileRecord) => {
    setEditStudent(s);
    setForm({
      fullName: s.user.fullName,
      email: s.user.email,
      enrollmentNo: s.enrollmentNo,
      department: s.department,
      semester: s.semester,
      year: s.year,
    });
    setFormError('');
  };

  const handleSave = async () => {
    if (!editStudent) return;
    setSaving(true);
    setFormError('');
    try {
      const updated = await studentService.update(editStudent.userId, form);
      setStudents(prev => prev.map(s => s.userId === updated.userId ? updated : s));
      success('Student updated');
      setEditStudent(null);
    } catch (e) {
      setFormError(e instanceof ApiError ? e.message : 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async () => {
    if (!toggleStudent) return;
    setToggling(true);
    try {
      const updated = await studentService.updateStatus(toggleStudent.userId, !toggleStudent.user.isActive);
      setStudents(prev => prev.map(s => s.userId === updated.userId ? updated : s));
      success(`Student ${updated.user.isActive ? 'activated' : 'deactivated'}`);
      setToggleStudent(null);
    } catch (e) {
      toastError(e instanceof ApiError ? e.message : 'Status update failed');
    } finally {
      setToggling(false);
    }
  };

  const field = (key: keyof UpdateStudentRequest, value: string | number) =>
    setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Students</h2>
          <p className="text-sm text-slate-400 mt-0.5">{filtered.length} of {students.length} students</p>
        </div>
        <div className="w-64">
          <Input
            placeholder="Search name, email, enrollment…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            id="student-search"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading students…" />
      ) : filtered.length === 0 ? (
        <EmptyState title="No students found" description="Adjust your search query." icon={<Users className="w-10 h-10" />} />
      ) : (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/50">
                  {['Name', 'Enrollment No', 'Department', 'Sem / Year', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {filtered.map(s => (
                  <tr key={s.userId} className="hover:bg-slate-700/20 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{s.user.fullName}</p>
                      <p className="text-xs text-slate-500">{s.user.email}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-300 font-mono text-xs">{s.enrollmentNo}</td>
                    <td className="px-4 py-3 text-slate-300">{s.department}</td>
                    <td className="px-4 py-3 text-slate-400">{s.semester} / {s.year}</td>
                    <td className="px-4 py-3">
                      <Badge variant={s.user.isActive ? 'success' : 'danger'}>
                        {s.user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="xs" leftIcon={<Pencil className="w-3.5 h-3.5" />} onClick={() => openEdit(s)}>Edit</Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          leftIcon={<Power className="w-3.5 h-3.5" />}
                          onClick={() => setToggleStudent(s)}
                          className={s.user.isActive ? 'text-rose-400 hover:text-rose-300 hover:bg-rose-500/10' : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10'}
                        >
                          {s.user.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={!!editStudent}
        onClose={() => setEditStudent(null)}
        title="Edit Student"
        size="md"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setEditStudent(null)} disabled={saving}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleSave} loading={saving}>Save Changes</Button>
          </>
        }
      >
        {formError && (
          <div className="rounded-lg bg-rose-500/10 border border-rose-500/25 px-3 py-2 text-sm text-rose-400">{formError}</div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full Name" id="st-name" value={form.fullName ?? ''} onChange={e => field('fullName', e.target.value)} />
          <Input label="Email" id="st-email" type="email" value={form.email ?? ''} onChange={e => field('email', e.target.value)} />
          <Input label="Enrollment No" id="st-enroll" value={form.enrollmentNo ?? ''} onChange={e => field('enrollmentNo', e.target.value)} />
          <Input label="Department" id="st-dept" value={form.department ?? ''} onChange={e => field('department', e.target.value)} />
          <Input label="Semester" id="st-sem" type="number" min={1} max={8} value={form.semester ?? ''} onChange={e => field('semester', Number(e.target.value))} />
          <Input label="Year" id="st-year" type="number" min={1} max={5} value={form.year ?? ''} onChange={e => field('year', Number(e.target.value))} />
        </div>
      </Modal>

      {/* Toggle Confirm */}
      <ConfirmDialog
        isOpen={!!toggleStudent}
        onClose={() => setToggleStudent(null)}
        onConfirm={handleToggle}
        title={`${toggleStudent?.user.isActive ? 'Deactivate' : 'Activate'} "${toggleStudent?.user.fullName}"?`}
        description={toggleStudent?.user.isActive
          ? 'This will prevent the student from logging in.'
          : 'This will allow the student to log in again.'}
        confirmLabel={toggleStudent?.user.isActive ? 'Deactivate' : 'Activate'}
        danger={toggleStudent?.user.isActive}
        loading={toggling}
      />
    </div>
  );
};
