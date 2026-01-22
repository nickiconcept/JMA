
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

// --- Login Screen Component ---
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

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState('dashboard');
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  // Data States
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

  // Selection states
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

  // Auth/View states
  const [authView, setAuthView] = useState<'LANDING' | 'LOGIN'>('LANDING');
  const [loginTab, setLoginTab] = useState<'RESULT' | 'STAFF'>('RESULT');
  const [loginCreds, setLoginCreds] = useState({ email: '', password: '', admissionNo: '', pin: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
        setIsLoadingData(true);
        try {
            const [
                usersRes, studentsRes, classesRes, subjectsRes, 
                resultsRes, attendanceRes, pinsRes, configRes, 
                psychomotorRes, staffAttRes, logsRes, requestsRes
            ] = await Promise.all([
                supabase.from('profiles').select('*'),
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
            console.error("Error fetching data:", e);
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

  // Session Management
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

  // Auto-select class for Form Masters
  useEffect(() => {
    if (user?.role === UserRole.FORM_MASTER && user.assignedClassIds?.length === 1 && !selectedClassId) {
        setSelectedClassId(user.assignedClassIds[0]);
    }
  }, [user, selectedClassId]);

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
          const { data, error } = await supabase.rpc('auth_staff', {
            email_input: emailInput,
            password_input: passwordInput
          });
          if (data) {
              handleAuthSuccess(data as User);
              setIsAuthenticating(false);
              return;
          }
          const foundLocalUser = users.find(u => u.email.toLowerCase() === emailInput.toLowerCase());
          if (foundLocalUser && foundLocalUser.password === passwordInput) {
               handleAuthSuccess(foundLocalUser);
               setIsAuthenticating(false);
               return;
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
      const admissionInput = loginCreds.admissionNo.trim();
      const student = students.find(s => s.id === admissionInput);
      const pin = pins.find(p => p.code === loginCreds.pin.trim());

      if (!student) { alert("Invalid Admission Number."); setIsAuthenticating(false); return; }
      if (!pin) { alert("Invalid PIN."); setIsAuthenticating(false); return; }
      if (pin.assignedStudentId && pin.assignedStudentId !== student.id) { alert("PIN assigned to another student."); setIsAuthenticating(false); return; }
      if (pin.usageCount >= pin.maxUsage) { alert("PIN expired."); setIsAuthenticating(false); return; }

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
    let isLocked = isAdmin ? newResult.isLocked : true;

    const existing = results.find(r => r.id === newResult.id);
    if (existing && existing.isLocked && !isAdmin) {
        const permission = accessRequests.find(r => r.resourceId === existing.id && r.status === RequestStatus.APPROVED);
        if (permission) {
            isLocked = true;
            await supabase.from('access_requests').update({ status: RequestStatus.CONSUMED }).eq('id', permission.id);
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
    setResults(prev => {
        const idx = prev.findIndex(r => r.id === resultToSave.id);
        if (idx >= 0) { const u = [...prev]; u[idx] = resultToSave; return u; }
        return [...prev, resultToSave];
    });
    await supabase.from('results').upsert(resultToSave);
    addLog(user?.id || 'sys', user?.role || UserRole.TEACHER, 'UPDATE_RESULT', `Updated result for ${newResult.studentId}`);
  };

  const handleSaveAttendance = async (newRecords: Attendance[]) => {
      if (newRecords.length === 0) return;
      const { classId, date } = newRecords[0];
      const combined = [...attendance.filter(a => !(a.classId === classId && a.date === date)), ...newRecords];
      setAttendance(combined);
      await supabase.from('attendance').delete().eq('classId', classId).eq('date', date);
      await supabase.from('attendance').insert(newRecords);
      addLog(user?.id || 'sys', user?.role || UserRole.FORM_MASTER, 'MARK_ATTENDANCE', `Marked attendance for ${newRecords.length} students`);
      alert("Attendance Saved!");
  };

  const saveUser = async (u: User) => {
      const { password, ...rest } = u;
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
  const saveSubject = async (s: Subject) => {
      await supabase.from('subjects').upsert(s);
      setSubjects(prev => { const idx = prev.findIndex(x => x.id === s.id); return idx >= 0 ? prev.map(x => x.id === s.id ? s : x) : [...prev, s]; });
  };
  const deleteSubject = async (id: string) => {
      await supabase.from('subjects').delete().eq('id', id);
      setSubjects(prev => prev.filter(x => x.id !== id));
  };
  const handleStaffClockIn = async (record: StaffAttendance) => {
      await supabase.from('staff_attendance').insert(record);
      setStaffAttendance(prev => [record, ...prev]);
      addLog(user!.id, user!.role, 'STAFF_ATTENDANCE', `Clocked in at ${record.time}`);
  };

  const handleSavePsychomotor = async (record: PsychomotorRecord) => {
      await supabase.from('psychomotor').upsert(record);
      setPsychomotor(prev => {
          const idx = prev.findIndex(r => r.id === record.id);
          return idx >= 0 ? prev.map(r => r.id === record.id ? record : r) : [...prev, record];
      });
      addLog(user!.id, user!.role, 'UPDATE_PSYCHOMOTOR', `Updated skills assessment for ${record.studentId}`);
  };

  // --- Views ---
  
  if (isLoadingData) {
      return <div className="h-screen flex items-center justify-center text-blue-600 font-bold">Loading Portal Data...</div>;
  }

  if (!user) {
    if (authView === 'LANDING') return <LandingPage onNavigate={(type) => { setLoginTab(type); setAuthView('LOGIN'); }} />;
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
          <div className="p-6 text-center">
              <h1 className="text-2xl font-bold font-display">Welcome, {user.name}</h1>
              {user.role === UserRole.ADMIN && <div className="mt-8"><AuditLogsTable logs={logs.slice(0,5)}/></div>}
          </div>
      )}
      {view === 'results' && (
          <div className="p-4">
              <div className="mb-4"><button onClick={() => setView('dashboard')} className="flex items-center text-gray-500 hover:text-blue-600"><ArrowLeftIcon className="h-4 w-4 mr-1"/> Back</button></div>
              {!selectedClassId ? (
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md mx-auto space-y-4">
                      <h2 className="text-xl font-bold mb-2">Select Context</h2>
                      <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" onChange={e => setSelectedClassId(e.target.value)} value={selectedClassId || ''}>
                          <option value="">Select Class</option>
                          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                      <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" onChange={e => setSelectedSubjectId(e.target.value)} value={selectedSubjectId || ''}>
                          <option value="">Select Subject</option>
                          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                  </div>
              ) : (
                  <div>
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="font-bold text-lg font-display text-slate-800">{classes.find(c => c.id === selectedClassId)?.name} - {subjects.find(s => s.id === selectedSubjectId)?.name}</h2>
                        <button onClick={() => { setSelectedClassId(null); setSelectedSubjectId(null); }} className="text-sm font-bold text-blue-600 hover:underline">Change Selection</button>
                      </div>
                      <div className="space-y-6">
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
      {view === 'attendance' && (
          <div className="p-4">
              {!selectedClassId ? (
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md mx-auto">
                      <h2 className="text-xl font-bold mb-4 font-display">Select Class for Attendance</h2>
                      <select 
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                          onChange={e => setSelectedClassId(e.target.value)} 
                          value={selectedClassId || ''}
                      >
                          <option value="">-- Choose Class --</option>
                          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                  </div>
              ) : (
                  <>
                      <div className="mb-4 flex justify-between items-center">
                          <button onClick={() => setSelectedClassId(null)} className="flex items-center text-sm font-bold text-blue-600 hover:underline">
                              ← Change Class
                          </button>
                          <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">{classes.find(c => c.id === selectedClassId)?.name}</span>
                      </div>
                      <AttendanceRegister 
                          currentClass={classes.find(c => c.id === selectedClassId)!} 
                          students={students.filter(s => s.classId === selectedClassId)} 
                          attendanceRecords={attendance} 
                          onSaveAttendance={handleSaveAttendance} 
                          currentUserRole={user.role}
                      />
                  </>
              )}
          </div>
      )}
      {view === 'psychomotor' && (
          <PsychomotorManager 
            students={students} 
            classes={classes} 
            records={psychomotor} 
            onSave={handleSavePsychomotor} 
            userRole={user.role} 
            assignedClassIds={user.assignedClassIds} 
            config={schoolConfig} 
            onUpdateConfig={saveConfig} 
          />
      )}
      {view === 'staff_manager' && <StaffManagement users={users} classes={classes} subjects={subjects} onAddUser={saveUser} onUpdateUser={saveUser} onDeleteUser={deleteUser} />}
      {view === 'class_manager' && <ClassManager classes={classes} users={users} onAdd={saveClass} onUpdate={saveClass} onDelete={deleteClass} currentUser={user} students={students} results={results} subjects={subjects} />}
      {view === 'students_manager' && <StudentManager students={students} classes={classes} onAdd={saveStudent} onUpdate={saveStudent} onDelete={deleteStudent} schoolConfig={schoolConfig} />}
      {view === 'subjects' && <SubjectManager subjects={subjects} classes={classes} onAdd={saveSubject} onUpdate={saveSubject} onDelete={deleteSubject} />} 
      {view === 'config' && <SchoolConfigManager config={schoolConfig} onSave={saveConfig} />}
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
