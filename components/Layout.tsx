
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
  ArrowTrendingUpIcon
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
    setIsSidebarOpen(false); // Close sidebar on mobile when item clicked
  };

  const NavItem = ({ view, icon: Icon, label }: { view: string, icon: any, label: string }) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => handleNavClick(view)}
        className={`w-full flex items-center space-x-3 px-6 py-3.5 text-sm font-medium transition-all duration-200 group ${
          isActive
            ? 'bg-white/10 text-accent-400 border-r-4 border-accent-400' 
            : 'text-primary-100 hover:bg-white/5 hover:text-white'
        }`}
      >
        <Icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${isActive ? 'text-accent-400' : 'text-primary-300'}`} />
        <span className="font-display tracking-wide">{label}</span>
      </button>
    );
  };

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-72 bg-gradient-to-b from-primary-900 to-primary-800 text-white shadow-2xl transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:flex md:flex-col
      `}>
        <div className="p-8 border-b border-white/10 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold font-display text-white tracking-tight leading-none">{SCHOOL_NAME}</h1>
            <div className="flex items-center gap-2 mt-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-400 animate-pulse"></span>
                <p className="text-xs font-medium text-primary-200 uppercase tracking-widest">Portal v2.0</p>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-primary-200 hover:text-white transition-colors">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 space-y-1">
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
             </>
          )}

           {/* Principal & Admin Specific */}
          {(user.role === UserRole.PRINCIPAL || user.role === UserRole.ADMIN) && (
             <>
                <NavItem view="insights" icon={ChartPieIcon} label="Insights & Analytics" />
                <NavItem view="approvals" icon={ClipboardDocumentCheckIcon} label="Result Approvals" />
             </>
          )}

          {/* Printing - Admin & Form Master */}
          {(user.role === UserRole.ADMIN || user.role === UserRole.FORM_MASTER) && (
              <NavItem view="print_results" icon={PrinterIcon} label="Print Results" />
          )}

          {/* Admin Only Management */}
          {user.role === UserRole.ADMIN && (
             <>
              <div className="mt-8 mb-3 px-6 text-xs font-bold uppercase text-primary-400 tracking-wider">Administration</div>
              <NavItem view="promotions" icon={ArrowTrendingUpIcon} label="Promotions" />
              <NavItem view="staff_manager" icon={UsersIcon} label="Staff & Users" />
              <NavItem view="students_manager" icon={UserGroupIcon} label="Student Database" />
              <NavItem view="subjects" icon={BookOpenIcon} label="Subjects & Classes" />
              <NavItem view="pins" icon={KeyIcon} label="PIN Management" />
              <NavItem view="audit" icon={ClipboardDocumentCheckIcon} label="Audit Logs" />
             </>
          )}

          {/* Student Specific */}
          {user.role === UserRole.STUDENT && (
            <NavItem view="my_result" icon={ChartBarIcon} label="My Report Card" />
          )}
        </div>

        <div className="p-6 border-t border-white/10 bg-primary-950/30">
          <div className="flex items-center mb-4 space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate font-display">{user.name}</p>
              <p className="text-xs text-primary-300 truncate font-medium">{user.role.replace('_', ' ')}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 bg-white/5 hover:bg-red-500/90 hover:text-white text-primary-100 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border border-white/5 hover:border-red-500/50"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full relative">
        {/* Mobile Header */}
        <header className="md:hidden bg-primary-900 text-white p-4 flex justify-between items-center shadow-lg z-10">
           <div className="flex items-center space-x-3">
             <button onClick={() => setIsSidebarOpen(true)} className="text-white hover:text-accent-400 transition-colors">
               <Bars3Icon className="h-6 w-6" />
             </button>
             <h1 className="text-lg font-bold font-display text-white truncate">{SCHOOL_NAME}</h1>
           </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-surface p-4 md:p-8 w-full scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
