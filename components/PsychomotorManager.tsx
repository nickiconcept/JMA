
import React, { useState } from 'react';
import { Student, ClassDefinition, PsychomotorRecord, UserRole } from '../types';
import Button from './Button';
import { CURRENT_SESSION, CURRENT_TERM } from '../constants';

interface Props {
  students: Student[];
  classes: ClassDefinition[];
  records: PsychomotorRecord[];
  onSave: (record: PsychomotorRecord) => void;
  userRole: UserRole;
  assignedClassIds?: string[];
}

const PsychomotorManager: React.FC<Props> = ({ students, classes, records, onSave, userRole, assignedClassIds }) => {
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [currentRecord, setCurrentRecord] = useState<PsychomotorRecord | null>(null);

  // Filter classes based on role
  const visibleClasses = userRole === UserRole.ADMIN 
    ? classes 
    : classes.filter(c => assignedClassIds?.includes(c.id));

  const filteredStudents = students.filter(s => s.classId === selectedClassId);

  const handleEdit = (studentId: string) => {
    const existing = records.find(r => r.studentId === studentId && r.session === CURRENT_SESSION && r.term === CURRENT_TERM);
    if (existing) {
      setCurrentRecord({ ...existing });
    } else {
      setCurrentRecord({
        id: `psy-${Date.now()}`,
        studentId,
        session: CURRENT_SESSION,
        term: CURRENT_TERM,
        affective: { punctuality: 3, attendance: 3, reliability: 3, neatness: 3, politeness: 3 },
        psychomotor: { handwriting: 3, games: 3, communication: 3, creativity: 3, leadership: 3 }
      });
    }
    setEditingStudentId(studentId);
  };

  const handleSaveRecord = () => {
    if (currentRecord) {
      onSave(currentRecord);
      setEditingStudentId(null);
      setCurrentRecord(null);
    }
  };

  const RatingInput = ({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) => (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map(rating => (
          <button
            key={rating}
            onClick={() => onChange(rating)}
            className={`h-8 w-8 rounded-full text-xs font-bold transition-all ${
              value === rating 
              ? 'bg-blue-600 text-white shadow-md scale-110' 
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {rating}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold font-display text-slate-900">Psychomotor & Skills</h2>
          <p className="text-slate-500 text-sm">Assess students on affective and psychomotor domains.</p>
        </div>
        <div className="mt-4 md:mt-0 w-full md:w-64">
           <select 
              className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-medium text-slate-700"
              value={selectedClassId}
              onChange={(e) => { setSelectedClassId(e.target.value); setEditingStudentId(null); }}
           >
              <option value="">-- Select Class --</option>
              {visibleClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
           </select>
        </div>
      </div>

      {editingStudentId && currentRecord && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                 <div>
                    <h3 className="text-lg font-bold font-display text-slate-900">
                      {students.find(s => s.id === editingStudentId)?.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">{editingStudentId}</p>
                 </div>
                 <button onClick={() => setEditingStudentId(null)} className="text-gray-400 hover:text-gray-600">
                    <span className="text-2xl">×</span>
                 </button>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div>
                    <h4 className="text-xs font-bold uppercase text-blue-600 tracking-wider mb-4 border-b border-blue-100 pb-2">Affective Domain</h4>
                    <RatingInput label="Punctuality" value={currentRecord.affective.punctuality} onChange={(v) => setCurrentRecord({...currentRecord, affective: {...currentRecord.affective, punctuality: v}})} />
                    <RatingInput label="Attendance" value={currentRecord.affective.attendance} onChange={(v) => setCurrentRecord({...currentRecord, affective: {...currentRecord.affective, attendance: v}})} />
                    <RatingInput label="Reliability" value={currentRecord.affective.reliability} onChange={(v) => setCurrentRecord({...currentRecord, affective: {...currentRecord.affective, reliability: v}})} />
                    <RatingInput label="Neatness" value={currentRecord.affective.neatness} onChange={(v) => setCurrentRecord({...currentRecord, affective: {...currentRecord.affective, neatness: v}})} />
                    <RatingInput label="Politeness" value={currentRecord.affective.politeness} onChange={(v) => setCurrentRecord({...currentRecord, affective: {...currentRecord.affective, politeness: v}})} />
                 </div>
                 
                 <div>
                    <h4 className="text-xs font-bold uppercase text-purple-600 tracking-wider mb-4 border-b border-purple-100 pb-2">Psychomotor Skills</h4>
                    <RatingInput label="Handwriting" value={currentRecord.psychomotor.handwriting} onChange={(v) => setCurrentRecord({...currentRecord, psychomotor: {...currentRecord.psychomotor, handwriting: v}})} />
                    <RatingInput label="Games/Sports" value={currentRecord.psychomotor.games} onChange={(v) => setCurrentRecord({...currentRecord, psychomotor: {...currentRecord.psychomotor, games: v}})} />
                    <RatingInput label="Communication" value={currentRecord.psychomotor.communication} onChange={(v) => setCurrentRecord({...currentRecord, psychomotor: {...currentRecord.psychomotor, communication: v}})} />
                    <RatingInput label="Creativity" value={currentRecord.psychomotor.creativity} onChange={(v) => setCurrentRecord({...currentRecord, psychomotor: {...currentRecord.psychomotor, creativity: v}})} />
                    <RatingInput label="Leadership" value={currentRecord.psychomotor.leadership} onChange={(v) => setCurrentRecord({...currentRecord, psychomotor: {...currentRecord.psychomotor, leadership: v}})} />
                 </div>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 rounded-b-2xl">
                 <Button variant="outline" onClick={() => setEditingStudentId(null)}>Cancel</Button>
                 <Button onClick={handleSaveRecord}>Save Assessment</Button>
              </div>
           </div>
        </div>
      )}

      {selectedClassId && (
        <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
           <table className="min-w-full divide-y divide-slate-100">
             <thead className="bg-slate-50/50">
               <tr>
                 <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Admission No</th>
                 <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                 <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                 <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-50">
               {filteredStudents.map(student => {
                 const hasRecord = records.some(r => r.studentId === student.id && r.session === CURRENT_SESSION && r.term === CURRENT_TERM);
                 return (
                   <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-500">{student.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">{student.name}</td>
                      <td className="px-6 py-4 text-center">
                         <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${hasRecord ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                            {hasRecord ? 'Rated' : 'Pending'}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button onClick={() => handleEdit(student.id)} className="text-blue-600 hover:text-blue-800 font-bold text-sm">
                            {hasRecord ? 'Edit Rating' : 'Rate Student'}
                         </button>
                      </td>
                   </tr>
                 );
               })}
               {filteredStudents.length === 0 && (
                 <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400">No students found in this class.</td></tr>
               )}
             </tbody>
           </table>
        </div>
      )}
    </div>
  );
};

export default PsychomotorManager;
