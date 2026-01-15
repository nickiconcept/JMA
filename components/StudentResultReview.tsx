
import React, { useState } from 'react';
import { Student, Result, Subject, ClassDefinition, UserRole } from '../types';
import Button from './Button';
import { generateGeneralRemark } from '../services/geminiService';
import { SparklesIcon } from '@heroicons/react/24/solid';

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
    const [isGenerating, setIsGenerating] = useState(false);

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

    const studentResults = results.filter(r => r.studentId === selectedStudentId);
    const totalScore = studentResults.reduce((acc, curr) => acc + curr.total, 0);
    const average = studentResults.length > 0 ? (totalScore / studentResults.length) : 0;
    const formattedAverage = average.toFixed(1);

    const handleGenerateAiRemark = async () => {
        if (!selectedStudentId) return;
        setIsGenerating(true);
        const student = students.find(s => s.id === selectedStudentId);
        
        const generated = await generateGeneralRemark(
            student?.name || 'Student',
            userRole === UserRole.PRINCIPAL ? 'PRINCIPAL' : 'FORM_MASTER',
            average,
            totalScore
        );
        
        setRemark(generated);
        setIsGenerating(false);
    };

    const handleSave = () => {
        if (selectedStudentId) {
            onSaveRemark(selectedStudentId, remark);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4 font-display">
                    {userRole === UserRole.PRINCIPAL ? "Principal's Review" : "Form Master's Review"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Class</label>
                        <select 
                            className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                            value={selectedClassId}
                            onChange={e => { setSelectedClassId(e.target.value); setSelectedStudentId(''); }}
                        >
                            <option value="">-- Choose Class --</option>
                            {visibleClasses.map(c => <option key={c.id} value={c.id}>{c.name} {c.arm}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Student</label>
                        <select 
                            className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
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
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 flex flex-col">
                         <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800">Result Summary</h3>
                            <div className="flex gap-4 text-sm bg-white px-3 py-1 rounded border border-gray-200 shadow-sm">
                                <span><span className="font-bold text-slate-500">Total:</span> {totalScore}</span>
                                <span className="w-px bg-gray-300 h-4 self-center"></span>
                                <span><span className="font-bold text-slate-500">Avg:</span> {formattedAverage}</span>
                            </div>
                         </div>
                         <div className="overflow-x-auto flex-1">
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
                                         <tr><td colSpan={3} className="text-center py-8 text-gray-500 text-sm">No results uploaded yet.</td></tr>
                                     )}
                                 </tbody>
                             </table>
                         </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
                        <div className="flex justify-between items-center mb-3">
                            <label className="block text-sm font-bold text-gray-800">
                                {userRole === UserRole.PRINCIPAL ? "Principal's General Remark" : "Form Master's General Remark"}
                            </label>
                            <button 
                                onClick={handleGenerateAiRemark}
                                disabled={isGenerating}
                                className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
                            >
                                {isGenerating ? (
                                    <span className="animate-pulse">Writing...</span>
                                ) : (
                                    <>
                                        <SparklesIcon className="h-3 w-3" />
                                        <span>AI Suggest</span>
                                    </>
                                )}
                            </button>
                        </div>
                        <textarea 
                            className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none shadow-inner bg-slate-50/50"
                            rows={6}
                            placeholder="Enter a general comment on the student's performance..."
                            value={remark}
                            onChange={e => setRemark(e.target.value)}
                        ></textarea>
                        <div className="mt-4">
                            <Button onClick={handleSave} className="w-full shadow-lg shadow-blue-500/20">Save General Remark</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentResultReview;
