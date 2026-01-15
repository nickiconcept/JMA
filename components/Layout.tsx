import React, { ReactNode } from 'react';
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
  ChartPieIcon
} from '@heroicons/react/24/outline';

interface LayoutProps {
  children: ReactNode;
  user: User | null;
  onLogout: () => void;
  currentView: string;
  onChangeView: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, currentView, onChangeView }) => {
  if (!user) return <>{children}</>;

  const NavItem = ({ view, icon: Icon, label }: { view: string, icon: any, label: string }) => (
    <button
      onClick={() => onChangeView(view)}
      className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-colors ${
        currentView === view 
          ? 'bg-green-800 text-white border-r-4 border-yellow-400' 
          : 'text-gray-300 hover:bg-green-800 hover:text-white'
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-green-900 text-white shadow-xl">
        <div className="p-6 border-b border-green-800">
          <h1 className="text-xl font-bold text-yellow-400 font-serif tracking-wide">{SCHOOL_NAME}</h1>
          <p className="text-xs text-green-200 mt-1">E-Result Portal</p>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <NavItem view="dashboard" icon={HomeIcon} label="Dashboard" />

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

          {/* Admin Only Management */}
          {user.role === UserRole.ADMIN && (
             <>
              <div className="mt-4 mb-2 px-4 text-xs uppercase text-green-400 font-bold tracking-wider">Administration</div>
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

        <div className="p-4 border-t border-green-800">
          <div className="flex items-center mb-4 space-x-2">
            <div className="h-8 w-8 rounded-full bg-yellow-400 flex items-center justify-center text-green-900 font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-green-300 truncate">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md text-sm transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-green-900 text-white p-4 flex justify-between items-center shadow-md">
           <h1 className="text-lg font-bold text-yellow-400">{SCHOOL_NAME}</h1>
           <button onClick={onLogout} className="text-white">
             <ArrowRightOnRectangleIcon className="h-6 w-6" />
           </button>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
