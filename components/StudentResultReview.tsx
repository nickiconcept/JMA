
import React, { useState, useMemo, useEffect } from 'react';
import { Student, Result, Subject, ClassDefinition, UserRole } from '../types';
import Button from './Button';
import { generateGeneralRemark } from '../services/geminiService';
import { SparklesIcon, CursorArrowRaysIcon, ExclamationTriangleIcon, AcademicCapIcon } from '@heroicons/react/24/solid';

interface Props {
  students?: Student[];
  results?: Result[];
  classes?: ClassDefinition[];
  subjects?: Subject[];
  userRole: UserRole;
  onSaveRemark: (studentId: string, remark: string) => void;
  assignedClassIds?: string[];
}

const StudentResultReview: React.FC<Props> = ({ 
    students = [], 
    results = [], 
    classes = [], 
    subjects = [], 
    userRole, 
    onSaveRemark, 
    assignedClassIds = [] 
}) => {
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [remark, setRemark] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    // International Audit: Dynamic Locale Detection
    const locale = typeof navigator !== 'undefined' ? navigator.language : 'en-NG';
    const numberFormatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);

    // Filter visible classes based on access rights
    const visibleClasses = useMemo(() => {
        if (userRole === UserRole.ADMIN || userRole === UserRole.PRINCIPAL) return classes;
        return classes.filter(c => assignedClassIds.includes(c.id));
    }, [userRole, classes, assignedClassIds]);

    const classStudents = useMemo(() => 
        students.filter(s => s.classId === selectedClassId)
    , [students, selectedClassId]);
    
    // Reset student selection when class changes to prevent cross-data bleed
    useEffect(() => {
        setSelectedStudentId('');
        setRemark('');
    }, [selectedClassId]);

    const handleStudentSelect = (id: string) => {
        setSelectedStudentId(id);
        if (!id) {
            setRemark('');
            return;
        }
        const studentResults = results.filter(r => r.studentId === id);
        if (studentResults.length > 0) {
            // Load existing remark if present
            const existingRemark = userRole === UserRole.PRINCIPAL 
                ? (studentResults[0].principalRemark || '') 
                : (studentResults[0].formMasterRemark || '');
            setRemark(existingRemark);
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
            console.error("AI Generation Error:", err);
            alert("Unable to generate AI remark at this time. Please try manual entry.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = () => {
        if (selectedStudentId) {
            onSaveRemark(selectedStudentId, remark);
        }
    };

    // If critical props are missing, show a safe error state instead of crashing
    if (!userRole) {
        return (
            <div className="p-12 text-center bg-red-50 rounded-3xl border border-red-100">
                <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-red-900 uppercase tracking-tight">Configuration Error</h3>
                <p className="text-red-600 text-sm mt-1">User session context is missing. Please try logging out and back in.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500" dir="auto">
            {/* Header Context Selection */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 font-display uppercase tracking-tight flex items-center gap-3">
                            <AcademicCapIcon className="h-7 w-7 text-blue-600" />
                            {userRole === UserRole.PRINCIPAL ? "Principal's terminal Review" : "Class Performance Review"}
                        </h2>
                        <p className="text-slate-500 text-sm font-medium mt-1">Select a student to audit their term performance and provide official remarks.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative group flex-1 sm:w-64">
                            <select 
                                className="w-full pl-5 pr-10 py-3.5 rounded-2xl border border-slate-200 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
                                value={selectedClassId}
                                onChange={e => setSelectedClassId(e.target.value)}
                            >
                                <option value="">-- Targeted Class --</option>
                                {visibleClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                            </div>
                        </div>
                        <div className="relative group flex-1 sm:w-64">
                            <select 
                                className="w-full pl-5 pr-10 py-3.5 rounded-2xl border border-slate-200 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none bg-white disabled:bg-slate-50 disabled:text-slate-400"
                                value={selectedStudentId}
                                onChange={e => handleStudentSelect(e.target.value)}
                                disabled={!selectedClassId}
                            >
                                <option value="">-- Targeted Student --</option>
                                {classStudents.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
                            </select>
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {selectedStudentId ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Performance Profile Card */}
                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                         <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div>
                                <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px]">Academic Portfolio Summary</h3>
                                <p className="text-[10px] text-slate-400 mt-0.5">Based on {studentResults.length} term subjects</p>
                            </div>
                            <div className="flex gap-10 items-center">
                                <div className="text-center">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Grand Aggregate</p>
                                    <p className="text-2xl font-black text-slate-900 font-display">{numberFormatter.format(totalScore)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Overall Average</p>
                                    <div className="flex items-baseline gap-1">
                                        <p className="text-2xl font-black text-blue-600 font-display">{numberFormatter.format(Number(average.toFixed(1)))}</p>
                                        <span className="text-xs font-bold text-blue-400">%</span>
                                    </div>
                                </div>
                            </div>
                         </div>
                         <div className="overflow-x-auto">
                             <table className="min-w-full divide-y divide-slate-100">
                                 <thead>
                                     <tr className="bg-slate-50/30">
                                         <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Discipline / Subject</th>
                                         <th className="px-8 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Raw Score</th>
                                         <th className="px-8 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Weighted Grade</th>
                                     </tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-50">
                                     {studentResults.map(r => {
                                         const sub = subjects.find(s => s.id === r.subjectId);
                                         return (
                                             <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                                                 <td className="px-8 py-5 text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{sub?.name || r.subjectId}</td>
                                                 <td className="px-8 py-5 text-center text-sm font-black text-slate-900">{numberFormatter.format(r.total)}</td>
                                                 <td className="px-8 py-5 text-center">
                                                     <span className={`px-3 py-1 rounded-xl text-[10px] font-black shadow-sm border ${
                                                         r.grade === 'F' ? 'bg-red-50 text-red-600 border-red-100' : 
                                                         r.grade === 'A' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                         'bg-blue-50 text-blue-700 border-blue-100'
                                                     }`}>
                                                         {r.grade}
                                                     </span>
                                                 </td>
                                             </tr>
                                         )
                                     })}
                                     {studentResults.length === 0 && (
                                         <tr>
                                             <td colSpan={3} className="text-center py-24">
                                                 <div className="flex flex-col items-center opacity-40">
                                                     <ExclamationTriangleIcon className="h-10 w-10 text-slate-400 mb-2" />
                                                     <p className="text-sm font-medium italic">No performance data found for this term.</p>
                                                 </div>
                                             </td>
                                         </tr>
                                     )}
                                 </tbody>
                             </table>
                         </div>
                    </div>

                    {/* Official Verdict & AI Assistance */}
                    <div className="bg-white p-8 rounded-[2rem] shadow-2xl shadow-blue-900/5 border border-blue-50 flex flex-col gap-6 sticky top-24">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                                <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Official Remark</label>
                            </div>
                            <button 
                                onClick={handleGenerateAiRemark}
                                disabled={isGenerating || studentResults.length === 0}
                                className="group flex items-center gap-2 text-[9px] font-black text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-full transition-all disabled:opacity-30 active:scale-95"
                            >
                                {isGenerating ? (
                                    <div className="h-2.5 w-2.5 border-2 border-blue-600 border-t-transparent animate-spin rounded-full group-hover:border-white group-hover:border-t-transparent"></div>
                                ) : (
                                    <SparklesIcon className="h-3 w-3" />
                                )}
                                AI DRAFT
                            </button>
                        </div>
                        <div className="relative">
                            <textarea 
                                className="w-full border-2 border-slate-100 rounded-3xl p-5 text-sm font-medium focus:ring-8 focus:ring-blue-500/5 focus:border-blue-400 outline-none resize-none bg-slate-50/30 h-44 transition-all placeholder:text-slate-300 placeholder:italic"
                                placeholder="Audit findings and terminal assessment verdict..."
                                value={remark}
                                onChange={e => setRemark(e.target.value)}
                            ></textarea>
                            <div className="absolute bottom-4 right-5 text-[9px] font-bold text-slate-300 uppercase">Terminal Audit</div>
                        </div>
                        <Button 
                            onClick={handleSave} 
                            disabled={!selectedStudentId || isGenerating} 
                            className="w-full py-4 text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 active:scale-95"
                        >
                            Finalize Audit
                        </Button>
                    </div>
                </div>
            ) : (
                /* Empty State / Initial View */
                <div className="bg-white py-32 text-center rounded-[3.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center group hover:border-blue-200 transition-colors duration-500">
                    <div className="h-20 w-20 bg-slate-50 text-slate-200 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-blue-50 group-hover:text-blue-200 transition-all duration-500">
                        <CursorArrowRaysIcon className="h-10 w-10 animate-pulse" />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 font-display uppercase tracking-tight">Deployment Ready</h3>
                    <p className="text-slate-400 text-sm max-w-sm mx-auto mt-2 font-medium leading-relaxed px-10">
                        Please select a class and student from the header controls to begin the performance review protocol.
                    </p>
                </div>
            )}
        </div>
    );
};

export default StudentResultReview;
