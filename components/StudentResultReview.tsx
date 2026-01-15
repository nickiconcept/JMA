
import React, { useState } from 'react';
import { Student, Result, Subject, ClassDefinition, UserRole } from '../types';
import Button from './Button';

interface Props {
  students: Student[];
  results: Result[];
  classes: ClassDefinition[];
  subjects: Subject[];
  userRole: UserRole;
  onSaveRemark: (studentId: string, remark: string) => void;
  assignedClassIds?: string[];
}

const StudentResultReview: React.FC<Props> = ({ 
    students, results, classes, subjects, userRole, onSaveRemark, assignedClassIds 
}) => {
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [remark, setRemark] = useState('');

    const visibleClasses = userRole === UserRole.ADMIN || userRole === UserRole.PRINCIPAL 
        ? classes 
        : classes.filter(c => assignedClassIds?.includes(c.id));

    const classStudents = students.filter(s => s.classId === selectedClassId);
    
    const handleStudentSelect = (id: string) => {
        setSelectedStudentId(id);
        const studentResults = results.filter(r => r.studentId === id);
        // Load existing remark if available
        if (studentResults.length > 0) {
            if (userRole === UserRole.PRINCIPAL) {
                setRemark(studentResults[0].principalRemark || '');
            } else {
                setRemark(studentResults[0].formMasterRemark || '');
            }
        } else {
            setRemark('');
        }
    };

    const handleSave = () => {
        if (selectedStudentId) {
            onSaveRemark(selectedStudentId, remark);
        }
    };

    const studentResults = results.filter(r => r.studentId === selectedStudentId);
    const totalScore = studentResults.reduce((acc, curr) => acc + curr.total, 0);
    const average = studentResults.length > 0 ? (totalScore / studentResults.length).toFixed(1) : 0;

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                    {userRole === UserRole.PRINCIPAL ? "Principal's Review" : "Form Master's Review"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Select Class</label>
                        <select 
                            className="w-full border p-2 rounded mt-1"
                            value={selectedClassId}
                            onChange={e => { setSelectedClassId(e.target.value); setSelectedStudentId(''); }}
                        >
                            <option value="">-- Choose Class --</option>
                            {visibleClasses.map(c => <option key={c.id} value={c.id}>{c.name} {c.arm}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Select Student</label>
                        <select 
                            className="w-full border p-2 rounded mt-1"
                            value={selectedStudentId}
                            onChange={e => handleStudentSelect(e.target.value)}
                            disabled={!selectedClassId}
                        >
                            <option value="">-- Choose Student --</option>
                            {classStudents.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {selectedStudentId && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200">
                         <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800">Result Summary</h3>
                            <div className="flex gap-4 text-sm">
                                <span><span className="font-bold">Total:</span> {totalScore}</span>
                                <span><span className="font-bold">Avg:</span> {average}</span>
                            </div>
                         </div>
                         <table className="min-w-full divide-y divide-gray-200">
                             <thead className="bg-white">
                                 <tr>
                                     <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Subject</th>
                                     <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Total</th>
                                     <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Grade</th>
                                 </tr>
                             </thead>
                             <tbody className="divide-y divide-gray-200">
                                 {studentResults.map(r => {
                                     const sub = subjects.find(s => s.id === r.subjectId);
                                     return (
                                         <tr key={r.id}>
                                             <td className="px-6 py-3 text-sm text-gray-900">{sub?.name}</td>
                                             <td className="px-6 py-3 text-center text-sm font-bold">{r.total}</td>
                                             <td className="px-6 py-3 text-center text-sm">
                                                 <span className={`px-2 py-0.5 rounded text-xs font-bold ${r.grade === 'F' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                     {r.grade}
                                                 </span>
                                             </td>
                                         </tr>
                                     )
                                 })}
                                 {studentResults.length === 0 && (
                                     <tr><td colSpan={3} className="text-center py-4 text-gray-500">No results found.</td></tr>
                                 )}
                             </tbody>
                         </table>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 h-fit">
                        <label className="block text-sm font-bold text-gray-800 mb-2">
                             {userRole === UserRole.PRINCIPAL ? "Principal's General Remark" : "Form Master's General Remark"}
                        </label>
                        <textarea 
                            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                            rows={6}
                            placeholder="Enter a general comment on the student's performance..."
                            value={remark}
                            onChange={e => setRemark(e.target.value)}
                        ></textarea>
                        <div className="mt-4">
                            <Button onClick={handleSave} className="w-full">Save Remark</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentResultReview;
