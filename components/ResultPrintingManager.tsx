
import React, { useState, useRef } from 'react';
import { User, UserRole, ClassDefinition, Student, Result, Subject, SchoolConfig, PsychomotorRecord } from '../types';
import Button from './Button';
import StudentReportCard from './StudentReportCard';
import { CURRENT_SESSION, CURRENT_TERM } from '../constants';

interface Props {
  user: User;
  classes: ClassDefinition[];
  students: Student[];
  results: Result[];
  subjects: Subject[];
  schoolConfig: SchoolConfig;
  psychomotorRecords: PsychomotorRecord[];
  users: User[]; // Needed to find Form Master details
}

const ResultPrintingManager: React.FC<Props> = ({ user, classes, students, results, subjects, schoolConfig, psychomotorRecords, users }) => {
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [mode, setMode] = useState<'INDIVIDUAL' | 'BULK'>('INDIVIDUAL');
  
  const bulkPrintRef = useRef<HTMLDivElement>(null);

  // Filter classes based on role
  const visibleClasses = user.role === UserRole.ADMIN || user.role === UserRole.PRINCIPAL
      ? classes
      : classes.filter(c => user.assignedClassIds?.includes(c.id));

  const classStudents = students.filter(s => s.classId === selectedClassId);

  const handleBulkPrint = () => {
    if (bulkPrintRef.current) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = bulkPrintRef.current.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  const getPsychomotor = (studentId: string) => {
    return psychomotorRecords.find(p => p.studentId === studentId && p.session === CURRENT_SESSION && p.term === CURRENT_TERM);
  };

  const getFormMaster = (classId: string) => {
      const cls = classes.find(c => c.id === classId);
      if (cls && cls.formMasterId) {
          return users.find(u => u.id === cls.formMasterId);
      }
      return undefined;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-600">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Result Printing Management</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Class</label>
                <select 
                    className="w-full border p-2 rounded"
                    value={selectedClassId}
                    onChange={(e) => { setSelectedClassId(e.target.value); setSelectedStudentId(''); }}
                >
                    <option value="">-- Select Class --</option>
                    {visibleClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>

            {selectedClassId && user.role === UserRole.ADMIN && (
                <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Printing Mode</label>
                     <div className="flex space-x-2">
                        <button 
                            onClick={() => setMode('INDIVIDUAL')}
                            className={`flex-1 py-2 text-sm rounded border ${mode === 'INDIVIDUAL' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}
                        >
                            Individual
                        </button>
                        <button 
                            onClick={() => setMode('BULK')}
                            className={`flex-1 py-2 text-sm rounded border ${mode === 'BULK' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}
                        >
                            Bulk (Class)
                        </button>
                     </div>
                </div>
            )}
            
             {selectedClassId && user.role === UserRole.FORM_MASTER && (
                <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Printing Mode</label>
                     <div className="flex space-x-2">
                        <button 
                            onClick={() => setMode('INDIVIDUAL')}
                            className={`flex-1 py-2 text-sm rounded border ${mode === 'INDIVIDUAL' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}
                        >
                            Individual
                        </button>
                        <button 
                            onClick={() => setMode('BULK')} // Allowing FM to print bulk for their own class
                            className={`flex-1 py-2 text-sm rounded border ${mode === 'BULK' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}
                        >
                            Bulk (Class)
                        </button>
                     </div>
                </div>
            )}

            {mode === 'INDIVIDUAL' && selectedClassId && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Student</label>
                    <select 
                        className="w-full border p-2 rounded"
                        value={selectedStudentId}
                        onChange={(e) => setSelectedStudentId(e.target.value)}
                    >
                        <option value="">-- Select Student --</option>
                        {classStudents.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
                    </select>
                </div>
            )}
        </div>

        {/* Action Area */}
        {mode === 'BULK' && selectedClassId && (
             <div className="flex justify-between items-center bg-yellow-50 p-4 rounded border border-yellow-200">
                <div>
                    <h3 className="font-bold text-yellow-800">Bulk Printing Ready</h3>
                    <p className="text-sm text-yellow-700">Ready to print report cards for {classStudents.length} students in this class.</p>
                </div>
                <Button onClick={handleBulkPrint}>🖨️ Print All {classStudents.length} Results</Button>
             </div>
        )}
      </div>

      {/* Render Area */}
      <div className="bg-gray-100 p-4 rounded-lg min-h-[500px]">
          
          {/* Individual Mode */}
          {mode === 'INDIVIDUAL' && selectedStudentId && (
              <StudentReportCard 
                 student={students.find(s => s.id === selectedStudentId)!}
                 results={results.filter(r => r.studentId === selectedStudentId)}
                 subjects={subjects}
                 classes={classes}
                 schoolConfig={schoolConfig}
                 psychomotorRecord={getPsychomotor(selectedStudentId)}
                 formMaster={getFormMaster(selectedClassId)}
              />
          )}

          {/* Bulk Mode (Hidden view used for printing) */}
          {mode === 'BULK' && selectedClassId && (
             <div>
                <div className="text-center text-gray-500 py-10">
                    <p>Bulk Preview is hidden to save resources. Click "Print All" above to generate the PDF.</p>
                    <p className="text-xs mt-2">The system will generate {classStudents.length} pages.</p>
                </div>
                
                {/* This div is what gets printed */}
                <div className="hidden" ref={bulkPrintRef}>
                    {classStudents.map((student) => (
                        <StudentReportCard 
                            key={student.id}
                            student={student}
                            results={results.filter(r => r.studentId === student.id)}
                            subjects={subjects}
                            classes={classes}
                            hidePrintButton={true}
                            schoolConfig={schoolConfig}
                            psychomotorRecord={getPsychomotor(student.id)}
                            formMaster={getFormMaster(student.classId)}
                        />
                    ))}
                </div>
             </div>
          )}

          {!selectedClassId && (
              <div className="text-center text-gray-400 py-20">
                  Select a class to begin printing operations.
              </div>
          )}
      </div>
    </div>
  );
};

export default ResultPrintingManager;
