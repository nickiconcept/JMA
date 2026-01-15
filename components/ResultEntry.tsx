
import React, { useState, useEffect } from 'react';
import { Result, Assessment, Term, Student } from '../types';
import { GRADING_SCALE, MAX_SCORES, CURRENT_SESSION, CURRENT_TERM } from '../constants';
import Button from './Button';
import { generateStudentRemark } from '../services/geminiService';

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

  // Sync state when existingResult or student changes
  useEffect(() => {
    if (existingResult) {
      setAssessment(existingResult.assessment);
      setRemark(existingResult.teacherRemark || '');
    } else {
      setAssessment({ ca1: 0, ca2: 0, assignment: 0, notes: 0, exam: 0 });
      setRemark('');
    }
  }, [existingResult, student.id, subjectId]);

  // Recalculate Total and Grade whenever assessment changes
  useEffect(() => {
    const sum = 
      Number(assessment.ca1) + 
      Number(assessment.ca2) + 
      Number(assessment.assignment) + 
      Number(assessment.notes) + 
      Number(assessment.exam);
    
    setTotal(sum);

    const gradeEntry = GRADING_SCALE.find(g => sum >= g.min && sum <= g.max);
    setGrade(gradeEntry ? gradeEntry.grade : 'F');
  }, [assessment]);

  const handleChange = (field: keyof Assessment, value: string) => {
    if (isReadOnly) return;
    
    const numValue = Number(value);
    // Validation based on Max scores
    let max = 0;
    if (field === 'exam') max = MAX_SCORES.EXAM;
    else if (field === 'ca1') max = MAX_SCORES.CA1;
    else if (field === 'ca2') max = MAX_SCORES.CA2;
    else if (field === 'assignment') max = MAX_SCORES.ASSIGNMENT;
    else if (field === 'notes') max = MAX_SCORES.NOTES;

    if (numValue > max) return; // Prevent invalid input

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

  return (
    <form onSubmit={handleSubmit} className={`bg-white p-6 rounded-lg shadow border border-gray-200 ${isReadOnly ? 'opacity-75' : ''}`}>
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-2">
        <div>
           <h4 className="text-lg font-bold text-gray-800">{student.name}</h4>
           <p className="text-sm text-gray-500">{student.id} - {subject}</p>
        </div>
        <div className="flex items-center justify-between md:justify-end md:text-right gap-4">
            <div className="text-2xl font-bold text-green-700">
               <span className="text-xs text-gray-400 font-normal mr-2">Total:</span>
               {total}
            </div>
            <div className={`text-sm font-bold px-2 py-1 rounded ${grade === 'F' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                Grade: {grade}
            </div>
        </div>
      </div>

      {isReadOnly && (
        <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Submitted. Locked for editing. Contact Admin to modify.
        </div>
      )}

      {/* Responsive Grid for Scores */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">1st CA (10)</label>
          <input 
            type="number" min="0" max="10" 
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 p-2 border"
            value={assessment.ca1}
            onChange={(e) => handleChange('ca1', e.target.value)}
            required
            disabled={isReadOnly}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">2nd CA (10)</label>
          <input 
            type="number" min="0" max="10" 
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 p-2 border"
            value={assessment.ca2}
            onChange={(e) => handleChange('ca2', e.target.value)}
            required
            disabled={isReadOnly}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Assign (10)</label>
          <input 
            type="number" min="0" max="10" 
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 p-2 border"
            value={assessment.assignment}
            onChange={(e) => handleChange('assignment', e.target.value)}
            required
            disabled={isReadOnly}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Notes (10)</label>
          <input 
            type="number" min="0" max="10" 
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 p-2 border"
            value={assessment.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            required
            disabled={isReadOnly}
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <label className="block text-xs font-medium text-gray-500 mb-1">Exam (60)</label>
          <input 
            type="number" min="0" max="60" 
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 bg-green-50 disabled:bg-gray-200 p-2 border"
            value={assessment.exam}
            onChange={(e) => handleChange('exam', e.target.value)}
            required
            disabled={isReadOnly}
          />
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Teacher's Remark</label>
            <button 
                type="button" 
                onClick={handleGenerateRemark}
                className="text-xs text-purple-600 hover:text-purple-800 flex items-center font-medium disabled:opacity-50"
                disabled={isGeneratingRemark || isReadOnly}
            >
                {isGeneratingRemark ? 'Thinking...' : '✨ Generate with AI'}
            </button>
        </div>
        <textarea 
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 p-2 border"
            rows={2}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Enter remark here..."
            disabled={isReadOnly}
        />
      </div>

      {!isReadOnly && (
        <Button type="submit" className="w-full">
          Save Result
        </Button>
      )}
    </form>
  );
};

export default ResultEntry;
