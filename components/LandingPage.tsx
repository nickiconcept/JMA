
import React from 'react';
import { AcademicCapIcon, UserGroupIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { SCHOOL_NAME } from '../constants';

interface LandingPageProps {
  onNavigate: (view: 'RESULT' | 'STAFF') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-100 py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md bg-white/80">
        <div className="flex items-center gap-3">
           <div className="h-10 w-10 bg-blue-600 text-white flex items-center justify-center rounded-xl font-black text-lg font-display shadow-lg shadow-blue-600/20">JM</div>
           <span className="font-bold text-slate-800 tracking-tight hidden md:block">{SCHOOL_NAME}</span>
        </div>
        <div className="flex gap-4">
           <button onClick={() => onNavigate('STAFF')} className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Staff Portal</button>
           <button onClick={() => onNavigate('RESULT')} className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95">Check Result</button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-20 relative overflow-hidden">
         {/* Background Elements */}
         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-50 to-white -z-10"></div>
         <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
         <div className="absolute top-40 -left-20 w-72 h-72 bg-purple-100 rounded-full blur-3xl opacity-50"></div>

         <div className="max-w-4xl mx-auto text-center z-10">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest mb-6 border border-blue-200">
                Official School Portal
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 font-display mb-6 tracking-tight leading-tight">
               Excellence in <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Knowledge & Character</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
               Welcome to the {SCHOOL_NAME} digital platform. Access student results, manage academic records, and track performance seamlessly.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto w-full">
                {/* Student Card */}
                <div 
                    onClick={() => onNavigate('RESULT')}
                    className="group bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:border-blue-500/30 transition-all cursor-pointer hover:-translate-y-1 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <AcademicCapIcon className="w-24 h-24 text-blue-600 transform rotate-12" />
                    </div>
                    <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform">
                        <AcademicCapIcon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 text-left">Student & Parents</h3>
                    <p className="text-slate-500 text-sm text-left mb-6">Check termly results, print report cards, and view performance analytics.</p>
                    <div className="flex items-center text-blue-600 font-bold text-sm group-hover:gap-2 transition-all">
                        Check Result <ArrowRightIcon className="w-4 h-4 ml-2" />
                    </div>
                </div>

                {/* Staff Card */}
                <div 
                    onClick={() => onNavigate('STAFF')}
                    className="group bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:border-purple-500/30 transition-all cursor-pointer hover:-translate-y-1 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <UserGroupIcon className="w-24 h-24 text-purple-600 transform rotate-12" />
                    </div>
                    <div className="bg-purple-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-purple-600 group-hover:scale-110 transition-transform">
                        <UserGroupIcon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 text-left">Staff & Admin</h3>
                    <p className="text-slate-500 text-sm text-left mb-6">Login to manage students, upload scores, take attendance, and more.</p>
                    <div className="flex items-center text-purple-600 font-bold text-sm group-hover:gap-2 transition-all">
                        Staff Login <ArrowRightIcon className="w-4 h-4 ml-2" />
                    </div>
                </div>
            </div>
         </div>
      </div>

      <footer className="bg-white border-t border-slate-100 py-8 text-center text-slate-400 text-sm">
         <p>&copy; {new Date().getFullYear()} {SCHOOL_NAME}. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
