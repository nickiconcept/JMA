
import React, { useState, useEffect } from 'react';
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
import { ArrowLeftIcon, UserCircleIcon, AcademicCapIcon, EyeIcon, EyeSlashIcon, InformationCircleIcon } from '@heroicons/react/24/solid';

// --- Login Component Extracted to fix Focus Issues ---
interface LoginScreenProps {
  loginTab: 'RESULT' | 'STAFF';
  setLoginTab: (t: 'RESULT' | 'STAFF') => void;
  loginCreds: any;
  setLoginCreds: React.Dispatch<React.SetStateAction<any>>;
  performStudentCheck: (e: React.FormEvent) => void;
  performStaffLogin: (e: React.FormEvent) => void;
  showPassword: boolean;
  setShowPassword: (b: boolean) => void;
  isAuthenticating: boolean;
}

const LoginScreen: React.FC<LoginScreenProps> = ({
  loginTab, setLoginTab, loginCreds, setLoginCreds, 
  performStudentCheck, performStaffLogin, showPassword, setShowPassword, isAuthenticating
}) => {
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
            <h1 className="text-4xl font-extrabold font-display text-blue-900 tracking-tight">Jere Model Academy</h1>
            <p className="mt-2 text-lg text-blue-600">E-Result & School Management Portal</p>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow-xl shadow-blue-900/10 sm:rounded-2xl sm:px-10 border border-white">
                
                {/* Tabs */}
                <div className="flex space-x-2 p-1 bg-blue-50 rounded-xl mb-8">
                    <button
                        onClick={() => setLoginTab('RESULT')}
                        className={`flex-1 flex items-center justify-center py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                            loginTab === 'RESULT' 
                            ? 'bg-white text-blue-700 shadow-sm' 
                            : 'text-blue-400 hover:text-blue-600'
                        }`}
                    >
                        <AcademicCapIcon className="h-5 w-5 mr-2" />
                        Check Result
                    </button>
                    <button
                        onClick={() => setLoginTab('STAFF')}
                        className={`flex-1 flex items-center justify-center py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                            loginTab === 'STAFF' 
                            ? 'bg-white text-blue-700 shadow-sm' 
                            : 'text-blue-400 hover:text-blue-600'
                        }`}
                    >
                        <UserCircleIcon className="h-5 w-5 mr-2" />
                        Staff Login
                    </button>
                </div>

                {/* Forms */}
                {loginTab === 'RESULT' ? (
                    <form onSubmit={performStudentCheck} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Admission Number</label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. JMA/24/001"
                                    value={loginCreds.admissionNo}
                                    onChange={e => setLoginCreds({...loginCreds, admissionNo: e.target.value})}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Result Checker PIN</label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. 1234-5678-9012"
                                    value={loginCreds.pin}
                                    onChange={e => setLoginCreds({...loginCreds, pin: e.target.value})}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors font-mono tracking-wider"
                                />
                            </div>
                            <p className="mt-2 text-xs text-gray-500 text-right">Max 5 uses per PIN</p>
                        </div>
                        <div>
                            <Button 
                                type="submit" 
                                className="w-full justify-center py-3 text-base shadow-lg shadow-blue-500/20"
                                isLoading={isAuthenticating}
                            >
                                Check Result
                            </Button>
                        </div>
                        
                        {/* Demo Data for Result */}
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100 text-xs text-blue-800">
                             <div className="font-bold flex items-center mb-1">
                                <InformationCircleIcon className="h-4 w-4 mr-1"/> Demo Credentials:
                             </div>
                             <p>Admission No: <span className="font-mono font-bold">JMA/24/001</span></p>
                             <p>PIN: <span className="font-mono font-bold">1234-5678-9012</span></p>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={performStaffLogin} className="space-y-6">
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Email Address</label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    required
                                    placeholder="admin@jere.edu.ng"
                                    value={loginCreds.email}
                                    onChange={e => setLoginCreds({...loginCreds, email: e.target.value})}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="mt-1 relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="••••••••"
                                    value={loginCreds.password}
                                    onChange={e => setLoginCreds({...loginCreds, password: e.target.value})}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>
                         <div>
                            <Button 
                                type="submit" 
                                className="w-full justify-center py-3 text-base shadow-lg shadow-blue-500/20"
                                isLoading={isAuthenticating}
                            >
                                Login to Dashboard
                            </Button>
                        </div>
                        
                        {/* Demo Data for Staff */}
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100 text-xs text-blue-800">
                             <div className="font-bold flex items-center mb-1">
                                <InformationCircleIcon className="h-4 w-4 mr-1"/> Demo Credentials:
                             </div>
                             <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <span className="font-semibold block text-blue-600">Admin</span>
                                    admin@jere.edu.ng
                                </div>
                                <div>
                                    <span className="font-semibold block text-blue-600">Teacher</span>
                                    adewale@jere.edu.ng
                                </div>
                             </div>
                             <p className="mt-2 border-t border-blue-200 pt-1">Password for all: <span className="font-mono font-bold">password</span></p>
                        </div>
                    </form>
                )}

            </div>
            <p className="text-center text-xs text-blue-400 mt-8">
                &copy; {new Date().getFullYear()} Jere Model Academy. All rights reserved.
            </p>
        </div>
    </div>
  );
};


