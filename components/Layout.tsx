
import React, { ReactNode, useState } from 'react';
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
  PencilSquareIcon
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
        className={`w-full flex items-center space-x-3 px-6 py-3.5 text-sm font-medium transition-all duration-200 group rounded-r-2xl mr-4 ${
          isActive
            ? 'bg-blue-600/10 text-blue-400 border-l-4 border-blue-500' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-white border-l-4 border-transparent'
        }`}
      >
        <Icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-white'}`} />
        <span className="font-display tracking-wide">{label}</span>
      </button>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white shadow-2xl transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:flex md:flex-col
      `}>
        <div className="p-8 flex justify-between items-center border-b border-slate-800/50">
          <div>
            <h1 className="text-xl font-black font-display text-white tracking-tight leading-none uppercase">{SCHOOL_NAME}</h1>
            <div className="flex items-center gap-2 mt-2">
                <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Portal v2.0</p>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white transition-colors">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 space-y-1 scroll-container">
          <NavItem view="dashboard" icon={HomeIcon} label="Overview" />

          {/* Teacher & Form Master & Admin - Result Entry */}
          {(user.role === UserRole.TEACHER || user.role === UserRole.FORM_MASTER || user.role === UserRole.ADMIN) && (
            <NavItem view="results" icon={AcademicCapIcon} label="Result Entry" />
          )}

          {/* Form Master Specific */}
          {(user.role === UserRole.FORM_MASTER || user.role === UserRole.ADMIN) && (
             <>
               <NavItem view="attendance" icon={CalendarDaysIcon} label="Attendance" />
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

          {/* Printing - Admin & Form Master */}
          {(user.role === UserRole.ADMIN || user.role === UserRole.FORM_MASTER) && (
              <NavItem view="print_results" icon={PrinterIcon} label="Print Results" />
          )}

          {/* Admin Only Management */}
          {user.role === UserRole.ADMIN && (
             <>
              <div className="mt-8 mb-2 px-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">Administration</div>
              <NavItem view="config" icon={Cog6ToothIcon} label="Portal Configuration" />
              <NavItem view="promotions" icon={ArrowTrendingUpIcon} label="Promotions" />
              <NavItem view="staff_manager" icon={UsersIcon} label="Staff & Users" />
              <NavItem view="students_manager" icon={UserGroupIcon} label="Students" />
              <NavItem view="subjects" icon={BookOpenIcon} label="Subjects & Classes" />
              <NavItem view="pins" icon={KeyIcon} label="PIN Manager" />
              <NavItem view="audit" icon={ClipboardDocumentCheckIcon} label="Audit Logs" />
             </>
          )}

          {/* Student Specific */}
          {user.role === UserRole.STUDENT && (
            <NavItem view="my_result" icon={ChartBarIcon} label="My Report Card" />
          )}
        </div>

        <div className="p-4 bg-slate-950/50 border-t border-slate-800">
          <div className="flex items-center mb-4 space-x-3 p-2">
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg ring-2 ring-blue-500/20">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate font-display">{user.name}</p>
              <p className="text-xs text-slate-400 truncate font-medium">{user.role.replace('_', ' ')}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-red-600/10 hover:text-red-500 text-slate-300 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all duration-200 border border-transparent hover:border-red-500/20"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full w-full relative">
        {/* Mobile Header */}
        <header className="md:hidden bg-white/80 backdrop-blur-md text-slate-800 p-4 flex justify-between items-center shadow-sm z-30 sticky top-0 border-b border-slate-200">
           <div className="flex items-center space-x-3">
             <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600 hover:text-blue-600 transition-colors p-1 rounded-lg hover:bg-slate-100">
               <Bars3Icon className="h-6 w-6" />
             </button>
             <h1 className="text-lg font-bold font-display text-slate-800 truncate max-w-[200px]">{SCHOOL_NAME}</h1>
           </div>
           <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
              {user.name.charAt(0)}
           </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 md:p-8 w-full scroll-smooth scroll-container">
          <div className="max-w-7xl mx-auto space-y-6 pb-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
