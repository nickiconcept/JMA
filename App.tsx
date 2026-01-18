
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
import PsychomotorManager from './components/PsychomotorManager';
import SchoolConfigManager from './components/SchoolConfigManager';
import StudentResultReview from './components/StudentResultReview';
import LandingPage from './components/LandingPage';
import StaffAttendancePanel from './components/StaffAttendancePanel';
import AdminStaffAttendance from './components/AdminStaffAttendance';

import { User, UserRole, Result, Student, AuditLog, ClassDefinition, Subject, Attendance, Pin, SchoolConfig, PsychomotorRecord, Term, AccessRequest, RequestStatus, RequestType, StaffAttendance } from './types';
import { mockUsers, mockStudents, mockResults, mockPins, mockClasses, mockSubjects, mockAttendance, mockSchoolConfig, mockPsychomotor } from './services/mockData';
import { MOCK_LOGS_INITIAL } from './constants';
import { UserCircleIcon, AcademicCapIcon, EyeIcon, EyeSlashIcon, InformationCircleIcon, ArrowLeftIcon, KeyIcon, BellIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

// --- Login Component ---
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
  onBack: () => void; // Added onBack prop
}

const LoginScreen: React.FC<LoginScreenProps> = ({
  loginTab, setLoginTab, loginCreds, setLoginCreds, 
  performStudentCheck, performStaffLogin, showPassword, setShowPassword, isAuthenticating, onBack
}) => {
  // text-base on mobile prevents iOS zoom, sm:text-sm on desktop
  const inputClass = "appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-base sm:text-sm transition-all";
  
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-6 sm:px-6 lg:px-8 font-sans">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6 md:mb-8 relative">
            <button 
                onClick={onBack}
                className="absolute left-4 top-0 text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1 text-sm font-medium"
            >
                <ArrowLeftIcon className="h-4 w-4" /> Home
            </button>
            <div className="h-16 w-16 bg-blue-600 text-white flex items-center justify-center rounded-2xl font-black text-2xl font-display mx-auto mb-4 shadow-xl shadow-blue-500/30">JM</div>
            <h1 className="text-2xl md:text-3xl font-black font-display text-slate-900 tracking-tight uppercase px-4">Jere Model Academy</h1>
            <p className="mt-2 text-slate-500 font-medium text-sm md:text-base">E-Result & School Management Portal</p>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md w-full px-4">
            <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/60 rounded-3xl sm:px-10 border border-slate-100">
                
                {/* Tabs */}
                <div className="flex p-1 bg-slate-100 rounded-xl mb-6 md:mb-8">
                    <button
                        onClick={() => setLoginTab('RESULT')}
                        className={`flex-1 flex items-center justify-center py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${
                            loginTab === 'RESULT' 
                            ? 'bg-white text-blue-700 shadow-sm' 
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        <AcademicCapIcon className="h-5 w-5 mr-2" />
                        Check Result
                    </button>
                    <button
                        onClick={() => setLoginTab('STAFF')}
                        className={`flex-1 flex items-center justify-center py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${
                            loginTab === 'STAFF' 
                            ? 'bg-white text-blue-700 shadow-sm' 
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        <UserCircleIcon className="h-5 w-5 mr-2" />
                        Staff Login
                    </button>
                </div>

                {/* Forms */}
                {loginTab === 'RESULT' ? (
                    <form onSubmit={performStudentCheck} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Admission Number</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. JMA/24/001"
                                value={loginCreds.admissionNo}
                                onChange={e => setLoginCreds({...loginCreds, admissionNo: e.target.value})}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Result Checker PIN</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. 1234-5678-9012"
                                value={loginCreds.pin}
                                onChange={e => setLoginCreds({...loginCreds, pin: e.target.value})}
                                className={`${inputClass} font-mono tracking-wider`}
                            />
                            <p className="mt-2 text-[10px] text-slate-400 text-right font-medium">Max 5 uses per PIN</p>
                        </div>
                        <div className="pt-2">
                            <Button type="submit" className="w-full justify-center py-3.5 text-base shadow-lg shadow-blue-500/20" isLoading={isAuthenticating}>
                                View Report Card
                            </Button>
                        </div>
                        
                        <div className="mt-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-xs text-blue-800">
                             <div className="font-bold flex items-center mb-2 text-blue-900">
                                <InformationCircleIcon className="h-4 w-4 mr-1.5"/> Demo Credentials
                             </div>
                             <div className="space-y-1 font-mono text-blue-700">
                                <p>ID: <b>JMA/24/001</b></p>
                                <p>PIN: <b>1234-5678-9012</b></p>
                             </div>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={performStaffLogin} className="space-y-5">
                         <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
                            <input
                                type="email"
                                required
                                placeholder="staff@jere.edu.ng"
                                value={loginCreds.email}
                                onChange={e => setLoginCreds({...loginCreds, email: e.target.value})}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="••••••••"
                                    value={loginCreds.password}
                                    onChange={e => setLoginCreds({...loginCreds, password: e.target.value})}
                                    className={inputClass}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>
                         <div className="pt-2">
                            <Button type="submit" className="w-full justify-center py-3.5 text-base shadow-lg shadow-blue-500/20" isLoading={isAuthenticating}>
                                Login to Dashboard
                            </Button>
                        </div>
                        
                        <div className="mt-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-xs text-blue-800">
                             <div className="font-bold flex items-center mb-2 text-blue-900">
                                <InformationCircleIcon className="h-4 w-4 mr-1.5"/> Demo Accounts
                             </div>
                             <div className="grid grid-cols-2 gap-2 text-[11px]">
                                <div><span className="font-bold block">Admin</span>admin@jere.edu.ng</div>
                                <div><span className="font-bold block">Teacher</span>adewale@jere.edu.ng</div>
                             </div>
                             <p className="mt-2 pt-2 border-t border-blue-200/50 font-mono">Default Pass: <b>password</b></p>
                        </div>
                    </form>
                )}
            </div>
            <p className="text-center text-xs font-medium text-slate-400 mt-8 mb-4">
                &copy; {new Date().getFullYear()} Jere Model Academy
            </p>
        </div>
    </div>
  );
};

// --- Change Password Component ---
const ChangePasswordView: React.FC<{ 
    user: User, 
    onCancel: () => void, 
    onChangePassword: (newPass: string) => void 
}> = ({ user, onCancel, onChangePassword }) => {
    const [currentPass, setCurrentPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const actualCurrent = user.password || 'password';
        if (currentPass !== actualCurrent) {
            alert("Current password incorrect.");
            return;
        }
        if (newPass.length < 6) {
            alert("New password must be at least 6 characters.");
            return;
        }
        if (newPass !== confirmPass) {
            alert("New passwords do not match.");
            return;
        }
        onChangePassword(newPass);
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md border border-slate-200 mt-10">
            <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
                <KeyIcon className="h-6 w-6 text-blue-600"/> Change Password
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700">Current Password</label>
                    <input type="password" required value={currentPass} onChange={e => setCurrentPass(e.target.value)} className="w-full border p-2 rounded mt-1"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">New Password</label>
                    <input type="password" required value={newPass} onChange={e => setNewPass(e.target.value)} className="w-full border p-2 rounded mt-1"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Confirm New Password</label>
                    <input type="password" required value={confirmPass} onChange={e => setConfirmPass(e.target.value)} className="w-full border p-2 rounded mt-1"/>
                </div>
                <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                    <Button type="submit">Update Password</Button>
                </div>
            </form>
        </div>
    );
};

const App: React.FC = () => {
  const loadFromStorage = <T,>(key: string, fallback: T): T => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallback;
    } catch (e) {
      console.error(`Error loading ${key} from localStorage`, e);
      return fallback;
    }
  };

  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState('dashboard');
  
  const [users, setUsers] = useState<User[]>(() => loadFromStorage('jma_users', mockUsers));
  const [students, setStudents] = useState<Student[]>(() => loadFromStorage('jma_students', mockStudents));
  const [results, setResults] = useState<Result[]>(() => loadFromStorage('jma_results', mockResults));
  const [logs, setLogs] = useState<AuditLog[]>(() => loadFromStorage('jma_logs', MOCK_LOGS_INITIAL as any));
  const [classes, setClasses] = useState<ClassDefinition[]>(() => loadFromStorage('jma_classes', mockClasses));
  const [subjects, setSubjects] = useState<Subject[]>(() => loadFromStorage('jma_subjects', mockSubjects));
  const [attendance, setAttendance] = useState<Attendance[]>(() => loadFromStorage('jma_attendance', mockAttendance));
  const [pins, setPins] = useState<Pin[]>(() => loadFromStorage('jma_pins', mockPins));
  const [schoolConfig, setSchoolConfig] = useState<SchoolConfig>(() => loadFromStorage('jma_config', mockSchoolConfig));
  const [psychomotor, setPsychomotor] = useState<PsychomotorRecord[]>(() => loadFromStorage('jma_psychomotor', mockPsychomotor));
  const [staffAttendance, setStaffAttendance] = useState<StaffAttendance[]>(() => loadFromStorage('jma_staff_attendance', []));

  // Record map: "userId_studentId": count
  const [viewLogs, setViewLogs] = useState<Record<string, number>>(() => loadFromStorage('jma_view_logs', {}));
  
  // Permission Requests State
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>(() => loadFromStorage('jma_access_requests', []));

  useEffect(() => localStorage.setItem('jma_users', JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem('jma_students', JSON.stringify(students)), [students]);
  useEffect(() => localStorage.setItem('jma_results', JSON.stringify(results)), [results]);
  useEffect(() => localStorage.setItem('jma_logs', JSON.stringify(logs)), [logs]);
  useEffect(() => localStorage.setItem('jma_classes', JSON.stringify(classes)), [classes]);
  useEffect(() => localStorage.setItem('jma_subjects', JSON.stringify(subjects)), [subjects]);
  useEffect(() => localStorage.setItem('jma_attendance', JSON.stringify(attendance)), [attendance]);
  useEffect(() => localStorage.setItem('jma_pins', JSON.stringify(pins)), [pins]);
  useEffect(() => localStorage.setItem('jma_config', JSON.stringify(schoolConfig)), [schoolConfig]);
  useEffect(() => localStorage.setItem('jma_psychomotor', JSON.stringify(psychomotor)), [psychomotor]);
  useEffect(() => localStorage.setItem('jma_view_logs', JSON.stringify(viewLogs)), [viewLogs]);
  useEffect(() => localStorage.setItem('jma_access_requests', JSON.stringify(accessRequests)), [accessRequests]);
  useEffect(() => localStorage.setItem('jma_staff_attendance', JSON.stringify(staffAttendance)), [staffAttendance]);

  const [authView, setAuthView] = useState<'LANDING' | 'LOGIN'>('LANDING'); // New state for Landing Page
  const [loginTab, setLoginTab] = useState<'RESULT' | 'STAFF'>('RESULT');
  const [loginCreds, setLoginCreds] = useState({ email: '', password: '', admissionNo: '', pin: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [formMasterViewCount, setFormMasterViewCount] = useState<number>(0);

  // Admin view filters
  const [adminSessionFilter, setAdminSessionFilter] = useState(schoolConfig.activeSession);
  const [adminTermFilter, setAdminTermFilter] = useState<Term>(schoolConfig.activeTerm);

  const addLog = (userId: string, role: string, action: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      userId, 
      userRole: role as UserRole,
      action, 
      details,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1'
    };
    setLogs(prev => [newLog, ...prev]);
  };

  // --- Permission Request Logic ---
  // ... (rest of the logic remains the same)
  const createAccessRequest = (type: RequestType, resourceId: string, details: string) => {
      if (!user) return;
      
      const newRequest: AccessRequest = {
          id: `req-${Date.now()}`,
          requesterId: user.id,
          requesterName: user.name,
          type,
          resourceId,
          details,
          status: RequestStatus.PENDING,
          timestamp: new Date().toISOString()
      };
      
      setAccessRequests(prev => [newRequest, ...prev]);
      alert("Permission request sent to Admin.");
      addLog(user.id, user.role, 'REQUEST_ACCESS', `Requested ${type} for ${resourceId}`);
  };

  const handleApproveRequest = (requestId: string) => {
      setAccessRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: RequestStatus.APPROVED } : r));
      addLog(user!.id, user!.role, 'APPROVE_ACCESS', `Approved request ${requestId}`);
  };

  const handleDeclineRequest = (requestId: string) => {
      setAccessRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: RequestStatus.DECLINED } : r));
      addLog(user!.id, user!.role, 'DECLINE_ACCESS', `Declined request ${requestId}`);
  };

  const hasApprovedPermission = (type: RequestType, resourceId: string): AccessRequest | undefined => {
      return accessRequests.find(r => 
          r.requesterId === user?.id && 
          r.resourceId === resourceId && 
          r.type === type && 
          r.status === RequestStatus.APPROVED
      );
  };

  const checkAttendancePermission = (classId: string, date: string) => {
      const resourceId = `${classId}|${date}`;
      return !!hasApprovedPermission(RequestType.EDIT_ATTENDANCE, resourceId);
  };
  
  const handleAuthSuccess = (authenticatedUser: User) => {
      setUser(authenticatedUser);
      setView('dashboard');
      addLog(authenticatedUser.id, authenticatedUser.role, 'LOGIN_SUCCESS', 'User login successful');
      setFormMasterViewCount(0);
      setLoginCreds({ email: '', password: '', admissionNo: '', pin: '' });
  };

  const performStaffLogin = (e: React.FormEvent) => {
      e.preventDefault();
      setIsAuthenticating(true);
      const emailInput = loginCreds.email.trim();
      setTimeout(() => {
          const foundUser = users.find(u => u.email.toLowerCase() === emailInput.toLowerCase());
          if (foundUser) {
              const validPassword = foundUser.password || 'password';
              if (loginCreds.password === validPassword) { 
                  handleAuthSuccess(foundUser);
              } else {
                  addLog('system', 'ANONYMOUS', 'LOGIN_FAILED', `Failed login: Invalid password for ${emailInput}`);
                  alert("Invalid Password.");
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

          const updatedPins = pins.map(p => p.code === pin.code ? { ...p, usageCount: p.usageCount + 1, isUsed: true, assignedStudentId: student.id } : p);
          setPins(updatedPins);
          
          const studentUser: User = {
              id: student.id,
              name: student.name,
              email: `${student.id}@student.school`,
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
     setAuthView('LANDING'); // Reset to landing on logout
     setSelectedClassId(null);
     setSelectedSubjectId(null);
  };

  const handleChangePassword = (newPass: string) => {
      if (!user) return;
      const updatedUser = { ...user, password: newPass };
      setUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
      addLog(user.id, user.role, 'PASSWORD_CHANGE', 'User changed password');
      alert("Password updated successfully.");
      setView('dashboard');
  };

  const handleSaveResult = (newResult: Result) => {
    // ... (logic for save result)
    const isAdmin = user?.role === UserRole.ADMIN;
    let isLocked = isAdmin ? newResult.isLocked : true;

    // Check for existing locked result
    const existing = results.find(r => r.id === newResult.id);
    if (existing && existing.isLocked && !isAdmin) {
        // Check for permission
        const permission = hasApprovedPermission(RequestType.EDIT_RESULT, existing.id);
        if (permission) {
            isLocked = true; // Still save as locked, but allow the save now.
            // Consume permission
            setAccessRequests(prev => prev.map(r => r.id === permission.id ? { ...r, status: RequestStatus.CONSUMED } : r));
        } else {
            // Should be caught by UI, but double check
            if (confirm("This result is locked. Request permission from Admin to edit?")) {
                createAccessRequest(RequestType.EDIT_RESULT, existing.id, `Request to edit result for ${newResult.studentId} in ${newResult.subjectId}`);
            }
            return;
        }
    }

    const resultToSave = { 
        ...newResult, 
        isLocked
    };

    setResults(prev => {
        const idx = prev.findIndex(r => r.id === resultToSave.id);
        if (idx >= 0) {
            const updated = [...prev];
            updated[idx] = resultToSave;
            return updated;
        }
        return [...prev, resultToSave];
    });
    addLog(user?.id || 'sys', user?.role || UserRole.TEACHER, 'UPDATE_RESULT', `Updated result for ${newResult.studentId}`);
  };

  const handleSaveReviewRemark = (studentId: string, remark: string) => {
      // ... (logic for review remark)
      if (!user) return;
      const role = user.role;
      setResults(prev => {
          const updated = prev.map(r => {
              // Only update current active session/term results
              if (r.studentId === studentId && r.session === schoolConfig.activeSession && r.term === schoolConfig.activeTerm) {
                  if (role === UserRole.PRINCIPAL) {
                      return { ...r, principalRemark: remark, isApproved: true, isLocked: true };
                  } else if (role === UserRole.FORM_MASTER) {
                      return { ...r, formMasterRemark: remark };
                  }
              }
              return r;
          });
          return updated;
      });
      addLog(user.id, user.role, 'ADD_REMARK', `Added general remark for student ${studentId}`);
      alert("Remark saved successfully.");
  };

  const handleSaveAttendance = (newRecords: Attendance[]) => {
      // ... (logic for save attendance)
      if (newRecords.length === 0) return;
      
      const { classId, date } = newRecords[0];
      
      // Consume permission if exists (locking it back after this save)
      const resourceId = `${classId}|${date}`;
      const permission = hasApprovedPermission(RequestType.EDIT_ATTENDANCE, resourceId);
      if (permission) {
          setAccessRequests(prev => prev.map(r => r.id === permission.id ? { ...r, status: RequestStatus.CONSUMED } : r));
      }

      const filtered = attendance.filter(a => !(a.classId === classId && a.date === date));
      setAttendance([...filtered, ...newRecords]);
      addLog(user?.id || 'sys', user?.role || UserRole.FORM_MASTER, 'MARK_ATTENDANCE', `Marked attendance for ${newRecords.length} students`);
      alert("Attendance Saved!");
  };

  const handleAttendanceUnlockRequest = (classId: string, date: string) => {
      // ...
      const resourceId = `${classId}|${date}`;
      const permission = hasApprovedPermission(RequestType.EDIT_ATTENDANCE, resourceId);
      
      if (permission) {
          alert("You have an unused approved permission. You can edit now.");
      } else {
          if (confirm(`Request permission to edit attendance for ${date}?`)) {
              createAccessRequest(RequestType.EDIT_ATTENDANCE, resourceId, `Unlock attendance for class ${classId} on ${date}`);
          }
      }
  };

  const handleCheckViewLimit = (studentId: string) => {
      // ...
      if (!user) return false;
      if (user.role === UserRole.ADMIN || user.role === UserRole.PRINCIPAL) return true; 

      const key = `${user.id}_${studentId}`;
      const currentCount = viewLogs[key] || 0;

      if (currentCount >= 2) {
          // Check permission
          const permission = hasApprovedPermission(RequestType.VIEW_RESULT_LIMIT, studentId);
          if (permission) {
              // Reset count to give them fresh access
              setViewLogs(prev => ({ ...prev, [key]: 0 }));
              // Consume permission
              setAccessRequests(prev => prev.map(r => r.id === permission.id ? { ...r, status: RequestStatus.CONSUMED } : r));
              return true; 
          }

          if (confirm("View limit reached (2/2). Request Admin permission to view again?")) {
              createAccessRequest(RequestType.VIEW_RESULT_LIMIT, studentId, `Request additional views for student ${studentId}`);
          }
          return false;
      }

      // Increment count
      setViewLogs(prev => ({ ...prev, [key]: currentCount + 1 }));
      return true;
  };

  const handleFormMasterViewAccess = () => {
     // ...
     if (user?.role === UserRole.FORM_MASTER) {
         if (formMasterViewCount >= 2) {
             alert("Access Denied: Limit reached.");
             return false;
         }
         setFormMasterViewCount(prev => prev + 1);
         alert(`Access Granted. ${formMasterViewCount + 1}/2 accesses used.`);
     }
     return true;
  };

  const handleViewChange = (newView: string) => {
      if ((newView === 'approvals' || newView === 'print_results') && user?.role === UserRole.FORM_MASTER) {
          if(!handleFormMasterViewAccess()) return;
      }
      setView(newView);
  };

  const generatePinCode = () => {
      const p = () => Math.floor(1000 + Math.random() * 9000);
      return `${p()}-${p()}-${p()}`;
  };

  const handleStaffClockIn = (record: StaffAttendance) => {
      setStaffAttendance(prev => [record, ...prev]);
      addLog(user!.id, user!.role, 'STAFF_ATTENDANCE', `Clocked in at ${record.time}`);
  };

  // Back Button Component
  const BackButton = () => (
      <button onClick={() => setView('dashboard')} className="flex items-center text-slate-500 hover:text-blue-600 mb-4 font-medium transition-colors">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Dashboard
      </button>
  );
  
  // Dashboard View and other view components...
  const DashboardView = () => {
    if (!user) return null;
    const pendingRequests = accessRequests.filter(r => r.status === RequestStatus.PENDING);
    // ... (rest of Dashboard view)
    return (
    <div className="space-y-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between">
            <div>
                <h2 className="text-3xl font-bold font-display text-slate-900">Welcome back, {user.name.split(' ')[0]}</h2>
                <p className="text-slate-500 mt-1 font-medium">
                    {user.role === UserRole.STUDENT 
                    ? 'View your latest academic performance reports.' 
                    : 'Manage school operations, results, and student data.'}
                </p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
                <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-bold text-sm">
                    Active: {schoolConfig.activeSession} - {schoolConfig.activeTerm}
                </div>
                {user.role !== UserRole.STUDENT && (
                    <Button variant="outline" onClick={() => setView('change_password')} className="text-xs py-1.5 px-3">
                        Change Password
                    </Button>
                )}
            </div>
        </div>
        
        {/* Admin Action Center */}
        {user.role === UserRole.ADMIN && pendingRequests.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-200">
                <div className="flex items-center gap-2 mb-4">
                    <BellIcon className="h-6 w-6 text-amber-500" />
                    <h3 className="text-lg font-bold text-slate-900">Action Center ({pendingRequests.length} pending requests)</h3>
                </div>
                <div className="space-y-3">
                    {pendingRequests.map(req => (
                        <div key={req.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-3 bg-amber-50 rounded-lg border border-amber-100 gap-4">
                            <div>
                                <p className="text-sm font-bold text-slate-800">{req.requesterName} <span className="text-slate-500 font-normal">requests</span> {req.type.replace('_', ' ')}</p>
                                <p className="text-xs text-slate-600 mt-0.5">{req.details}</p>
                                <p className="text-[10px] text-slate-400 mt-1">{new Date(req.timestamp).toLocaleString()}</p>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handleApproveRequest(req.id)}
                                    className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded text-xs font-bold hover:bg-green-700"
                                >
                                    <CheckIcon className="h-4 w-4 mr-1" /> Approve
                                </button>
                                <button 
                                    onClick={() => handleDeclineRequest(req.id)}
                                    className="flex items-center px-3 py-1.5 bg-white border border-red-200 text-red-600 rounded text-xs font-bold hover:bg-red-50"
                                >
                                    <XMarkIcon className="h-4 w-4 mr-1" /> Decline
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {user.role !== UserRole.STUDENT && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { 
                        label: 'Total Students', 
                        count: students.length, 
                        color: 'blue',
                        view: user.role === UserRole.ADMIN ? 'students_manager' : undefined
                    },
                    { 
                        label: 'Results Logged', 
                        count: results.length, 
                        color: 'emerald',
                        view: 'results'
                    },
                    { 
                        label: 'Active Staff', 
                        count: users.filter(u => u.role !== UserRole.STUDENT).length, 
                        color: 'purple',
                        view: user.role === UserRole.ADMIN ? 'staff_manager' : undefined
                    },
                    { 
                        label: 'Classes', 
                        count: classes.length, 
                        color: 'amber',
                        view: user.role === UserRole.ADMIN ? 'class_manager' : (user.role === UserRole.FORM_MASTER ? 'class_manager' : undefined)
                    },
                ].map((item, idx) => (
                    <div 
                        key={idx} 
                        onClick={() => item.view && setView(item.view)}
                        className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between
                        ${item.view ? 'cursor-pointer hover:shadow-md hover:-translate-y-1 active:scale-95 active:bg-slate-50' : ''}`}
                    >
                        <div>
                            <div className={`text-${item.color}-600 text-xs font-bold uppercase tracking-wider mb-2`}>{item.label}</div>
                            <div className="text-4xl font-black text-slate-900 font-display group-hover:scale-105 transition-transform origin-left">{item.count}</div>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full mt-4 overflow-hidden">
                            <div className={`h-full bg-${item.color}-500 w-2/3 rounded-full`}></div>
                        </div>
                         {item.view && (
                            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 text-${item.color}-500`}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                </svg>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        )}
        
        {user.role === UserRole.ADMIN && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-6 font-display">Recent System Activity</h3>
                <AuditLogsTable logs={logs.slice(0, 5)} />
            </div>
        )}

        {user.role === UserRole.STUDENT && (
             <div className="bg-blue-600 text-white p-8 rounded-2xl shadow-lg shadow-blue-500/20">
                 <h3 className="text-2xl font-bold font-display mb-2">My Student Portal</h3>
                 <p className="text-blue-100 mb-6 max-w-lg">Access your complete academic history and download your termly report cards instantly.</p>
                 <Button onClick={() => setView('my_result')} className="bg-white text-blue-700 hover:bg-blue-50 shadow-none border-none">View My Result</Button>
             </div>
        )}
    </div>
    );
  };

  const ResultEntryFlow = () => {
    // ... (rest of result entry flow)
    const isRestricted = user?.role !== UserRole.ADMIN;
    const currentSession = isRestricted ? schoolConfig.activeSession : adminSessionFilter;
    const currentTerm = isRestricted ? schoolConfig.activeTerm : adminTermFilter;

    if (!selectedClassId || !selectedSubjectId) {
        const visibleClasses = user?.role === UserRole.ADMIN || user?.role === UserRole.PRINCIPAL
            ? classes 
            : classes.filter(c => user?.assignedClassIds?.includes(c.id));
        
        let visibleSubjects = user?.role === UserRole.ADMIN || user?.role === UserRole.PRINCIPAL
            ? subjects
            : subjects.filter(s => user?.assignedSubjectIds?.includes(s.id));
        
        if (selectedClassId) {
            const selectedClass = classes.find(c => c.id === selectedClassId);
            if (selectedClass) {
                // Filter compatible subjects logic if needed based on new class naming (removed Arm)
                // Assuming basic mapping for now or all subjects available
            }
        }

        const selectClass = "w-full p-4 rounded-xl border border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-medium text-slate-700 text-base sm:text-sm";

        return (
            <div className="space-y-6">
                <BackButton />
                {user?.role === UserRole.ADMIN && (
                    <div className="bg-blue-50 p-4 rounded-lg flex gap-4 items-end mb-6 border border-blue-100">
                        <div className="flex-1">
                            <label className="text-xs font-bold text-blue-800">Admin View: Session</label>
                            <select className="w-full border p-1.5 rounded" value={adminSessionFilter} onChange={e => setAdminSessionFilter(e.target.value)}>
                                <option value="2023/2024">2023/2024</option>
                                <option value="2024/2025">2024/2025</option>
                                <option value="2025/2026">2025/2026</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="text-xs font-bold text-blue-800">Term</label>
                            <select className="w-full border p-1.5 rounded" value={adminTermFilter} onChange={e => setAdminTermFilter(e.target.value as Term)}>
                                <option value={Term.FIRST}>{Term.FIRST}</option>
                                <option value={Term.SECOND}>{Term.SECOND}</option>
                                <option value={Term.THIRD}>{Term.THIRD}</option>
                            </select>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 max-w-xl w-full mx-4">
                        <div className="text-center mb-8 md:mb-10">
                            <div className="h-14 w-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AcademicCapIcon className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-bold font-display text-slate-900">Start Grading</h3>
                            <p className="text-slate-500 mt-2">Entering results for <span className="font-bold text-blue-600">{currentSession} - {currentTerm}</span></p>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Class</label>
                                <select 
                                    className={selectClass}
                                    onChange={(e) => { setSelectedClassId(e.target.value); setSelectedSubjectId(null); }}
                                    value={selectedClassId || ''}
                                >
                                    <option value="">Select Class...</option>
                                    {visibleClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Subject</label>
                                <select 
                                    className={selectClass}
                                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                                    value={selectedSubjectId || ''}
                                    disabled={!selectedClassId}
                                >
                                    <option value="">Select Subject...</option>
                                    {visibleSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                            <Button 
                                disabled={!selectedClassId || !selectedSubjectId}
                                onClick={() => {}} 
                                className="w-full py-4 text-lg"
                            >
                                Proceed to Entry
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const classStudents = students.filter(s => s.classId === selectedClassId);
    const subjectName = subjects.find(s => s.id === selectedSubjectId)?.name;
    
    return (
        <div className="space-y-6">
            {/* Sticky Header for Mobile Context */}
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur shadow-sm p-4 -mx-4 md:mx-0 md:rounded-xl md:border md:border-slate-100 flex items-center justify-between transition-all">
                <div className="flex items-center gap-3 md:gap-4">
                    <button onClick={() => { setSelectedClassId(null); setSelectedSubjectId(null); }} className="h-8 w-8 md:h-10 md:w-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
                        <ArrowLeftIcon className="h-4 w-4 md:h-5 md:w-5" />
                    </button>
                    <div>
                        <h2 className="text-lg md:text-xl font-bold font-display text-slate-900 truncate max-w-[150px] md:max-w-none">{subjectName}</h2>
                        <p className="text-slate-500 text-xs md:text-sm font-medium">{classStudents.length} Students | {currentTerm}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Class</p>
                    <p className="font-bold text-sm md:text-base text-slate-800">{classes.find(c => c.id === selectedClassId)?.name}</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6 pb-20">
                {classStudents.map(student => {
                    const existing = results.find(r => r.studentId === student.id && r.subjectId === selectedSubjectId && r.session === currentSession && r.term === currentTerm);
                    
                    // STRICT LOCKING LOGIC with Permission Check
                    let isReadOnly = false;
                    let canRequestUnlock = false;

                    if (user?.role === UserRole.ADMIN) {
                        isReadOnly = false;
                    } else {
                        // For non-admins
                        if (existing) {
                            // Check if permission granted
                            const hasPerm = hasApprovedPermission(RequestType.EDIT_RESULT, existing.id);
                            if (hasPerm) {
                                isReadOnly = false;
                            } else {
                                isReadOnly = true; // Submit once rule
                                canRequestUnlock = true;
                            }
                        }
                        if (isRestricted && (currentSession !== schoolConfig.activeSession || currentTerm !== schoolConfig.activeTerm)) {
                            isReadOnly = true;
                        }
                    }

                    return (
                        <div key={student.id} className="relative">
                            {/* Request Overlay for locked items */}
                            {isReadOnly && canRequestUnlock && (
                                <div className="absolute top-2 right-2 z-10">
                                    <button 
                                        onClick={() => {
                                            if (confirm("Request permission to edit this result?")) {
                                                createAccessRequest(RequestType.EDIT_RESULT, existing!.id, `Edit result for ${student.name} in ${subjectName}`);
                                            }
                                        }}
                                        className="text-xs bg-white border border-blue-200 text-blue-600 px-2 py-1 rounded shadow-sm hover:bg-blue-50"
                                    >
                                        Request Edit
                                    </button>
                                </div>
                            )}

                            <ResultEntry 
                                student={student} 
                                subject={subjectName || ''}
                                subjectId={selectedSubjectId!}
                                session={currentSession}
                                term={currentTerm}
                                existingResult={existing}
                                isReadOnly={isReadOnly}
                                onSave={(r) => {
                                    handleSaveResult(r);
                                    alert('Saved Successfully!');
                                }}
                            />
                        </div>
                    );
                })}
                {classStudents.length === 0 && <p className="text-slate-500 text-center py-20 font-medium">No students found in this class.</p>}
            </div>
        </div>
    );
  };

  const AttendanceView = () => {
     // ... (rest of attendance view)
     const myClassId = user?.assignedClassIds?.[0]; 
     const myClass = classes.find(c => c.id === myClassId);
     
     if (!myClass && user?.role !== UserRole.ADMIN) return <div><BackButton/> You are not assigned to a class as Form Master.</div>;
     
     const targetClass = user?.role === UserRole.ADMIN ? classes[0] : myClass; 
     if (!targetClass) return <div><BackButton/> No classes available.</div>;

     const classStudents = students.filter(s => s.classId === targetClass.id);

     // Check for approved unlock permissions for the attendance register component to use
     // This is passed down via props or handled in the save logic wrapper, here we pass the handler
     
     return (
         <div className="space-y-4">
             <BackButton />
             <AttendanceRegister 
                currentClass={targetClass}
                students={classStudents}
                attendanceRecords={attendance}
                onSaveAttendance={handleSaveAttendance}
                currentUserRole={user?.role}
                onRequestUnlock={handleAttendanceUnlockRequest}
                checkUnlockPermission={checkAttendancePermission}
             />
         </div>
     );
  };

  if (!user) {
    if (authView === 'LANDING') {
      return <LandingPage onNavigate={(type) => { setLoginTab(type); setAuthView('LOGIN'); }} />;
    }
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
        onBack={() => setAuthView('LANDING')}
    />;
  }

  const getFormMasterForClass = (classId: string) => {
      const cls = classes.find(c => c.id === classId);
      if (cls && cls.formMasterId) {
          return users.find(u => u.id === cls.formMasterId);
      }
      return undefined;
  };

  return (
    <Layout user={user} onLogout={handleLogout} currentView={view} onChangeView={handleViewChange}>
      {view === 'dashboard' && <DashboardView />}
      {view === 'change_password' && <ChangePasswordView user={user!} onCancel={() => setView('dashboard')} onChangePassword={handleChangePassword} />}
      {view === 'results' && <ResultEntryFlow />}
      
      {view === 'attendance' && <AttendanceView />}
      
      {/* New Staff Attendance View */}
      {view === 'staff_attendance' && (
          <div className="space-y-4">
             <BackButton />
             <StaffAttendancePanel 
                user={user}
                schoolConfig={schoolConfig}
                attendanceHistory={staffAttendance.filter(a => a.staffId === user.id).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())}
                onClockIn={handleStaffClockIn}
             />
          </div>
      )}

      {/* Admin Attendance Report */}
      {view === 'admin_attendance' && (
          <div className="space-y-4">
              <BackButton />
              <AdminStaffAttendance 
                  users={users}
                  attendanceRecords={staffAttendance}
              />
          </div>
      )}
      
      {view === 'staff_manager' && (
          <div className="space-y-4">
              <BackButton />
              <StaffManagement 
                users={users} classes={classes} subjects={subjects}
                onAddUser={(u) => { setUsers(prev => [...prev, u]); addLog(user!.id, user!.role, 'ADD_USER', `Added user ${u.name}`); }}
                onUpdateUser={(u) => { setUsers(prev => prev.map(x => x.id === u.id ? u : x)); addLog(user!.id, user!.role, 'UPDATE_USER', `Updated user ${u.name}`); }}
                onDeleteUser={(id) => { setUsers(prev => prev.filter(x => x.id !== id)); addLog(user!.id, user!.role, 'DELETE_USER', `Deleted user ${id}`); }}
              />
          </div>
      )}

      {view === 'pins' && (
          <div className="space-y-4">
              <BackButton />
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
                        generatedBy: user!.id,
                        expiryDate: '2025-12-31',
                        isUsed: false,
                        assignedStudentId: student.id
                    }));
                    setPins(prev => [...newPins, ...prev]);
                    addLog(user!.id, user!.role, 'GENERATE_PINS', `Generated ${newPins.length} pins for class ${classId}`);
                    alert(`Successfully generated ${newPins.length} pins for ${classStudents.length} students.`);
                }}
                onAssignStudent={(code, studentId) => {
                    setPins(prev => prev.map(p => p.code === code ? { ...p, assignedStudentId: studentId } : p));
                    addLog(user!.id, user!.role, 'ASSIGN_PIN', `Assigned PIN ${code} to student ${studentId}`);
                }}
              />
          </div>
      )}

      {view === 'insights' && (
          <div className="space-y-4">
              <BackButton />
              <Insights results={results} students={students} classes={classes} />
          </div>
      )}
      {view === 'audit' && (
          <div className="space-y-4">
              <BackButton />
              <AuditLogsTable logs={logs} />
          </div>
      )}
      {view === 'approvals' && (
           <div className="space-y-4">
                <BackButton />
                <ResultApproval 
                        user={user!}
                        results={results}
                        students={students}
                        classes={classes}
                        subjects={subjects}
                        onUpdateResult={handleSaveResult}
                />
           </div>
      )}
      {view === 'print_results' && (
          <div className="space-y-4">
                <BackButton />
                <ResultPrintingManager 
                    user={user!}
                    classes={classes}
                    students={students}
                    results={results}
                    subjects={subjects}
                    schoolConfig={schoolConfig}
                    psychomotorRecords={psychomotor}
                    users={users}
                />
          </div>
      )}
      {view === 'promotions' && (
          <div className="space-y-4">
              <BackButton />
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
                    addLog(user!.id, user!.role, 'BULK_PROMOTION', `Promoted ${updates.length} students`);
                }}
              />
          </div>
      )}
      {view === 'class_manager' && (
           <div className="space-y-4">
               <BackButton />
               <ClassManager 
                    classes={classes}
                    users={users}
                    onAdd={(c) => { setClasses(prev => [...prev, c]); addLog(user!.id, user!.role, 'ADD_CLASS', `Added class ${c.name}`); }}
                    onUpdate={(c) => { setClasses(prev => prev.map(x => x.id === c.id ? c : x)); addLog(user!.id, user!.role, 'UPDATE_CLASS', `Updated class ${c.name}`); }}
                    onDelete={(id) => { setClasses(prev => prev.filter(x => x.id !== id)); addLog(user!.id, user!.role, 'DELETE_CLASS', `Deleted class ${id}`); }}
                    currentUser={user || undefined}
                    students={students}
                    results={results}
                    subjects={subjects}
                    schoolConfig={schoolConfig}
                    psychomotorRecords={psychomotor}
                    onViewStudentResult={handleCheckViewLimit}
                    viewCounts={viewLogs}
               />
           </div>
      )}
      {view === 'students_manager' && (
           <div className="space-y-4">
               <BackButton />
               <StudentManager
                    students={students}
                    classes={classes}
                    onAdd={(s) => { setStudents(prev => [...prev, s]); addLog(user!.id, user!.role, 'ADD_STUDENT', `Added student ${s.name}`); }}
                    onUpdate={(s) => { setStudents(prev => prev.map(x => x.id === s.id ? s : x)); addLog(user!.id, user!.role, 'UPDATE_STUDENT', `Updated student ${s.name}`); }}
                    onDelete={(id) => { setStudents(prev => prev.filter(x => x.id !== id)); addLog(user!.id, user!.role, 'DELETE_STUDENT', `Deleted student ${id}`); }}
               />
           </div>
      )}
      {view === 'subjects' && (
           <div className="space-y-4">
               <BackButton />
               <SubjectManager
                    subjects={subjects}
                    onAdd={(s) => { setSubjects(prev => [...prev, s]); addLog(user!.id, user!.role, 'ADD_SUBJECT', `Added subject ${s.name}`); }}
                    onUpdate={(s) => { setSubjects(prev => prev.map(x => x.id === s.id ? s : x)); addLog(user!.id, user!.role, 'UPDATE_SUBJECT', `Updated subject ${s.name}`); }}
                    onDelete={(id) => { setSubjects(prev => prev.filter(x => x.id !== id)); addLog(user!.id, user!.role, 'DELETE_SUBJECT', `Deleted subject ${id}`); }}
               />
           </div>
      )}
      {view === 'psychomotor' && (
          <div className="space-y-4">
              <BackButton />
              <PsychomotorManager
                students={students}
                classes={classes}
                records={psychomotor}
                userRole={user!.role}
                assignedClassIds={user!.assignedClassIds}
                onSave={(record) => {
                setPsychomotor(prev => {
                    const idx = prev.findIndex(r => r.id === record.id);
                    if (idx >= 0) {
                    const updated = [...prev];
                    updated[idx] = record;
                    return updated;
                    }
                    return [...prev, record];
                });
                addLog(user!.id, user!.role, 'UPDATE_PSYCHOMOTOR', `Updated psychomotor for ${record.studentId}`);
                }}
              />
          </div>
      )}
      {view === 'config' && (
          <div className="space-y-4">
              <BackButton />
              <SchoolConfigManager
                config={schoolConfig}
                onSave={(cfg) => {
                    setSchoolConfig(cfg);
                    addLog(user!.id, user!.role, 'UPDATE_CONFIG', 'Updated portal configuration');
                    alert("Configuration Saved!");
                }}
              />
          </div>
      )}
      {/* Principal Review Panel */}
      {view === 'principal_review' && (
          <div className="space-y-4">
              <BackButton />
              <StudentResultReview 
                students={students}
                results={results}
                classes={classes}
                subjects={subjects}
                userRole={user!.role}
                onSaveRemark={handleSaveReviewRemark}
              />
          </div>
      )}
      {/* Form Master Review Panel */}
      {view === 'fm_review' && (
          <div className="space-y-4">
              <BackButton />
              <StudentResultReview 
                students={students}
                results={results}
                classes={classes}
                subjects={subjects}
                userRole={user!.role}
                onSaveRemark={handleSaveReviewRemark}
                assignedClassIds={user!.assignedClassIds}
              />
          </div>
      )}
      {view === 'my_result' && (
        <div className="space-y-4">
            <BackButton />
            <StudentReportCard 
                student={students.find(s => s.id === user!.id)!} 
                results={results.filter(r => r.studentId === user!.id && r.session === schoolConfig.activeSession && r.term === schoolConfig.activeTerm)} 
                allResults={results.filter(r => r.studentId === user!.id)}
                subjects={subjects}
                classes={classes}
                schoolConfig={schoolConfig}
                psychomotorRecord={psychomotor.find(p => p.studentId === user!.id && p.session === schoolConfig.activeSession && p.term === schoolConfig.activeTerm)}
                formMaster={getFormMasterForClass(students.find(s => s.id === user!.id)!.classId)}
            />
        </div>
      )}
    </Layout>
  );
};

export default App;
