
import React, { useState, useEffect } from 'react';
import { Result, Assessment, Student } from '../types';
import { GRADING_SCALE, MAX_SCORES, CURRENT_SESSION, CURRENT_TERM } from '../constants';
import Button from './Button';
import { generateStudentRemark } from '../services/geminiService';
import { SparklesIcon } from '@heroicons/react/24/solid';

interface Props {
  student: Student;
  subject: string;
  subjectId: string;
  onSave: (result: Result) => void;
  existingResult?: Result;
  isReadOnly?: boolean; 
}

const ResultEntry: React.FC<Props> = ({ student, subject, subjectId, onSave, existingResult, isReadOnly = false }) => {
  const [assessment, setAssessment] = useState<Assessment>(
    existingResult?.assessment || { ca1: 0, ca2: 0, assignment: 0, notes: 0, exam: 0 }
  );
  const [total, setTotal] = useState(0);
  const [grade, setGrade] = useState('');
  const [remark, setRemark] = useState(existingResult?.teacherRemark || '');
  const [isGeneratingRemark, setIsGeneratingRemark] = useState(false);

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

    // Auto-generate remark if not manually edited or readonly
    if (!isReadOnly && gradeEntry) {
         // Only set if remark is empty or matches a standard remark to avoid overwriting custom text excessively
         // For now, we update it reactively as requested
         setRemark(gradeEntry.remark);
    }

  }, [assessment]);

  const handleChange = (field: keyof Assessment, value: string) => {
    if (isReadOnly) return;
    
    const numValue = Number(value);
    let max = 0;
    if (field === 'exam') max = MAX_SCORES.EXAM;
    else if (field === 'ca1') max = MAX_SCORES.CA1;
    else if (field === 'ca2') max = MAX_SCORES.CA2;
    else if (field === 'assignment') max = MAX_SCORES.ASSIGNMENT;
    else if (field === 'notes') max = MAX_SCORES.NOTES;

    if (numValue > max) return; 

    setAssessment(prev => ({ ...prev, [field]: numValue }));
  };

  const handleGenerateRemark = async () => {
    if (isReadOnly) return;
    setIsGeneratingRemark(true);
    const newRemark = await generateStudentRemark(student.name, subject, total, grade);
    setRemark(newRemark);
    setIsGeneratingRemark(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;

    const result: Result = {
      id: existingResult?.id || `res-${Date.now()}`,
      studentId: student.id,
      subjectId: subjectId,
      session: CURRENT_SESSION,
      term: CURRENT_TERM,
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

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-medium text-slate-700 disabled:bg-slate-50 disabled:text-slate-400";
  const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2";

  return (
    <form onSubmit={handleSubmit} className={`bg-white p-8 rounded-2xl shadow-sm border border-slate-100 ${isReadOnly ? 'opacity-80 grayscale-[0.5]' : ''}`}>
      <div className="flex flex-col md:flex-row justify-between md:items-start mb-8 gap-4 border-b border-slate-100 pb-6">
        <div>
           <h4 className="text-lg font-bold font-display text-slate-800">{student.name}</h4>
           <div className="flex items-center space-x-2 text-sm text-slate-500 mt-1">
             <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-mono font-bold text-slate-600">{student.id}</span>
             <span>•</span>
             <span className="font-medium">{subject}</span>
           </div>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Score</span>
               <span className="text-3xl font-black text-blue-900 font-display leading-none">{total}</span>
            </div>
            <div className={`h-12 w-12 flex items-center justify-center rounded-xl text-lg font-bold border-2 ${grade === 'F' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                {grade}
            </div>
        </div>
      </div>

      {isReadOnly && (
        <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm font-medium flex items-center">
            Submitted & Locked. Contact Admin to modify.
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
        <div>
          <label className={labelClass}>1st CA (10)</label>
          <input 
            type="number" min="0" max="10" 
            className={inputClass}
            value={assessment.ca1}
            onChange={(e) => handleChange('ca1', e.target.value)}
            required disabled={isReadOnly}
          />
        </div>
        <div>
          <label className={labelClass}>2nd CA (10)</label>
          <input 
            type="number" min="0" max="10" 
            className={inputClass}
            value={assessment.ca2}
            onChange={(e) => handleChange('ca2', e.target.value)}
            required disabled={isReadOnly}
          />
        </div>
        <div>
          <label className={labelClass}>Assign (10)</label>
          <input 
            type="number" min="0" max="10" 
            className={inputClass}
            value={assessment.assignment}
            onChange={(e) => handleChange('assignment', e.target.value)}
            required disabled={isReadOnly}
          />
        </div>
        <div>
          <label className={labelClass}>Notes (10)</label>
          <input 
            type="number" min="0" max="10" 
            className={inputClass}
            value={assessment.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            required disabled={isReadOnly}
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <label className="block text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Exam (60)</label>
          <input 
            type="number" min="0" max="60" 
            className={`${inputClass} bg-blue-50/50 border-blue-100 focus:border-blue-500`}
            value={assessment.exam}
            onChange={(e) => handleChange('exam', e.target.value)}
            required disabled={isReadOnly}
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold text-slate-700">Teacher's Remark</label>
            <div className="flex gap-2">
                 <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-1 rounded">Auto-generated</span>
                <button 
                    type="button" 
                    onClick={handleGenerateRemark}
                    className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center font-bold uppercase tracking-wide disabled:opacity-50 transition-colors bg-indigo-50 px-3 py-1 rounded-full"
                    disabled={isGeneratingRemark || isReadOnly}
                >
                    {isGeneratingRemark ? 'Generating...' : <><SparklesIcon className="h-3 w-3 mr-1" /> AI Override</>}
                </button>
            </div>
        </div>
        <textarea 
            className={`${inputClass} resize-none`}
            rows={2}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Enter a comprehensive remark..."
            disabled={isReadOnly}
        />
      </div>

      {!isReadOnly && (
        <Button type="submit" className="w-full py-3.5 text-base shadow-lg shadow-blue-500/20">
          Save Result
        </Button>
      )}
    </form>
  );
};

export default ResultEntry;
