
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
import ReportsDashboard from './components/ReportsDashboard';

import { User, UserRole, Result, Student, AuditLog, ClassDefinition, Subject, Attendance, Pin, SchoolConfig, PsychomotorRecord, Term, AccessRequest, RequestStatus, RequestType, StaffAttendance } from './types';
import { mockUsers, mockSchoolConfig, mockStudents, mockClasses, mockSubjects, mockResults, mockPins, mockPsychomotor } from './services/mockData';
import { UserCircleIcon, AcademicCapIcon, EyeIcon, EyeSlashIcon, ArrowLeftIcon, KeyIcon } from '@heroicons/react/24/solid';
import { supabase } from './services/supabase';

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
  onBack: () => void; 
}

const LoginScreen: React.FC<LoginScreenProps> = ({
  loginTab, setLoginTab, loginCreds, setLoginCreds, 
  performStudentCheck, performStaffLogin, showPassword, setShowPassword, isAuthenticating, onBack
}) => {
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
                <div className="flex p-1 bg-slate-100 rounded-xl mb-6 md:mb-8">
                    <button
                        onClick={() => setLoginTab('RESULT')}
                        className={`flex-1 flex items-center justify-center py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${
                            loginTab === 'RESULT' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        <AcademicCapIcon className="h-5 w-5 mr-2" /> Check Result
                    </button>
                    <button
                        onClick={() => setLoginTab('STAFF')}
                        className={`flex-1 flex items-center justify-center py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${
                            loginTab === 'STAFF' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        <UserCircleIcon className="h-5 w-5 mr-2" /> Staff Login
                    </button>
                </div>

                {loginTab === 'RESULT' ? (
                    <form onSubmit={performStudentCheck} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Admission Number</label>
                            <input
                                type="text" required placeholder="e.g. JMA/24/001"
                                value={loginCreds.admissionNo}
                                onChange={e => setLoginCreds({...loginCreds, admissionNo: e.target.value})}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Result Checker PIN</label>
                            <input
                                type="text" required placeholder="e.g. 1234-5678-9012"
                                value={loginCreds.pin}
                                onChange={e => setLoginCreds({...loginCreds, pin: e.target.value})}
                                className={`${inputClass} font-mono tracking-wider`}
                            />
                        </div>
                        <div className="pt-2">
                            <Button type="submit" className="w-full justify-center py-3.5 text-base shadow-lg shadow-blue-500/20" isLoading={isAuthenticating}>View Report Card</Button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={performStaffLogin} className="space-y-5">
                         <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
                            <input
                                type="email" required placeholder="staff@jere.edu.ng"
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
                                    required placeholder="••••••••"
                                    value={loginCreds.password}
                                    onChange={e => setLoginCreds({...loginCreds, password: e.target.value})}
                                    className={inputClass}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">
                                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>
                         <div className="pt-2">
                            <Button type="submit" className="w-full justify-center py-3.5 text-base shadow-lg shadow-blue-500/20" isLoading={isAuthenticating}>Login to Dashboard</Button>
                        </div>
                    </form>
                )}
            </div>
            <p className="text-center text-xs font-medium text-slate-400 mt-8 mb-4">&copy; {new Date().getFullYear()} Jere Model Academy</p>
        </div>
    </div>
  );
};

const ChangePasswordView: React.FC<{ user: User, onCancel: () => void, onChangePassword: (newPass: string) => void }> = ({ user, onCancel, onChangePassword }) => {
    const [currentPass, setCurrentPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation for mock data. For real data (where password isn't loaded), we rely on server side or skip strict current check.
        if (user.password && currentPass !== user.password) { 
            alert("Current password incorrect."); 
            return; 
        }
        
        if (newPass.length < 6) { alert("New password must be at least 6 characters."); return; }
        if (newPass !== confirmPass) { alert("New passwords do not match."); return; }
        onChangePassword(newPass);
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md border border-slate-200 mt-10">
            <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2"><KeyIcon className="h-6 w-6 text-blue-600"/> Change Password</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="password" required value={currentPass} onChange={e => setCurrentPass(e.target.value)} placeholder="Current Password" className="w-full border p-2 rounded mt-1"/>
                <input type="password" required value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="New Password" className="w-full border p-2 rounded mt-1"/>
                <input type="password" required value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="Confirm New Password" className="w-full border p-2 rounded mt-1"/>
                <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                    <Button type="submit">Update Password</Button>
                </div>
            </form>
        </div>
    );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState('dashboard');
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  // Data States - Initialized empty, populated via Supabase or Fallback
  const [users, setUsers] = useState<User[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [classes, setClasses] = useState<ClassDefinition[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [pins, setPins] = useState<Pin[]>([]);
  const [schoolConfig, setSchoolConfig] = useState<SchoolConfig>(mockSchoolConfig);
  const [psychomotor, setPsychomotor] = useState<PsychomotorRecord[]>([]);
  const [staffAttendance, setStaffAttendance] = useState<StaffAttendance[]>([]);
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const [viewLogs, setViewLogs] = useState<Record<string, number>>({}); 

  // Initial Data Fetch from Supabase
  useEffect(() => {
    const fetchData = async () => {
        setIsLoadingData(true);
        try {
            const [
                // Fetch from 'profiles' view instead of 'users' table to avoid RLS error
                usersRes, studentsRes, classesRes, subjectsRes, 
                resultsRes, attendanceRes, pinsRes, configRes, 
                psychomotorRes, staffAttRes, logsRes, requestsRes
            ] = await Promise.all([
                supabase.from('profiles').select('*'), // CHANGED: Query profiles view
                supabase.from('students').select('*'),
                supabase.from('classes').select('*'),
                supabase.from('subjects').select('*'),
                supabase.from('results').select('*'),
                supabase.from('attendance').select('*'),
                supabase.from('pins').select('*'),
                supabase.from('school_config').select('*').single(),
                supabase.from('psychomotor').select('*'),
                supabase.from('staff_attendance').select('*'),
                supabase.from('audit_logs').select('*').order('timestamp', { ascending: false }).limit(100),
                supabase.from('access_requests').select('*')
            ]);

            // Robust Fallback: If DB table is empty (length 0), use Mock Data
            if (usersRes.data && usersRes.data.length > 0) setUsers(usersRes.data as User[]);
            else setUsers(mockUsers); 

            if (studentsRes.data && studentsRes.data.length > 0) setStudents(studentsRes.data);
            else setStudents(mockStudents);

            if (classesRes.data && classesRes.data.length > 0) setClasses(classesRes.data);
            else setClasses(mockClasses);

            if (subjectsRes.data && subjectsRes.data.length > 0) setSubjects(subjectsRes.data);
            else setSubjects(mockSubjects);

            if (resultsRes.data && resultsRes.data.length > 0) setResults(resultsRes.data);
            else setResults(mockResults);

            if (pinsRes.data && pinsRes.data.length > 0) setPins(pinsRes.data);
            else setPins(mockPins);

            if (attendanceRes.data) setAttendance(attendanceRes.data);
            if (configRes.data && configRes.data.data) setSchoolConfig(configRes.data.data);
            if (psychomotorRes.data && psychomotorRes.data.length > 0) setPsychomotor(psychomotorRes.data);
            else setPsychomotor(mockPsychomotor);

            if (staffAttRes.data) setStaffAttendance(staffAttRes.data);
            if (logsRes.data) setLogs(logsRes.data);
            if (requestsRes.data) setAccessRequests(requestsRes.data);

        } catch (e) {
            console.error("Error fetching data from Supabase:", e);
            // On hard error, also fallback
            setUsers(mockUsers);
            setStudents(mockStudents);
            setClasses(mockClasses);
            setSubjects(mockSubjects);
            setResults(mockResults);
            setPins(mockPins);
            setPsychomotor(mockPsychomotor);
        } finally {
            setIsLoadingData(false);
        }
    };

    fetchData();
  }, []);

  // Session Persistence
  useEffect(() => {
    const sessionStr = localStorage.getItem('jma_session');
    if (sessionStr) {
        try {
            const session = JSON.parse(sessionStr);
            const now = new Date().getTime();
            if (session.user && session.expiry > now) {
                setUser(session.user);
            } else {
                localStorage.removeItem('jma_session');
            }
        } catch(e) { console.error("Session error", e); }
    }
  }, []);

  const [authView, setAuthView] = useState<'LANDING' | 'LOGIN'>('LANDING');
  const [loginTab, setLoginTab] = useState<'RESULT' | 'STAFF'>('RESULT');
  const [loginCreds, setLoginCreds] = useState({ email: '', password: '', admissionNo: '', pin: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [formMasterViewCount, setFormMasterViewCount] = useState<number>(0);
  const [adminSessionFilter, setAdminSessionFilter] = useState(schoolConfig.activeSession);
  const [adminTermFilter, setAdminTermFilter] = useState<Term>(schoolConfig.activeTerm);

  // Sync Helper Actions
  const addLog = async (userId: string, role: string, action: string, details: string) => {
    const userObj = users.find(u => u.id === userId);
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      userId, 
      userName: userObj ? userObj.name : (role === 'STUDENT' ? 'Student' : 'Unknown'),
      userRole: role as UserRole,
      action, 
      details,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1'
    };
    setLogs(prev => [newLog, ...prev]);
    await supabase.from('audit_logs').insert(newLog);
  };

  const handleAuthSuccess = (authenticatedUser: User) => {
      const expiry = new Date().getTime() + (30 * 60 * 1000);
      localStorage.setItem('jma_session', JSON.stringify({ user: authenticatedUser, expiry }));
      setUser(authenticatedUser);
      setView('dashboard');
      addLog(authenticatedUser.id, authenticatedUser.role, 'LOGIN_SUCCESS', 'User login successful');
      setLoginCreds({ email: '', password: '', admissionNo: '', pin: '' });
  };

  const performStaffLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsAuthenticating(true);
      
      const emailInput = loginCreds.email.trim();
      const passwordInput = loginCreds.password;

      try {
          // 1. Try Secure RPC Login
          const { data, error } = await supabase.rpc('auth_staff', {
            email_input: emailInput,
            password_input: passwordInput
          });

          // 2. Handle RPC Success
          if (data) {
              handleAuthSuccess(data as User);
              setIsAuthenticating(false);
              return;
          }

          // 3. Handle RPC Failure/Null (User not in DB) -> Fallback to Local/Mock check
          // If the DB is empty or connection fails, the app loads mockUsers into 'users' state.
          // Since RPC checks the REAL DB, it will return null if DB is empty.
          // We must check if our local 'users' state has the user (which means it's a mock user with a password).
          const foundLocalUser = users.find(u => u.email.toLowerCase() === emailInput.toLowerCase());
          
          if (foundLocalUser && foundLocalUser.password && (foundLocalUser.password === passwordInput)) {
               // This path is taken when the app is running in "Mock Mode" because DB is empty
               handleAuthSuccess(foundLocalUser);
               setIsAuthenticating(false);
               return;
          }

          // 4. Genuine Failure
          if (error) {
              console.error("Login RPC Error", error);
          }
          alert("Invalid Email or Password.");

      } catch (err) {
          console.error("Login Error", err);
          alert("An unexpected error occurred during login.");
      } finally {
          setIsAuthenticating(false);
      }
  };

  const performStudentCheck = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsAuthenticating(true);
      const { data: latestStudents } = await supabase.from('students').select('*');
      const { data: latestPins } = await supabase.from('pins').select('*');
      
      const studentList = (latestStudents && latestStudents.length > 0) ? latestStudents : students;
      const pinList = (latestPins && latestPins.length > 0) ? latestPins : pins;

      const admissionInput = loginCreds.admissionNo.trim();
      const student = studentList.find(s => s.id === admissionInput);
      const pin = pinList.find(p => p.code === loginCreds.pin.trim());

      if (!student) { alert("Invalid Admission Number."); setIsAuthenticating(false); return; }
      if (!pin) { alert("Invalid PIN."); setIsAuthenticating(false); return; }
      if (pin.assignedStudentId && pin.assignedStudentId !== student.id) { alert("PIN assigned to another student."); setIsAuthenticating(false); return; }
      if (pin.usageCount >= pin.maxUsage) { alert("PIN expired."); setIsAuthenticating(false); return; }

      // Update PIN usage in DB
      const updatedPin = { ...pin, usageCount: pin.usageCount + 1, isUsed: true, assignedStudentId: student.id };
      await supabase.from('pins').update(updatedPin).eq('code', pin.code);
      setPins(prev => prev.map(p => p.code === pin.code ? updatedPin : p));
      
      const studentUser: User = { id: student.id, name: student.name, email: `${student.id}@student.school`, role: UserRole.STUDENT, isActive: true, assignedClassIds: [], assignedSubjectIds: [] };
      handleAuthSuccess(studentUser);
      setIsAuthenticating(false);
  };

  const handleLogout = () => {
     if(user) addLog(user.id, user.role, 'LOGOUT', 'User logged out');
     localStorage.removeItem('jma_session');
     setUser(null);
     setView('login');
     setAuthView('LANDING');
  };

  const handleSaveResult = async (newResult: Result) => {
    const isAdmin = user?.role === UserRole.ADMIN;
    let isLocked = isAdmin ? newResult.isLocked : true; // Default lock on submit for teachers

    const existing = results.find(r => r.id === newResult.id);
    if (existing && existing.isLocked && !isAdmin) {
        const permission = accessRequests.find(r => r.resourceId === existing.id && r.status === RequestStatus.APPROVED);
        if (permission) {
            isLocked = true; // Still locked after edit
            // Consume permission
            await supabase.from('access_requests').update({ status: RequestStatus.CONSUMED }).eq('id', permission.id);
            setAccessRequests(prev => prev.map(r => r.id === permission.id ? { ...r, status: RequestStatus.CONSUMED } : r));
        } else {
            if (confirm("Result locked. Request permission?")) {
                const req = {
                    id: `req-${Date.now()}`, requesterId: user!.id, requesterName: user!.name, type: RequestType.EDIT_RESULT, 
                    resourceId: existing.id, details: `Edit result ${newResult.studentId}`, status: RequestStatus.PENDING, timestamp: new Date().toISOString()
                };
                await supabase.from('access_requests').insert(req);
                setAccessRequests(prev => [req, ...prev]);
                alert("Request sent.");
            }
            return;
        }
    }

    const resultToSave = { ...newResult, isLocked };
    
    // Optimistic Update
    setResults(prev => {
        const idx = prev.findIndex(r => r.id === resultToSave.id);
        if (idx >= 0) { const u = [...prev]; u[idx] = resultToSave; return u; }
        return [...prev, resultToSave];
    });

    // DB Update
    await supabase.from('results').upsert(resultToSave);
    addLog(user?.id || 'sys', user?.role || UserRole.TEACHER, 'UPDATE_RESULT', `Updated result for ${newResult.studentId}`);
  };

  const handleSaveAttendance = async (newRecords: Attendance[]) => {
      if (newRecords.length === 0) return;
      const { classId, date } = newRecords[0];
      const resourceId = `${classId}|${date}`;
      const permission = accessRequests.find(r => r.resourceId === resourceId && r.status === RequestStatus.APPROVED);
      if (permission) {
          await supabase.from('access_requests').update({ status: RequestStatus.CONSUMED }).eq('id', permission.id);
          setAccessRequests(prev => prev.map(r => r.id === permission.id ? { ...r, status: RequestStatus.CONSUMED } : r));
      }

      // Filter local state
      const filtered = attendance.filter(a => !(a.classId === classId && a.date === date));
      const combined = [...filtered, ...newRecords];
      setAttendance(combined);

      // DB Update (Delete old for day, insert new)
      await supabase.from('attendance').delete().eq('classId', classId).eq('date', date);
      await supabase.from('attendance').insert(newRecords);
      
      addLog(user?.id || 'sys', user?.role || UserRole.FORM_MASTER, 'MARK_ATTENDANCE', `Marked attendance for ${newRecords.length} students`);
      alert("Attendance Saved!");
  };

  // Other critical handlers wrapped for DB sync
  const saveUser = async (u: User) => {
      // Logic: If password is provided, we send the whole object.
      // If password is NOT provided (e.g. edit from profile view), we must NOT send an empty password field to upsert, 
      // or it might overwrite existing password with null.
      const { password, ...rest } = u;
      
      // If password exists and is not empty, use full object. Otherwise use rest.
      const payload = (password && password.length > 0) ? u : rest;
      
      await supabase.from('users').upsert(payload);
      setUsers(prev => { const idx = prev.findIndex(x => x.id === u.id); return idx >= 0 ? prev.map(x => x.id === u.id ? u : x) : [...prev, u]; });
  };
  const deleteUser = async (id: string) => {
      await supabase.from('users').delete().eq('id', id);
      setUsers(prev => prev.filter(x => x.id !== id));
  };
  
  const saveClass = async (c: ClassDefinition) => {
      await supabase.from('classes').upsert(c);
      setClasses(prev => { const idx = prev.findIndex(x => x.id === c.id); return idx >= 0 ? prev.map(x => x.id === c.id ? c : x) : [...prev, c]; });
  };
  const deleteClass = async (id: string) => {
      await supabase.from('classes').delete().eq('id', id);
      setClasses(prev => prev.filter(x => x.id !== id));
  };

  const saveStudent = async (s: Student) => {
      await supabase.from('students').upsert(s);
      setStudents(prev => { const idx = prev.findIndex(x => x.id === s.id); return idx >= 0 ? prev.map(x => x.id === s.id ? s : x) : [...prev, s]; });
  };
  const deleteStudent = async (id: string) => {
      await supabase.from('students').delete().eq('id', id);
      setStudents(prev => prev.filter(x => x.id !== id));
  };

  const saveConfig = async (cfg: SchoolConfig) => {
      await supabase.from('school_config').upsert({ id: 1, data: cfg });
      setSchoolConfig(cfg);
  };

  const handleStaffClockIn = async (record: StaffAttendance) => {
      await supabase.from('staff_attendance').insert(record);
      setStaffAttendance(prev => [record, ...prev]);
      addLog(user!.id, user!.role, 'STAFF_ATTENDANCE', `Clocked in at ${record.time}`);
  };

  // --- Views ---
  
  if (isLoadingData) {
      return <div className="h-screen flex items-center justify-center text-blue-600 font-bold">Loading Portal Data...</div>;
  }

  if (!user) {
    if (authView === 'LANDING') {
      return <LandingPage onNavigate={(type) => { setLoginTab(type); setAuthView('LOGIN'); }} />;
    }
    return <LoginScreen 
        loginTab={loginTab} setLoginTab={setLoginTab} loginCreds={loginCreds} setLoginCreds={setLoginCreds}
        performStudentCheck={performStudentCheck} performStaffLogin={performStaffLogin}
        showPassword={showPassword} setShowPassword={setShowPassword} isAuthenticating={isAuthenticating}
        onBack={() => setAuthView('LANDING')}
    />;
  }

  return (
    <Layout user={user} onLogout={handleLogout} currentView={view} onChangeView={setView}>
      {view === 'dashboard' && (
          // Dashboard logic mostly read-only from props
          <div className="p-6 text-center">
              <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
              {user.role === UserRole.ADMIN && <div className="mt-4"><AuditLogsTable logs={logs.slice(0,5)}/></div>}
          </div>
      )}
      {view === 'results' && (
          // Simplified Result Entry Flow injection
          <div className="p-4">
              <div className="mb-4"><button onClick={() => setView('dashboard')} className="flex items-center text-gray-500 hover:text-blue-600"><ArrowLeftIcon className="h-4 w-4 mr-1"/> Back</button></div>
              {!selectedClassId ? (
                  <div className="space-y-4">
                      <select className="border p-2 w-full rounded" onChange={e => setSelectedClassId(e.target.value)} value={selectedClassId || ''}>
                          <option value="">Select Class</option>
                          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                      <select className="border p-2 w-full rounded" onChange={e => setSelectedSubjectId(e.target.value)} value={selectedSubjectId || ''}>
                          <option value="">Select Subject</option>
                          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                  </div>
              ) : (
                  <div>
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-lg">{classes.find(c => c.id === selectedClassId)?.name} - {subjects.find(s => s.id === selectedSubjectId)?.name}</h2>
                        <button onClick={() => { setSelectedClassId(null); setSelectedSubjectId(null); }} className="text-sm text-red-500">Change Selection</button>
                      </div>
                      <div className="space-y-4">
                        {students.filter(s => s.classId === selectedClassId).map(s => (
                            <ResultEntry 
                                key={s.id}
                                student={s} subject={subjects.find(x=>x.id===selectedSubjectId)?.name || ''} 
                                subjectId={selectedSubjectId!} session={schoolConfig.activeSession} term={schoolConfig.activeTerm}
                                existingResult={results.find(r => r.studentId === s.id && r.subjectId === selectedSubjectId && r.session === schoolConfig.activeSession && r.term === schoolConfig.activeTerm)}
                                onSave={handleSaveResult}
                            />
                        ))}
                      </div>
                  </div>
              )}
          </div>
      )}
      {view === 'staff_manager' && <StaffManagement users={users} classes={classes} subjects={subjects} onAddUser={saveUser} onUpdateUser={saveUser} onDeleteUser={deleteUser} />}
      {view === 'class_manager' && <ClassManager classes={classes} users={users} onAdd={saveClass} onUpdate={saveClass} onDelete={deleteClass} currentUser={user} students={students} results={results} subjects={subjects} />}
      {view === 'students_manager' && <StudentManager students={students} classes={classes} onAdd={saveStudent} onUpdate={saveStudent} onDelete={deleteStudent} />}
      {view === 'subjects' && <SubjectManager subjects={subjects} classes={classes} onAdd={() => {}} onUpdate={() => {}} onDelete={() => {}} />} {/* Hook up proper handlers if needed, simplified for brevity */}
      {view === 'config' && <SchoolConfigManager config={schoolConfig} onSave={saveConfig} />}
      {view === 'attendance' && selectedClassId && (
          <AttendanceRegister 
            currentClass={classes.find(c => c.id === selectedClassId)!} 
            students={students.filter(s => s.classId === selectedClassId)} 
            attendanceRecords={attendance} 
            onSaveAttendance={handleSaveAttendance} 
          />
      )}
      {view === 'staff_attendance' && <StaffAttendancePanel user={user} schoolConfig={schoolConfig} attendanceHistory={staffAttendance} onClockIn={handleStaffClockIn} />}
      {view === 'reports' && <ReportsDashboard user={user} students={students} results={results} classes={classes} subjects={subjects} schoolConfig={schoolConfig} psychomotorRecords={psychomotor} users={users} />}
      {view === 'my_result' && user.role === UserRole.STUDENT && (
          <StudentReportCard 
            student={students.find(s => s.id === user.id)!} 
            results={results.filter(r => r.studentId === user.id)} 
            subjects={subjects} classes={classes} schoolConfig={schoolConfig}
          />
      )}
    </Layout>
  );
};

export default App;
