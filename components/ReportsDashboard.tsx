
import React, { useState, useMemo } from 'react';
import { User, Student, Result, ClassDefinition, Subject, SchoolConfig, PsychomotorRecord, Term, UserRole } from '../types';
import ResultPrintingManager from './ResultPrintingManager';
import Button from './Button';

interface Props {
  user: User;
  students: Student[];
  results: Result[];
  classes: ClassDefinition[];
  subjects: Subject[];
  schoolConfig: SchoolConfig;
  psychomotorRecords: PsychomotorRecord[];
  users: User[];
}

type ReportType = 'BROADSHEET' | 'SUBJECT_ANALYSIS' | 'TERMLY' | 'SESSION' | 'STUDENT_PERFORMANCE';

const ReportsDashboard: React.FC<Props> = ({ 
    user, students, results, classes, subjects, schoolConfig, psychomotorRecords, users 
}) => {
  const [activeTab, setActiveTab] = useState<ReportType>('BROADSHEET');
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedSession, setSelectedSession] = useState<string>(schoolConfig.activeSession);
  const [selectedTerm, setSelectedTerm] = useState<Term>(schoolConfig.activeTerm);

  // Helper to get compatible classes for user
  const visibleClasses = user.role === UserRole.ADMIN || user.role === UserRole.PRINCIPAL 
    ? classes 
    : classes.filter(c => user.assignedClassIds?.includes(c.id));

  // Broadsheet Logic
  const BroadsheetView = () => {
    if (!selectedClassId) return <div className="p-8 text-center text-gray-500">Select a class to view the Master Sheet.</div>;
    
    const classStudents = students.filter(s => s.classId === selectedClassId).sort((a,b) => a.name.localeCompare(b.name));
    
    // Calculate totals for ranking
    const studentTotals = classStudents.map(student => {
        const studentRes = results.filter(r => 
            r.studentId === student.id && 
            r.session === selectedSession && 
            r.term === selectedTerm
        );
        const grandTotal = studentRes.reduce((acc, curr) => acc + curr.total, 0);
        const average = studentRes.length > 0 ? grandTotal / studentRes.length : 0;
        return { id: student.id, grandTotal, average };
    });

    // Sort by Average Descending
    const rankings = [...studentTotals].sort((a,b) => b.average - a.average);

    return (
        <div className="overflow-x-auto">
             <div className="mb-4 flex justify-between items-center print:hidden">
                 <h3 className="font-bold text-lg">Master Broadsheet: {classes.find(c => c.id === selectedClassId)?.name}</h3>
                 <Button onClick={() => window.print()} className="text-xs">Print Sheet</Button>
             </div>
             
             <div className="bg-white border border-gray-300 text-xs min-w-[1200px]">
                 <table className="w-full border-collapse">
                     <thead>
                         <tr className="bg-gray-100">
                             <th className="border p-2 text-left w-10">S/N</th>
                             <th className="border p-2 text-left w-48 sticky left-0 bg-gray-100 z-10">Student Name</th>
                             {subjects.map(sub => (
                                 <th key={sub.id} className="border p-2 w-16 text-center transform -rotate-90 h-32 align-bottom">{sub.name}</th>
                             ))}
                             <th className="border p-2 w-16 text-center font-bold bg-blue-50">Total</th>
                             <th className="border p-2 w-16 text-center font-bold bg-green-50">Avg</th>
                             <th className="border p-2 w-16 text-center font-bold bg-yellow-50">Pos</th>
                         </tr>
                     </thead>
                     <tbody>
                         {classStudents.map((student, idx) => {
                             const totals = studentTotals.find(t => t.id === student.id);
                             const position = rankings.findIndex(r => r.id === student.id) + 1;
                             return (
                                 <tr key={student.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                     <td className="border p-2">{idx + 1}</td>
                                     <td className="border p-2 font-bold sticky left-0 bg-inherit z-10">{student.name}</td>
                                     {subjects.map(sub => {
                                         const res = results.find(r => r.studentId === student.id && r.subjectId === sub.id && r.session === selectedSession && r.term === selectedTerm);
                                         return (
                                             <td key={sub.id} className={`border p-2 text-center ${res ? (res.total < 40 ? 'text-red-600 font-bold' : 'text-gray-800') : 'text-gray-300'}`}>
                                                 {res ? res.total : '-'}
                                             </td>
                                         );
                                     })}
                                     <td className="border p-2 text-center font-bold bg-blue-50">{totals?.grandTotal}</td>
                                     <td className="border p-2 text-center font-bold bg-green-50">{totals?.average.toFixed(1)}</td>
                                     <td className="border p-2 text-center font-bold bg-yellow-50">{position}</td>
                                 </tr>
                             );
                         })}
                     </tbody>
                 </table>
             </div>
        </div>
    );
  };

  const SessionReportView = () => {
       if (!selectedClassId) return <div className="p-8 text-center text-gray-500">Select a class for Session Summary.</div>;
       
       const classStudents = students.filter(s => s.classId === selectedClassId);
       
       return (
           <div className="overflow-x-auto bg-white p-6 rounded-lg shadow border border-gray-200">
               <h3 className="font-bold text-lg mb-4 text-center">Annual Session Performance Report ({selectedSession})</h3>
               <table className="w-full text-sm border-collapse border border-gray-300">
                   <thead className="bg-gray-100">
                       <tr>
                           <th className="border p-3 text-left">Student</th>
                           <th className="border p-3 text-center">1st Term Avg</th>
                           <th className="border p-3 text-center">2nd Term Avg</th>
                           <th className="border p-3 text-center">3rd Term Avg</th>
                           <th className="border p-3 text-center bg-blue-50">Cumulative Avg</th>
                           <th className="border p-3 text-center">Verdict</th>
                       </tr>
                   </thead>
                   <tbody>
                       {classStudents.map(student => {
                           const getAvg = (term: Term) => {
                               const termRes = results.filter(r => r.studentId === student.id && r.session === selectedSession && r.term === term);
                               if (termRes.length === 0) return 0;
                               return termRes.reduce((acc, curr) => acc + curr.total, 0) / termRes.length;
                           };
                           const t1 = getAvg(Term.FIRST);
                           const t2 = getAvg(Term.SECOND);
                           const t3 = getAvg(Term.THIRD);
                           const cum = (t1 + t2 + t3) / 3;
                           
                           return (
                               <tr key={student.id}>
                                   <td className="border p-3 font-medium">{student.name}</td>
                                   <td className="border p-3 text-center">{t1 > 0 ? t1.toFixed(1) : '-'}</td>
                                   <td className="border p-3 text-center">{t2 > 0 ? t2.toFixed(1) : '-'}</td>
                                   <td className="border p-3 text-center">{t3 > 0 ? t3.toFixed(1) : '-'}</td>
                                   <td className="border p-3 text-center font-bold bg-blue-50">{cum.toFixed(1)}</td>
                                   <td className="border p-3 text-center">
                                       <span className={`px-2 py-1 rounded text-xs font-bold ${cum >= 50 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                           {cum >= 50 ? 'PASS' : 'FAIL'}
                                       </span>
                                   </td>
                               </tr>
                           );
                       })}
                   </tbody>
               </table>
           </div>
       );
  };

  const SubjectAnalysisView = () => {
      // Calculate subject performance across selected class
      if (!selectedClassId) return <div className="p-8 text-center text-gray-500">Select a class.</div>;
      
      const analysis = subjects.map(sub => {
          const classResults = results.filter(r => 
            students.find(s => s.id === r.studentId)?.classId === selectedClassId &&
            r.subjectId === sub.id &&
            r.session === selectedSession &&
            r.term === selectedTerm
          );
          
          if (classResults.length === 0) return null;

          const totalScore = classResults.reduce((acc, curr) => acc + curr.total, 0);
          const avg = totalScore / classResults.length;
          const min = Math.min(...classResults.map(r => r.total));
          const max = Math.max(...classResults.map(r => r.total));
          const passCount = classResults.filter(r => r.total >= 40).length;
          const passRate = (passCount / classResults.length) * 100;

          return { subject: sub.name, avg, min, max, passRate, count: classResults.length };
      }).filter(Boolean);

      return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analysis.map((item, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-lg shadow border border-gray-100">
                      <h4 className="font-bold text-blue-900 mb-2">{item!.subject}</h4>
                      <div className="grid grid-cols-2 gap-y-2 text-sm">
                          <div className="text-gray-500">Avg Score:</div>
                          <div className="font-bold">{item!.avg.toFixed(1)}</div>
                          <div className="text-gray-500">Highest:</div>
                          <div className="text-green-600 font-bold">{item!.max}</div>
                          <div className="text-gray-500">Lowest:</div>
                          <div className="text-red-600 font-bold">{item!.min}</div>
                          <div className="text-gray-500">Pass Rate:</div>
                          <div className="font-bold">{item!.passRate.toFixed(1)}%</div>
                      </div>
                  </div>
              ))}
          </div>
      );
  };

  return (
    <div className="space-y-6">
       <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
               <h2 className="text-2xl font-bold font-display text-slate-900">Reports Center</h2>
               
               {/* Global Filters */}
               <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                   <select className="border p-2 rounded text-sm" value={selectedSession} onChange={e => setSelectedSession(e.target.value)}>
                       <option value="2023/2024">2023/2024</option>
                       <option value="2024/2025">2024/2025</option>
                   </select>
                   <select className="border p-2 rounded text-sm" value={selectedTerm} onChange={e => setSelectedTerm(e.target.value as Term)}>
                        <option value={Term.FIRST}>{Term.FIRST}</option>
                        <option value={Term.SECOND}>{Term.SECOND}</option>
                        <option value={Term.THIRD}>{Term.THIRD}</option>
                   </select>
                   <select className="border p-2 rounded text-sm min-w-[150px]" value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)}>
                       <option value="">-- Select Class --</option>
                       {visibleClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                   </select>
               </div>
           </div>

           {/* Tabs */}
           <div className="flex overflow-x-auto border-b border-gray-200 mb-6">
                {[
                    { id: 'BROADSHEET', label: 'Master Broadsheet' },
                    { id: 'TERMLY', label: 'Termly Report Cards' },
                    { id: 'SUBJECT_ANALYSIS', label: 'Subject Analysis' },
                    { id: 'SESSION', label: 'Session Report' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as ReportType)}
                        className={`px-6 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
                            activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
           </div>

           {/* Content Area */}
           <div className="min-h-[400px]">
               {activeTab === 'BROADSHEET' && <BroadsheetView />}
               {activeTab === 'SUBJECT_ANALYSIS' && <SubjectAnalysisView />}
               {activeTab === 'SESSION' && <SessionReportView />}
               {activeTab === 'TERMLY' && (
                   <ResultPrintingManager 
                        user={user}
                        classes={visibleClasses}
                        students={students}
                        results={results}
                        subjects={subjects}
                        schoolConfig={schoolConfig}
                        psychomotorRecords={psychomotorRecords}
                        users={users}
                   />
               )}
           </div>
       </div>
    </div>
  );
};

export default ReportsDashboard;
