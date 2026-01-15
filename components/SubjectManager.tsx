import React, { useState } from 'react';
import { Subject } from '../types';
import Button from './Button';

interface Props {
  subjects: Subject[];
  onAdd: (sub: Subject) => void;
  onUpdate: (sub: Subject) => void;
  onDelete: (id: string) => void;
}

const SubjectManager: React.FC<Props> = ({ subjects, onAdd, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentSubject, setCurrentSubject] = useState<Partial<Subject>>({ isCore: true });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentSubject.id && subjects.some(s => s.id === currentSubject.id && isEditing)) {
      onUpdate(currentSubject as Subject);
    } else {
      const id = currentSubject.name?.toUpperCase().substring(0, 4) || `SUB${Date.now()}`;
      onAdd({ ...currentSubject, id } as Subject);
    }
    setIsEditing(false);
    setCurrentSubject({ isCore: true });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Subject Management</h2>
        <Button onClick={() => setIsEditing(true)}>+ Add Subject</Button>
      </div>

      {isEditing && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-bold mb-4">{currentSubject.id ? 'Edit Subject' : 'Add New Subject'}</h3>
          <form onSubmit={handleSubmit} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Subject Name</label>
              <input 
                type="text" required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                value={currentSubject.name || ''}
                onChange={e => setCurrentSubject({...currentSubject, name: e.target.value})}
              />
            </div>
            <div className="mb-3">
                <label className="flex items-center space-x-2">
                    <input 
                        type="checkbox" 
                        checked={currentSubject.isCore}
                        onChange={e => setCurrentSubject({...currentSubject, isCore: e.target.checked})}
                        className="rounded text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">Core Subject</span>
                </label>
            </div>
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden rounded-md">
        <ul className="divide-y divide-gray-200">
          {subjects.map(s => (
            <li key={s.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
              <div>
                <span className="text-lg font-medium text-gray-900">{s.name}</span>
                {s.isCore && <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Core</span>}
              </div>
              <div className="flex space-x-2">
                <button onClick={() => { setCurrentSubject(s); setIsEditing(true); }} className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                <button onClick={() => onDelete(s.id)} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SubjectManager;
