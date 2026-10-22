import React, { useEffect, useState, useCallback } from 'react';
import { librarianService } from '../services/librarianService';
import { LibrarianProfileRecord, CreateLibrarianRequest, UpdateLibrarianRequest } from '../types/librarian';
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
import { UserCog, Search, Pencil, Power, Plus, Eye, EyeOff } from 'lucide-react';

const EMPTY_CREATE: CreateLibrarianRequest = {
  fullName: '', email: '', password: '', employeeId: '', designation: '', phone: '', address: '',
};

export const LibrariansPage: React.FC = () => {
  const { success, error: toastError } = useToast();
  const [librarians, setLibrarians] = useState<LibrarianProfileRecord[]>([]);
  const [filtered, setFiltered] = useState<LibrarianProfileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateLibrarianRequest>(EMPTY_CREATE);
  const [showPw, setShowPw] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  const [editLib, setEditLib] = useState<LibrarianProfileRecord | null>(null);
  const [editForm, setEditForm] = useState<UpdateLibrarianRequest>({});
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState('');

  const [toggleLib, setToggleLib] = useState<LibrarianProfileRecord | null>(null);
  const [toggling, setToggling] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await librarianService.getAll();
      setLibrarians(data);
      setFiltered(data);
    } catch {
      toastError('Failed to load librarians');
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      q
        ? librarians.filter(l =>
            l.user.fullName.toLowerCase().includes(q) ||
            l.user.email.toLowerCase().includes(q) ||
            l.employeeId.toLowerCase().includes(q) ||
            l.designation.toLowerCase().includes(q)
          )
        : librarians
    );
  }, [search, librarians]);

  const handleCreate = async () => {
    if (!createForm.fullName || !createForm.email || !createForm.password || !createForm.employeeId || !createForm.designation) {
      setCreateError('All required fields must be filled.');
      return;
    }
    setCreating(true);
    setCreateError('');
    try {
      const created = await librarianService.create(createForm);
      setLibrarians(prev => [created, ...prev]);
      success('Librarian registered');
      setCreateOpen(false);
      setCreateForm(EMPTY_CREATE);
    } catch (e) {
      setCreateError(e instanceof ApiError ? e.message : 'Create failed');
    } finally {
      setCreating(false);
    }
  };

  const openEdit = (l: LibrarianProfileRecord) => {
    setEditLib(l);
    setEditForm({
      fullName: l.user.fullName,
      email: l.user.email,
      employeeId: l.employeeId,
      designation: l.designation,
      phone: l.phone ?? '',
      address: l.address ?? '',
    });
    setEditError('');
  };

  const handleSave = async () => {
    if (!editLib) return;
    setSaving(true);
    setEditError('');
    try {
      const updated = await librarianService.update(editLib.userId, editForm);
      setLibrarians(prev => prev.map(l => l.userId === updated.userId ? updated : l));
      success('Librarian updated');
      setEditLib(null);
    } catch (e) {
      setEditError(e instanceof ApiError ? e.message : 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async () => {
    if (!toggleLib) return;
    setToggling(true);
    try {
      const updated = await librarianService.updateStatus(toggleLib.userId, !toggleLib.user.isActive);
      setLibrarians(prev => prev.map(l => l.userId === updated.userId ? updated : l));
      success(`Librarian ${updated.user.isActive ? 'activated' : 'deactivated'}`);
      setToggleLib(null);
    } catch (e) {
      toastError(e instanceof ApiError ? e.message : 'Status update failed');
    } finally {
      setToggling(false);
    }
  };

  const cf = (key: keyof CreateLibrarianRequest, value: string) => setCreateForm(p => ({ ...p, [key]: value }));
  const ef = (key: keyof UpdateLibrarianRequest, value: string) => setEditForm(p => ({ ...p, [key]: value }));

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Librarians</h2>
          <p className="text-sm text-slate-400 mt-0.5">{filtered.length} of {librarians.length} staff members</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-60">
            <Input
              placeholder="Search name, email, ID…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
              id="lib-search"
            />
          </div>
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => { setCreateOpen(true); setCreateError(''); }}>
            Register Librarian
          </Button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading librarians…" />
      ) : filtered.length === 0 ? (
        <EmptyState title="No librarians found" icon={<UserCog className="w-10 h-10" />} action={
          <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setCreateOpen(true)}>Register Librarian</Button>
        } />
      ) : (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/50">
                  {['Name', 'Employee ID', 'Designation', 'Phone', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {filtered.map(l => (
                  <tr key={l.userId} className="hover:bg-slate-700/20 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{l.user.fullName}</p>
                      <p className="text-xs text-slate-500">{l.user.email}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-300 font-mono text-xs">{l.employeeId}</td>
                    <td className="px-4 py-3 text-slate-300">{l.designation}</td>
                    <td className="px-4 py-3 text-slate-400">{l.phone ?? '—'}</td>
                    <td className="px-4 py-3">
                      <Badge variant={l.user.isActive ? 'success' : 'danger'}>
                        {l.user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="xs" leftIcon={<Pencil className="w-3.5 h-3.5" />} onClick={() => openEdit(l)}>Edit</Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          leftIcon={<Power className="w-3.5 h-3.5" />}
                          onClick={() => setToggleLib(l)}
                          className={l.user.isActive ? 'text-rose-400 hover:text-rose-300 hover:bg-rose-500/10' : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10'}
                        >
                          {l.user.isActive ? 'Deactivate' : 'Activate'}
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

      {/* Create Modal */}
      <Modal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Register New Librarian"
        size="lg"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setCreateOpen(false)} disabled={creating}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleCreate} loading={creating}>Register</Button>
          </>
        }
      >
        {createError && (
          <div className="rounded-lg bg-rose-500/10 border border-rose-500/25 px-3 py-2 text-sm text-rose-400">{createError}</div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full Name *" id="lib-name" value={createForm.fullName} onChange={e => cf('fullName', e.target.value)} />
          <Input label="Email *" id="lib-email" type="email" value={createForm.email} onChange={e => cf('email', e.target.value)} />
          <Input
            label="Password *"
            id="lib-pw"
            type={showPw ? 'text' : 'password'}
            value={createForm.password}
            onChange={e => cf('password', e.target.value)}
            rightElement={
              <button type="button" onClick={() => setShowPw(p => !p)} className="text-slate-400 hover:text-slate-200 transition-colors">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />
          <Input label="Employee ID *" id="lib-empid" value={createForm.employeeId} onChange={e => cf('employeeId', e.target.value)} placeholder="EMP001" />
          <Input label="Designation *" id="lib-desig" value={createForm.designation} onChange={e => cf('designation', e.target.value)} placeholder="Senior Librarian" />
          <Input label="Phone" id="lib-phone" value={createForm.phone ?? ''} onChange={e => cf('phone', e.target.value)} />
          <div className="sm:col-span-2">
            <Input label="Address" id="lib-addr" value={createForm.address ?? ''} onChange={e => cf('address', e.target.value)} />
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editLib}
        onClose={() => setEditLib(null)}
        title="Edit Librarian"
        size="md"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setEditLib(null)} disabled={saving}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleSave} loading={saving}>Save Changes</Button>
          </>
        }
      >
        {editError && (
          <div className="rounded-lg bg-rose-500/10 border border-rose-500/25 px-3 py-2 text-sm text-rose-400">{editError}</div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full Name" id="elib-name" value={editForm.fullName ?? ''} onChange={e => ef('fullName', e.target.value)} />
          <Input label="Email" id="elib-email" type="email" value={editForm.email ?? ''} onChange={e => ef('email', e.target.value)} />
          <Input label="Employee ID" id="elib-empid" value={editForm.employeeId ?? ''} onChange={e => ef('employeeId', e.target.value)} />
          <Input label="Designation" id="elib-desig" value={editForm.designation ?? ''} onChange={e => ef('designation', e.target.value)} />
          <Input label="Phone" id="elib-phone" value={editForm.phone ?? ''} onChange={e => ef('phone', e.target.value)} />
          <Input label="Address" id="elib-addr" value={editForm.address ?? ''} onChange={e => ef('address', e.target.value)} />
        </div>
      </Modal>

      {/* Toggle Confirm */}
      <ConfirmDialog
        isOpen={!!toggleLib}
        onClose={() => setToggleLib(null)}
        onConfirm={handleToggle}
        title={`${toggleLib?.user.isActive ? 'Deactivate' : 'Activate'} "${toggleLib?.user.fullName}"?`}
        description={toggleLib?.user.isActive
          ? 'This librarian will no longer be able to log in.'
          : 'This librarian will be able to log in again.'}
        confirmLabel={toggleLib?.user.isActive ? 'Deactivate' : 'Activate'}
        danger={toggleLib?.user.isActive}
        loading={toggling}
      />
    </div>
  );
};
