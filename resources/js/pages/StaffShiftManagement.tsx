import React, { useMemo, useState } from 'react';
import MainLayout from '../Layouts/MainLayout';
import { Search, Download, ArrowUpDown, Filter, Plus, X, Loader2 } from 'lucide-react';
import { StaffTableRow, StaffMember } from '../components/StaffTableRow';
import { BulkActionsToolbar } from '../components/BulkActionsToolbar';
import { AnimatePresence, motion } from 'framer-motion';
import { router } from '@inertiajs/react';

interface Props {
  staff: StaffMember[];
}

type RoleFilter = 'All' | 'admin' | 'manager' | 'cashier' | 'waiter' | 'kitchen_staff';
type StatusFilter = 'All' | 'On Duty' | 'Off Duty';

export default function StaffShiftManagement({ staff = [] }: Props) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('All');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'waiter',
    pin: '',
    password: ''
  });

  const [sortConfig, setSortConfig] = useState<{
    key: keyof StaffMember;
    direction: 'asc' | 'desc';
  } | null>(null);

  const filteredStaff = useMemo(() => {
    let result = [...staff];
    if (roleFilter !== 'All') {
      result = result.filter(s => s.role === roleFilter);
    }
    if (statusFilter !== 'All') {
      result = result.filter(s => s.status === statusFilter);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(s => s.name.toLowerCase().includes(query) || s.role.toLowerCase().includes(query));
    }
    if (sortConfig) {
      result.sort((a, b) => {
        if (a[sortConfig.key]! < b[sortConfig.key]!) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key]! > b[sortConfig.key]!) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [staff, roleFilter, statusFilter, searchQuery, sortConfig]); // Added staff to dependency

  // Safe check for null/undefined staff array provided by backend
  const activeStaffCount = (staff || []).filter(s => s.status === 'On Duty').length;

  const handleToggleRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === filteredStaff.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredStaff.map(s => s.id)));
    }
  };

  const handleSort = (key: keyof StaffMember) => {
    setSortConfig(current => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const [editingId, setEditingId] = useState<string | null>(null);

  const handleEdit = (staffMember: StaffMember) => {
    setEditingId(staffMember.id);
    setFormData({
      name: staffMember.name,
      email: staffMember.email || '',
      role: staffMember.role,
      pin: staffMember.pin || '',
      password: ''
    });
    setIsAddModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this staff member?')) {
      router.delete(`/staff/${id}`);
    }
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setEditingId(null);
    setFormData({ name: '', email: '', role: 'waiter', pin: '', password: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (editingId) {
      router.put(`/staff/${editingId}`, formData, {
        onFinish: () => {
          setIsSubmitting(false);
          handleModalClose();
        }
      });
    } else {
      router.post('/staff', formData, {
        onFinish: () => {
          setIsSubmitting(false);
          handleModalClose();
        }
      });
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-full relative">

        {/* Top Bar */}
        <div className="bg-[#1E1E1E] rounded-xl p-4 mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 shadow-lg">
          <div className="flex flex-col gap-4 w-full lg:w-auto">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">Staff Management</h1>
              <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-medium border border-green-500/20">
                {activeStaffCount} On Duty
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 mr-4">
                <Filter size={14} className="text-white/40" />
                <span className="text-xs font-medium text-white/40 uppercase tracking-wider">
                  Role
                </span>
              </div>
              {(['All', 'admin', 'manager', 'cashier', 'kitchen_staff', 'waiter'] as RoleFilter[]).map(role => (
                <button key={role} onClick={() => setRoleFilter(role)} className={`
                  px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize
                  ${roleFilter === role ? 'bg-[#FF6B00] text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}
                `}>
                  {role.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input type="text" placeholder="Search staff..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#FF6B00]/50 transition-colors" />
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-[#FF6B00] hover:bg-[#ff8533] text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors shadow-lg shadow-[#FF6B00]/20"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add Staff</span>
            </button>
          </div>
        </div>

        {/* Bulk Actions (Optional) */}
        <AnimatePresence>
          {selectedRows.size > 0 && <BulkActionsToolbar selectedCount={selectedRows.size} onClearSelection={() => setSelectedRows(new Set())} onClockOutAll={() => console.log('Clock out all')} onExport={() => console.log('Export selected')} onDelete={() => console.log('Delete selected')} />}
        </AnimatePresence>

        {/* Table */}
        <div className="bg-[#1E1E1E] rounded-xl overflow-hidden shadow-lg border border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#1A1A1A] border-b border-white/5">
                  <th className="px-6 py-4 w-[40px]">
                    <button onClick={handleSelectAll} className={`
                      w-5 h-5 rounded border flex items-center justify-center transition-colors
                      ${selectedRows.size === filteredStaff.length && filteredStaff.length > 0 ? 'bg-[#FF6B00] border-[#FF6B00] text-white' : 'bg-transparent border-white/20 text-transparent hover:border-white/40'}
                    `}>
                      <div className="w-2.5 h-2.5 bg-current rounded-sm" />
                    </button>
                  </th>
                  {[{
                    key: 'name',
                    label: 'Employee Name'
                  }, {
                    key: 'role',
                    label: 'Role'
                  }, {
                    key: 'clockIn',
                    label: 'Clock In'
                  }, {
                    key: 'status',
                    label: 'Status'
                  }].map(col => <th key={col.key} onClick={() => handleSort(col.key as keyof StaffMember)} className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider cursor-pointer hover:text-white transition-colors group select-none">
                    <div className="flex items-center gap-2">
                      {col.label}
                      <ArrowUpDown size={12} className={`opacity-0 group-hover:opacity-100 transition-opacity ${sortConfig?.key === col.key ? 'opacity-100 text-[#FF6B00]' : ''}`} />
                    </div>
                  </th>)}
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredStaff.map(staff => (
                  <StaffTableRow
                    key={staff.id}
                    staff={staff}
                    isSelected={selectedRows.has(staff.id)}
                    onToggle={handleToggleRow}
                    onEdit={() => handleEdit(staff)}
                    onDelete={handleDelete}
                  />
                ))}
                {filteredStaff.length === 0 && <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/40">
                    No staff members found.
                  </td>
                </tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* ADD/EDIT STAFF MODAL */}
        <AnimatePresence>
          {isAddModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#1E1E1E] w-full max-w-md rounded-xl border border-white/10 shadow-2xl overflow-hidden"
              >
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#252525]">
                  <h2 className="text-lg font-bold text-white">
                    {editingId ? 'Edit Staff Member' : 'Add New Staff Member'}
                  </h2>
                  <button onClick={handleModalClose} className="text-white/40 hover:text-white transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Full Name</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#FF6B00] outline-none transition-colors"
                      placeholder="e.g. John Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Email Address</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#FF6B00] outline-none transition-colors"
                      placeholder="john@resto.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Role</label>
                      <div className="relative group">
                        <select
                          value={formData.role}
                          onChange={e => setFormData({ ...formData, role: e.target.value })}
                          className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#FF6B00] outline-none transition-colors appearance-none cursor-pointer"
                        >
                          <option value="manager" className="bg-[#1E1E1E] text-white">Manager</option>
                          <option value="cashier" className="bg-[#1E1E1E] text-white">Cashier</option>
                          <option value="waiter" className="bg-[#1E1E1E] text-white">Waiter</option>
                          <option value="kitchen_staff" className="bg-[#1E1E1E] text-white">Kitchen Staff</option>
                          <option value="admin" className="bg-[#1E1E1E] text-white">Admin</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40 group-hover:text-white transition-colors">
                          <ArrowUpDown size={16} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/60 uppercase tracking-wider">PIN Code</label>
                      <input
                        type="text"
                        maxLength={4}
                        value={formData.pin}
                        onChange={e => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '') })}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#FF6B00] outline-none transition-colors font-mono text-center tracking-[0.5em]"
                        placeholder="----"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Password {editingId ? '(Leave blank to keep current)' : '(Optional)'}</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#FF6B00] outline-none transition-colors"
                      placeholder={editingId ? "********" : "Leave blank to use default"}
                    />
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={handleModalClose}
                      className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 bg-[#FF6B00] hover:bg-[#ff8533] text-white font-bold rounded-lg transition-colors flex justify-center items-center gap-2"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (editingId ? 'Save Changes' : 'Create Account')}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </MainLayout>
  );
}