const App: React.FC = () => {
  // --- LocalStorage Helper ---
  const loadFromStorage = <T,>(key: string, fallback: T): T => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallback;
    } catch (e) {
      console.error(`Error loading ${key} from localStorage`, e);
      return fallback;
    }
  };

  // --- Global State ---
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState('dashboard');
  
  // --- Data State (Persisted) ---
  const [users, setUsers] = useState<User[]>(() => loadFromStorage('jma_users', mockUsers));
  const [students, setStudents] = useState<Student[]>(() => loadFromStorage('jma_students', mockStudents));
  const [results, setResults] = useState<Result[]>(() => loadFromStorage('jma_results', mockResults));
  const [logs, setLogs] = useState<AuditLog[]>(() => loadFromStorage('jma_logs', MOCK_LOGS_INITIAL as any));
  const [classes, setClasses] = useState<ClassDefinition[]>(() => loadFromStorage('jma_classes', mockClasses));
  const [subjects, setSubjects] = useState<Subject[]>(() => loadFromStorage('jma_subjects', mockSubjects));
  const [attendance, setAttendance] = useState<Attendance[]>(() => loadFromStorage('jma_attendance', mockAttendance));
  const [pins, setPins] = useState<Pin[]>(() => loadFromStorage('jma_pins', mockPins));

  // --- Persistence Effects ---
  useEffect(() => localStorage.setItem('jma_users', JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem('jma_students', JSON.stringify(students)), [students]);
  useEffect(() => localStorage.setItem('jma_results', JSON.stringify(results)), [results]);
  useEffect(() => localStorage.setItem('jma_logs', JSON.stringify(logs)), [logs]);
  useEffect(() => localStorage.setItem('jma_classes', JSON.stringify(classes)), [classes]);
  useEffect(() => localStorage.setItem('jma_subjects', JSON.stringify(subjects)), [subjects]);
  useEffect(() => localStorage.setItem('jma_attendance', JSON.stringify(attendance)), [attendance]);
  useEffect(() => localStorage.setItem('jma_pins', JSON.stringify(pins)), [pins]);

  // --- Login State ---
  const [loginTab, setLoginTab] = useState<'RESULT' | 'STAFF'>('RESULT');
  const [loginCreds, setLoginCreds] = useState({ 
    email: '', 
    password: '', 
    admissionNo: '', 
    pin: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // --- Temporary State for Selection Flows ---
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  
  // --- Feature Logic State ---
  const [formMasterViewCount, setFormMasterViewCount] = useState<number>(0);

  // --- Actions ---

  const addLog = (userId: string, role: string, action: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      userId, 
      userRole: role as UserRole, // Casting string to enum for flexibility in system logs
      action, 
      details,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1' // In a real app, this comes from the server
    };
    setLogs(prev => [newLog, ...prev]);
  };
  
  const handleAuthSuccess = (authenticatedUser: User) => {
      setUser(authenticatedUser);
      setView('dashboard');
      addLog(authenticatedUser.id, authenticatedUser.role, 'LOGIN_SUCCESS', 'User login successful');
      setFormMasterViewCount(0);
      setLoginCreds({ email: '', password: '', admissionNo: '', pin: '' }); // Clear creds
  };

  const performStaffLogin = (e: React.FormEvent) => {
      e.preventDefault();
      setIsAuthenticating(true);
      
      const emailInput = loginCreds.email.trim();
      
      // Simulate network delay
      setTimeout(() => {
          const foundUser = users.find(u => u.email.toLowerCase() === emailInput.toLowerCase());
          
          if (foundUser) {
              if (loginCreds.password === 'password') { // Mock password check
                  handleAuthSuccess(foundUser);
              } else {
                  addLog('system', 'ANONYMOUS', 'LOGIN_FAILED', `Failed login: Invalid password for ${emailInput}`);
                  alert("Invalid Password. (Hint: Use 'password')");
              }
          } else {
              addLog('system', 'ANONYMOUS', 'LOGIN_FAILED', `Failed login: User not found ${emailInput}`);
              alert("User not found. Please check your email.");
          }
          setIsAuthenticating(false);
      }, 800);
  };

  const performStudentCheck = (e: React.FormEvent) => {
      e.preventDefault();
      setIsAuthenticating(true);

      const admissionInput = loginCreds.admissionNo.trim();

      setTimeout(() => {
          const student = students.find(s => s.id === admissionInput);
          const pin = pins.find(p => p.code === loginCreds.pin.trim());

          if (!student) {
              addLog('system', 'ANONYMOUS', 'RESULT_CHECK_FAILED', `Invalid Admission No: ${admissionInput}`);
              alert("Invalid Admission Number.");
              setIsAuthenticating(false);
              return;
          }

          if (!pin) {
              addLog('system', 'ANONYMOUS', 'RESULT_CHECK_FAILED', `Invalid PIN attempt for ${admissionInput}`);
              alert("Invalid Result Checking PIN.");
              setIsAuthenticating(false);
              return;
          }

          if (pin.assignedStudentId && pin.assignedStudentId !== student.id) {
              addLog('system', 'ANONYMOUS', 'RESULT_CHECK_FAILED', `PIN mismatch for ${admissionInput}`);
              alert("This PIN has been assigned to another student.");
              setIsAuthenticating(false);
              return;
          }

          if (pin.usageCount >= pin.maxUsage) {
              addLog('system', 'ANONYMOUS', 'RESULT_CHECK_FAILED', `Expired PIN used for ${admissionInput}`);
              alert("This PIN has reached its maximum usage limit (5 times). Please obtain a new PIN.");
              setIsAuthenticating(false);
              return;
          }

          // Validation Passed
          // Update PIN usage
          const updatedPins = pins.map(p => p.code === pin.code ? { ...p, usageCount: p.usageCount + 1, isUsed: true, assignedStudentId: student.id } : p);
          setPins(updatedPins);
          
          // Create a session user for the student
          const studentUser: User = {
              id: student.id,
              name: student.name,
              email: `${student.id}@student.school`, // Dummy email
              role: UserRole.STUDENT,
              isActive: true,
              assignedClassIds: [],
              assignedSubjectIds: []
          };
          
          handleAuthSuccess(studentUser);
          setIsAuthenticating(false);
      }, 1000);
  };

  const handleLogout = () => {
     if(user) addLog(user.id, user.role, 'LOGOUT', 'User logged out');
     setUser(null);
     setView('login');
     setSelectedClassId(null);
     setSelectedSubjectId(null);
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
  
  const DashboardView = () => (
    <div className="space-y-8">
        <div>
            <h2 className="text-3xl font-bold font-display text-slate-800">Welcome, {user?.name.split(' ')[0]}</h2>
            <p className="text-slate-500 mt-1">
                {user?.role === UserRole.STUDENT 
                ? 'View your academic performance below.' 
                : 'Manage school operations and student results.'}
            </p>
        </div>
        
        {user?.role !== UserRole.STUDENT && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Students', count: students.length, color: 'blue' },
                    { label: 'Results', count: results.length, color: 'emerald' },
                    { label: 'Staff', count: users.filter(u => u.role !== UserRole.STUDENT).length, color: 'purple' },
                    { label: 'Classes', count: classes.length, color: 'amber' },
                ].map((item, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-soft border border-slate-100 hover:shadow-lg transition-shadow duration-300">
                        <div className={`text-${item.color}-600 text-xs font-bold uppercase tracking-wider mb-2`}>{item.label}</div>
                        <div className="text-4xl font-bold text-slate-800 font-display">{item.count}</div>
                        <div className="h-1 w-full bg-slate-100 rounded-full mt-4 overflow-hidden">
                            <div className={`h-full bg-${item.color}-500 w-2/3 rounded-full`}></div>
                        </div>
                    </div>
                ))}
            </div>
        )}
        
        {user?.role === UserRole.ADMIN && (
            <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 font-display">Recent System Activities</h3>
                <AuditLogsTable logs={logs.slice(0, 5)} />
            </div>
        )}

        {user?.role === UserRole.STUDENT && (
             <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
                 <h3 className="text-xl font-bold text-blue-900 mb-2">Student Dashboard</h3>
                 <p className="text-blue-700 mb-4">Click "My Report Card" in the menu to view your full result details.</p>
                 <Button onClick={() => setView('my_result')}>View My Result</Button>
             </div>
        )}
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
                const classLevel = selectedClass.name; 
                visibleSubjects = visibleSubjects.filter(s => 
                    !s.compatibleLevels || s.compatibleLevels.length === 0 || s.compatibleLevels.includes(classLevel)
                );
            }
        }

        return (
            <div className="bg-white p-10 rounded-2xl shadow-soft border border-slate-100 max-w-2xl mx-auto mt-10">
                <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold font-display text-slate-800">Result Entry</h3>
                    <p className="text-slate-500">Select a class and subject to begin grading.</p>
                </div>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Class</label>
                        <select 
                            className="w-full border-slate-200 p-3 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-colors"
                            onChange={(e) => { setSelectedClassId(e.target.value); setSelectedSubjectId(null); }}
                            value={selectedClassId || ''}
                        >
                            <option value="">-- Select Class --</option>
                            {visibleClasses.map(c => <option key={c.id} value={c.id}>{c.name} {c.arm}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                        <select 
                             className="w-full border-slate-200 p-3 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-colors disabled:bg-slate-50 disabled:text-slate-400"
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
                        className="w-full py-3 text-lg"
                    >
                        Start Grading
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
            <div className="flex items-center space-x-4 mb-6">
                <button onClick={() => { setSelectedClassId(null); setSelectedSubjectId(null); }} className="text-slate-400 hover:text-primary-600 transition-colors">
                    <ArrowLeftIcon className="h-6 w-6" />
                </button>
                <div>
                    <h2 className="text-2xl font-bold font-display text-slate-800">Result Entry</h2>
                    <p className="text-primary-600 font-medium">{subjectName} <span className="text-slate-400">|</span> {classStudents.length} Students</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
                {classStudents.map(student => {
                    const existing = results.find(r => r.studentId === student.id && r.subjectId === selectedSubjectId);
                    const isReadOnly = user?.role === UserRole.TEACHER && !!existing;

                    return (
                        <div key={student.id}>
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
                {classStudents.length === 0 && <p className="text-slate-500 text-center py-10 bg-white rounded-xl">No students found in this class.</p>}
            </div>
        </div>
    );
  };

  const AttendanceView = () => {
     // Form Master View for their class
     const myClassId = user?.assignedClassIds?.[0]; 
     const myClass = classes.find(c => c.id === myClassId);
     
     if (!myClass && user?.role !== UserRole.ADMIN) return <div>You are not assigned to a class as Form Master.</div>;
     
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

  if (!user) {
    return <LoginScreen 
        loginTab={loginTab}
        setLoginTab={setLoginTab}
        loginCreds={loginCreds}
        setLoginCreds={setLoginCreds}
        performStudentCheck={performStudentCheck}
        performStaffLogin={performStaffLogin}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        isAuthenticating={isAuthenticating}
    />;
  }

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
