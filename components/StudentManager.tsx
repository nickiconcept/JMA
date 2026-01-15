
import React, { useState, useRef } from 'react';
import { Student, ClassDefinition, PromotionStatus } from '../types';
import Button from './Button';

interface Props {
  students: Student[];
  classes: ClassDefinition[];
  onAdd: (student: Student) => void;
  onUpdate: (student: Student) => void;
  onDelete: (id: string) => void;
}

const StudentManager: React.FC<Props> = ({ students, classes, onAdd, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Partial<Student>>({});
  const [filterClass, setFilterClass] = useState<string>('ALL');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Bulk Selection State
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set());
  const [targetClassId, setTargetClassId] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStudent.id && students.some(s => s.id === currentStudent.id && isEditing)) {
      onUpdate(currentStudent as Student);
    } else {
      const admissionNo = currentStudent.id || `JMA/24/${Math.floor(Math.random() * 1000)}`;
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
              
              if (name && classId) {
                  if (classes.some(c => c.id === classId)) {
                      onAdd({
                          id: `JMA/24/${Math.floor(Math.random() * 90000) + 10000}`,
                          name: name,
                          classId: classId,
                          promotionStatus: PromotionStatus.PENDING
                      });
                      addedCount++;
                  }
              }
          });
          alert(`Successfully added ${addedCount} students from CSV.`);
      };
      reader.readAsText(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Filtering
  const filteredStudents = filterClass === 'ALL' 
    ? students 
    : students.filter(s => s.classId === filterClass);

  // Selection Logic
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
      if (!targetClassId) {
          alert("Please select a target class for promotion.");
          return;
      }
      if (selectedStudentIds.size === 0) {
          alert("No students selected.");
          return;
      }

      if (confirm(`Are you sure you want to promote ${selectedStudentIds.size} students to ${classes.find(c => c.id === targetClassId)?.name} ${classes.find(c => c.id === targetClassId)?.arm}?`)) {
          // Iterate and update
          selectedStudentIds.forEach(id => {
              const student = students.find(s => s.id === id);
              if (student) {
                  onUpdate({
                      ...student,
                      classId: targetClassId,
                      promotionStatus: PromotionStatus.PROMOTED
                  });
              }
          });
          setSelectedStudentIds(new Set());
          alert("Bulk promotion completed successfully.");
      }
  };

  const handleBulkDelete = () => {
      if (selectedStudentIds.size === 0) return;
      if (confirm(`Are you sure you want to delete ${selectedStudentIds.size} students? This cannot be undone.`)) {
          selectedStudentIds.forEach(id => onDelete(id));
          setSelectedStudentIds(new Set());
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Student Database</h2>
        <div className="flex space-x-2 items-center">
             <input 
                type="file" 
                accept=".csv" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileUpload}
            />
            <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                📂 Bulk Upload (CSV)
            </Button>
            <Button onClick={() => setIsEditing(true)}>+ Register Student</Button>
        </div>
      </div>
      
      {/* Bulk Action / Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          {/* Filter Section */}
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Current Class</label>
              <select 
                    className="w-full border-gray-300 rounded-md shadow-sm border p-2 text-sm"
                    value={filterClass}
                    onChange={e => { setFilterClass(e.target.value); setSelectedStudentIds(new Set()); }}
                >
                    <option value="ALL">All Classes</option>
                    {classes.map(c => <option key={c.id} value={c.id}>{c.name} {c.arm}</option>)}
                </select>
          </div>

          {/* Bulk Action Section */}
          <div className={`transition-opacity duration-200 ${selectedStudentIds.size > 0 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
               <div className="bg-blue-50 p-3 rounded border border-blue-100 flex gap-2 items-end">
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-blue-800 mb-1">Promote Selected ({selectedStudentIds.size}) To:</label>
                        <select
                            className="w-full border-blue-300 rounded text-sm p-1.5"
                            value={targetClassId}
                            onChange={e => setTargetClassId(e.target.value)}
                        >
                            <option value="">-- Select Target Class --</option>
                            {classes.map(c => <option key={c.id} value={c.id}>{c.name} {c.arm}</option>)}
                        </select>
                    </div>
                    <Button onClick={handleBulkPromote} className="h-9 text-xs">Promote</Button>
                    <Button onClick={handleBulkDelete} variant="danger" className="h-9 text-xs">Delete</Button>
               </div>
          </div>
      </div>

      <div className="text-xs text-gray-500 mb-2">
          CSV Format: <code>Student Name, ClassID</code> (e.g., "John Doe, JSS1-A")
      </div>

      {isEditing && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-bold mb-4">{currentStudent.id ? 'Edit Student' : 'Register New Student'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input 
                type="text" required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                value={currentStudent.name || ''}
                onChange={e => setCurrentStudent({...currentStudent, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Class</label>
              <select 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                value={currentStudent.classId || ''}
                onChange={e => setCurrentStudent({...currentStudent, classId: e.target.value})}
                required
              >
                <option value="">Select Class</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name} {c.arm}</option>
                ))}
              </select>
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">Admission No (Optional if new)</label>
              <input 
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                value={currentStudent.id || ''}
                onChange={e => setCurrentStudent({...currentStudent, id: e.target.value})}
                disabled={!!(currentStudent.id && isEditing)} 
              />
            </div>
            <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button type="submit">Save Student</Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden rounded-md">
        <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll}
                    checked={filteredStudents.length > 0 && selectedStudentIds.size === filteredStudents.length}
                    className="rounded text-green-600 focus:ring-green-500"
                  />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admission No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map(s => {
               const cls = classes.find(c => c.id === s.classId);
               return (
                <tr key={s.id} className={`hover:bg-gray-50 ${selectedStudentIds.has(s.id) ? 'bg-blue-50' : ''}`}>
                    <td className="px-6 py-4">
                        <input 
                            type="checkbox" 
                            checked={selectedStudentIds.has(s.id)}
                            onChange={() => handleSelectOne(s.id)}
                            className="rounded text-green-600 focus:ring-green-500"
                        />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{cls ? `${cls.name} ${cls.arm}` : s.classId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 text-xs rounded-full ${s.promotionStatus === 'PROMOTED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {s.promotionStatus}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button onClick={() => handlePromoteSingle(s)} className="text-purple-600 hover:text-purple-900">Promote</button>
                        <button onClick={() => { setCurrentStudent(s); setIsEditing(true); }} className="text-blue-600 hover:text-blue-900">Edit</button>
                        <button onClick={() => onDelete(s.id)} className="text-red-600 hover:text-red-900">Delete</button>
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
