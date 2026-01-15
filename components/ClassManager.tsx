
import React, { useState } from 'react';
import { ClassDefinition, User, UserRole } from '../types';
import Button from './Button';

interface Props {
  classes: ClassDefinition[];
  users: User[]; // Needed to assign Form Masters
  onAdd: (cls: ClassDefinition) => void;
  onUpdate: (cls: ClassDefinition) => void;
  onDelete: (id: string) => void;
  currentUserRole?: UserRole; // To check permissions
}

const ClassManager: React.FC<Props> = ({ classes, users, onAdd, onUpdate, onDelete, currentUserRole }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentClass, setCurrentClass] = useState<Partial<ClassDefinition>>({});

  const isAdmin = currentUserRole === UserRole.ADMIN;
  const formMasters = users.filter(u => u.role === UserRole.FORM_MASTER || u.role === UserRole.TEACHER);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentClass.id && classes.some(c => c.id === currentClass.id && isEditing)) {
       // Updating existing by logic, though ID usually shouldn't change
       onUpdate(currentClass as ClassDefinition);
    } else {
       // Creating new
       const newId = `${currentClass.name?.replace(/\s/g, '')}-${currentClass.arm}`;
       onAdd({ ...currentClass, id: newId } as ClassDefinition);
    }
    setIsEditing(false);
    setCurrentClass({});
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Class Management</h2>
        {isAdmin && <Button onClick={() => setIsEditing(true)}>+ Add New Class</Button>}
      </div>

      {isEditing && isAdmin && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-bold mb-4">Add / Edit Class</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Class Name</label>
              <select 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                value={currentClass.name || ''}
                onChange={e => setCurrentClass({...currentClass, name: e.target.value})}
                required
              >
                <option value="">Select Level</option>
                <option value="JSS 1">JSS 1</option>
                <option value="JSS 2">JSS 2</option>
                <option value="JSS 3">JSS 3</option>
                <option value="SSS 1">SSS 1</option>
                <option value="SSS 2">SSS 2</option>
                <option value="SSS 3">SSS 3</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Arm</label>
              <select 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                value={currentClass.arm || ''}
                onChange={e => setCurrentClass({...currentClass, arm: e.target.value})}
                required
              >
                <option value="">Select Arm</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Form Master</label>
              <select 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                value={currentClass.formMasterId || ''}
                onChange={e => setCurrentClass({...currentClass, formMasterId: e.target.value})}
              >
                <option value="">None Assigned</option>
                {formMasters.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-3 flex justify-end space-x-3 mt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button type="submit">Save Class</Button>
            </div>
          </form>
        </div>
      )}

      {!isAdmin && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded text-sm">
              You have read-only access to class configuration.
          </div>
      )}

      <div className="bg-white shadow overflow-hidden rounded-md">
        <ul className="divide-y divide-gray-200">
          {classes.map(c => {
            const master = users.find(u => u.id === c.formMasterId);
            return (
              <li key={c.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div>
                  <h4 className="text-lg font-bold text-gray-800">{c.name} {c.arm}</h4>
                  <p className="text-sm text-gray-500">
                    Form Master: <span className="font-medium text-green-700">{master ? master.name : 'Not Assigned'}</span>
                  </p>
                </div>
                {isAdmin && (
                  <div className="flex space-x-2">
                     <button onClick={() => { setCurrentClass(c); setIsEditing(true); }} className="text-blue-600 text-sm hover:underline">Edit</button>
                     <button onClick={() => onDelete(c.id)} className="text-red-600 text-sm hover:underline">Delete</button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ClassManager;
