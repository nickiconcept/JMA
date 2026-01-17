
import React from 'react';
import { Result, Student, ClassDefinition } from '../types';
import { ChartBarIcon, UserGroupIcon, DocumentCheckIcon } from '@heroicons/react/24/solid';

interface Props {
  results: Result[];
  students: Student[];
  classes: ClassDefinition[];
}

const Insights: React.FC<Props> = ({ results, students, classes }) => {
  const totalStudents = students.length;
  const passedResults = results.filter(r => r.grade !== 'F').length;
  const passRate = results.length > 0 ? ((passedResults / results.length) * 100).toFixed(1) : 0;
  
  const classPerformance = classes.map(c => {
      const classStudents = students.filter(s => s.classId === c.id).map(s => s.id);
      const classResults = results.filter(r => classStudents.includes(r.studentId));
      const avgScore = classResults.length > 0 
        ? (classResults.reduce((acc, curr) => acc + curr.total, 0) / classResults.length).toFixed(1)
        : 0;
      return { className: c.name, avg: avgScore };
  });

  const StatCard = ({ title, value, subtext, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between">
       <div>
          <h4 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</h4>
          <div className={`text-4xl font-black font-display text-${color}-600`}>{value}</div>
          <p className="text-xs text-slate-400 mt-2 font-medium">{subtext}</p>
       </div>
       <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600`}>
          <Icon className="h-6 w-6" />
       </div>
    </div>
  );

  return (
    <div className="space-y-8">
       <div>
         <h2 className="text-3xl font-bold font-display text-slate-900">Academic Insights</h2>
         <p className="text-slate-500 mt-1">Real-time performance metrics for the current session.</p>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <StatCard 
            title="Pass Rate" 
            value={`${passRate}%`} 
            subtext="Overall institution performance" 
            icon={ChartBarIcon} 
            color="blue" 
         />
         <StatCard 
            title="Results Submitted" 
            value={results.length} 
            subtext="Total entries this term" 
            icon={DocumentCheckIcon} 
            color="indigo" 
         />
         <StatCard 
            title="Active Students" 
            value={totalStudents} 
            subtext="Total enrolled population" 
            icon={UserGroupIcon} 
            color="emerald" 
         />
       </div>

       <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold font-display text-slate-800 mb-6">Class Performance Ranking</h3>
          <div className="space-y-6">
             {classPerformance.sort((a,b) => Number(b.avg) - Number(a.avg)).map((c, idx) => (
               <div key={idx}>
                  <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-bold text-slate-700">{c.className}</span>
                      <span className="text-sm font-black text-slate-900">{c.avg} <span className="text-slate-400 text-xs font-normal">avg</span></span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                     <div 
                        className={`h-full rounded-full transition-all duration-500 ${idx === 0 ? 'bg-yellow-400' : 'bg-blue-500'}`} 
                        style={{ width: `${Number(c.avg)}%` }}
                     ></div>
                  </div>
               </div>
             ))}
          </div>
       </div>
    </div>
  );
};

export default Insights;
