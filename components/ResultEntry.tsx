
import React, { useState, useEffect } from 'react';
import { Result, Assessment, Student } from '../types';
import { GRADING_SCALE, MAX_SCORES } from '../constants';
import Button from './Button';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';

interface Props {
  student: Student;
  subject: string;
  subjectId: string;
  session: string;
  term: string;
  onSave: (result: Result) => void;
  existingResult?: Result;
  isReadOnly?: boolean; 
}

const ResultEntry: React.FC<Props> = ({ student, subject, subjectId, session, term, onSave, existingResult, isReadOnly = false }) => {
  const [assessment, setAssessment] = useState<Assessment>(
    existingResult?.assessment || { ca1: 0, ca2: 0, assignment: 0, notes: 0, exam: 0 }
  );
  const [total, setTotal] = useState(0);
  const [grade, setGrade] = useState('');
  const [remark, setRemark] = useState(existingResult?.teacherRemark || '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (existingResult) {
      setAssessment(existingResult.assessment);
      setRemark(existingResult.teacherRemark || '');
    } else {
      setAssessment({ ca1: 0, ca2: 0, assignment: 0, notes: 0, exam: 0 });
      setRemark('');
    }
  }, [existingResult, student.id, subjectId]);

  useEffect(() => {
    const sum = 
      Number(assessment.ca1) + 
      Number(assessment.ca2) + 
      Number(assessment.assignment) + 
      Number(assessment.notes) + 
      Number(assessment.exam);
    
    setTotal(sum);

    const gradeEntry = GRADING_SCALE.find(g => sum >= g.min && sum <= g.max);
    const calculatedGrade = gradeEntry ? gradeEntry.grade : 'F';
    setGrade(calculatedGrade);

    if (!isReadOnly && gradeEntry) {
         setRemark(gradeEntry.remark);
    }

  }, [assessment]);

  const handleChange = (field: keyof Assessment, value: string) => {
    if (isReadOnly) return;
    
    // Allow empty string to let user delete
    if (value === '') {
        setAssessment(prev => ({ ...prev, [field]: 0 }));
        return;
    }

    const numValue = Number(value);
    let max = 0;
    let label = '';

    if (field === 'exam') { max = MAX_SCORES.EXAM; label='Exam'; }
    else if (field === 'ca1') { max = MAX_SCORES.CA1; label='1st CA'; }
    else if (field === 'ca2') { max = MAX_SCORES.CA2; label='2nd CA'; }
    else if (field === 'assignment') { max = MAX_SCORES.ASSIGNMENT; label='Assignment'; }
    else if (field === 'notes') { max = MAX_SCORES.NOTES; label='Notes'; }

    if (numValue > max) {
        setError(`${label} cannot exceed ${max} marks.`);
        setTimeout(() => setError(null), 3000);
        return; // Reject the change
    }

    if (numValue < 0) return;

    setError(null);
    setAssessment(prev => ({ ...prev, [field]: numValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;

    const result: Result = {
      id: existingResult?.id || `res-${Date.now()}-${student.id}`,
      studentId: student.id,
      subjectId: subjectId,
      session: session as any,
      term: term as any,
      assessment,
      total,
      grade,
      teacherRemark: remark,
      isApproved: false,
      isLocked: false,
      auditHistory: []
    };
    onSave(result);
  };

  const inputClass = "w-full px-3 py-3 rounded-lg border border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none font-medium text-slate-700 disabled:bg-slate-50 disabled:text-slate-400 text-base sm:text-sm";
  const labelClass = "block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5";

  return (
    <form onSubmit={handleSubmit} className={`bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 ${isReadOnly ? 'opacity-80 grayscale-[0.5]' : ''} relative`}>
      {error && (
          <div className="absolute top-2 right-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-sm animate-pulse z-10">
              <ExclamationCircleIcon className="h-4 w-4 mr-1"/> {error}
          </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-6 gap-4 border-b border-slate-100 pb-4">
        <div>
           <h4 className="text-base font-bold font-display text-slate-800">{student.name}</h4>
           <div className="flex items-center space-x-2 text-sm text-slate-500 mt-0.5">
             <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-slate-600">{student.id}</span>
           </div>
        </div>
        <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total</span>
               <span className="text-2xl font-black text-blue-900 font-display leading-none">{total}</span>
            </div>
            <div className={`h-10 w-10 flex items-center justify-center rounded-lg text-lg font-bold border-2 ${grade === 'F' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                {grade}
            </div>
        </div>
      </div>

      {isReadOnly && (
        <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm font-medium flex items-center">
            Submitted & Locked.
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-6">
        <div>
          <label className={labelClass}>1st CA (Max 10)</label>
          <input 
            type="number" min="0" max="10" 
            className={inputClass}
            value={assessment.ca1 === 0 ? '' : assessment.ca1}
            onChange={(e) => handleChange('ca1', e.target.value)}
            placeholder="0"
            required disabled={isReadOnly}
            inputMode="numeric"
          />
        </div>
        <div>
          <label className={labelClass}>2nd CA (Max 10)</label>
          <input 
            type="number" min="0" max="10" 
            className={inputClass}
            value={assessment.ca2 === 0 ? '' : assessment.ca2}
            onChange={(e) => handleChange('ca2', e.target.value)}
            placeholder="0"
            required disabled={isReadOnly}
            inputMode="numeric"
          />
        </div>
        <div>
          <label className={labelClass}>Assign (Max 10)</label>
          <input 
            type="number" min="0" max="10" 
            className={inputClass}
            value={assessment.assignment === 0 ? '' : assessment.assignment}
            onChange={(e) => handleChange('assignment', e.target.value)}
            placeholder="0"
            required disabled={isReadOnly}
            inputMode="numeric"
          />
        </div>
        <div>
          <label className={labelClass}>Notes (Max 10)</label>
          <input 
            type="number" min="0" max="10" 
            className={inputClass}
            value={assessment.notes === 0 ? '' : assessment.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="0"
            required disabled={isReadOnly}
            inputMode="numeric"
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <label className="block text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1.5">Exam (Max 60)</label>
          <input 
            type="number" min="0" max="60" 
            className={`${inputClass} bg-blue-50/50 border-blue-100 focus:border-blue-500`}
            value={assessment.exam === 0 ? '' : assessment.exam}
            onChange={(e) => handleChange('exam', e.target.value)}
            placeholder="0"
            required disabled={isReadOnly}
            inputMode="numeric"
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-bold text-slate-700">Remark</label>
            <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded">Auto-filled</span>
        </div>
        <textarea 
            className={`${inputClass} resize-none`}
            rows={1}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Enter remark..."
            disabled={isReadOnly}
        />
      </div>

      {!isReadOnly && (
        <Button type="submit" className="w-full py-3 text-sm shadow-lg shadow-blue-500/20">
          Save Result
        </Button>
      )}
    </form>
  );
};

export default ResultEntry;
