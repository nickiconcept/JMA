
import React, { useRef } from 'react';
import { Result, Student, Subject, ClassDefinition, PsychomotorRecord, SchoolConfig } from '../types';
import { CURRENT_SESSION, CURRENT_TERM } from '../constants';

interface Props {
  student: Student;
  results: Result[];
  subjects: Subject[];
  classes: ClassDefinition[];
  hidePrintButton?: boolean;
  schoolConfig?: SchoolConfig;
  psychomotorRecord?: PsychomotorRecord;
}

const StudentReportCard: React.FC<Props> = ({ 
  student, results, subjects, classes, hidePrintButton = false,
  schoolConfig, psychomotorRecord 
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (printContent) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  const studentClass = classes.find(c => c.id === student.classId);
  const className = studentClass ? `${studentClass.name} ${studentClass.arm}` : student.classId;
  
  // Aggregate calculations
  const totalScore = results.reduce((acc, curr) => acc + curr.total, 0);
  const average = results.length > 0 ? (totalScore / results.length).toFixed(1) : '0.0';
  const passedCount = results.filter(r => r.grade !== 'F').length;

  const renderRating = (label: string, score: number) => (
    <div className="flex items-center justify-between py-1 border-b border-gray-100 last:border-0">
      <span className="text-xs font-medium text-gray-600">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <div 
            key={star} 
            className={`w-3 h-3 rounded-full ${star <= score ? 'bg-blue-600' : 'bg-gray-200'}`}
          />
        ))}
      </div>
    </div>
  );

  const affective = psychomotorRecord?.affective || { punctuality: 0, attendance: 0, reliability: 0, neatness: 0, politeness: 0 };
  const psychomotor = psychomotorRecord?.psychomotor || { handwriting: 0, games: 0, communication: 0, creativity: 0, leadership: 0 };
  const config = schoolConfig || { 
      schoolName: "JERE MODEL ACADEMY", 
      address: "Ungwan Shakwera, Kagarko LGA, Kaduna State",
      principalName: "The Principal",
      nextTermBegins: "____",
      nextTermEnds: "____"
  };

  return (
    <div className={`max-w-[210mm] mx-auto ${hidePrintButton ? 'mb-0' : 'mb-8'}`}>
      <style>
        {`
          @media print {
            @page { size: A4; margin: 10mm; }
            body { -webkit-print-color-adjust: exact; }
            .print-hidden { display: none; }
            .page-break { page-break-inside: avoid; }
          }
        `}
      </style>

      {!hidePrintButton && (
        <div className="flex justify-end mb-6 print-hidden">
          <button 
            onClick={handlePrint} 
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 font-medium flex items-center gap-2 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
            </svg>
            Print Report Card
          </button>
        </div>
      )}

      <div ref={printRef} className="bg-white p-8 rounded-none shadow-none print:shadow-none min-h-[297mm] relative font-sans text-gray-800">
        
        {/* Modern Header */}
        <div className="flex justify-between items-start border-b-2 border-blue-900 pb-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-blue-900 text-white flex items-center justify-center rounded-lg overflow-hidden font-bold text-2xl font-display">
               {config.logo ? <img src={config.logo} alt="Logo" className="w-full h-full object-contain bg-white" /> : 'JM'}
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight text-blue-900">{config.schoolName}</h1>
              <p className="text-xs font-medium text-gray-500">{config.address}</p>
              <p className="text-sm font-bold text-blue-600 mt-1">Student Progress Report</p>
            </div>
          </div>
          <div className="text-right">
             <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Session</p>
                <p className="text-lg font-bold text-blue-900">{results[0]?.session || CURRENT_SESSION}</p>
             </div>
             <p className="text-sm font-medium text-gray-600 mt-2">{results[0]?.term || CURRENT_TERM}</p>
          </div>
        </div>

        {/* Student Profile Card */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 mb-8 flex flex-col md:flex-row gap-6">
           <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Student Name</p>
                <p className="text-sm font-bold text-gray-900">{student.name}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Admission No</p>
                <p className="text-sm font-mono text-gray-900">{student.id}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Class</p>
                <p className="text-sm font-bold text-gray-900">{className}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Attendance</p>
                <p className="text-sm font-bold text-gray-900">{psychomotorRecord?.affective.attendance ? `${psychomotorRecord.affective.attendance}/5 Rating` : '___ / ___'}</p>
              </div>
           </div>
           
           <div className="flex gap-4 border-l border-gray-200 pl-6">
              <div className="text-center">
                 <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Total</p>
                 <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm mx-auto border-2 border-white shadow-sm">
                    {totalScore}
                 </div>
              </div>
              <div className="text-center">
                 <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Average</p>
                 <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm mx-auto border-2 border-white shadow-sm">
                    {average}
                 </div>
              </div>
              <div className="text-center">
                 <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Passed</p>
                 <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm mx-auto border-2 border-white shadow-sm">
                    {passedCount}
                 </div>
              </div>
           </div>
        </div>

        {/* Academic Results */}
        <div className="mb-8 overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-[11px] uppercase tracking-wider font-bold">
                <th className="py-3 px-4 text-left w-1/4">Subject</th>
                <th className="py-3 px-2 text-center">CA 1</th>
                <th className="py-3 px-2 text-center">CA 2</th>
                <th className="py-3 px-2 text-center">Assign</th>
                <th className="py-3 px-2 text-center">Notes</th>
                <th className="py-3 px-2 text-center bg-gray-50 text-gray-500">Total CA</th>
                <th className="py-3 px-2 text-center">Exam</th>
                <th className="py-3 px-4 text-center bg-blue-50 text-blue-800">Total</th>
                <th className="py-3 px-2 text-center">Grade</th>
                <th className="py-3 px-4 text-left w-1/4">Remark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {results.map((res, index) => {
                const subject = subjects.find(s => s.id === res.subjectId);
                const caTotal = res.assessment.ca1 + res.assessment.ca2 + res.assessment.assignment + res.assessment.notes;
                
                return (
                  <tr key={res.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="py-3 px-4 font-medium text-gray-800">{subject?.name || res.subjectId}</td>
                    <td className="py-3 px-2 text-center text-gray-500">{res.assessment.ca1}</td>
                    <td className="py-3 px-2 text-center text-gray-500">{res.assessment.ca2}</td>
                    <td className="py-3 px-2 text-center text-gray-500">{res.assessment.assignment}</td>
                    <td className="py-3 px-2 text-center text-gray-500">{res.assessment.notes}</td>
                    <td className="py-3 px-2 text-center font-medium text-gray-700 bg-gray-50/50">{caTotal}</td>
                    <td className="py-3 px-2 text-center font-medium text-gray-700">{res.assessment.exam}</td>
                    <td className="py-3 px-4 text-center font-bold text-blue-900 bg-blue-50/30 text-base">{res.total}</td>
                    <td className="py-3 px-2 text-center">
                      <span className={`inline-block w-8 text-center py-0.5 rounded text-xs font-bold ${
                        res.grade === 'F' ? 'bg-red-100 text-red-700' :
                        res.grade === 'A' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {res.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs italic text-gray-500 truncate max-w-[150px]">{res.teacherRemark}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Skills & Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 page-break">
            
            {/* Affective Domain */}
            <div className="border border-gray-200 rounded-xl p-4">
               <h3 className="text-xs font-bold uppercase text-gray-400 mb-3 tracking-wider">Affective Domain</h3>
               <div className="space-y-1">
                 {renderRating("Punctuality", affective.punctuality)}
                 {renderRating("Attendance", affective.attendance)}
                 {renderRating("Reliability", affective.reliability)}
                 {renderRating("Neatness", affective.neatness)}
                 {renderRating("Politeness", affective.politeness)}
               </div>
            </div>

            {/* Psychomotor Domain */}
            <div className="border border-gray-200 rounded-xl p-4">
               <h3 className="text-xs font-bold uppercase text-gray-400 mb-3 tracking-wider">Psychomotor Skills</h3>
               <div className="space-y-1">
                 {renderRating("Handwriting", psychomotor.handwriting)}
                 {renderRating("Games/Sports", psychomotor.games)}
                 {renderRating("Communication", psychomotor.communication)}
                 {renderRating("Creativity", psychomotor.creativity)}
                 {renderRating("Leadership", psychomotor.leadership)}
               </div>
            </div>

             {/* Key & Grading */}
             <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase text-gray-400 mb-3 tracking-wider">Grading System</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div className="flex justify-between"><span>A (70-100)</span> <span className="font-bold text-emerald-600">Excellent</span></div>
                    <div className="flex justify-between"><span>B (60-69)</span> <span className="font-bold text-blue-600">V. Good</span></div>
                    <div className="flex justify-between"><span>C (50-59)</span> <span className="font-bold text-purple-600">Good</span></div>
                    <div className="flex justify-between"><span>D (40-49)</span> <span className="font-bold text-orange-600">Pass</span></div>
                    <div className="flex justify-between"><span>F (0-39)</span> <span className="font-bold text-red-600">Fail</span></div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                   <p className="text-[10px] text-center text-gray-400">Generated by Jere Model Academy Portal</p>
                </div>
             </div>
        </div>

        {/* Remarks Section */}
        <div className="space-y-4 border-t-2 border-dashed border-gray-200 pt-6 page-break">
           
           <div className="flex items-start gap-4">
              <div className="w-40 pt-2">
                 <p className="text-sm font-bold text-gray-800">Form Master</p>
                 <p className="text-xs text-gray-500">Class Supervisor</p>
              </div>
              <div className="flex-1">
                 <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 min-h-[50px] italic text-sm text-gray-600">
                    {results[0]?.formMasterRemark || 'No remark added yet.'}
                 </div>
                 <div className="flex justify-end mt-2 gap-4">
                     <div className="border-b border-gray-300 w-32 h-8 relative">
                         <span className="absolute bottom-0 right-0 text-[10px] text-gray-400">Signature</span>
                     </div>
                     <div className="border-b border-gray-300 w-24 h-8 relative">
                         <span className="absolute bottom-0 right-0 text-[10px] text-gray-400">Date</span>
                     </div>
                 </div>
              </div>
           </div>

           <div className="flex items-start gap-4">
              <div className="w-40 pt-2">
                 <p className="text-sm font-bold text-gray-800">{config.principalName}</p>
                 <p className="text-xs text-gray-500">Principal / Head of School</p>
              </div>
              <div className="flex-1">
                 <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 min-h-[50px] italic text-sm text-gray-600">
                    {results[0]?.principalRemark || 'No remark added yet.'}
                 </div>
                 <div className="flex justify-end mt-2 gap-4">
                     <div className="flex flex-col items-center border-b border-gray-300 w-32 relative min-h-[32px]">
                         {config.principalSignature ? (
                            <img src={config.principalSignature} alt="Principal Sign" className="h-8 object-contain" />
                         ) : (
                            <span className="text-[10px] text-gray-400 mt-2">Signature</span>
                         )}
                     </div>
                     <div className="border-b border-gray-300 w-24 h-8 relative">
                         <span className="absolute bottom-0 right-0 text-[10px] text-gray-400">Date</span>
                     </div>
                 </div>
              </div>
           </div>

           <div className="bg-slate-50 rounded-lg p-3 flex justify-between items-center text-xs font-medium text-slate-600 mt-4 print:bg-transparent print:border print:border-slate-200">
               <div><span className="font-bold">Next Term Begins:</span> {config.nextTermBegins}</div>
               <div><span className="font-bold">Next Term Ends:</span> {config.nextTermEnds}</div>
           </div>

        </div>

      </div>
    </div>
  );
};

export default StudentReportCard;
