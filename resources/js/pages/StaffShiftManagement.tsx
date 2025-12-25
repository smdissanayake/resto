import React, { useMemo, useState } from 'react';
import MainLayout from '../Layouts/MainLayout';
import { Search, Download, ArrowUpDown, Filter } from 'lucide-react';
import { StaffTableRow, StaffMember } from '../components/StaffTableRow';
import { BulkActionsToolbar } from '../components/BulkActionsToolbar';
import { AnimatePresence } from 'framer-motion';
// Mock Data
const MOCK_STAFF: StaffMember[] = [{
  id: '1',
  name: 'Sarah Jenkins',
  role: 'Manager',
  clockIn: '08:00 AM',
  clockOut: null,
  status: 'On Duty'
}, {
  id: '2',
  name: 'Mike Ross',
  role: 'Chef',
  clockIn: '09:30 AM',
  clockOut: null,
  status: 'On Duty'
}, {
  id: '3',
  name: 'Jessica Pearson',
  role: 'Server',
  clockIn: '10:00 AM',
  clockOut: '04:00 PM',
  status: 'Off Duty'
}, {
  id: '4',
  name: 'Harvey Specter',
  role: 'Bartender',
  clockIn: '04:00 PM',
  clockOut: null,
  status: 'On Duty'
}, {
  id: '5',
  name: 'Louis Litt',
  role: 'Server',
  clockIn: '11:00 AM',
  clockOut: '05:00 PM',
  status: 'Off Duty'
}, {
  id: '6',
  name: 'Rachel Zane',
  role: 'Host',
  clockIn: '09:00 AM',
  clockOut: null,
  status: 'On Duty'
}, {
  id: '7',
  name: 'Donna Paulsen',
  role: 'Manager',
  clockIn: '08:30 AM',
  clockOut: null,
  status: 'On Duty'
}, {
  id: '8',
  name: 'Alex Williams',
  role: 'Chef',
  clockIn: '10:00 AM',
  clockOut: '06:00 PM',
  status: 'Off Duty'
}, {
  id: '9',
  name: 'Katrina Bennett',
  role: 'Server',
  clockIn: '05:00 PM',
  clockOut: null,
  status: 'On Duty'
}, {
  id: '10',
  name: 'Samantha Wheeler',
  role: 'Bartender',
  clockIn: '06:00 PM',
  clockOut: null,
  status: 'On Duty'
}, {
  id: '11',
  name: 'Robert Zane',
  role: 'Chef',
  clockIn: '07:00 AM',
  clockOut: '03:00 PM',
  status: 'Off Duty'
}, {
  id: '12',
  name: 'Sheila Sazs',
  role: 'Host',
  clockIn: '10:00 AM',
  clockOut: '04:00 PM',
  status: 'Off Duty'
}, {
  id: '13',
  name: 'Daniel Hardman',
  role: 'Manager',
  clockIn: '09:00 AM',
  clockOut: '05:00 PM',
  status: 'Off Duty'
}, {
  id: '14',
  name: 'Jeff Malone',
  role: 'Server',
  clockIn: '11:00 AM',
  clockOut: null,
  status: 'On Duty'
}, {
  id: '15',
  name: 'Dana Scott',
  role: 'Bartender',
  clockIn: '04:30 PM',
  clockOut: null,
  status: 'On Duty'
}];
type RoleFilter = 'All' | 'Server' | 'Chef' | 'Host' | 'Bartender' | 'Manager';
type StatusFilter = 'All' | 'On Duty' | 'Off Duty';
export default function StaffShiftManagement() {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('All');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof StaffMember;
    direction: 'asc' | 'desc';
  } | null>(null);
  const filteredStaff = useMemo(() => {
    let result = [...MOCK_STAFF];
    if (roleFilter !== 'All') {
      result = result.filter(staff => staff.role === roleFilter);
    }
    if (statusFilter !== 'All') {
      result = result.filter(staff => staff.status === statusFilter);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(staff => staff.name.toLowerCase().includes(query) || staff.role.toLowerCase().includes(query));
    }
    if (sortConfig) {
      result.sort((a, b) => {
        if (a[sortConfig.key]! < b[sortConfig.key]!) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key]! > b[sortConfig.key]!) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [roleFilter, statusFilter, searchQuery, sortConfig]);
  const activeStaffCount = MOCK_STAFF.filter(s => s.status === 'On Duty').length;
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
  return <MainLayout>
      <div className="flex flex-col h-full">
      {/* Top Bar */}
      <div className="bg-[#1E1E1E] rounded-xl p-4 mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 shadow-lg">
        <div className="flex flex-col gap-4 w-full lg:w-auto">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Shift Management</h1>
            <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-medium border border-green-500/20">
              {activeStaffCount} Active Staff
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 mr-4">
              <Filter size={14} className="text-white/40" />
              <span className="text-xs font-medium text-white/40 uppercase tracking-wider">
                Role
              </span>
            </div>
            {(['All', 'Server', 'Chef', 'Host', 'Bartender', 'Manager'] as RoleFilter[]).map(role => <button key={role} onClick={() => setRoleFilter(role)} className={`
                  px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                  ${roleFilter === role ? 'bg-[#FF6B00] text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}
                `}>
                {role}
              </button>)}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 mr-4">
              <Filter size={14} className="text-white/40" />
              <span className="text-xs font-medium text-white/40 uppercase tracking-wider">
                Status
              </span>
            </div>
            {(['All', 'On Duty', 'Off Duty'] as StatusFilter[]).map(status => <button key={status} onClick={() => setStatusFilter(status)} className={`
                  px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                  ${statusFilter === status ? 'bg-[#FF6B00] text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}
                `}>
                  {status}
                </button>)}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input type="text" placeholder="Search staff..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#FF6B00]/50 transition-colors" />
          </div>
          <button className="flex items-center gap-2 bg-[#FF6B00] hover:bg-[#ff8533] text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors shadow-lg shadow-[#FF6B00]/20">
            <Download size={18} />
            <span className="hidden sm:inline">Report</span>
          </button>
        </div>
      </div>

      {/* Bulk Actions Toolbar */}
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
                key: 'clockOut',
                label: 'Clock Out'
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
              {filteredStaff.map(staff => <StaffTableRow key={staff.id} staff={staff} isSelected={selectedRows.has(staff.id)} onToggle={handleToggleRow} onEdit={id => console.log('Edit', id)} />)}
              {filteredStaff.length === 0 && <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-white/40">
                    No staff members found matching your filters.
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </MainLayout>;
}