
import React, { useRef } from 'react';
import { Result, Student, Subject, ClassDefinition } from '../types';
import { SCHOOL_NAME } from '../constants';

interface Props {
  student: Student;
  results: Result[];
  subjects: Subject[];
  classes: ClassDefinition[];
  hidePrintButton?: boolean; // New prop for bulk printing context
}

const StudentReportCard: React.FC<Props> = ({ student, results, subjects, classes, hidePrintButton = false }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (printContent) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); // Refresh to restore state
    }
  };

  // Resolve class name
  const studentClass = classes.find(c => c.id === student.classId);
  const className = studentClass ? `${studentClass.name} ${studentClass.arm}` : student.classId;

  return (
    <div className={`max-w-4xl mx-auto ${hidePrintButton ? 'mb-0' : 'mb-8'}`}>
      <style>
        {`
          @media print {
            .page-break { page-break-after: always; }
            .print-container { width: 100%; margin: 0; padding: 0; border: none; shadow: none; }
          }
        `}
      </style>

      {!hidePrintButton && (
        <div className="flex justify-end mb-4">
          <button 
            onClick={handlePrint} 
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          >
            Print Report Card
          </button>
        </div>
      )}

      {/* The outer div has a class for page breaks used in bulk printing */}
      <div ref={printRef} className="bg-white p-8 shadow-lg border border-gray-300 rounded-none print:shadow-none print:border-none print:w-full print-container page-break">
        {/* Header */}
        <div className="text-center border-b-2 border-green-800 pb-4 mb-6">
          <h1 className="text-3xl font-bold text-green-900 uppercase font-serif">{SCHOOL_NAME}</h1>
          <p className="text-sm text-gray-600">Motto: Excellence and Integrity</p>
          <div className="mt-2 text-lg font-semibold bg-green-100 inline-block px-4 py-1 rounded">
            TERMINAL REPORT SHEET
          </div>
        </div>

        {/* Student Info */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm border p-4 bg-gray-50">
          <div><span className="font-bold">Name:</span> {student.name}</div>
          <div><span className="font-bold">Admission No:</span> {student.id}</div>
          <div><span className="font-bold">Class:</span> {className}</div>
          <div><span className="font-bold">Session:</span> {results[0]?.session || '2024/2025'}</div>
          <div><span className="font-bold">Term:</span> {results[0]?.term || '1st Term'}</div>
        </div>

        {/* Results Table */}
        <table className="w-full border-collapse border border-gray-400 mb-6 text-sm">
          <thead>
            <tr className="bg-green-800 text-white print:bg-gray-300 print:text-black">
              <th className="border border-gray-400 p-2 text-left">Subject</th>
              <th className="border border-gray-400 p-2 w-16 text-center">CA (40)</th>
              <th className="border border-gray-400 p-2 w-16 text-center">Exam (60)</th>
              <th className="border border-gray-400 p-2 w-16 text-center">Total</th>
              <th className="border border-gray-400 p-2 w-16 text-center">Grade</th>
              <th className="border border-gray-400 p-2 text-left">Remark</th>
            </tr>
          </thead>
          <tbody>
            {results.map((res) => {
               const totalCA = res.assessment.ca1 + res.assessment.ca2 + res.assessment.assignment + res.assessment.notes;
               const subjectName = subjects.find(s => s.id === res.subjectId)?.name || res.subjectId;
               return (
                <tr key={res.id}>
                  <td className="border border-gray-400 p-2 font-medium">{subjectName}</td>
                  <td className="border border-gray-400 p-2 text-center text-gray-600">{totalCA}</td>
                  <td className="border border-gray-400 p-2 text-center text-gray-600">{res.assessment.exam}</td>
                  <td className="border border-gray-400 p-2 text-center font-bold">{res.total}</td>
                  <td className={`border border-gray-400 p-2 text-center font-bold ${res.grade === 'F' ? 'text-red-600' : 'text-green-800'}`}>{res.grade}</td>
                  <td className="border border-gray-400 p-2 text-xs italic">{res.teacherRemark}</td>
                </tr>
               );
            })}
            {results.length === 0 && (
                <tr><td colSpan={6} className="text-center p-4">No results available.</td></tr>
            )}
          </tbody>
        </table>

        {/* Footer Signatures */}
        <div className="grid grid-cols-2 gap-8 mt-12 pt-8 border-t border-gray-300">
           <div className="text-center">
             <div className="border-b border-black w-32 mx-auto mb-2"></div>
             <p className="text-xs font-bold uppercase">Form Master</p>
           </div>
           <div className="text-center">
             <div className="border-b border-black w-32 mx-auto mb-2"></div>
             <p className="text-xs font-bold uppercase">Principal</p>
           </div>
        </div>
        
        {/* Print Timestamp */}
        <div className="text-center mt-8 text-[10px] text-gray-400">
            Generated on {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default StudentReportCard;
