
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

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
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
        className={`w-full flex items-center justify-start space-x-3 px-6 py-4 text-sm font-semibold transition-all duration-200 group border-l-4 ${
          isActive
            ? 'bg-blue-600/10 text-blue-400 border-blue-500 shadow-inner' 
            : 'text-slate-400 hover:bg-slate-800/40 hover:text-white border-transparent'
        }`}
      >
        <Icon className={`h-5 w-5 shrink-0 transition-transform ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-white'}`} />
        <span className="font-display tracking-wide truncate">{label}</span>
      </button>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans" dir="ltr">
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Sidebar - Fixed/Relative mix for stability */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 shrink-0
      `}>
        <div className="p-6 flex justify-between items-center border-b border-slate-800/50 shrink-0 bg-slate-950/20">
          <div className="overflow-hidden">
            <h1 className="text-lg font-black font-display text-white tracking-tight uppercase truncate">{SCHOOL_NAME}</h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1 flex items-center gap-1">
                <span className="h-1 w-1 bg-emerald-500 rounded-full animate-pulse"></span> Security-Audit Ready
            </p>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white p-1">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Scrollable Nav - Optimized with explicit height container */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <NavItem view="dashboard" icon={HomeIcon} label="Dashboard" />

          {user.role !== UserRole.STUDENT && (
            <>
               <div className="mt-6 mb-2 px-6 text-[10px] font-black uppercase text-slate-600 tracking-widest">Teaching Tools</div>
               <NavItem view="results" icon={AcademicCapIcon} label="Result Entry" />
               <NavItem view="staff_attendance" icon={MapPinIcon} label="My Attendance" />
            </>
          )}

          {(user.role === UserRole.FORM_MASTER || user.role === UserRole.ADMIN) && (
             <>
               <div className="mt-6 mb-2 px-6 text-[10px] font-black uppercase text-slate-600 tracking-widest">Classroom</div>
               <NavItem view="attendance" icon={CalendarDaysIcon} label="Attendance" />
               <NavItem view="class_manager" icon={UserGroupIcon} label="My Class" />
               <NavItem view="psychomotor" icon={SparklesIcon} label="Psychomotor" />
               <NavItem view="fm_review" icon={PencilSquareIcon} label="Student Review" />
             </>
          )}

          {(user.role === UserRole.PRINCIPAL || user.role === UserRole.ADMIN) && (
             <>
                <div className="mt-6 mb-2 px-6 text-[10px] font-black uppercase text-slate-600 tracking-widest">Management</div>
                <NavItem view="insights" icon={ChartPieIcon} label="Analytics" />
                <NavItem view="approvals" icon={ClipboardDocumentCheckIcon} label="Approvals" />
                <NavItem view="principal_review" icon={PencilSquareIcon} label="Principal's Review" />
                <NavItem view="reports" icon={DocumentChartBarIcon} label="Broadsheets" />
             </>
          )}

          {user.role === UserRole.ADMIN && (
             <>
              <div className="mt-6 mb-2 px-6 text-[10px] font-black uppercase text-slate-600 tracking-widest">Admin Desk</div>
              <NavItem view="config" icon={Cog6ToothIcon} label="Settings" />
              <NavItem view="promotions" icon={ArrowTrendingUpIcon} label="Promotions" />
              <NavItem view="pins" icon={KeyIcon} label="PINs" />
              <NavItem view="staff_manager" icon={UsersIcon} label="Staff" />
              <NavItem view="subjects" icon={BookOpenIcon} label="Curriculum" />
              <NavItem view="students_manager" icon={UserGroupIcon} label="Students" />
              <NavItem view="admin_attendance" icon={ClockIcon} label="Staff Logs" />
              <NavItem view="audit" icon={ClipboardDocumentCheckIcon} label="Audit" />
             </>
          )}

          {user.role === UserRole.STUDENT && (
            <NavItem view="my_result" icon={ChartBarIcon} label="My Report Card" />
          )}
        </nav>
        
        <div className="p-4 border-t border-slate-800/30 text-[9px] text-slate-600 font-bold uppercase tracking-widest text-center">
            &copy; {new Date().getFullYear()} JMA Portal
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
        
        {/* Top Header - Fixed */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shrink-0 z-30 shadow-sm">
           <div className="flex items-center space-x-3 md:hidden">
             <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600 p-2 rounded-lg hover:bg-slate-100">
               <Bars3Icon className="h-6 w-6" />
             </button>
             <h1 className="text-sm font-black font-display text-slate-900 truncate uppercase">{SCHOOL_NAME}</h1>
           </div>

           <div className="hidden md:flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-blue-500 shadow-glow"></span>
              <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{currentView.replace(/_/g, ' ')}</h2>
           </div>

           <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end border-r border-slate-200 pr-4 mr-2">
                 <span className="text-xs font-black text-slate-900 leading-none mb-1">{user.name}</span>
                 <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{user.role.replace('_', ' ')}</span>
              </div>
              <div className="h-9 w-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-black text-xs border border-slate-200">
                 {user.name.charAt(0)}
              </div>
              <button 
                onClick={onLogout}
                className="flex items-center gap-2 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                title="Sign Out"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span className="text-[10px] font-black uppercase hidden lg:inline">Sign Out</span>
              </button>
           </div>
        </header>

        {/* Scrollable Content Container */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-10 scroll-smooth relative">
          <div className="max-w-7xl mx-auto pb-20">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
