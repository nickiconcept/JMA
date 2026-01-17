
import React, { useState, useMemo } from 'react';
import { Student, ClassDefinition, Result, Term, PromotionStatus } from '../types';
import Button from './Button';

interface Props {
  students: Student[];
  classes: ClassDefinition[];
  results: Result[];
  onPromoteStudents: (updates: { studentId: string; newClassId: string; status: PromotionStatus }[]) => void;
}

const PromotionManager: React.FC<Props> = ({ students, classes, results, onPromoteStudents }) => {
  const [selectedClassId, setSelectedClassId] = useState('');
  const [targetClassId, setTargetClassId] = useState(''); // Default target for bulk
  const [selectedSession, setSelectedSession] = useState('2024/2025');

  // Filter students by selected class
  const classStudents = useMemo(() => 
    students.filter(s => s.classId === selectedClassId), 
  [students, selectedClassId]);

  // Calculate Cumulative Data
  const studentPerformance = useMemo(() => {
    return classStudents.map(student => {
      // Get all results for this student in this session
      const studentResults = results.filter(r => r.studentId === student.id && r.session === selectedSession);
      
      const getTermAvg = (term: Term) => {
        const termResults = studentResults.filter(r => r.term === term);
        if (termResults.length === 0) return 0;
        const total = termResults.reduce((sum, r) => sum + r.total, 0);
        return total / termResults.length;
      };

      const t1 = getTermAvg(Term.FIRST);
      const t2 = getTermAvg(Term.SECOND);
      const t3 = getTermAvg(Term.THIRD);
      
      // Calculate annual average. 
      const cumulative = (t1 + t2 + t3) / 3;

      return {
        student,
        t1, t2, t3,
        cumulative,
        recommendedAction: cumulative >= 50 ? 'PROMOTE' : 'REPEAT'
      };
    });
  }, [classStudents, results, selectedSession]);

  // Selection State for Bulk Action
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(studentPerformance.map(p => p.student.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleToggle = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const executePromotion = () => {
    if (!targetClassId) {
      alert("Please select a target class to promote the selected students to.");
      return;
    }
    
    const updates = Array.from(selectedIds).map(id => ({
      studentId: id,
      newClassId: targetClassId,
      status: PromotionStatus.PROMOTED
    }));

    if (confirm(`Promote ${updates.length} students to ${classes.find(c => c.id === targetClassId)?.name}?`)) {
        onPromoteStudents(updates);
        setSelectedIds(new Set());
        alert("Promotion successfully applied.");
    }
  };

    // Auto-suggest next class logic (simple string matching)
    // E.g. JSS 1 -> JSS 2
    React.useEffect(() => {
        if(selectedClassId) {
            const current = classes.find(c => c.id === selectedClassId);
            if(current) {
                const parts = current.name.split(' '); // ["JSS", "1"]
                if(parts.length === 2) {
                    const level = parseInt(parts[1]);
                    if(!isNaN(level)) {
                       // Look for next level
                       const nextName = `${parts[0]} ${level + 1}`;
                       const nextClass = classes.find(c => c.name === nextName);
                       if(nextClass) setTargetClassId(nextClass.id);
                    }
                    // Handle JSS 3 -> SSS 1
                    if(current.name === "JSS 3") {
                         const nextClass = classes.find(c => c.name === "SSS 1");
                         if(nextClass) setTargetClassId(nextClass.id);
                    }
                }
            }
        }
    }, [selectedClassId, classes]);

  return (
    <div className="space-y-6">
       <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-indigo-600">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Annual Promotion Manager</h2>
          <p className="text-sm text-gray-500 mb-6">Calculate cumulative averages across all terms (1st, 2nd, 3rd) and promote students to the next class.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Session</label>
                  <select 
                    className="w-full border p-2 rounded"
                    value={selectedSession}
                    onChange={e => setSelectedSession(e.target.value)}
                  >
                      <option value="2023/2024">2023/2024</option>
                      <option value="2024/2025">2024/2025</option>
                  </select>
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Class</label>
                  <select 
                    className="w-full border p-2 rounded"
                    value={selectedClassId}
                    onChange={e => setSelectedClassId(e.target.value)}
                  >
                      <option value="">-- Select Class --</option>
                      {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
              </div>
              <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Promote Selected To</label>
                   <select 
                    className="w-full border p-2 rounded"
                    value={targetClassId}
                    onChange={e => setTargetClassId(e.target.value)}
                  >
                      <option value="">-- Select Target --</option>
                      {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
              </div>
          </div>
          
          <div className="mt-4 flex justify-end">
              <Button 
                onClick={executePromotion} 
                disabled={selectedIds.size === 0 || !targetClassId}
              >
                Promote {selectedIds.size} Students
              </Button>
          </div>
       </div>

       {selectedClassId && (
         <div className="bg-white shadow rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left">
                            <input type="checkbox" onChange={handleSelectAll} checked={selectedIds.size === studentPerformance.length && studentPerformance.length > 0} className="rounded text-indigo-600 focus:ring-indigo-500"/>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">1st Term</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">2nd Term</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">3rd Term</th>
                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase">Cum. Avg</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Verdict</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {studentPerformance.map((data) => (
                        <tr key={data.student.id} className={selectedIds.has(data.student.id) ? 'bg-indigo-50' : ''}>
                            <td className="px-6 py-4">
                                <input 
                                    type="checkbox" 
                                    checked={selectedIds.has(data.student.id)} 
                                    onChange={() => handleToggle(data.student.id)}
                                    className="rounded text-indigo-600 focus:ring-indigo-500"
                                />
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                {data.student.name}
                                <div className="text-xs text-gray-500">{data.student.id}</div>
                            </td>
                            <td className="px-6 py-4 text-center text-sm text-gray-500">{data.t1 > 0 ? data.t1.toFixed(1) : '-'}</td>
                            <td className="px-6 py-4 text-center text-sm text-gray-500">{data.t2 > 0 ? data.t2.toFixed(1) : '-'}</td>
                            <td className="px-6 py-4 text-center text-sm text-gray-500">{data.t3 > 0 ? data.t3.toFixed(1) : '-'}</td>
                            <td className="px-6 py-4 text-center text-sm font-bold text-gray-800">{data.cumulative.toFixed(1)}%</td>
                            <td className="px-6 py-4 text-center">
                                <span className={`px-2 py-1 text-xs rounded-full ${data.cumulative >= 50 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {data.recommendedAction}
                                </span>
                            </td>
                        </tr>
                    ))}
                    {studentPerformance.length === 0 && (
                        <tr><td colSpan={7} className="text-center p-4 text-gray-500">No students found in this class.</td></tr>
                    )}
                </tbody>
            </table>
         </div>
       )}
    </div>
  );
};

export default PromotionManager;
