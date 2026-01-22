
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
    students: propsStudents, 
    results: propsResults, 
    classes: propsClasses, 
    subjects: propsSubjects, 
    userRole, 
    onSaveRemark, 
    assignedClassIds: propsAssignedIds
}) => {
    // Normalizing props to ensure we never operate on null/undefined arrays
    const students = useMemo(() => propsStudents || [], [propsStudents]);
    const results = useMemo(() => propsResults || [], [propsResults]);
    const classes = useMemo(() => propsClasses || [], [propsClasses]);
    const subjects = useMemo(() => propsSubjects || [], [propsSubjects]);
    const assignedClassIds = useMemo(() => propsAssignedIds || [], [propsAssignedIds]);

    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [remark, setRemark] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    // BCP 47 Locale Sanitization to prevent Intl RangeErrors
    const safeLocale = useMemo(() => {
        try {
            const navLang = typeof navigator !== 'undefined' ? navigator.language : 'en-NG';
            // Extract the first part of the locale string (e.g., 'en-NG' from 'en-NG,en;q=0.9')
            const tag = navLang ? navLang.split(',')[0].trim() : 'en-NG';
            // Validate tag format briefly
            return /^[a-z]{2,3}(-[a-z0-9]{2,4})?$/i.test(tag) ? tag : 'en-NG';
        } catch {
            return 'en-NG';
        }
    }, []);

    const numberFormatter = useMemo(() => {
        try {
            return new Intl.NumberFormat(safeLocale);
        } catch (e) {
            console.warn("Intl failed for locale", safeLocale, "falling back to en-US");
            return new Intl.NumberFormat('en-US');
        }
    }, [safeLocale]);

    // Filter visible classes based on access rights
    const visibleClasses = useMemo(() => {
        if (!userRole) return [];
        if (userRole === UserRole.ADMIN || userRole === UserRole.PRINCIPAL) return classes;
        return classes.filter(c => assignedClassIds.includes(c.id));
    }, [userRole, classes, assignedClassIds]);

    const classStudents = useMemo(() => 
        students.filter(s => s.classId === selectedClassId)
    , [students, selectedClassId]);
    
    // State Synchronization: Reset student when class changes
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
        studentResults.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0)
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
            alert("AI service unavailable. Please enter remark manually.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = () => {
        if (selectedStudentId) {
            onSaveRemark(selectedStudentId, remark);
        }
    };

    // Fail-safe view if userRole is missing
    if (!userRole) {
        return (
            <div className="p-12 text-center bg-amber-50 rounded-3xl border border-amber-100">
                <ExclamationTriangleIcon className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-amber-900 uppercase">Unauthorized View</h3>
                <p className="text-amber-600 text-sm mt-1">Unable to determine user role permissions.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500" dir="auto">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 font-display uppercase tracking-tight flex items-center gap-3">
                            <AcademicCapIcon className="h-7 w-7 text-blue-600" />
                            {userRole === UserRole.PRINCIPAL ? "Principal Audit" : "Form Master Review"}
                        </h2>
                        <p className="text-slate-500 text-sm font-medium mt-1">Execute terminal assessment and finalize student remarks.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <select 
                            className="px-5 py-3.5 rounded-2xl border border-slate-200 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none bg-white min-w-[200px]"
                            value={selectedClassId}
                            onChange={e => setSelectedClassId(e.target.value)}
                        >
                            <option value="">-- Targeted Class --</option>
                            {visibleClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <select 
                            className="px-5 py-3.5 rounded-2xl border border-slate-200 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none bg-white disabled:bg-slate-50 disabled:text-slate-400 min-w-[200px]"
                            value={selectedStudentId}
                            onChange={e => handleStudentSelect(e.target.value)}
                            disabled={!selectedClassId}
                        >
                            <option value="">-- Targeted Student --</option>
                            {classStudents.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {selectedStudentId ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                         <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px]">Academic Portfolio</h3>
                            <div className="flex gap-10 items-center">
                                <div className="text-center">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Aggregate</p>
                                    <p className="text-2xl font-black text-slate-900 font-display">{numberFormatter.format(totalScore)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Average</p>
                                    <p className="text-2xl font-black text-blue-600 font-display">{numberFormatter.format(Number(average.toFixed(1)))}%</p>
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
                                             <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                                                 <td className="px-8 py-5 text-sm font-bold text-slate-700">{sub?.name || r.subjectId}</td>
                                                 <td className="px-8 py-5 text-center text-sm font-black text-slate-900">{numberFormatter.format(r.total)}</td>
                                                 <td className="px-8 py-5 text-center">
                                                     <span className={`px-3 py-1 rounded-xl text-[10px] font-black border ${
                                                         r.grade === 'F' ? 'bg-red-50 text-red-600 border-red-100' : 
                                                         'bg-blue-50 text-blue-700 border-blue-100'
                                                     }`}>
                                                         {r.grade}
                                                     </span>
                                                 </td>
                                             </tr>
                                         )
                                     })}
                                     {studentResults.length === 0 && (
                                         <tr><td colSpan={3} className="text-center py-24 text-slate-400 text-sm italic">No terminal records found for this student.</td></tr>
                                     )}
                                 </tbody>
                             </table>
                         </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] shadow-2xl shadow-blue-900/5 border border-blue-50 flex flex-col gap-6 sticky top-24">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Final Remark</label>
                            <button 
                                onClick={handleGenerateAiRemark}
                                disabled={isGenerating || studentResults.length === 0}
                                className="flex items-center gap-2 text-[9px] font-black text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full transition-all disabled:opacity-30"
                            >
                                {isGenerating ? (
                                    <div className="h-2 w-2 border-2 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
                                ) : (
                                    <SparklesIcon className="h-3 w-3" />
                                )}
                                AI ASSIST
                            </button>
                        </div>
                        <textarea 
                            className="w-full border-2 border-slate-100 rounded-3xl p-5 text-sm font-medium focus:ring-8 focus:ring-blue-500/5 focus:border-blue-400 outline-none resize-none bg-slate-50/30 h-44 transition-all placeholder:text-slate-300"
                            placeholder="Type assessment findings here..."
                            value={remark}
                            onChange={e => setRemark(e.target.value)}
                        ></textarea>
                        <Button 
                            onClick={handleSave} 
                            disabled={!selectedStudentId || isGenerating} 
                            className="w-full py-4 text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-600/20"
                        >
                            Apply Remark
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="bg-white py-32 text-center rounded-[3.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center">
                    <div className="h-20 w-20 bg-slate-50 text-slate-200 rounded-3xl flex items-center justify-center mb-6">
                        <CursorArrowRaysIcon className="h-10 w-10" />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 font-display uppercase tracking-tight">Audit Selection Required</h3>
                    <p className="text-slate-400 text-sm max-w-sm mx-auto mt-2 font-medium">Select a student from the header controls to begin the terminal performance audit.</p>
                </div>
            )}
        </div>
    );
};

export default StudentResultReview;
