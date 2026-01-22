
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
        className={`w-full flex items-center justify-start space-x-3 px-6 py-3 text-sm font-medium transition-all duration-150 group border-l-4 text-left ${
          isActive
            ? 'bg-blue-600/10 text-blue-400 border-blue-500' 
            : 'text-slate-400 hover:bg-slate-800/40 hover:text-white border-transparent'
        }`}
      >
        <Icon className={`h-5 w-5 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-white'}`} />
        <span className="font-display tracking-wide truncate">{label}</span>
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
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 shrink-0
      `}>
        {/* Header - School Name */}
        <div className="p-6 flex justify-between items-center border-b border-slate-800/50 shrink-0 bg-slate-950/20">
          <div className="overflow-hidden">
            <h1 className="text-lg font-black font-display text-white tracking-tight leading-none uppercase truncate">{SCHOOL_NAME}</h1>
            <div className="flex items-center gap-2 mt-1.5">
                <span className="h-1 w-1 rounded-full bg-blue-500 animate-pulse"></span>
                <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Portal v2.0</p>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white p-1">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-6 space-y-1 scroll-container scrollbar-hide">
          <NavItem view="dashboard" icon={HomeIcon} label="Dashboard" />

          {/* Teacher & Staff Shared */}
          {(user.role === UserRole.TEACHER || user.role === UserRole.FORM_MASTER || user.role === UserRole.ADMIN || user.role === UserRole.PRINCIPAL) && (
            <>
               <NavItem view="results" icon={AcademicCapIcon} label="Result Entry" />
               <NavItem view="staff_attendance" icon={MapPinIcon} label="My Attendance" />
            </>
          )}

          {/* Form Master Specific */}
          {(user.role === UserRole.FORM_MASTER || user.role === UserRole.ADMIN) && (
             <>
               <div className="mt-6 mb-2 px-6 text-[10px] font-black uppercase text-slate-600 tracking-widest">Classroom</div>
               <NavItem view="attendance" icon={CalendarDaysIcon} label="Class Attendance" />
               <NavItem view="class_manager" icon={UserGroupIcon} label="My Class" />
               <NavItem view="psychomotor" icon={SparklesIcon} label="Psychomotor" />
               <NavItem view="fm_review" icon={PencilSquareIcon} label="Student Review" />
             </>
          )}

           {/* Principal & Admin Specific */}
          {(user.role === UserRole.PRINCIPAL || user.role === UserRole.ADMIN) && (
             <>
                <div className="mt-6 mb-2 px-6 text-[10px] font-black uppercase text-slate-600 tracking-widest">Management</div>
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
              <div className="mt-6 mb-2 px-6 text-[10px] font-black uppercase text-slate-600 tracking-widest">System Admin</div>
              <NavItem view="config" icon={Cog6ToothIcon} label="Configuration" />
              <NavItem view="admin_attendance" icon={ClockIcon} label="Staff Logs" />
              <NavItem view="promotions" icon={ArrowTrendingUpIcon} label="Promotions" />
              <NavItem view="staff_manager" icon={UsersIcon} label="Staff & Users" />
              <NavItem view="subjects" icon={BookOpenIcon} label="Subjects/Classes" />
              <NavItem view="students_manager" icon={UserGroupIcon} label="Students List" />
              <NavItem view="pins" icon={KeyIcon} label="PIN Manager" />
              <NavItem view="audit" icon={ClipboardDocumentCheckIcon} label="System Audit" />
             </>
          )}

          {/* Student Specific */}
          {user.role === UserRole.STUDENT && (
            <NavItem view="my_result" icon={ChartBarIcon} label="My Results" />
          )}
        </div>
        
        {/* Simple Sidebar Footer */}
        <div className="p-4 border-t border-slate-800/30 text-[10px] text-slate-600 font-medium">
            &copy; {new Date().getFullYear()} JMA Digital
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Header - Desktop Top Bar & Mobile Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-8 shrink-0 z-30">
           <div className="flex items-center space-x-3 md:hidden">
             <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600 p-2 -ml-2 rounded-lg active:bg-slate-100">
               <Bars3Icon className="h-6 w-6" />
             </button>
             <h1 className="text-base font-bold font-display text-slate-800 truncate">{SCHOOL_NAME}</h1>
           </div>

           {/* Desktop Breadcrumb/Title */}
           <div className="hidden md:block">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                 {currentView.replace(/_/g, ' ')}
              </h2>
           </div>

           {/* Global Actions/User Profile */}
           <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end border-r border-slate-200 pr-4 mr-2">
                 <span className="text-xs font-bold text-slate-900 leading-none mb-1">{user.name}</span>
                 <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{user.role.replace('_', ' ')}</span>
              </div>
              <div 
                className="h-10 w-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm border border-slate-200 cursor-pointer hover:bg-slate-200 transition-colors"
                onClick={() => setShowUserModal(true)}
              >
                 {user.name.charAt(0)}
              </div>
              <button 
                onClick={onLogout}
                className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Sign Out"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </button>
           </div>
        </header>

        {/* Scrollable Content Container */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 md:p-8 scroll-smooth scroll-container relative">
          <div className="max-w-7xl mx-auto space-y-6 pb-20 md:pb-10">
            {children}
          </div>
        </main>
      </div>

      {/* User Details Modal (Retained) */}
      {showUserModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white text-center relative">
               <button onClick={() => setShowUserModal(false)} className="absolute top-4 right-4 text-white/70 hover:text-white">
                  <XMarkIcon className="h-6 w-6" />
               </button>
               <div className="h-20 w-20 rounded-2xl bg-white text-blue-600 text-3xl font-bold flex items-center justify-center mx-auto mb-3 shadow-lg">
                  {user.name.charAt(0)}
               </div>
               <h2 className="text-xl font-bold font-display">{user.name}</h2>
               <p className="text-sm text-blue-100 opacity-90">{user.role.replace('_', ' ')}</p>
            </div>
            <div className="p-6 space-y-4">
               <div className="flex items-center justify-between py-2 border-b border-gray-50 text-sm">
                   <span className="font-bold text-slate-400 uppercase text-[10px]">Staff ID</span>
                   <span className="font-medium text-slate-700 font-mono">{user.id}</span>
               </div>
               <div className="flex items-center justify-between py-2 border-b border-gray-50 text-sm">
                   <span className="font-bold text-slate-400 uppercase text-[10px]">Email</span>
                   <span className="font-medium text-slate-700 truncate max-w-[200px]">{user.email}</span>
               </div>
               <div className="pt-2">
                   <button 
                     onClick={() => { setShowUserModal(false); onChangeView('config'); }}
                     className="w-full py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                   >
                     System Config
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
