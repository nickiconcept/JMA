
import React, { useState } from 'react';
import { ClassDefinition, User, UserRole, Student, Result, Subject, SchoolConfig, PsychomotorRecord } from '../types';
import Button from './Button';
import StudentReportCard from './StudentReportCard';
import { EyeIcon } from '@heroicons/react/24/solid';

interface Props {
  classes: ClassDefinition[];
  users: User[];
  onAdd: (cls: ClassDefinition) => void;
  onUpdate: (cls: ClassDefinition) => void;
  onDelete: (id: string) => void;
  currentUser?: User;
  students?: Student[];
  results?: Result[];
  subjects?: Subject[];
  schoolConfig?: SchoolConfig;
  psychomotorRecords?: PsychomotorRecord[];
  onViewStudentResult?: (studentId: string) => boolean; 
  viewCounts?: Record<string, number>; 
}

const ClassManager: React.FC<Props> = ({ 
    classes, users, onAdd, onUpdate, onDelete, currentUser,
    students = [], results = [], subjects = [], schoolConfig, psychomotorRecords = [],
    onViewStudentResult, viewCounts = {}
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentClass, setCurrentClass] = useState<Partial<ClassDefinition>>({});
  const [viewingStudentId, setViewingStudentId] = useState<string | null>(null);

  const isAdmin = currentUser?.role === UserRole.ADMIN;
  const isFormMaster = currentUser?.role === UserRole.FORM_MASTER;
  const formMasters = users.filter(u => u.role === UserRole.FORM_MASTER || u.role === UserRole.TEACHER);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentClass.id && classes.some(c => c.id === currentClass.id && isEditing)) {
       onUpdate(currentClass as ClassDefinition);
    } else {
       const newId = currentClass.name?.replace(/\s/g, '').toUpperCase() || `CLS${Date.now()}`;
       onAdd({ ...currentClass, id: newId } as ClassDefinition);
    }
    setIsEditing(false);
    setCurrentClass({});
  };

  const attemptViewResult = (studentId: string) => {
      if (!onViewStudentResult) return;
      
      const canView = onViewStudentResult(studentId);
      if (canView) {
          setViewingStudentId(studentId);
      }
      // If false, the parent component handles the request prompt
  };

  // --- Form Master Logic ---
  if (isFormMaster && !isAdmin) {
      const myClassId = currentUser?.assignedClassIds?.[0];
      const myClass = classes.find(c => c.id === myClassId);
      const myStudents = students.filter(s => s.classId === myClassId);

      if (viewingStudentId) {
          const student = students.find(s => s.id === viewingStudentId);
          if (!student) return <div>Student not found</div>;

          return (
              <div className="space-y-4">
                  <div className="flex items-center justify-between">
                      <Button variant="outline" onClick={() => setViewingStudentId(null)}>← Back to List</Button>
                      <div className="text-sm font-bold text-slate-500 uppercase tracking-wider bg-yellow-50 text-yellow-700 px-3 py-1 rounded border border-yellow-200">
                          View Only Mode
                      </div>
                  </div>
                  <StudentReportCard 
                      student={student}
                      results={results.filter(r => r.studentId === student.id && r.session === schoolConfig?.activeSession && r.term === schoolConfig?.activeTerm)} 
                      allResults={results.filter(r => r.studentId === student.id)}
                      subjects={subjects}
                      classes={classes}
                      schoolConfig={schoolConfig}
                      psychomotorRecord={psychomotorRecords.find(p => p.studentId === student.id && p.session === schoolConfig?.activeSession && p.term === schoolConfig?.activeTerm)}
                      formMaster={currentUser}
                      hidePrintButton={true} 
                  />
              </div>
          );
      }

      if (!myClass) {
          return (
              <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
                  <p className="text-slate-500">You are not assigned to any class as a Form Master.</p>
              </div>
          );
      }

      return (
          <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h2 className="text-2xl font-bold text-gray-800">My Class: {myClass.name}</h2>
                  <p className="text-slate-500 text-sm mt-1">Manage and view students in your designated class.</p>
                  <p className="text-xs text-orange-600 mt-2 font-bold bg-orange-50 inline-block px-2 py-1 rounded border border-orange-100">
                      Limit: 2 full result views per student. Request admin permission for more.
                  </p>
              </div>

              <div className="bg-white shadow overflow-hidden rounded-xl border border-slate-200">
                  <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                          <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission No</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Views Used</th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                          {myStudents.map((s) => {
                              const key = `${currentUser?.id}_${s.id}`;
                              const views = viewCounts[key] || 0;
                              return (
                              <tr key={s.id} className="hover:bg-slate-50">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-500">{s.id}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{s.name}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-center">
                                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${s.promotionStatus === 'PROMOTED' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                                          {s.promotionStatus}
                                      </span>
                                  </td>
                                   <td className="px-6 py-4 whitespace-nowrap text-center">
                                      <span className={`px-2 py-0.5 text-xs font-bold rounded ${views >= 2 ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
                                          {views} / 2
                                      </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                      <button 
                                          onClick={() => attemptViewResult(s.id)}
                                          className={`flex items-center justify-end gap-1 ml-auto text-blue-600 hover:text-blue-900`}
                                      >
                                          <EyeIcon className="h-4 w-4" /> {views >= 2 ? 'Request View' : 'View Result'}
                                      </button>
                                  </td>
                              </tr>
                          )})}
                          {myStudents.length === 0 && (
                              <tr>
                                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">No students found in this class.</td>
                              </tr>
                          )}
                      </tbody>
                  </table>
              </div>
          </div>
      );
  }

  // --- Admin Logic (Default) ---
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Class Management</h2>
        {isAdmin && <Button onClick={() => setIsEditing(true)}>+ Add New Class</Button>}
      </div>

      {isEditing && isAdmin && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-bold mb-4">Add / Edit Class</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Class Name</label>
              <select 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                value={currentClass.name || ''}
                onChange={e => setCurrentClass({...currentClass, name: e.target.value})}
                required
              >
                <option value="">Select Level</option>
                <option value="JSS 1">JSS 1</option>
                <option value="JSS 2">JSS 2</option>
                <option value="JSS 3">JSS 3</option>
                <option value="SSS 1">SSS 1</option>
                <option value="SSS 2">SSS 2</option>
                <option value="SSS 3">SSS 3</option>
              </select>
            </div>
            {/* Arms Option Removed */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Form Master</label>
              <select 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                value={currentClass.formMasterId || ''}
                onChange={e => setCurrentClass({...currentClass, formMasterId: e.target.value})}
              >
                <option value="">None Assigned</option>
                {formMasters.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button type="submit">Save Class</Button>
            </div>
          </form>
        </div>
      )}

      {!isAdmin && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded text-sm">
              You have read-only access to class configuration.
          </div>
      )}

      <div className="bg-white shadow overflow-hidden rounded-md">
        <ul className="divide-y divide-gray-200">
          {classes.map(c => {
            const master = users.find(u => u.id === c.formMasterId);
            return (
              <li key={c.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div>
                  <h4 className="text-lg font-bold text-gray-800">{c.name}</h4>
                  <p className="text-sm text-gray-500">
                    Form Master: <span className="font-medium text-green-700">{master ? master.name : 'Not Assigned'}</span>
                  </p>
                </div>
                {isAdmin && (
                  <div className="flex space-x-2">
                     <button onClick={() => { setCurrentClass(c); setIsEditing(true); }} className="text-blue-600 text-sm hover:underline">Edit</button>
                     <button onClick={() => onDelete(c.id)} className="text-red-600 text-sm hover:underline">Delete</button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ClassManager;
