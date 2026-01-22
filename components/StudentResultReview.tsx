
import React, { useState, useMemo } from 'react';
import { Student, Result, Subject, ClassDefinition, UserRole } from '../types';
import Button from './Button';
import { generateGeneralRemark } from '../services/geminiService';
import { SparklesIcon, CursorArrowRaysIcon } from '@heroicons/react/24/solid';

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
    students = [], results = [], classes = [], subjects = [], userRole, onSaveRemark, assignedClassIds = [] 
}) => {
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [remark, setRemark] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    // International-aware formatting
    const locale = navigator.language || 'en-NG';
    const percentFormat = new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 1 });

    const visibleClasses = useMemo(() => {
        if (userRole === UserRole.ADMIN || userRole === UserRole.PRINCIPAL) return classes;
        return classes.filter(c => assignedClassIds.includes(c.id));
    }, [userRole, classes, assignedClassIds]);

    const classStudents = useMemo(() => 
        students.filter(s => s.classId === selectedClassId)
    , [students, selectedClassId]);
    
    const handleStudentSelect = (id: string) => {
        setSelectedStudentId(id);
        const studentResults = results.filter(r => r.studentId === id);
        if (studentResults.length > 0) {
            setRemark(userRole === UserRole.PRINCIPAL ? (studentResults[0].principalRemark || '') : (studentResults[0].formMasterRemark || ''));
        } else {
            setRemark('');
        }
    };

    const studentResults = useMemo(() => 
        results.filter(r => r.studentId === selectedStudentId)
    , [results, selectedStudentId]);

    const totalScore = useMemo(() => 
        studentResults.reduce((acc, curr) => acc + (curr.total || 0), 0)
    , [studentResults]);

    const average = useMemo(() => 
        studentResults.length > 0 ? (totalScore / studentResults.length) : 0
    , [studentResults, totalScore]);

    const handleGenerateAiRemark = async () => {
        if (!selectedStudentId) return;
        setIsGenerating(true);
        try {
            const student = students.find(s => s.id === selectedStudentId);
            const generated = await generateGeneralRemark(
                student?.name || 'Student', 
                userRole === UserRole.PRINCIPAL ? 'PRINCIPAL' : 'FORM_MASTER', 
                average, 
                totalScore
            );
            setRemark(generated);
        } catch (err) {
            console.error("AI Remark failed", err);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = () => {
        if (selectedStudentId) onSaveRemark(selectedStudentId, remark);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Context Selector */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 font-display uppercase tracking-tight">
                            {userRole === UserRole.PRINCIPAL ? "Principal's Review" : "Class Review"}
                        </h2>
                        <p className="text-slate-500 text-sm font-medium mt-1">Terminal assessment and official remarks.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <select 
                            className="px-5 py-3.5 rounded-2xl border border-slate-200 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                            value={selectedClassId}
                            onChange={e => { setSelectedClassId(e.target.value); setSelectedStudentId(''); setRemark(''); }}
                        >
                            <option value="">-- Select Class --</option>
                            {visibleClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <select 
                            className="px-5 py-3.5 rounded-2xl border border-slate-200 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400"
                            value={selectedStudentId}
                            onChange={e => handleStudentSelect(e.target.value)}
                            disabled={!selectedClassId}
                        >
                            <option value="">-- Select Student --</option>
                            {classStudents.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {selectedStudentId ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                         <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px]">Student Performance Profile</h3>
                            <div className="flex gap-8 items-center">
                                <div className="text-center">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Grand Total</p>
                                    <p className="text-xl font-black text-slate-900">{totalScore}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Average</p>
                                    <p className="text-xl font-black text-blue-600">{average.toFixed(1)}%</p>
                                </div>
                            </div>
                         </div>
                         <div className="overflow-x-auto">
                             <table className="min-w-full divide-y divide-slate-100">
                                 <thead>
                                     <tr className="bg-slate-50/30">
                                         <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject</th>
                                         <th className="px-8 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Score</th>
                                         <th className="px-8 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Grade</th>
                                     </tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-50">
                                     {studentResults.map(r => {
                                         const sub = subjects.find(s => s.id === r.subjectId);
                                         return (
                                             <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                                                 <td className="px-8 py-4 text-sm font-bold text-slate-800">{sub?.name || r.subjectId}</td>
                                                 <td className="px-8 py-4 text-center text-sm font-black text-slate-900">{r.total}</td>
                                                 <td className="px-8 py-4 text-center">
                                                     <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${r.grade === 'F' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                                                         {r.grade}
                                                     </span>
                                                 </td>
                                             </tr>
                                         )
                                     })}
                                     {studentResults.length === 0 && (
                                         <tr><td colSpan={3} className="text-center py-20 text-slate-400 font-medium italic">No scores uploaded for this term.</td></tr>
                                     )}
                                 </tbody>
                             </table>
                         </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col gap-6 sticky top-24">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Official Verdict</label>
                            <button 
                                onClick={handleGenerateAiRemark}
                                disabled={isGenerating || studentResults.length === 0}
                                className="flex items-center gap-2 text-[9px] font-black text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full transition-all disabled:opacity-30"
                            >
                                {isGenerating ? <div className="h-2 w-2 border-2 border-blue-600 border-t-transparent animate-spin rounded-full"></div> : <SparklesIcon className="h-3 w-3" />}
                                GENERATE WITH AI
                            </button>
                        </div>
                        <textarea 
                            className="w-full border border-slate-200 rounded-2xl p-4 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none resize-none bg-slate-50/50 h-40 transition-all placeholder:text-slate-300"
                            placeholder="Review student performance, character, and areas of improvement..."
                            value={remark}
                            onChange={e => setRemark(e.target.value)}
                        ></textarea>
                        <Button onClick={handleSave} disabled={!selectedStudentId} className="w-full py-4 text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-500/20">
                            Apply Remark
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="bg-white p-24 text-center rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center">
                    <div className="h-16 w-16 bg-slate-50 text-slate-200 rounded-2xl flex items-center justify-center mb-6">
                        <CursorArrowRaysIcon className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-black text-slate-700 font-display uppercase tracking-tight">Select Student to Review</h3>
                    <p className="text-slate-400 text-sm max-w-xs mx-auto mt-2 font-medium">Use the filters above to load a student profile and provide official terminal feedback.</p>
                </div>
            )}
        </div>
    );
};

export default StudentResultReview;
