
import React, { useState, useMemo } from 'react';
import { User, StaffAttendance, UserRole } from '../types';

interface Props {
  users: User[];
  attendanceRecords: StaffAttendance[];
}

const AdminStaffAttendance: React.FC<Props> = ({ users, attendanceRecords }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterRole, setFilterRole] = useState<string>('ALL');

  const staffMembers = useMemo(() => {
    return users.filter(u => u.role !== UserRole.STUDENT && u.role !== UserRole.PARENT);
  }, [users]);

  const reportData = useMemo(() => {
    return staffMembers.map(staff => {
      const record = attendanceRecords.find(r => r.staffId === staff.id && r.date === selectedDate);
      return {
        staff,
        record,
        status: record ? record.status : 'ABSENT'
      };
    }).filter(item => filterRole === 'ALL' || item.staff.role === filterRole);
  }, [staffMembers, attendanceRecords, selectedDate, filterRole]);

  const stats = {
    total: reportData.length,
    present: reportData.filter(r => r.status === 'PRESENT' || r.status === 'LATE').length,
    absent: reportData.filter(r => r.status === 'ABSENT').length
  };

  return (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 className="text-2xl font-bold font-display text-slate-900">Staff Attendance Report</h2>
                <p className="text-slate-500 text-sm">Daily check-in logs for academic and non-academic staff.</p>
            </div>
            <div className="flex items-center gap-2">
                <input 
                    type="date" 
                    value={selectedDate} 
                    onChange={e => setSelectedDate(e.target.value)}
                    className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-500 uppercase">Total Expected</p>
                <p className="text-2xl font-black text-slate-800">{stats.total}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl border border-green-100 shadow-sm">
                <p className="text-xs font-bold text-green-600 uppercase">Present</p>
                <p className="text-2xl font-black text-green-700">{stats.present}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-xl border border-red-100 shadow-sm">
                <p className="text-xs font-bold text-red-600 uppercase">Absent</p>
                <p className="text-2xl font-black text-red-700">{stats.absent}</p>
            </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scroll-container">
            <span className="text-xs font-bold text-slate-400 uppercase mr-2 flex-shrink-0">Filter Role:</span>
            {['ALL', UserRole.TEACHER, UserRole.FORM_MASTER, UserRole.ADMIN, UserRole.PRINCIPAL].map(role => (
                <button
                    key={role}
                    onClick={() => setFilterRole(role)}
                    className={`px-3 py-1 text-xs font-bold rounded-full border transition-colors whitespace-nowrap flex-shrink-0 ${
                        filterRole === role 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                >
                    {role.replace('_', ' ')}
                </button>
            ))}
        </div>

        {/* Table */}
        <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Staff Name</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Role</th>
                            <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase">Time In</th>
                            <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase">Distance</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {reportData.map(({ staff, record, status }) => (
                            <tr key={staff.id} className="hover:bg-slate-50/50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs mr-3">
                                            {staff.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-900">{staff.name}</div>
                                            <div className="text-xs text-slate-500">{staff.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                        {staff.role.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-mono text-slate-700">
                                    {record ? record.time : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-xs text-slate-500">
                                    {record ? `${Math.round(record.distanceFromSchool)}m` : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                        status === 'PRESENT' ? 'bg-green-100 text-green-800' :
                                        status === 'LATE' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {reportData.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm">
                                    No staff records found for criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default AdminStaffAttendance;
