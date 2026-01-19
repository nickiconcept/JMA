
import React, { useState, useRef } from 'react';
import { Student, ClassDefinition, PromotionStatus, SchoolConfig } from '../types';
import Button from './Button';

interface Props {
  students: Student[];
  classes: ClassDefinition[];
  onAdd: (student: Student) => void;
  onUpdate: (student: Student) => void;
  onDelete: (id: string) => void;
  schoolConfig: SchoolConfig;
}

const StudentManager: React.FC<Props> = ({ students, classes, onAdd, onUpdate, onDelete, schoolConfig }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Partial<Student>>({});
  const [filterClass, setFilterClass] = useState<string>('ALL');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set());
  const [targetClassId, setTargetClassId] = useState<string>('');

  // Helper to generate serial admission numbers
  const generateAdmissionNo = (offset: number = 0) => {
    // 1. Get format from config or default
    const format = schoolConfig.admissionNumberFormat || 'JMA/{YY}/';
    
    // 2. Determine current year short code (e.g. 26 for 2026)
    const currentYearShort = new Date().getFullYear().toString().slice(-2);
    
    // 3. Construct the prefix (e.g. JMA/26/)
    const prefix = format.replace('{YY}', currentYearShort);
    
    // 4. Find existing IDs that start with this prefix to determine sequence
    const existingNums = students
        .filter(s => s.id.startsWith(prefix))
        .map(s => {
            // Extract the suffix part (after the prefix)
            const suffix = s.id.slice(prefix.length);
            return parseInt(suffix, 10);
        })
        .filter(n => !isNaN(n));
    
    // 5. Calculate next number
    const max = existingNums.length > 0 ? Math.max(...existingNums) : 0;
    const next = max + 1 + offset;
    
    // 6. Return formatted ID (e.g. JMA/26/0001)
    return `${prefix}${next.toString().padStart(4, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStudent.id && students.some(s => s.id === currentStudent.id && isEditing)) {
      onUpdate(currentStudent as Student);
    } else {
      const admissionNo = currentStudent.id || generateAdmissionNo();
      onAdd({ ...currentStudent, id: admissionNo, promotionStatus: PromotionStatus.PENDING } as Student);
    }
    setIsEditing(false);
    setCurrentStudent({});
  };

  const handlePromoteSingle = (student: Student) => {
      const newClassId = prompt(`Promote ${student.name} to which class ID? (Current: ${student.classId})`);
      if (newClassId && classes.some(c => c.id === newClassId)) {
          onUpdate({ ...student, classId: newClassId, promotionStatus: PromotionStatus.PROMOTED });
      } else if (newClassId) {
          alert("Invalid Class ID");
      }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
          const csv = event.target?.result as string;
          const lines = csv.split('\n');
          let addedCount = 0;
          lines.forEach((line, index) => {
              if (index === 0) return; // Skip header
              const [name, classId] = line.split(',').map(item => item.trim());
              if (name && classId && classes.some(c => c.id === classId)) {
                  // Use addedCount as offset to ensure uniqueness in this batch
                  const newId = generateAdmissionNo(addedCount);
                  onAdd({
                      id: newId,
                      name: name,
                      classId: classId,
                      promotionStatus: PromotionStatus.PENDING
                  });
                  addedCount++;
              }
          });
          alert(`Successfully added ${addedCount} students from CSV.`);
      };
      reader.readAsText(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadTemplate = () => {
      // Header
      let csvContent = "Name,ClassID\n";
      
      // Generate example rows for ALL available classes to guide the user
      if (classes.length > 0) {
          csvContent += classes.map((c, index) => `Student Name ${index + 1},${c.id}`).join('\n');
      } else {
          csvContent += "John Doe,JSS1\nJane Smith,SSS2";
      }

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "student_bulk_upload_template.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const filteredStudents = filterClass === 'ALL' 
    ? students 
    : students.filter(s => s.classId === filterClass);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
          const ids = filteredStudents.map(s => s.id);
          setSelectedStudentIds(new Set(ids));
      } else {
          setSelectedStudentIds(new Set());
      }
  };

  const handleSelectOne = (id: string) => {
      const newSet = new Set(selectedStudentIds);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      setSelectedStudentIds(newSet);
  };

  const handleBulkPromote = () => {
      if (!targetClassId || selectedStudentIds.size === 0) {
          alert("Please select students and a target class.");
          return;
      }
      if (confirm(`Promote ${selectedStudentIds.size} students?`)) {
          selectedStudentIds.forEach(id => {
              const student = students.find(s => s.id === id);
              if (student) {
                  onUpdate({ ...student, classId: targetClassId, promotionStatus: PromotionStatus.PROMOTED });
              }
          });
          setSelectedStudentIds(new Set());
      }
  };

  const handleBulkDelete = () => {
      if (selectedStudentIds.size === 0) return;
      if (confirm(`Delete ${selectedStudentIds.size} students? Irreversible.`)) {
          selectedStudentIds.forEach(id => onDelete(id));
          setSelectedStudentIds(new Set());
      }
  };

  const inputClass = "w-full px-4 py-2 rounded-xl border border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-sm";
  const previewNextId = generateAdmissionNo();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold font-display text-slate-900">Student Database</h2>
           <p className="text-slate-500 text-sm">Manage enrollment and class assignments.</p>
        </div>
        <div className="flex space-x-2 items-center">
             <input type="file" accept=".csv" className="hidden" ref={fileInputRef} onChange={handleFileUpload}/>
            <Button variant="outline" onClick={downloadTemplate} className="text-sm">Download Template</Button>
            <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>Bulk Upload</Button>
            <Button onClick={() => setIsEditing(true)}>+ Register Student</Button>
        </div>
      </div>
      
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Filter by Class</label>
              <select className={inputClass} value={filterClass} onChange={e => { setFilterClass(e.target.value); setSelectedStudentIds(new Set()); }}>
                  <option value="ALL">All Classes</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
          </div>

          <div className={`transition-all duration-200 ${selectedStudentIds.size > 0 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
               <div className="bg-blue-50 p-2 pl-4 rounded-xl border border-blue-100 flex gap-3 items-center">
                    <div className="flex-1">
                        <select className="w-full bg-transparent text-sm font-medium text-blue-900 border-none focus:ring-0 p-0" value={targetClassId} onChange={e => setTargetClassId(e.target.value)}>
                            <option value="">-- Promote Selected To --</option>
                            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <Button onClick={handleBulkPromote} className="py-1.5 px-3 text-xs h-8">Go</Button>
                    <Button onClick={handleBulkDelete} variant="danger" className="py-1.5 px-3 text-xs h-8">Del</Button>
               </div>
          </div>
      </div>

      {isEditing && (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 fixed inset-0 md:inset-auto md:relative z-50 md:z-0 m-4 md:m-0 overflow-y-auto">
          <h3 className="text-lg font-bold font-display text-slate-800 mb-6">{currentStudent.id ? 'Edit Student' : 'New Registration'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
              <input type="text" required className={inputClass} value={currentStudent.name || ''} onChange={e => setCurrentStudent({...currentStudent, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Class</label>
              <select className={inputClass} value={currentStudent.classId || ''} onChange={e => setCurrentStudent({...currentStudent, classId: e.target.value})} required>
                <option value="">Select Class</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
             <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Admission No <span className="font-normal text-slate-400">(Auto: {previewNextId})</span></label>
              <input type="text" className={inputClass} value={currentStudent.id || ''} onChange={e => setCurrentStudent({...currentStudent, id: e.target.value})} disabled={!!(currentStudent.id && isEditing)} placeholder={previewNextId} />
            </div>
            <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button type="submit">Save Student</Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-6 py-4 text-left w-10">
                  <input type="checkbox" onChange={handleSelectAll} checked={filteredStudents.length > 0 && selectedStudentIds.size === filteredStudents.length} className="rounded-md border-slate-300 text-blue-600 focus:ring-blue-500" />
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Admission No</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Class</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-50">
            {filteredStudents.map(s => {
               const cls = classes.find(c => c.id === s.classId);
               return (
                <tr key={s.id} className={`hover:bg-slate-50/80 transition-colors ${selectedStudentIds.has(s.id) ? 'bg-blue-50/50' : ''}`}>
                    <td className="px-6 py-4">
                        <input type="checkbox" checked={selectedStudentIds.has(s.id)} onChange={() => handleSelectOne(s.id)} className="rounded-md border-slate-300 text-blue-600 focus:ring-blue-500" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-500">{s.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">{s.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{cls ? cls.name : s.classId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${s.promotionStatus === 'PROMOTED' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                            {s.promotionStatus}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                        <button onClick={() => handlePromoteSingle(s)} className="text-indigo-600 hover:text-indigo-900 font-medium">Promote</button>
                        <button onClick={() => { setCurrentStudent(s); setIsEditing(true); }} className="text-blue-600 hover:text-blue-900 font-medium">Edit</button>
                        <button onClick={() => onDelete(s.id)} className="text-red-500 hover:text-red-700 font-medium">Delete</button>
                    </td>
                </tr>
               );
            })}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default StudentManager;
