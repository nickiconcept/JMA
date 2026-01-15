
import React, { useState, useRef } from 'react';
import { SchoolConfig } from '../types';
import Button from './Button';
import { PhotoIcon } from '@heroicons/react/24/outline';

interface Props {
  config: SchoolConfig;
  onSave: (config: SchoolConfig) => void;
}

const SchoolConfigManager: React.FC<Props> = ({ config, onSave }) => {
  const [formData, setFormData] = useState<SchoolConfig>(config);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'principalSignature') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold font-display text-slate-900 mb-2">Report Card Template</h2>
        <p className="text-slate-500 text-sm mb-6">Configure the headers, dates, and official signatures that appear on student result sheets.</p>

        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-8">
          
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">School Name</label>
                <input 
                   type="text" name="schoolName" required
                   value={formData.schoolName} onChange={handleInputChange}
                   className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                />
             </div>
             <div className="col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">School Address</label>
                <input 
                   type="text" name="address" required
                   value={formData.address} onChange={handleInputChange}
                   className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                />
             </div>
             <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Principal's Name</label>
                <input 
                   type="text" name="principalName" required
                   value={formData.principalName} onChange={handleInputChange}
                   className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                />
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Next Term Begins</label>
                  <input 
                    type="date" name="nextTermBegins" required
                    value={formData.nextTermBegins} onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm"
                  />
               </div>
               <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Next Term Ends</label>
                  <input 
                    type="date" name="nextTermEnds" required
                    value={formData.nextTermEnds} onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm"
                  />
               </div>
             </div>
          </div>

          {/* Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 pt-6">
             
             {/* Logo */}
             <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">School Logo</label>
                <div className="flex items-start gap-4">
                   <div className="h-24 w-24 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                      {formData.logo ? (
                        <img src={formData.logo} alt="Logo" className="w-full h-full object-contain" />
                      ) : (
                        <PhotoIcon className="h-8 w-8 text-slate-300" />
                      )}
                   </div>
                   <div>
                      <input 
                         type="file" accept="image/*" className="hidden" ref={logoInputRef}
                         onChange={(e) => handleFileChange(e, 'logo')}
                      />
                      <Button type="button" variant="outline" onClick={() => logoInputRef.current?.click()} className="text-xs">
                         Upload Logo
                      </Button>
                      <p className="text-xs text-slate-400 mt-2">Recommended: 200x200px PNG</p>
                   </div>
                </div>
             </div>

             {/* Signature */}
             <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Principal's Signature</label>
                <div className="flex items-start gap-4">
                   <div className="h-24 w-48 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden relative">
                      {formData.principalSignature ? (
                        <img src={formData.principalSignature} alt="Signature" className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-xs text-slate-400">No Signature</span>
                      )}
                      {formData.principalSignature && (
                          <button 
                             type="button" onClick={() => setFormData({...formData, principalSignature: undefined})}
                             className="absolute top-1 right-1 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200"
                          >
                             <span className="sr-only">Remove</span>
                             <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                          </button>
                      )}
                   </div>
                   <div>
                      <input 
                         type="file" accept="image/*" className="hidden" ref={signatureInputRef}
                         onChange={(e) => handleFileChange(e, 'principalSignature')}
                      />
                      <Button type="button" variant="outline" onClick={() => signatureInputRef.current?.click()} className="text-xs">
                         Upload Sig
                      </Button>
                      <p className="text-xs text-slate-400 mt-2">Transparent PNG recommended.</p>
                   </div>
                </div>
             </div>

          </div>

          <div className="flex justify-end pt-4">
             <Button type="submit" className="w-full md:w-auto">Save Configuration</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SchoolConfigManager;
