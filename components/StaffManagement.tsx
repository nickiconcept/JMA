
import React, { useState, useRef } from 'react';
import { User, UserRole, ClassDefinition, Subject } from '../types';
import Button from './Button';

interface Props {
  users: User[];
  classes: ClassDefinition[];
  subjects: Subject[];
  onAddUser: (user: User) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (id: string) => void;
}

const StaffManagement: React.FC<Props> = ({ users, classes, subjects, onAddUser, onUpdateUser, onDeleteUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<User>>({ role: UserRole.TEACHER, isActive: true, assignedClassIds: [], assignedSubjectIds: [] });
  const signatureRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser.id) {
      onUpdateUser(currentUser as User);
    } else {
      onAddUser({ ...currentUser, id: `user-${Date.now()}` } as User);
    }
    setIsEditing(false);
    setCurrentUser({ role: UserRole.TEACHER, isActive: true, assignedClassIds: [], assignedSubjectIds: [] });
  };

  const toggleSelection = (id: string, field: 'assignedClassIds' | 'assignedSubjectIds') => {
    const current = currentUser[field] || [];
    if (current.includes(id)) {
      setCurrentUser({ ...currentUser, [field]: current.filter(x => x !== id) });
    } else {
      setCurrentUser({ ...currentUser, [field]: [...current, id] });
    }
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentUser(prev => ({ ...prev, signatureUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Staff & User Management</h2>
        <Button onClick={() => setIsEditing(true)}>+ Add New Staff</Button>
      </div>

      {isEditing && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-bold mb-4">{currentUser.id ? 'Edit User' : 'Create New User'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input 
                  type="text" required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                  value={currentUser.name || ''}
                  onChange={e => setCurrentUser({...currentUser, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input 
                  type="email" required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                  value={currentUser.email || ''}
                  onChange={e => setCurrentUser({...currentUser, email: e.target.value})}
                />
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input 
                  type="text" 
                  placeholder={currentUser.id ? "Leave empty to keep current" : "Create password"}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                  value={currentUser.password || ''}
                  onChange={e => setCurrentUser({...currentUser, password: e.target.value})}
                  required={!currentUser.id} // Required only on creation
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                  value={currentUser.role}
                  onChange={e => setCurrentUser({...currentUser, role: e.target.value as UserRole})}
                >
                  <option value={UserRole.ADMIN}>Admin</option>
                  <option value={UserRole.PRINCIPAL}>Principal</option>
                  <option value={UserRole.TEACHER}>Teacher</option>
                  <option value={UserRole.FORM_MASTER}>Form Master</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Signature</label>
                <input 
                    type="file" accept="image/*" className="hidden" ref={signatureRef}
                    onChange={handleSignatureUpload}
                />
                <div className="flex items-center gap-4 mt-1">
                    <Button type="button" variant="outline" onClick={() => signatureRef.current?.click()} className="text-xs">
                        Upload Image
                    </Button>
                    {currentUser.signatureUrl && <img src={currentUser.signatureUrl} alt="Sig" className="h-8 border border-gray-200" />}
                </div>
              </div>
            </div>

            {(currentUser.role === UserRole.TEACHER || currentUser.role === UserRole.FORM_MASTER) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 p-4 bg-gray-50 rounded">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Assign Classes</label>
                  <div className="max-h-40 overflow-y-auto space-y-2 border p-2 bg-white rounded">
                    {classes.map(c => (
                      <label key={c.id} className="flex items-center space-x-2">
                        <input 
                          type="checkbox"
                          checked={(currentUser.assignedClassIds || []).includes(c.id)}
                          onChange={() => toggleSelection(c.id, 'assignedClassIds')}
                        />
                        <span className="text-sm">{c.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Assign Subjects</label>
                  <div className="max-h-40 overflow-y-auto space-y-2 border p-2 bg-white rounded">
                    {subjects.map(s => (
                      <label key={s.id} className="flex items-center space-x-2">
                        <input 
                          type="checkbox"
                          checked={(currentUser.assignedSubjectIds || []).includes(s.id)}
                          onChange={() => toggleSelection(s.id, 'assignedSubjectIds')}
                        />
                        <span className="text-sm">{s.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button type="submit">Save User</Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden rounded-md">
        <ul className="divide-y divide-gray-200">
          {users.map(u => (
            <li key={u.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
              <div>
                <p className="text-sm font-medium text-gray-900">{u.name}</p>
                <p className="text-xs text-gray-500">{u.email} • <span className="font-bold">{u.role}</span></p>
                {u.role === UserRole.TEACHER && (
                    <p className="text-xs text-gray-400 mt-1">
                        Classes: {u.assignedClassIds?.join(', ')} | Subjects: {u.assignedSubjectIds?.join(', ')}
                    </p>
                )}
              </div>
              <div className="flex space-x-2">
                <button onClick={() => { setCurrentUser(u); setIsEditing(true); }} className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                <button onClick={() => onDeleteUser(u.id)} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StaffManagement;
