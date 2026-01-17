
import React, { useState } from 'react';
import { Pin, ClassDefinition, Student } from '../types';
import Button from './Button';

interface Props {
  pins: Pin[];
  classes: ClassDefinition[];
  students: Student[];
  onGenerateForClass: (classId: string, amountPerStudent: number) => void;
  onAssignStudent: (pinCode: string, studentId: string) => void;
}

const PinManager: React.FC<Props> = ({ pins, classes, students, onGenerateForClass, onAssignStudent }) => {
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [filterClassId, setFilterClassId] = useState<string>('');

  // Count students in selected class for preview
  const studentCount = selectedClassId ? students.filter(s => s.classId === selectedClassId).length : 0;
  
  // Filter displayed pins
  const displayedPins = filterClassId 
    ? pins.filter(p => {
        const student = students.find(s => s.id === p.assignedStudentId);
        return student && student.classId === filterClassId;
      })
    : pins;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-600">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Auto-Generate Student PINs</h2>
        <p className="text-sm text-gray-500 mb-4">Select a class to automatically generate and assign result checking PINs for all students in that class.</p>
        
        <div className="flex flex-col md:flex-row items-end gap-4">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Target Class</label>
            <select 
              className="w-full border-gray-300 rounded-md p-2 border"
              value={selectedClassId}
              onChange={e => setSelectedClassId(e.target.value)}
            >
                <option value="">-- Select Class --</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="w-full md:w-auto">
             <Button 
                onClick={() => onGenerateForClass(selectedClassId, 1)} 
                disabled={!selectedClassId || studentCount === 0}
                className="w-full md:w-auto"
             >
                {studentCount > 0 ? `Generate for ${studentCount} Students` : 'Generate PINs'}
             </Button>
          </div>
        </div>
        {selectedClassId && studentCount === 0 && (
            <p className="text-red-500 text-xs mt-2">No students found in the selected class.</p>
        )}
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="text-lg font-bold text-gray-700">Active PIN Database</h3>
          <select 
              className="border-gray-300 rounded-md p-2 text-sm border"
              value={filterClassId}
              onChange={e => setFilterClassId(e.target.value)}
            >
                <option value="">-- Filter by Class --</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PIN Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedPins.map((pin, idx) => {
                  const student = students.find(s => s.id === pin.assignedStudentId);
                  const studentName = student ? `${student.name} (${student.id})` : 'Unassigned';
                  return (
                    <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm font-bold text-gray-800 tracking-wider">
                        {pin.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        pin.usageCount >= pin.maxUsage ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                        {pin.usageCount >= pin.maxUsage ? 'Used Up' : 'Active'}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {pin.assignedStudentId ? (
                             <span className="flex flex-col">
                                <span>{student?.name}</span>
                                <span className="text-xs text-gray-500">{pin.assignedStudentId}</span>
                             </span>
                        ) : (
                            <input 
                            type="text"
                            placeholder="Assign ID"
                            className="border border-gray-300 rounded px-2 py-1 text-xs w-32 focus:ring-green-500 focus:border-green-500"
                            value={pin.assignedStudentId || ''}
                            onChange={(e) => onAssignStudent(pin.code, e.target.value)}
                            disabled={pin.usageCount > 0} 
                            />
                        )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {pin.usageCount} / {pin.maxUsage}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {pin.expiryDate}
                    </td>
                    </tr>
                );
              })}
              {displayedPins.length === 0 && (
                  <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No PINs found.</td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PinManager;
