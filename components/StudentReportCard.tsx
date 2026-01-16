
import React, { useRef } from 'react';
import { Result, Student, Subject, ClassDefinition, PsychomotorRecord, SchoolConfig, User, Term } from '../types';
import { CURRENT_SESSION, CURRENT_TERM } from '../constants';

interface Props {
  student: Student;
  results: Result[];
  subjects: Subject[];
  classes: ClassDefinition[];
  hidePrintButton?: boolean;
  schoolConfig?: SchoolConfig;
  psychomotorRecord?: PsychomotorRecord;
  formMaster?: User; // Passed in to show specific FM details
  allResults?: Result[]; // Needed for cumulative calc if not provided in 'results'
}

const StudentReportCard: React.FC<Props> = ({ 
  student, results, subjects, classes, hidePrintButton = false,
  schoolConfig, psychomotorRecord, formMaster, allResults
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
  
  // Aggregate calculations for current term
  const totalScore = results.reduce((acc, curr) => acc + curr.total, 0);
  const average = results.length > 0 ? (totalScore / results.length).toFixed(1) : '0.0';
  
  // Calculate Cumulative Annual Average if it's 3rd Term
  const isThirdTerm = results[0]?.term === Term.THIRD || schoolConfig?.activeTerm === Term.THIRD;
  
  const calculateAnnualAvg = (subjectId: string, currentTotal: number) => {
      if (!isThirdTerm || !allResults) return null;
      
      const session = results[0]?.session;
      const t1 = allResults.find(r => r.studentId === student.id && r.subjectId === subjectId && r.session === session && r.term === Term.FIRST)?.total || 0;
      const t2 = allResults.find(r => r.studentId === student.id && r.subjectId === subjectId && r.session === session && r.term === Term.SECOND)?.total || 0;
      
      // If previous terms missing, just avg what we have, or strictly divide by 3? 
      // Strictly dividing by 3 for annual average standard
      return ((t1 + t2 + currentTotal) / 3).toFixed(1);
  };

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
      activeSession: "2024/2025",
      activeTerm: Term.FIRST,
      nextTermBegins: "____",
      nextTermEnds: "____",
      reportCardLayout: {
          subjectLabel: 'Subject', ca1Label: 'CA 1', ca2Label: 'CA 2', assignLabel: 'Assign', 
          notesLabel: 'Notes', examLabel: 'Exam', totalLabel: 'Total', gradeLabel: 'Grade', remarkLabel: 'Remark',
          headingColor: 'blue'
      }
  };
  
  // Fallback if layout is missing in saved config
  const labels = config.reportCardLayout || {
      subjectLabel: 'Subject', ca1Label: 'CA 1', ca2Label: 'CA 2', assignLabel: 'Assign', 
      notesLabel: 'Notes', examLabel: 'Exam', totalLabel: 'Total', gradeLabel: 'Grade', remarkLabel: 'Remark'
  };

  return (
    <div className={`max-w-[210mm] mx-auto ${hidePrintButton ? 'mb-0' : 'mb-8'}`}>
      <style>
        {`
          @media print {
            @page { 
                size: A4; 
                margin: 0mm; 
            }
            body { 
                -webkit-print-color-adjust: exact; 
                margin: 0;
                padding: 0;
            }
            .print-hidden { display: none; }
            .report-card-container {
                width: 210mm;
                height: 297mm;
                padding: 10mm;
                overflow: hidden; /* Prevent overflow */
                box-sizing: border-box;
                transform: scale(0.96); /* Slight scale down to ensure fit */
                transform-origin: top center;
                page-break-after: always;
            }
            .report-scroll-wrapper {
                overflow: visible !important;
            }
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

      {/* Wrapper for mobile horizontal scrolling */}
      <div className="report-scroll-wrapper overflow-x-auto w-full print:w-auto">
          <div ref={printRef} className="report-card-container bg-white p-8 rounded-none shadow-none print:shadow-none min-h-[297mm] min-w-[210mm] relative font-sans text-gray-800">
            
            {/* Modern Header */}
            <div className="flex justify-between items-start border-b-2 border-blue-900 pb-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 bg-blue-900 text-white flex items-center justify-center rounded-lg overflow-hidden font-bold text-2xl font-display">
                  {config.logo ? <img src={config.logo} alt="Logo" className="w-full h-full object-contain bg-white" /> : 'JM'}
                </div>
                <div>
                  <h1 className="text-xl font-black uppercase tracking-tight text-blue-900 leading-none">{config.schoolName}</h1>
                  <p className="text-[10px] font-medium text-gray-500">{config.address}</p>
                  <p className="text-xs font-bold text-blue-600 mt-1">Student Progress Report</p>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Session</p>
                    <p className="text-sm font-bold text-blue-900">{results[0]?.session || config.activeSession}</p>
                </div>
                <p className="text-xs font-medium text-gray-600 mt-1">{results[0]?.term || config.activeTerm}</p>
              </div>
            </div>

            {/* Student Profile Card */}
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-y-2 gap-x-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-gray-500 font-bold mb-0.5">Student Name</p>
                    <p className="text-sm font-bold text-gray-900 truncate">{student.name}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-gray-500 font-bold mb-0.5">Admission No</p>
                    <p className="text-sm font-mono text-gray-900">{student.id}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-gray-500 font-bold mb-0.5">Class</p>
                    <p className="text-sm font-bold text-gray-900">{className}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-gray-500 font-bold mb-0.5">Attendance</p>
                    <p className="text-sm font-bold text-gray-900">{psychomotorRecord?.affective.attendance ? `${psychomotorRecord.affective.attendance}/5` : '-'}</p>
                  </div>
              </div>
              
              <div className="flex gap-3 border-l border-gray-200 pl-4 items-center">
                  <div className="text-center">
                    <p className="text-[9px] uppercase tracking-wider text-gray-500 font-bold mb-0.5">Total</p>
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs mx-auto border-2 border-white shadow-sm">
                        {totalScore}
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] uppercase tracking-wider text-gray-500 font-bold mb-0.5">Avg</p>
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs mx-auto border-2 border-white shadow-sm">
                        {average}
                    </div>
                  </div>
              </div>
            </div>

            {/* Academic Results */}
            <div className="mb-6 overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 text-[10px] uppercase tracking-wider font-bold">
                    <th className="py-2 px-3 text-left w-1/4">{labels.subjectLabel}</th>
                    <th className="py-2 px-1 text-center">{labels.ca1Label}</th>
                    <th className="py-2 px-1 text-center">{labels.ca2Label}</th>
                    <th className="py-2 px-1 text-center">{labels.assignLabel}</th>
                    <th className="py-2 px-1 text-center">{labels.notesLabel}</th>
                    <th className="py-2 px-1 text-center bg-gray-50 text-gray-500">Total CA</th>
                    <th className="py-2 px-1 text-center">{labels.examLabel}</th>
                    <th className="py-2 px-2 text-center bg-blue-50 text-blue-800">{labels.totalLabel}</th>
                    {isThirdTerm && <th className="py-2 px-2 text-center bg-purple-50 text-purple-800">Ann. Avg</th>}
                    <th className="py-2 px-1 text-center">{labels.gradeLabel}</th>
                    <th className="py-2 px-3 text-left w-1/4">{labels.remarkLabel}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {results.map((res, index) => {
                    const subject = subjects.find(s => s.id === res.subjectId);
                    const caTotal = res.assessment.ca1 + res.assessment.ca2 + res.assessment.assignment + res.assessment.notes;
                    const annualAvg = calculateAnnualAvg(res.subjectId, res.total);
                    
                    return (
                      <tr key={res.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                        <td className="py-2 px-3 font-medium text-gray-800 truncate">{subject?.name || res.subjectId}</td>
                        <td className="py-2 px-1 text-center text-gray-500">{res.assessment.ca1}</td>
                        <td className="py-2 px-1 text-center text-gray-500">{res.assessment.ca2}</td>
                        <td className="py-2 px-1 text-center text-gray-500">{res.assessment.assignment}</td>
                        <td className="py-2 px-1 text-center text-gray-500">{res.assessment.notes}</td>
                        <td className="py-2 px-1 text-center font-medium text-gray-700 bg-gray-50/50">{caTotal}</td>
                        <td className="py-2 px-1 text-center font-medium text-gray-700">{res.assessment.exam}</td>
                        <td className="py-2 px-2 text-center font-bold text-blue-900 bg-blue-50/30 text-sm">{res.total}</td>
                        {isThirdTerm && <td className="py-2 px-2 text-center font-bold text-purple-900 bg-purple-50/30">{annualAvg}</td>}
                        <td className="py-2 px-1 text-center">
                          <span className={`inline-block w-6 text-center py-0.5 rounded text-[10px] font-bold ${
                            res.grade === 'F' ? 'bg-red-100 text-red-700' :
                            res.grade === 'A' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {res.grade}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-[10px] italic text-gray-500 truncate max-w-[150px]">{res.teacherRemark}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Skills & Footer Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                
                {/* Affective Domain */}
                <div className="border border-gray-200 rounded-lg p-3">
                  <h3 className="text-[10px] font-bold uppercase text-gray-400 mb-2 tracking-wider">Affective</h3>
                  <div className="space-y-0.5">
                    {renderRating("Punctuality", affective.punctuality)}
                    {renderRating("Attendance", affective.attendance)}
                    {renderRating("Reliability", affective.reliability)}
                    {renderRating("Neatness", affective.neatness)}
                    {renderRating("Politeness", affective.politeness)}
                  </div>
                </div>

                {/* Psychomotor Domain */}
                <div className="border border-gray-200 rounded-lg p-3">
                  <h3 className="text-[10px] font-bold uppercase text-gray-400 mb-2 tracking-wider">Psychomotor</h3>
                  <div className="space-y-0.5">
                    {renderRating("Handwriting", psychomotor.handwriting)}
                    {renderRating("Sports", psychomotor.games)}
                    {renderRating("Communication", psychomotor.communication)}
                    {renderRating("Creativity", psychomotor.creativity)}
                    {renderRating("Leadership", psychomotor.leadership)}
                  </div>
                </div>

                {/* Key & Grading */}
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex flex-col justify-between">
                    <div>
                      <h3 className="text-[10px] font-bold uppercase text-gray-400 mb-2 tracking-wider">Grading</h3>
                      <div className="grid grid-cols-2 gap-1 text-[10px] text-gray-600">
                        <div className="flex justify-between"><span>A (70-100)</span> <span className="font-bold text-emerald-600">Exc.</span></div>
                        <div className="flex justify-between"><span>B (60-69)</span> <span className="font-bold text-blue-600">V.Good</span></div>
                        <div className="flex justify-between"><span>C (50-59)</span> <span className="font-bold text-purple-600">Good</span></div>
                        <div className="flex justify-between"><span>D (40-49)</span> <span className="font-bold text-orange-600">Pass</span></div>
                        <div className="flex justify-between"><span>F (0-39)</span> <span className="font-bold text-red-600">Fail</span></div>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-[9px] text-center text-gray-400">Generated by JMA Portal</p>
                    </div>
                </div>
            </div>

            {/* Remarks Section */}
            <div className="space-y-3 border-t-2 border-dashed border-gray-200 pt-4">
              
              <div className="flex items-start gap-4">
                  <div className="w-32 pt-1">
                    <p className="text-xs font-bold text-gray-800">Form Master</p>
                    <p className="text-[10px] text-gray-500 truncate">{formMaster ? formMaster.name : 'Class Supervisor'}</p>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 p-2 rounded border border-gray-100 min-h-[40px] italic text-xs text-gray-600">
                        {results[0]?.formMasterRemark || 'No remark added yet.'}
                    </div>
                    <div className="flex justify-end mt-1 gap-4">
                        <div className="flex flex-col items-center border-b border-gray-300 w-24 relative min-h-[24px]">
                            {formMaster && formMaster.signatureUrl ? (
                                <img src={formMaster.signatureUrl} alt="FM Sign" className="h-6 object-contain" />
                            ) : (
                                <span className="text-[9px] text-gray-400 mt-1">Signature</span>
                            )}
                        </div>
                        <div className="border-b border-gray-300 w-20 h-6 relative">
                            <span className="absolute bottom-0 right-0 text-[9px] text-gray-400">Date</span>
                        </div>
                    </div>
                  </div>
              </div>

              <div className="flex items-start gap-4">
                  <div className="w-32 pt-1">
                    <p className="text-xs font-bold text-gray-800">{config.principalName}</p>
                    <p className="text-[10px] text-gray-500">Principal</p>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 p-2 rounded border border-gray-100 min-h-[40px] italic text-xs text-gray-600">
                        {results[0]?.principalRemark || 'No remark added yet.'}
                    </div>
                    <div className="flex justify-end mt-1 gap-4">
                        <div className="flex flex-col items-center border-b border-gray-300 w-24 relative min-h-[24px]">
                            {config.principalSignature ? (
                                <img src={config.principalSignature} alt="Principal Sign" className="h-6 object-contain" />
                            ) : (
                                <span className="text-[9px] text-gray-400 mt-1">Signature</span>
                            )}
                        </div>
                        <div className="border-b border-gray-300 w-20 h-6 relative">
                            <span className="absolute bottom-0 right-0 text-[9px] text-gray-400">Date</span>
                        </div>
                    </div>
                  </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-2 flex justify-between items-center text-[10px] font-medium text-slate-600 mt-2 print:bg-transparent print:border print:border-slate-200">
                  <div><span className="font-bold">Next Term Begins:</span> {config.nextTermBegins}</div>
                  <div><span className="font-bold">Next Term Ends:</span> {config.nextTermEnds}</div>
              </div>

            </div>

          </div>
      </div>
    </div>
  );
};

export default StudentReportCard;
