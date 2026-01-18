
import React, { ReactNode, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { SCHOOL_NAME } from '../constants';
import { 
  HomeIcon, 
  UserGroupIcon, 
  AcademicCapIcon, 
  ClipboardDocumentCheckIcon, 
  KeyIcon, 
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  UsersIcon,
  BookOpenIcon,
  ChartPieIcon,
  PrinterIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowTrendingUpIcon,
  SparklesIcon,
  Cog6ToothIcon,
  PencilSquareIcon,
  MapPinIcon,
  ClockIcon,
  DocumentChartBarIcon
} from '@heroicons/react/24/outline';

interface LayoutProps {
  children: ReactNode;
  user: User | null;
  onLogout: () => void;
  currentView: string;
  onChangeView: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, currentView, onChangeView }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  if (!user) return <>{children}</>;

  const handleNavClick = (view: string) => {
    onChangeView(view);
    setIsSidebarOpen(false);
  };

  const NavItem = ({ view, icon: Icon, label }: { view: string, icon: any, label: string }) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => handleNavClick(view)}
        className={`w-full flex items-center justify-start space-x-3 px-6 py-3 text-sm font-medium transition-all duration-200 group border-l-4 text-left ${
          isActive
            ? 'bg-slate-800/50 text-blue-400 border-blue-500' 
            : 'text-slate-400 hover:bg-slate-800/30 hover:text-white border-transparent'
        }`}
      >
        <Icon className={`h-5 w-5 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-white'}`} />
        <span className="font-display tracking-wide">{label}</span>
      </button>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        {/* Header - School Name */}
        <div className="p-6 flex justify-between items-center border-b border-slate-800/50 shrink-0 bg-slate-950/20 text-left">
          <div>
            <h1 className="text-lg font-black font-display text-white tracking-tight leading-none uppercase">{SCHOOL_NAME}</h1>
            <div className="flex items-center gap-2 mt-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Portal v2.0</p>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white transition-colors p-1 bg-slate-800 rounded-md">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* User Profile Section (Moved to Top) */}
        <div className="px-6 py-6 border-b border-slate-800/50 bg-gradient-to-b from-slate-800/10 to-transparent shrink-0 text-left">
          <div 
            className="flex items-center gap-4 mb-5 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setShowUserModal(true)}
          >
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg ring-1 ring-white/10 relative shrink-0">
              {user.name.charAt(0)}
              <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate font-display tracking-wide">{user.name.split(' ')[0]}</p>
              <p className="text-[10px] text-slate-400 truncate font-medium uppercase tracking-wider">{user.role.replace('_', ' ')}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-800 hover:bg-red-500/10 hover:text-red-400 text-slate-400 rounded-xl text-xs font-bold uppercase tracking-wide transition-all duration-200 border border-slate-700/50 hover:border-red-500/20 group"
          >
            <span>Sign Out</span>
            <ArrowRightOnRectangleIcon className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity group-hover:translate-x-1" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4 space-y-1 scroll-container text-left">
          <NavItem view="dashboard" icon={HomeIcon} label="Overview" />

          {/* Teacher & Form Master & Admin - Result Entry */}
          {(user.role === UserRole.TEACHER || user.role === UserRole.FORM_MASTER || user.role === UserRole.ADMIN || user.role === UserRole.PRINCIPAL) && (
            <>
               <NavItem view="results" icon={AcademicCapIcon} label="Result Entry" />
               <NavItem view="staff_attendance" icon={MapPinIcon} label="My Attendance" />
            </>
          )}

          {/* Form Master Specific */}
          {(user.role === UserRole.FORM_MASTER || user.role === UserRole.ADMIN) && (
             <>
               <NavItem view="attendance" icon={CalendarDaysIcon} label="Class Attendance" />
               <NavItem view="class_manager" icon={UserGroupIcon} label="My Class" />
               <NavItem view="psychomotor" icon={SparklesIcon} label="Psychomotor Skills" />
               <NavItem view="fm_review" icon={PencilSquareIcon} label="Student Review" />
             </>
          )}

           {/* Principal & Admin Specific */}
          {(user.role === UserRole.PRINCIPAL || user.role === UserRole.ADMIN) && (
             <>
                <NavItem view="insights" icon={ChartPieIcon} label="Analytics" />
                <NavItem view="approvals" icon={ClipboardDocumentCheckIcon} label="Approvals" />
                <NavItem view="principal_review" icon={PencilSquareIcon} label="Principal's Review" />
             </>
          )}

          {/* Unified Reports Tab */}
          {(user.role === UserRole.ADMIN || user.role === UserRole.PRINCIPAL || user.role === UserRole.FORM_MASTER) && (
              <NavItem view="reports" icon={DocumentChartBarIcon} label="Reports Center" />
          )}

          {/* Admin Only Management */}
          {user.role === UserRole.ADMIN && (
             <>
              <div className="mt-6 mb-2 px-6 text-[10px] font-black uppercase text-slate-600 tracking-widest">Administration</div>
              <NavItem view="config" icon={Cog6ToothIcon} label="Portal Configuration" />
              <NavItem view="admin_attendance" icon={ClockIcon} label="Staff Attendance Log" />
              <NavItem view="promotions" icon={ArrowTrendingUpIcon} label="Promotions" />
              <NavItem view="staff_manager" icon={UsersIcon} label="Staff & Users" />
              <NavItem view="subjects" icon={BookOpenIcon} label="Subjects & Classes" />
              <NavItem view="students_manager" icon={UserGroupIcon} label="Students" />
              <NavItem view="pins" icon={KeyIcon} label="PIN Manager" />
              <NavItem view="audit" icon={ClipboardDocumentCheckIcon} label="Audit Logs" />
             </>
          )}

          {/* Student Specific */}
          {user.role === UserRole.STUDENT && (
            <NavItem view="my_result" icon={ChartBarIcon} label="My Report Card" />
          )}
        </div>
        
        {/* Footer info (Version/Copyright) */}
        <div className="p-4 text-center border-t border-slate-800/30 text-[10px] text-slate-600 font-medium text-left">
            &copy; {new Date().getFullYear()} JMA Portal
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full w-full relative">
        {/* Mobile Header */}
        <header className="md:hidden bg-white/90 backdrop-blur-md text-slate-800 p-4 flex justify-between items-center shadow-sm z-30 sticky top-0 border-b border-slate-200">
           <div className="flex items-center space-x-3">
             <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600 hover:text-blue-600 transition-colors p-2 -ml-2 rounded-lg active:bg-slate-100">
               <Bars3Icon className="h-6 w-6" />
             </button>
             <h1 className="text-lg font-bold font-display text-slate-800 truncate max-w-[200px]">{SCHOOL_NAME}</h1>
           </div>
           <div 
             className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm border border-blue-200"
             onClick={() => setShowUserModal(true)}
           >
              {user.name.charAt(0)}
           </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 md:p-8 w-full scroll-smooth scroll-container">
          <div className="max-w-7xl mx-auto space-y-6 pb-20 md:pb-10">
            {children}
          </div>
        </main>
      </div>

      {/* User Details Modal */}
      {showUserModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-center relative">
               <button 
                  onClick={() => setShowUserModal(false)}
                  className="absolute top-4 right-4 text-white/70 hover:text-white"
               >
                  <XMarkIcon className="h-6 w-6" />
               </button>
               <div className="h-20 w-20 rounded-2xl bg-white text-blue-600 text-3xl font-bold flex items-center justify-center mx-auto mb-3 shadow-lg">
                  {user.name.charAt(0)}
               </div>
               <h2 className="text-xl font-bold font-display">{user.name}</h2>
               <p className="text-sm text-blue-100 opacity-90">{user.role.replace('_', ' ')}</p>
            </div>
            <div className="p-6 space-y-4">
               <div className="flex items-center justify-between py-2 border-b border-gray-50">
                   <span className="text-xs font-bold uppercase text-slate-400">User ID</span>
                   <span className="text-sm font-medium text-slate-700 font-mono">{user.id}</span>
               </div>
               <div className="flex items-center justify-between py-2 border-b border-gray-50">
                   <span className="text-xs font-bold uppercase text-slate-400">Email</span>
                   <span className="text-sm font-medium text-slate-700 truncate max-w-[200px]">{user.email}</span>
               </div>
               <div className="flex items-center justify-between py-2 border-b border-gray-50">
                   <span className="text-xs font-bold uppercase text-slate-400">Status</span>
                   <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">Active</span>
               </div>
               <div className="pt-2">
                   <button 
                     onClick={() => { setShowUserModal(false); onChangeView('change_password'); }}
                     className="w-full py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                   >
                     Change Password
                   </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
