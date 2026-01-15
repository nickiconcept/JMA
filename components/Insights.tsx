import React from 'react';
import { Result, Student, ClassDefinition } from '../types';

interface Props {
  results: Result[];
  students: Student[];
  classes: ClassDefinition[];
}

const Insights: React.FC<Props> = ({ results, students, classes }) => {
  // Simple analytics logic
  const totalStudents = students.length;
  const passedResults = results.filter(r => r.grade !== 'F').length;
  const passRate = results.length > 0 ? ((passedResults / results.length) * 100).toFixed(1) : 0;
  
  const classPerformance = classes.map(c => {
      const classStudents = students.filter(s => s.classId === c.id).map(s => s.id);
      const classResults = results.filter(r => classStudents.includes(r.studentId));
      const avgScore = classResults.length > 0 
        ? (classResults.reduce((acc, curr) => acc + curr.total, 0) / classResults.length).toFixed(1)
        : 0;
      return { className: `${c.name} ${c.arm}`, avg: avgScore };
  });

  return (
    <div className="space-y-6">
       <h2 className="text-2xl font-bold text-gray-800">Academic Insights</h2>
       
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-gray-500 text-sm uppercase">Pass Rate</h4>
            <div className="text-4xl font-bold text-blue-600">{passRate}%</div>
            <p className="text-xs text-gray-400 mt-2">Overall institution performance</p>
         </div>
         <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-gray-500 text-sm uppercase">Total Results</h4>
            <div className="text-4xl font-bold text-purple-600">{results.length}</div>
            <p className="text-xs text-gray-400 mt-2">Submitted this term</p>
         </div>
         <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-gray-500 text-sm uppercase">Population</h4>
            <div className="text-4xl font-bold text-green-600">{totalStudents}</div>
            <p className="text-xs text-gray-400 mt-2">Active students</p>
         </div>
       </div>

       <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-gray-700 mb-4">Class Performance Ranking</h3>
          <div className="space-y-4">
             {classPerformance.sort((a,b) => Number(b.avg) - Number(a.avg)).map((c, idx) => (
               <div key={idx} className="flex items-center">
                  <div className="w-24 text-sm font-medium text-gray-600">{c.className}</div>
                  <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden mx-4">
                     <div className="h-full bg-blue-500" style={{ width: `${Number(c.avg)}%` }}></div>
                  </div>
                  <div className="w-12 text-sm font-bold text-gray-800">{c.avg}</div>
               </div>
             ))}
          </div>
       </div>
    </div>
  );
};

export default Insights;
