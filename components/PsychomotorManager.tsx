
import React, { useState, useEffect } from 'react';
import { Student, ClassDefinition, PsychomotorRecord, UserRole, SchoolConfig, SkillDefinition } from '../types';
import Button from './Button';
import { CURRENT_SESSION, CURRENT_TERM } from '../constants';
import { Cog6ToothIcon, TrashIcon, SparklesIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';

const RatingInput: React.FC<{ label: string, value: number, onChange: (v: number) => void }> = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
    <label className="text-sm font-medium text-gray-700 capitalize">{label.replace(/_/g, ' ')}</label>
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map(rating => (
        <button
          key={rating}
          type="button"
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

interface Props {
  students: Student[];
  classes: ClassDefinition[];
  records: PsychomotorRecord[];
  onSave: (record: PsychomotorRecord) => void;
  userRole: UserRole;
  assignedClassIds?: string[];
  config: SchoolConfig;
  onUpdateConfig: (config: SchoolConfig) => void;
}

const PsychomotorManager: React.FC<Props> = ({ students, classes, records, onSave, userRole, assignedClassIds, config, onUpdateConfig }) => {
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [currentRecord, setCurrentRecord] = useState<PsychomotorRecord | null>(null);
  const [showSkillConfig, setShowSkillConfig] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<'AFFECTIVE' | 'PSYCHOMOTOR'>('AFFECTIVE');

  // Auto-select for Form Master
  useEffect(() => {
      if (userRole === UserRole.FORM_MASTER && assignedClassIds && assignedClassIds.length === 1 && !selectedClassId) {
          setSelectedClassId(assignedClassIds[0]);
      }
  }, [userRole, assignedClassIds, selectedClassId]);

  // Filter classes based on role
  const visibleClasses = userRole === UserRole.ADMIN || userRole === UserRole.PRINCIPAL
    ? classes 
    : classes.filter(c => assignedClassIds?.includes(c.id));

  const filteredStudents = students.filter(s => s.classId === selectedClassId);

  // Default skills
  const defaultAffective = ["punctuality", "attendance", "reliability", "neatness", "politeness"];
  const defaultPsychomotor = ["handwriting", "games", "communication", "creativity", "leadership"];

  const customAffective = (config.customSkills || []).filter(s => s.category === 'AFFECTIVE');
  const customPsychomotor = (config.customSkills || []).filter(s => s.category === 'PSYCHOMOTOR');

  const handleEdit = (studentId: string) => {
    const existing = records.find(r => r.studentId === studentId && r.session === CURRENT_SESSION && r.term === CURRENT_TERM);
    if (existing) {
      setCurrentRecord({ ...existing });
    } else {
      setCurrentRecord({
        id: `psy-${Date.now()}-${studentId}`,
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

  const addSkill = () => {
      if (!newSkillName.trim()) return;
      const id = newSkillName.toLowerCase().replace(/\s+/g, '_');
      const newSkill: SkillDefinition = { id, name: newSkillName, category: newSkillCategory };
      const updatedSkills = [...(config.customSkills || []), newSkill];
      onUpdateConfig({ ...config, customSkills: updatedSkills });
      setNewSkillName('');
  };

  const removeSkill = (id: string) => {
      const updatedSkills = (config.customSkills || []).filter(s => s.id !== id);
      onUpdateConfig({ ...config, customSkills: updatedSkills });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold font-display text-slate-900">Psychomotor & Skills</h2>
          <p className="text-slate-500 text-sm">Assess students on affective and psychomotor domains.</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
            {userRole === UserRole.ADMIN && (
                <Button variant="outline" onClick={() => setShowSkillConfig(true)} className="px-3">
                    <Cog6ToothIcon className="h-5 w-5" />
                </Button>
            )}
            <select 
                className="w-full md:w-64 px-4 py-2 rounded-xl border border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-medium text-slate-700"
                value={selectedClassId}
                onChange={(e) => { setSelectedClassId(e.target.value); setEditingStudentId(null); }}
            >
                <option value="">-- Select Class --</option>
                {visibleClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
        </div>
      </div>

      {/* Skill Configuration Modal */}
      {showSkillConfig && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 animate-in zoom-in duration-200">
                 <div className="flex justify-between items-center mb-4">
                     <h3 className="text-lg font-bold text-slate-900">Configure Custom Skills</h3>
                     <button onClick={() => setShowSkillConfig(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
                 </div>
                 
                 <div className="space-y-4 mb-6">
                     <div className="flex gap-2">
                         <input 
                            type="text" placeholder="Skill Name (e.g. Public Speaking)" 
                            className="flex-1 border p-2 rounded text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                            value={newSkillName} onChange={e => setNewSkillName(e.target.value)}
                         />
                         <select 
                            className="border p-2 rounded text-sm outline-none"
                            value={newSkillCategory} onChange={e => setNewSkillCategory(e.target.value as any)}
                         >
                             <option value="AFFECTIVE">Affective</option>
                             <option value="PSYCHOMOTOR">Psychomotor</option>
                         </select>
                         <Button onClick={addSkill} disabled={!newSkillName} className="py-1 px-3 text-sm">+</Button>
                     </div>
                 </div>

                 <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                     <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Existing Custom Skills</h4>
                     {(!config.customSkills || config.customSkills.length === 0) && <p className="text-sm text-gray-400 italic">No custom skills added yet.</p>}
                     <ul className="space-y-2">
                         {config.customSkills?.map(s => (
                             <li key={s.id} className="flex justify-between items-center bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                                 <span className="text-sm font-medium">{s.name} <span className="text-[10px] text-gray-400 uppercase ml-1">[{s.category}]</span></span>
                                 <button onClick={() => removeSkill(s.id)} className="text-red-400 hover:text-red-600 p-1">
                                     <TrashIcon className="h-4 w-4" />
                                 </button>
                             </li>
                         ))}
                     </ul>
                 </div>
             </div>
        </div>
      )}

      {editingStudentId && currentRecord && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10 shadow-sm">
                 <div>
                    <h3 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2">
                      <SparklesIcon className="h-5 w-5 text-blue-500" />
                      {students.find(s => s.id === editingStudentId)?.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono tracking-tight">{editingStudentId}</p>
                 </div>
                 <button onClick={() => setEditingStudentId(null)} className="text-gray-400 hover:text-gray-600 p-2 bg-gray-50 rounded-full transition-colors">
                    <span className="text-2xl leading-none">×</span>
                 </button>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-1">
                    <h4 className="text-[10px] font-black uppercase text-blue-600 tracking-widest mb-4 border-b border-blue-100 pb-2">Affective Domain</h4>
                    {defaultAffective.map(key => (
                         <RatingInput key={key} label={key} value={currentRecord.affective[key] || 0} onChange={(v) => setCurrentRecord({...currentRecord, affective: {...currentRecord.affective, [key]: v}})} />
                    ))}
                    {customAffective.map(skill => (
                         <RatingInput key={skill.id} label={skill.name} value={currentRecord.affective[skill.id] || 0} onChange={(v) => setCurrentRecord({...currentRecord, affective: {...currentRecord.affective, [skill.id]: v}})} />
                    ))}
                 </div>
                 
                 <div className="space-y-1">
                    <h4 className="text-[10px] font-black uppercase text-purple-600 tracking-widest mb-4 border-b border-purple-100 pb-2">Psychomotor Skills</h4>
                    {defaultPsychomotor.map(key => (
                         <RatingInput key={key} label={key} value={currentRecord.psychomotor[key] || 0} onChange={(v) => setCurrentRecord({...currentRecord, psychomotor: {...currentRecord.psychomotor, [key]: v}})} />
                    ))}
                    {customPsychomotor.map(skill => (
                         <RatingInput key={skill.id} label={skill.name} value={currentRecord.psychomotor[skill.id] || 0} onChange={(v) => setCurrentRecord({...currentRecord, psychomotor: {...currentRecord.psychomotor, [skill.id]: v}})} />
                    ))}
                 </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-gray-100 flex justify-end gap-3 rounded-b-2xl sticky bottom-0 z-10">
                 <Button variant="outline" onClick={() => setEditingStudentId(null)}>Cancel</Button>
                 <Button onClick={handleSaveRecord} className="shadow-lg shadow-blue-500/20">Save Assessment</Button>
              </div>
           </div>
        </div>
      )}

      {selectedClassId ? (
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
                         <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${hasRecord ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                            {hasRecord ? 'Assessment Completed' : 'Pending'}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button onClick={() => handleEdit(student.id)} className="text-blue-600 hover:text-blue-800 font-bold text-sm transition-colors">
                            {hasRecord ? 'Edit Rating' : 'Rate Student'}
                         </button>
                      </td>
                   </tr>
                 );
               })}
               {filteredStudents.length === 0 && (
                 <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">No students found in this class level.</td></tr>
               )}
             </tbody>
           </table>
        </div>
      ) : (
          <div className="bg-white p-20 text-center rounded-2xl border border-dashed border-slate-300">
              <div className="h-16 w-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                  <SparklesIcon className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-700">Choose a class to assess</h3>
              <p className="text-slate-400 text-sm max-w-xs mx-auto mt-2">Use the class selector above to load the student list for psychomotor and affective domain ratings.</p>
          </div>
      )}
    </div>
  );
};

export default PsychomotorManager;
