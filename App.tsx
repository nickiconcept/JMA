
import React, { useState } from 'react';
import Layout from './components/Layout';
import Button from './components/Button';
import ResultEntry from './components/ResultEntry';
import AuditLogsTable from './components/AuditLogsTable';
import StudentReportCard from './components/StudentReportCard';
import StaffManagement from './components/StaffManagement';
import AttendanceRegister from './components/AttendanceRegister';
import PinManager from './components/PinManager';
import Insights from './components/Insights';
import ClassManager from './components/ClassManager';
import StudentManager from './components/StudentManager';
import SubjectManager from './components/SubjectManager';
import ResultApproval from './components/ResultApproval';
import ResultPrintingManager from './components/ResultPrintingManager';
import PromotionManager from './components/PromotionManager';

import { User, UserRole, Result, Student, AuditLog, ClassDefinition, Subject, Attendance, Pin } from './types';
import { mockUsers, mockStudents, mockResults, mockPins, mockClasses, mockSubjects, mockAttendance } from './services/mockData';
import { MOCK_LOGS_INITIAL } from './constants';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

const App: React.FC = () => {
  // --- Global State ---
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState('dashboard');
  
  // --- Data State ---
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [results, setResults] = useState<Result[]>(mockResults);
  const [logs, setLogs] = useState<AuditLog[]>(MOCK_LOGS_INITIAL as any);
  const [classes, setClasses] = useState<ClassDefinition[]>(mockClasses);
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
  const [attendance, setAttendance] = useState<Attendance[]>(mockAttendance);
  const [pins, setPins] = useState<Pin[]>(mockPins);

  // --- Temporary State for Selection Flows ---
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  
  // --- Feature Logic State ---
  const [formMasterViewCount, setFormMasterViewCount] = useState<number>(0);

  // --- Actions ---
  const handleLogin = (role: UserRole) => {
    let foundUser = mockUsers.find(u => u.role === role);
    if (role === UserRole.STUDENT) {
        foundUser = { 
            id: 'JMA/24/001', name: 'Ibrahim Musa', email: 'student@school.com', role: UserRole.STUDENT, isActive: true,
            assignedClassIds: [], assignedSubjectIds: []
        };
    }
    if (foundUser) {
      setUser(foundUser);
      setView('dashboard');
      addLog(foundUser.id, foundUser.role, 'LOGIN', 'Login successful');
      setFormMasterViewCount(0); // Reset view count on login
    }
  };

  const handleLogout = () => {
     if(user) addLog(user.id, user.role, 'LOGOUT', 'User logged out');
     setUser(null);
     setView('login');
     setSelectedClassId(null);
     setSelectedSubjectId(null);
  };

  const addLog = (userId: string, role: UserRole, action: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      userId, userRole: role, action, details,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1'
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const handleSaveResult = (newResult: Result) => {
    setResults(prev => {
        const idx = prev.findIndex(r => r.id === newResult.id);
        if (idx >= 0) {
            const updated = [...prev];
            updated[idx] = newResult;
            return updated;
        }
        return [...prev, newResult];
    });
    addLog(user?.id || 'sys', user?.role || UserRole.TEACHER, 'UPDATE_RESULT', `Updated result for ${newResult.studentId}`);
  };

  const handleSaveAttendance = (newRecords: Attendance[]) => {
      // Remove existing records for same date/class to avoid duplicates (naive approach)
      const filtered = attendance.filter(a => !(a.classId === newRecords[0].classId && a.date === newRecords[0].date));
      setAttendance([...filtered, ...newRecords]);
      addLog(user?.id || 'sys', user?.role || UserRole.FORM_MASTER, 'MARK_ATTENDANCE', `Marked attendance for ${newRecords.length} students`);
      alert("Attendance Saved!");
  };

  const handleFormMasterViewAccess = () => {
     if (user?.role === UserRole.FORM_MASTER) {
         if (formMasterViewCount >= 2) {
             alert("Access Denied: You have exceeded the limit (2) for viewing the Broadsheet/Result Printing.");
             return false;
         }
         setFormMasterViewCount(prev => prev + 1);
         // Alert to inform user of remaining usage
         alert(`Access Granted. You have used ${formMasterViewCount + 1}/2 accesses for this session.`);
     }
     return true;
  };

  const handleViewChange = (newView: string) => {
      // Check limits if accessing Printing or Approvals/Broadsheet
      if ((newView === 'approvals' || newView === 'print_results') && user?.role === UserRole.FORM_MASTER) {
          if(!handleFormMasterViewAccess()) return;
      }
      setView(newView);
  };

  const generatePinCode = () => {
      // Generate ####-####-####
      const p = () => Math.floor(1000 + Math.random() * 9000);
      return `${p()}-${p()}-${p()}`;
  };

  // --- Views ---

  const LoginView = () => (
    <div className="min-h-screen bg-green-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-green-900 font-serif">Jere Model Academy</h1>
            <p className="text-gray-500 mt-2">Secure Result Portal</p>
        </div>
        <div className="space-y-4">
            <p className="text-center text-sm font-medium text-gray-700">Select Role:</p>
            <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" onClick={() => handleLogin(UserRole.ADMIN)}>Admin</Button>
                <Button variant="outline" onClick={() => handleLogin(UserRole.PRINCIPAL)}>Principal</Button>
                <Button variant="primary" onClick={() => handleLogin(UserRole.TEACHER)}>Teacher</Button>
                <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => handleLogin(UserRole.FORM_MASTER)}>Form Master</Button>
            </div>
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
                <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Student Access</span></div>
            </div>
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
                <div className="flex space-x-2">
                    <input type="text" placeholder="Enter PIN" className="flex-1 rounded border-gray-300 text-sm p-2 border" />
                    <Button onClick={() => handleLogin(UserRole.STUDENT)} className="bg-yellow-500 text-black">Check</Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );

  const DashboardView = () => (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                <div className="text-gray-500 text-sm uppercase">Students</div>
                <div className="text-3xl font-bold text-gray-800">{students.length}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                <div className="text-gray-500 text-sm uppercase">Results</div>
                <div className="text-3xl font-bold text-gray-800">{results.length}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
                <div className="text-gray-500 text-sm uppercase">Staff</div>
                <div className="text-3xl font-bold text-gray-800">{users.filter(u => u.role !== UserRole.STUDENT).length}</div>
            </div>
             <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
                <div className="text-gray-500 text-sm uppercase">Classes</div>
                <div className="text-3xl font-bold text-gray-800">{classes.length}</div>
            </div>
        </div>
        {user?.role === UserRole.ADMIN && <AuditLogsTable logs={logs.slice(0, 5)} />}
    </div>
  );

  const ResultEntryFlow = () => {
    // Phase 1: Selection
    if (!selectedClassId || !selectedSubjectId) {
        // Filter classes based on role
        const visibleClasses = user?.role === UserRole.ADMIN || user?.role === UserRole.PRINCIPAL
            ? classes 
            : classes.filter(c => user?.assignedClassIds?.includes(c.id));
        
        // Filter subjects based on role
        let visibleSubjects = user?.role === UserRole.ADMIN || user?.role === UserRole.PRINCIPAL
            ? subjects
            : subjects.filter(s => user?.assignedSubjectIds?.includes(s.id));
        
        // Additional Filter: Map subjects to classes option (If class is selected, filter subjects compatible with that class)
        if (selectedClassId) {
            const selectedClass = classes.find(c => c.id === selectedClassId);
            if (selectedClass) {
                // Heuristic: Check if subject has compatible levels. 
                // Matches "JSS 1" from "JSS 1" in "JSS 1 A"
                const classLevel = selectedClass.name; 
                visibleSubjects = visibleSubjects.filter(s => 
                    !s.compatibleLevels || s.compatibleLevels.length === 0 || s.compatibleLevels.includes(classLevel)
                );
            }
        }

        return (
            <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
                <h3 className="text-xl font-bold mb-6">Select Class & Subject to Enter Results</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                        <select 
                            className="w-full border p-2 rounded" 
                            onChange={(e) => { setSelectedClassId(e.target.value); setSelectedSubjectId(null); }}
                            value={selectedClassId || ''}
                        >
                            <option value="">-- Select Class --</option>
                            {visibleClasses.map(c => <option key={c.id} value={c.id}>{c.name} {c.arm}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                        <select 
                             className="w-full border p-2 rounded disabled:bg-gray-100"
                             onChange={(e) => setSelectedSubjectId(e.target.value)}
                             value={selectedSubjectId || ''}
                             disabled={!selectedClassId}
                        >
                            <option value="">-- Select Subject --</option>
                            {visibleSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <Button 
                        disabled={!selectedClassId || !selectedSubjectId}
                        onClick={() => {}} // State updates automatically re-render, logic handles next phase
                        className="w-full"
                    >
                        Proceed to Entry
                    </Button>
                </div>
            </div>
        );
    }

    // Phase 2: Entry List
    const classStudents = students.filter(s => s.classId === selectedClassId);
    const subjectName = subjects.find(s => s.id === selectedSubjectId)?.name;
    
    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <button onClick={() => { setSelectedClassId(null); setSelectedSubjectId(null); }} className="text-gray-600 hover:text-black">
                    <ArrowLeftIcon className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-bold">Result Entry: {subjectName}</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
                {classStudents.map(student => {
                    const existing = results.find(r => r.studentId === student.id && r.subjectId === selectedSubjectId);
                    
                    // Single Submission Logic: If user is teacher and result exists, it's read-only
                    const isReadOnly = user?.role === UserRole.TEACHER && !!existing;

                    return (
                        <div key={student.id} className="border-b pb-4">
                            <ResultEntry 
                                student={student} 
                                subject={subjectName || ''}
                                subjectId={selectedSubjectId!}
                                existingResult={existing}
                                isReadOnly={isReadOnly}
                                onSave={(r) => {
                                    handleSaveResult(r);
                                    alert('Saved');
                                }}
                            />
                        </div>
                    );
                })}
                {classStudents.length === 0 && <p className="text-gray-500">No students found in this class.</p>}
            </div>
        </div>
    );
  };

  const AttendanceView = () => {
     // Form Master View for their class
     const myClassId = user?.assignedClassIds?.[0]; // Assuming 1 class for simplicity
     const myClass = classes.find(c => c.id === myClassId);
     
     if (!myClass && user?.role !== UserRole.ADMIN) return <div>You are not assigned to a class as Form Master.</div>;
     
     // If admin, select class first
     const targetClass = user?.role === UserRole.ADMIN ? classes[0] : myClass; 
     if (!targetClass) return <div>No classes available.</div>;

     const classStudents = students.filter(s => s.classId === targetClass.id);

     return (
         <AttendanceRegister 
            currentClass={targetClass}
            students={classStudents}
            attendanceRecords={attendance}
            onSaveAttendance={handleSaveAttendance}
            currentUserRole={user?.role}
         />
     );
  };

  // --- Render Switch ---

  if (!user) return <LoginView />;

  return (
    <Layout user={user} onLogout={handleLogout} currentView={view} onChangeView={handleViewChange}>
      {view === 'dashboard' && <DashboardView />}
      {view === 'results' && <ResultEntryFlow />}
      
      {view === 'attendance' && <AttendanceView />}
      
      {view === 'staff_manager' && (
          <StaffManagement 
            users={users} classes={classes} subjects={subjects}
            onAddUser={(u) => { setUsers(prev => [...prev, u]); addLog(user.id, user.role, 'ADD_USER', `Added user ${u.name}`); }}
            onUpdateUser={(u) => { setUsers(prev => prev.map(x => x.id === u.id ? u : x)); addLog(user.id, user.role, 'UPDATE_USER', `Updated user ${u.name}`); }}
            onDeleteUser={(id) => { setUsers(prev => prev.filter(x => x.id !== id)); addLog(user.id, user.role, 'DELETE_USER', `Deleted user ${id}`); }}
          />
      )}

      {view === 'pins' && (
          <PinManager 
            pins={pins}
            classes={classes}
            students={students}
            onGenerateForClass={(classId, amountPerStudent) => {
                const classStudents = students.filter(s => s.classId === classId);
                if (classStudents.length === 0) return;

                const newPins: Pin[] = classStudents.map(student => ({
                    code: generatePinCode(),
                    usageCount: 0,
                    maxUsage: 5,
                    generatedBy: user.id,
                    expiryDate: '2025-12-31',
                    isUsed: false,
                    assignedStudentId: student.id
                }));
                
                setPins(prev => [...newPins, ...prev]);
                addLog(user.id, user.role, 'GENERATE_PINS', `Generated ${newPins.length} pins for class ${classId}`);
                alert(`Successfully generated ${newPins.length} pins for ${classStudents.length} students.`);
            }}
            onAssignStudent={(code, studentId) => {
                setPins(prev => prev.map(p => p.code === code ? { ...p, assignedStudentId: studentId } : p));
                addLog(user.id, user.role, 'ASSIGN_PIN', `Assigned PIN ${code} to student ${studentId}`);
            }}
          />
      )}

      {view === 'insights' && <Insights results={results} students={students} classes={classes} />}
      
      {view === 'audit' && <AuditLogsTable logs={logs} />}

      {view === 'approvals' && (
           <ResultApproval 
                user={user}
                results={results}
                students={students}
                classes={classes}
                subjects={subjects}
                onUpdateResult={handleSaveResult}
           />
      )}

      {view === 'print_results' && (
          <ResultPrintingManager 
              user={user}
              classes={classes}
              students={students}
              results={results}
              subjects={subjects}
          />
      )}
      
      {view === 'promotions' && (
          <PromotionManager
              students={students}
              classes={classes}
              results={results}
              onPromoteStudents={(updates) => {
                  setStudents(prev => {
                      const updatedStudents = [...prev];
                      updates.forEach(u => {
                          const idx = updatedStudents.findIndex(s => s.id === u.studentId);
                          if(idx !== -1) {
                              updatedStudents[idx] = { ...updatedStudents[idx], classId: u.newClassId, promotionStatus: u.status };
                          }
                      });
                      return updatedStudents;
                  });
                  addLog(user.id, user.role, 'BULK_PROMOTION', `Promoted ${updates.length} students`);
              }}
          />
      )}

      {view === 'class_manager' && (
           <ClassManager 
                classes={classes}
                users={users}
                onAdd={(c) => { setClasses(prev => [...prev, c]); addLog(user.id, user.role, 'ADD_CLASS', `Added class ${c.name}`); }}
                onUpdate={(c) => { setClasses(prev => prev.map(x => x.id === c.id ? c : x)); addLog(user.id, user.role, 'UPDATE_CLASS', `Updated class ${c.name}`); }}
                onDelete={(id) => { setClasses(prev => prev.filter(x => x.id !== id)); addLog(user.id, user.role, 'DELETE_CLASS', `Deleted class ${id}`); }}
                currentUserRole={user.role}
           />
      )}

      {view === 'students_manager' && (
           <StudentManager
                students={students}
                classes={classes}
                onAdd={(s) => { setStudents(prev => [...prev, s]); addLog(user.id, user.role, 'ADD_STUDENT', `Added student ${s.name}`); }}
                onUpdate={(s) => { setStudents(prev => prev.map(x => x.id === s.id ? s : x)); addLog(user.id, user.role, 'UPDATE_STUDENT', `Updated student ${s.name}`); }}
                onDelete={(id) => { setStudents(prev => prev.filter(x => x.id !== id)); addLog(user.id, user.role, 'DELETE_STUDENT', `Deleted student ${id}`); }}
           />
      )}

      {view === 'subjects' && (
           <SubjectManager
                subjects={subjects}
                onAdd={(s) => { setSubjects(prev => [...prev, s]); addLog(user.id, user.role, 'ADD_SUBJECT', `Added subject ${s.name}`); }}
                onUpdate={(s) => { setSubjects(prev => prev.map(x => x.id === s.id ? s : x)); addLog(user.id, user.role, 'UPDATE_SUBJECT', `Updated subject ${s.name}`); }}
                onDelete={(id) => { setSubjects(prev => prev.filter(x => x.id !== id)); addLog(user.id, user.role, 'DELETE_SUBJECT', `Deleted subject ${id}`); }}
           />
      )}
      
      {view === 'my_result' && (
        <StudentReportCard 
            student={students.find(s => s.id === user.id)!} 
            results={results.filter(r => r.studentId === user.id)} 
            subjects={subjects}
            classes={classes}
        />
      )}
    </Layout>
  );
};

export default App;
