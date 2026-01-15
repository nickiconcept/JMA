
import React, { useState } from 'react';
import { Student, Attendance, ClassDefinition, Term, UserRole } from '../types';
import Button from './Button';

interface Props {
  students: Student[];
  attendanceRecords: Attendance[];
  currentClass: ClassDefinition;
  onSaveAttendance: (records: Attendance[]) => void;
  currentUserRole?: UserRole; // Added to check admin override
}

const AttendanceRegister: React.FC<Props> = ({ students, attendanceRecords, currentClass, onSaveAttendance, currentUserRole }) => {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [draftRecords, setDraftRecords] = useState<Record<string, 'PRESENT' | 'ABSENT' | 'LATE'>>({});

  // Check if attendance already exists for this date and class
  const existingRecordsForDate = attendanceRecords.filter(a => a.date === selectedDate && a.classId === currentClass.id);
  const hasExistingData = existingRecordsForDate.length > 0;
  
  // Locked if data exists AND user is NOT admin
  const isLocked = hasExistingData && currentUserRole !== UserRole.ADMIN;

  // Initialize draft from existing records
  React.useEffect(() => {
    const initial: Record<string, 'PRESENT' | 'ABSENT' | 'LATE'> = {};
    students.forEach(s => {
      const record = existingRecordsForDate.find(e => e.studentId === s.id);
      initial[s.id] = record ? record.status : 'PRESENT'; // Default to PRESENT
    });
    setDraftRecords(initial);
  }, [selectedDate, attendanceRecords, currentClass, students]);

  const handleStatusChange = (studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    if (isLocked) return;
    setDraftRecords(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = () => {
    if (isLocked) return;
    
    const newRecords: Attendance[] = Object.keys(draftRecords).map(studentId => ({
      id: `att-${studentId}-${selectedDate}`,
      studentId,
      classId: currentClass.id,
      date: selectedDate,
      status: draftRecords[studentId],
      term: Term.FIRST, 
      session: '2024/2025'
    }));
    onSaveAttendance(newRecords);
  };

  const markAll = (status: 'PRESENT' | 'ABSENT') => {
      if (isLocked) return;
      const updated = { ...draftRecords };
      students.forEach(s => updated[s.id] = status);
      setDraftRecords(updated);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-xl font-bold text-gray-800">Attendance Register</h2>
           <p className="text-sm text-gray-500">Class: {currentClass.name} {currentClass.arm}</p>
        </div>
        <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Date:</label>
            <input 
                type="date" 
                value={selectedDate} 
                onChange={e => setSelectedDate(e.target.value)}
                className="border border-gray-300 rounded-md p-2 text-sm"
            />
        </div>
      </div>

      {isLocked && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-sm">
              <p className="font-bold">🔒 Attendance Locked</p>
              <p>Attendance for {selectedDate} has already been submitted. Only Administrators can modify daily attendance after submission.</p>
          </div>
      )}

      <div className="flex space-x-2 mb-4">
          <button onClick={() => markAll('PRESENT')} disabled={isLocked} className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded disabled:opacity-50">Mark All Present</button>
          <button onClick={() => markAll('ABSENT')} disabled={isLocked} className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded disabled:opacity-50">Mark All Absent</button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admission No</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map(student => (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                   <div className="flex justify-center space-x-2">
                       {['PRESENT', 'LATE', 'ABSENT'].map((status) => (
                           <button
                             key={status}
                             onClick={() => handleStatusChange(student.id, status as any)}
                             disabled={isLocked}
                             className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                                 draftRecords[student.id] === status
                                 ? status === 'PRESENT' ? 'bg-green-600 text-white' 
                                 : status === 'LATE' ? 'bg-yellow-500 text-white'
                                 : 'bg-red-600 text-white'
                                 : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                             } ${isLocked ? 'cursor-not-allowed opacity-70' : ''}`}
                           >
                               {status.charAt(0)}
                           </button>
                       ))}
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end">
          {!isLocked && <Button onClick={handleSave}>Save Attendance</Button>}
      </div>
    </div>
  );
};

export default AttendanceRegister;
