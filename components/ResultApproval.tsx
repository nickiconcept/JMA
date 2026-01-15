import React, { useState } from 'react';
import { Result, Student, ClassDefinition, Subject, UserRole, User } from '../types';
import Button from './Button';

interface Props {
  user: User;
  results: Result[];
  students: Student[];
  classes: ClassDefinition[];
  subjects: Subject[];
  onUpdateResult: (result: Result) => void;
}

const ResultApproval: React.FC<Props> = ({ user, results, students, classes, subjects, onUpdateResult }) => {
  const [filterClassId, setFilterClassId] = useState<string>('');
  
  // Filter visible classes based on role
  const visibleClasses = user.role === UserRole.ADMIN || user.role === UserRole.PRINCIPAL
      ? classes
      : classes.filter(c => user.assignedClassIds?.includes(c.id));

  // If Form Master, they should only see results for their class
  const filteredResults = results.filter(r => {
      const student = students.find(s => s.id === r.studentId);
      if (!student) return false;
      if (filterClassId && student.classId !== filterClassId) return false;
      
      if (user.role === UserRole.FORM_MASTER) {
          return user.assignedClassIds?.includes(student.classId);
      }
      return true;
  });

  const handleRemarkChange = (result: Result, field: 'formMasterRemark' | 'principalRemark', value: string) => {
      onUpdateResult({ ...result, [field]: value });
  };

  const toggleApproval = (result: Result) => {
      onUpdateResult({ ...result, isApproved: !result.isApproved, isLocked: !result.isApproved });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold text-gray-800">Result Remarks & Approval</h2>
         <select 
            className="border-gray-300 rounded-md border p-2"
            value={filterClassId}
            onChange={e => setFilterClassId(e.target.value)}
         >
             <option value="">-- All Accessible Classes --</option>
             {visibleClasses.map(c => <option key={c.id} value={c.id}>{c.name} {c.arm}</option>)}
         </select>
      </div>

      <div className="bg-white shadow overflow-x-auto rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                  <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Grade</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          {user.role === UserRole.FORM_MASTER ? 'Form Master Remark' : 'Principal Remark'}
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                  {filteredResults.map(r => {
                      const student = students.find(s => s.id === r.studentId);
                      const subject = subjects.find(s => s.id === r.subjectId);
                      return (
                          <tr key={r.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {student?.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {subject?.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-gray-700">
                                  {r.total}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                  <span className={`px-2 text-xs rounded-full font-bold ${r.grade === 'F' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                      {r.grade}
                                  </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                  {user.role === UserRole.FORM_MASTER && (
                                      <input 
                                          type="text" 
                                          className="w-full border-gray-300 rounded border p-1 text-xs"
                                          placeholder="Enter remark..."
                                          value={r.formMasterRemark || ''}
                                          onChange={e => handleRemarkChange(r, 'formMasterRemark', e.target.value)}
                                          onBlur={() => onUpdateResult(r)} // Save on blur
                                      />
                                  )}
                                  {user.role === UserRole.PRINCIPAL && (
                                      <input 
                                          type="text" 
                                          className="w-full border-gray-300 rounded border p-1 text-xs"
                                          placeholder="Enter remark..."
                                          value={r.principalRemark || ''}
                                          onChange={e => handleRemarkChange(r, 'principalRemark', e.target.value)}
                                          onBlur={() => onUpdateResult(r)}
                                      />
                                  )}
                                  {user.role === UserRole.ADMIN && (
                                      <span className="text-xs italic">View as Principal/Form Master to edit</span>
                                  )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                  {(user.role === UserRole.PRINCIPAL || user.role === UserRole.ADMIN) && (
                                      <Button 
                                          variant={r.isApproved ? 'secondary' : 'outline'}
                                          className="text-xs px-2 py-1"
                                          onClick={() => toggleApproval(r)}
                                      >
                                          {r.isApproved ? 'Approved' : 'Approve'}
                                      </Button>
                                  )}
                                  {user.role === UserRole.FORM_MASTER && (
                                      <span className={`text-xs ${r.isApproved ? 'text-green-600' : 'text-yellow-600'}`}>
                                          {r.isApproved ? 'Approved' : 'Pending'}
                                      </span>
                                  )}
                              </td>
                          </tr>
                      );
                  })}
                  {filteredResults.length === 0 && (
                      <tr>
                          <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No results found matching criteria.</td>
                      </tr>
                  )}
              </tbody>
          </table>
      </div>
    </div>
  );
};

export default ResultApproval;
