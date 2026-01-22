
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

import { User, UserRole, Result, Student, AuditLog, ClassDefinition, Subject, Attendance, Pin, SchoolConfig, PsychomotorRecord, Term, AccessRequest, RequestStatus, RequestType, StaffAttendance, PromotionStatus } from './types';
import { mockUsers, mockSchoolConfig, mockStudents, mockClasses, mockSubjects, mockResults, mockPins, mockPsychomotor } from './services/mockData';
import { UserCircleIcon, AcademicCapIcon, EyeIcon, EyeSlashIcon, ArrowLeftIcon, CalendarDaysIcon } from '@heroicons/react/24/solid';
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

            if (usersRes.data) setUsers(usersRes.data as User[]);
            if (studentsRes.data) setStudents(studentsRes.data);
            if (classesRes.data) setClasses(classesRes.data);
            if (subjectsRes.data) setSubjects(subjectsRes.data);
            if (resultsRes.data) setResults(resultsRes.data);
            if (pinsRes.data) setPins(pinsRes.data);
            if (attendanceRes.data) setAttendance(attendanceRes.data);
            if (configRes.data && configRes.data.data) setSchoolConfig(configRes.data.data);
            if (psychomotorRes.data) setPsychomotor(psychomotorRes.data);
            if (staffAttRes.data) setStaffAttendance(staffAttRes.data);
            if (logsRes.data) setLogs(logsRes.data);
            if (requestsRes.data) setAccessRequests(requestsRes.data);

        } catch (e) {
            console.error("Critical database fetch failure, reverting to mocks", e);
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
        } catch(e) { console.error("Session restoration error", e); }
    }
  }, []);

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
    try {
        await supabase.from('audit_logs').insert(newLog);
    } catch (err) {
        console.error("Logging failed", err);
    }
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
          const { data } = await supabase.rpc('auth_staff', {
            email_input: emailInput,
            password_input: passwordInput
          });
          if (data) {
              handleAuthSuccess(data as User);
              return;
          }
          const foundLocalUser = users.find(u => u.email.toLowerCase() === emailInput.toLowerCase());
          if (foundLocalUser && foundLocalUser.password === passwordInput) {
               handleAuthSuccess(foundLocalUser);
               return;
          }
          alert("Unauthorized access. Invalid credentials.");
      } catch (err) {
          console.error("Auth Failure", err);
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
     setView('dashboard'); 
     setAuthView('LANDING');
  };

  const handleSaveResult = async (newResult: Result) => {
    const isAdmin = user?.role === UserRole.ADMIN;
    let isLocked = isAdmin ? newResult.isLocked : true;

    const resultToSave = { ...newResult, isLocked };
    setResults(prev => {
        const idx = prev.findIndex(r => r.id === resultToSave.id);
        if (idx >= 0) { const u = [...prev]; u[idx] = resultToSave; return u; }
        return [...prev, resultToSave];
    });
    await supabase.from('results').upsert(resultToSave);
  };

  const handleSaveAttendance = async (newRecords: Attendance[]) => {
      if (newRecords.length === 0) return;
      const { classId, date } = newRecords[0];
      const combined = [...attendance.filter(a => !(a.classId === classId && a.date === date)), ...newRecords];
      setAttendance(combined);
      await supabase.from('attendance').delete().eq('classId', classId).eq('date', date);
      await supabase.from('attendance').insert(newRecords);
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
  const saveSubject = async (s: Subject) => {
      await supabase.from('subjects').upsert(s);
      setSubjects(prev => { const idx = prev.findIndex(x => x.id === s.id); return idx >= 0 ? prev.map(x => x.id === s.id ? s : x) : [...prev, s]; });
  };
  const deleteSubject = async (id: string) => {
      await supabase.from('subjects').delete().eq('id', id);
      setSubjects(prev => prev.filter(x => x.id !== id));
  };
  const saveConfig = async (cfg: SchoolConfig) => {
      await supabase.from('school_config').upsert({ id: 1, data: cfg });
      setSchoolConfig(cfg);
  };
  const handleStaffClockIn = async (record: StaffAttendance) => {
      await supabase.from('staff_attendance').insert(record);
      setStaffAttendance(prev => [record, ...prev]);
  };

  const handleSavePsychomotor = async (record: PsychomotorRecord) => {
      await supabase.from('psychomotor').upsert(record);
      setPsychomotor(prev => {
          const idx = prev.findIndex(r => r.id === record.id);
          return idx >= 0 ? prev.map(r => r.id === record.id ? record : r) : [...prev, record];
      });
  };

  const handlePromoteStudentsBatch = async (updates: { studentId: string; newClassId: string; status: PromotionStatus }[]) => {
      const updatedStudents = students.map(s => {
          const up = updates.find(u => u.studentId === s.id);
          return up ? { ...s, classId: up.newClassId, promotionStatus: up.status } : s;
      });
      setStudents(updatedStudents);
      for (const up of updates) {
          try {
            await supabase.from('students').update({ classId: up.newClassId, promotionStatus: up.status }).eq('id', up.studentId);
          } catch (err) {
            console.error("Batch promotion failed for", up.studentId, err);
          }
      }
      alert("Promotions processed.");
  };

  const handleGeneratePins = async (classId: string, amountPerStudent: number) => {
      const classStudents = students.filter(s => s.classId === classId);
      const newPins: Pin[] = [];
      const expiry = new Date(new Date().getFullYear() + 1, 11, 31).toISOString().split('T')[0];
      classStudents.forEach(s => {
          for(let i=0; i<amountPerStudent; i++) {
              const code = Array(3).fill(0).map(() => Math.floor(1000 + Math.random() * 9000)).join('-');
              newPins.push({ code, usageCount: 0, maxUsage: 5, generatedBy: user!.id, expiryDate: expiry, isUsed: false, assignedStudentId: s.id });
          }
      });
      await supabase.from('pins').insert(newPins);
      setPins(prev => [...prev, ...newPins]);
  };

  const handleAssignPin = async (code: string, studentId: string) => {
      await supabase.from('pins').update({ assignedStudentId: studentId }).eq('code', code);
      setPins(prev => prev.map(p => p.code === code ? { ...p, assignedStudentId: studentId } : p));
  };

  const handleSaveGeneralRemark = async (studentId: string, remark: string) => {
      const field = user?.role === UserRole.PRINCIPAL ? 'principalRemark' : 'formMasterRemark';
      const termResults = results.filter(r => r.studentId === studentId && r.session === schoolConfig.activeSession && r.term === schoolConfig.activeTerm);
      if (termResults.length === 0) {
          alert("No terminal results found to apply remark.");
          return;
      }
      const updated = termResults.map(r => ({ ...r, [field]: remark }));
      setResults(prev => {
          const rest = prev.filter(r => !updated.find(u => u.id === r.id));
          return [...rest, ...updated];
      });
      for (const r of updated) await supabase.from('results').upsert(r);
  };

  // --- Views ---
  
  if (isLoadingData) {
      return (
        <div className="h-screen flex flex-col items-center justify-center bg-slate-900 text-white space-y-4">
            <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent animate-spin rounded-full"></div>
            <p className="font-black text-xs uppercase tracking-widest animate-pulse">Initializing Digital Grid...</p>
        </div>
      );
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-700">
              <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-center">
                  <h1 className="text-4xl font-black font-display text-slate-900 leading-[1.1]">System Access:<br/><span className="text-blue-600">{user.name}</span></h1>
                  <p className="text-slate-400 mt-4 font-bold uppercase tracking-widest text-xs">Environment: {schoolConfig.activeSession} • {schoolConfig.activeTerm}</p>
              </div>
              {user.role === UserRole.ADMIN && (
                  <div className="md:col-span-2"><AuditLogsTable logs={logs.slice(0, 10)} /></div>
              )}
          </div>
      )}

      {view === 'results' && (
          <div className="space-y-6">
              {!selectedClassId ? (
                  <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 max-w-xl mx-auto text-center">
                      <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                          <AcademicCapIcon className="h-8 w-8" />
                      </div>
                      <h2 className="text-xl font-black font-display mb-6 uppercase tracking-wider text-slate-900">Academic Entry Point</h2>
                      <div className="space-y-4">
                        <select className="w-full px-6 py-4 rounded-2xl border border-slate-200 font-black text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" onChange={e => setSelectedClassId(e.target.value)} value={selectedClassId || ''}>
                            <option value="">-- Targeted Class --</option>
                            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <select className="w-full px-6 py-4 rounded-2xl border border-slate-200 font-black text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" onChange={e => setSelectedSubjectId(e.target.value)} value={selectedSubjectId || ''}>
                            <option value="">-- Targeted Subject --</option>
                            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </div>
                  </div>
              ) : (
                  <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
                      <div className="flex justify-between items-center bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <h2 className="font-black text-xl font-display text-slate-900 uppercase tracking-widest">{classes.find(c => c.id === selectedClassId)?.name} // {subjects.find(s => s.id === selectedSubjectId)?.name}</h2>
                        <button onClick={() => { setSelectedClassId(null); setSelectedSubjectId(null); }} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-800 transition-colors">Switch Context</button>
                      </div>
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {students.filter(s => s.classId === selectedClassId).map(s => (
                            <ResultEntry 
                                key={s.id} student={s} subject={subjects.find(x=>x.id===selectedSubjectId)?.name || ''} 
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
                  <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 max-w-xl mx-auto text-center">
                      <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                          <CalendarDaysIcon className="h-8 w-8" />
                      </div>
                      <h2 className="text-xl font-black font-display mb-6 uppercase tracking-wider text-slate-900">Attendance Log</h2>
                      <select className="w-full px-6 py-4 rounded-2xl border border-slate-200 font-black text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all" onChange={e => setSelectedClassId(e.target.value)} value={selectedClassId || ''}>
                          <option value="">-- Targeting Class --</option>
                          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                  </div>
              ) : (
                  <>
                      <div className="mb-8 flex justify-between items-center bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                          <button onClick={() => setSelectedClassId(null)} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">← Context Switch</button>
                          <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{classes.find(c => c.id === selectedClassId)?.name}</span>
                      </div>
                      <AttendanceRegister currentClass={classes.find(c => c.id === selectedClassId)!} students={students.filter(s => s.classId === selectedClassId)} attendanceRecords={attendance} onSaveAttendance={handleSaveAttendance} currentUserRole={user.role} />
                  </>
              )}
          </div>
      )}

      {view === 'insights' && <Insights results={results} students={students} classes={classes} />}
      {view === 'approvals' && <ResultApproval user={user} results={results} students={students} classes={classes} subjects={subjects} onUpdateResult={handleSaveResult} />}
      {view === 'principal_review' && <StudentResultReview students={students} results={results} classes={classes} subjects={subjects} userRole={UserRole.PRINCIPAL} onSaveRemark={handleSaveGeneralRemark} />}
      {view === 'fm_review' && <StudentResultReview students={students} results={results} classes={classes} subjects={subjects} userRole={UserRole.FORM_MASTER} onSaveRemark={handleSaveGeneralRemark} assignedClassIds={user.assignedClassIds} />}
      {view === 'admin_attendance' && <AdminStaffAttendance users={users} attendanceRecords={staffAttendance} />}
      {view === 'promotions' && <PromotionManager students={students} classes={classes} results={results} onPromoteStudents={handlePromoteStudentsBatch} />}
      {view === 'pins' && <PinManager pins={pins} classes={classes} students={students} onGenerateForClass={handleGeneratePins} onAssignStudent={handleAssignPin} />}
      {view === 'audit' && <AuditLogsTable logs={logs} />}
      {view === 'staff_manager' && <StaffManagement users={users} classes={classes} subjects={subjects} onAddUser={saveUser} onUpdateUser={saveUser} onDeleteUser={deleteUser} />}
      {view === 'class_manager' && <ClassManager classes={classes} users={users} onAdd={saveClass} onUpdate={saveClass} onDelete={deleteClass} currentUser={user} students={students} results={results} subjects={subjects} schoolConfig={schoolConfig} psychomotorRecords={psychomotor} />}
      {view === 'students_manager' && <StudentManager students={students} classes={classes} onAdd={saveStudent} onUpdate={saveStudent} onDelete={deleteStudent} schoolConfig={schoolConfig} />}
      {view === 'subjects' && <SubjectManager subjects={subjects} classes={classes} onAdd={saveSubject} onUpdate={saveSubject} onDelete={deleteSubject} />} 
      {view === 'config' && <SchoolConfigManager config={schoolConfig} onSave={saveConfig} />}
      {view === 'staff_attendance' && <StaffAttendancePanel user={user} schoolConfig={schoolConfig} attendanceHistory={staffAttendance} onClockIn={handleStaffClockIn} />}
      {view === 'reports' && <ReportsDashboard user={user} students={students} results={results} classes={classes} subjects={subjects} schoolConfig={schoolConfig} psychomotorRecords={psychomotor} users={users} />}
      {view === 'psychomotor' && <PsychomotorManager students={students} classes={classes} records={psychomotor} onSave={handleSavePsychomotor} userRole={user.role} assignedClassIds={user.assignedClassIds} config={schoolConfig} onUpdateConfig={saveConfig} />}
      
      {view === 'my_result' && user.role === UserRole.STUDENT && (
          <StudentReportCard student={students.find(s => s.id === user.id)!} results={results.filter(r => r.studentId === user.id)} subjects={subjects} classes={classes} schoolConfig={schoolConfig} />
      )}
    </Layout>
  );
};

export default App;
