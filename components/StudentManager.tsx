import React, { useState } from 'react';
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

  const handlePromote = (student: Student) => {
      // Simple promotion logic: just ask user to pick new class
      const newClassId = prompt(`Promote ${student.name} to which class ID? (Current: ${student.classId})`);
      if (newClassId && classes.some(c => c.id === newClassId)) {
          onUpdate({ ...student, classId: newClassId, promotionStatus: PromotionStatus.PROMOTED });
      } else if (newClassId) {
          alert("Invalid Class ID");
      }
  };

  const filteredStudents = filterClass === 'ALL' 
    ? students 
    : students.filter(s => s.classId === filterClass);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Student Database</h2>
        <div className="flex space-x-2">
            <select 
                className="border-gray-300 rounded-md shadow-sm border p-2 text-sm"
                value={filterClass}
                onChange={e => setFilterClass(e.target.value)}
            >
                <option value="ALL">All Classes</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name} {c.arm}</option>)}
            </select>
            <Button onClick={() => setIsEditing(true)}>+ Register Student</Button>
        </div>
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
                disabled={!!(currentStudent.id && isEditing)} // Cannot change ID once set
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
                <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{cls ? `${cls.name} ${cls.arm}` : s.classId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 text-xs rounded-full ${s.promotionStatus === 'PROMOTED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {s.promotionStatus}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button onClick={() => handlePromote(s)} className="text-purple-600 hover:text-purple-900">Promote</button>
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
