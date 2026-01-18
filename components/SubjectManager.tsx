
import React, { useState } from 'react';
import { Subject, ClassDefinition } from '../types';
import Button from './Button';

interface Props {
  subjects: Subject[];
  classes: ClassDefinition[];
  onAdd: (sub: Subject) => void;
  onUpdate: (sub: Subject) => void;
  onDelete: (id: string) => void;
}

const SubjectManager: React.FC<Props> = ({ subjects, classes, onAdd, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentSubject, setCurrentSubject] = useState<Partial<Subject>>({ isCore: true, compatibleLevels: [] });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentSubject.id && subjects.some(s => s.id === currentSubject.id && isEditing)) {
      onUpdate(currentSubject as Subject);
    } else {
      const id = currentSubject.name?.toUpperCase().substring(0, 4) || `SUB${Date.now()}`;
      onAdd({ ...currentSubject, id } as Subject);
    }
    setIsEditing(false);
    setCurrentSubject({ isCore: true, compatibleLevels: [] });
  };

  const toggleLevel = (level: string) => {
      const current = currentSubject.compatibleLevels || [];
      if (current.includes(level)) {
          setCurrentSubject({ ...currentSubject, compatibleLevels: current.filter(l => l !== level) });
      } else {
          setCurrentSubject({ ...currentSubject, compatibleLevels: [...current, level] });
      }
  };

  const availableLevels = classes.map(c => c.name).sort();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Subject Management</h2>
        <Button onClick={() => setIsEditing(true)}>+ Add Subject</Button>
      </div>

      {isEditing && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-bold mb-4">{currentSubject.id ? 'Edit Subject' : 'Add New Subject'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Subject Name</label>
              <input 
                type="text" required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                value={currentSubject.name || ''}
                onChange={e => setCurrentSubject({...currentSubject, name: e.target.value})}
              />
            </div>
            
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Mapped Class Levels (Leave empty for All)</label>
                <div className="flex flex-wrap gap-2">
                    {availableLevels.length > 0 ? availableLevels.map(level => (
                        <button
                            key={level}
                            type="button"
                            onClick={() => toggleLevel(level)}
                            className={`px-3 py-1 rounded text-xs font-medium border ${
                                (currentSubject.compatibleLevels || []).includes(level) 
                                ? 'bg-green-600 text-white border-green-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            {level}
                        </button>
                    )) : (
                        <p className="text-xs text-gray-400">No classes defined. Create classes to map specific subjects.</p>
                    )}
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <input 
                    type="checkbox" 
                    checked={currentSubject.isCore}
                    onChange={e => setCurrentSubject({...currentSubject, isCore: e.target.checked})}
                    className="rounded text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Core Subject</span>
            </div>
            
            <div className="flex space-x-2 pt-4">
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
                <div className="flex items-center space-x-2">
                    <span className="text-lg font-medium text-gray-900">{s.name}</span>
                    {s.isCore && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Core</span>}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                    Applicable to: {(!s.compatibleLevels || s.compatibleLevels.length === 0) ? 'All Levels' : s.compatibleLevels.join(', ')}
                </div>
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
