
import React, { useState, useRef } from 'react';
import { SchoolConfig, Term } from '../types';
import Button from './Button';
import { PhotoIcon, CalendarDaysIcon, MapPinIcon } from '@heroicons/react/24/outline';

interface Props {
  config: SchoolConfig;
  onSave: (config: SchoolConfig) => void;
}

const SchoolConfigManager: React.FC<Props> = ({ config, onSave }) => {
  const [formData, setFormData] = useState<SchoolConfig>(config);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLayoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
        ...prev,
        reportCardLayout: {
            ...prev.reportCardLayout,
            [name]: value
        }
    }));
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

  const handleSetCurrentLocation = () => {
      setGpsLoading(true);
      if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition((position) => {
              setFormData(prev => ({
                  ...prev,
                  gpsCoordinates: {
                      lat: position.coords.latitude,
                      lng: position.coords.longitude
                  }
              }));
              setGpsLoading(false);
          }, (error) => {
              alert("Error getting location: " + error.message);
              setGpsLoading(false);
          }, { enableHighAccuracy: true });
      } else {
          alert("Geolocation not supported by this browser.");
          setGpsLoading(false);
      }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold font-display text-slate-900 mb-2">School & Term Configuration</h2>
        <p className="text-slate-500 text-sm mb-6">Manage the active academic session, term, and report card templates.</p>

        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-8">
          
          {/* Active Session & Term Control */}
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
             <div className="flex items-center gap-2 mb-4">
                 <CalendarDaysIcon className="h-6 w-6 text-blue-600" />
                 <h3 className="text-lg font-bold text-blue-900">Current Academic Context</h3>
             </div>
             <p className="text-sm text-blue-700 mb-4">
                 Changing these values will "Close" the current term/session. Teachers will only be able to enter results for the Active Session and Term selected here. Previous data will be archived for Admin view only.
             </p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-bold text-blue-800 mb-2">Active Session</label>
                    <select 
                        name="activeSession" 
                        value={formData.activeSession} 
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-xl border border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-white"
                    >
                        <option value="2023/2024">2023/2024</option>
                        <option value="2024/2025">2024/2025</option>
                        <option value="2025/2026">2025/2026</option>
                        <option value="2026/2027">2026/2027</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-blue-800 mb-2">Active Term</label>
                    <select 
                        name="activeTerm" 
                        value={formData.activeTerm} 
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-xl border border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-white"
                    >
                        <option value={Term.FIRST}>{Term.FIRST}</option>
                        <option value={Term.SECOND}>{Term.SECOND}</option>
                        <option value={Term.THIRD}>{Term.THIRD}</option>
                    </select>
                 </div>
             </div>
          </div>

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

          {/* Staff Attendance Geofencing */}
          <div className="border-t border-slate-100 pt-6">
              <div className="flex items-center gap-2 mb-4">
                 <MapPinIcon className="h-6 w-6 text-emerald-600" />
                 <h3 className="text-lg font-bold text-slate-800">Staff Attendance Geofencing</h3>
              </div>
              <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div>
                    <label className="block text-sm font-bold text-emerald-800 mb-2">Latitude</label>
                    <input 
                       type="number" step="any"
                       value={formData.gpsCoordinates?.lat || ''} 
                       onChange={e => setFormData(prev => ({...prev, gpsCoordinates: {...prev.gpsCoordinates!, lat: parseFloat(e.target.value) || 0}}))}
                       className="w-full px-4 py-2 rounded-xl border border-emerald-200 bg-white"
                       placeholder="e.g. 9.6833"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-emerald-800 mb-2">Longitude</label>
                    <input 
                       type="number" step="any"
                       value={formData.gpsCoordinates?.lng || ''} 
                       onChange={e => setFormData(prev => ({...prev, gpsCoordinates: {...prev.gpsCoordinates!, lng: parseFloat(e.target.value) || 0}}))}
                       className="w-full px-4 py-2 rounded-xl border border-emerald-200 bg-white"
                       placeholder="e.g. 7.7000"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-emerald-800 mb-2">Allowed Radius (Meters)</label>
                    <input 
                       type="number"
                       value={formData.allowedRadiusMeters || 200} 
                       onChange={e => setFormData(prev => ({...prev, allowedRadiusMeters: parseInt(e.target.value) || 0}))}
                       className="w-full px-4 py-2 rounded-xl border border-emerald-200 bg-white"
                    />
                 </div>
                 <div className="md:col-span-3 flex justify-start">
                     <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={handleSetCurrentLocation}
                        isLoading={gpsLoading}
                     >
                        📍 Set to Current Location
                     </Button>
                 </div>
              </div>
          </div>

          {/* Table Labels Configuration */}
          <div className="border-t border-slate-100 pt-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Result Table Labels</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Subject Column</label>
                      <input type="text" name="subjectLabel" value={formData.reportCardLayout?.subjectLabel || 'Subject'} onChange={handleLayoutChange} className="w-full border rounded p-2 text-sm"/>
                  </div>
                  <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">1st CA</label>
                      <input type="text" name="ca1Label" value={formData.reportCardLayout?.ca1Label || 'CA 1'} onChange={handleLayoutChange} className="w-full border rounded p-2 text-sm"/>
                  </div>
                  <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">2nd CA</label>
                      <input type="text" name="ca2Label" value={formData.reportCardLayout?.ca2Label || 'CA 2'} onChange={handleLayoutChange} className="w-full border rounded p-2 text-sm"/>
                  </div>
                  <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Assignment</label>
                      <input type="text" name="assignLabel" value={formData.reportCardLayout?.assignLabel || 'Assign'} onChange={handleLayoutChange} className="w-full border rounded p-2 text-sm"/>
                  </div>
                  <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Notes</label>
                      <input type="text" name="notesLabel" value={formData.reportCardLayout?.notesLabel || 'Notes'} onChange={handleLayoutChange} className="w-full border rounded p-2 text-sm"/>
                  </div>
                   <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Exam</label>
                      <input type="text" name="examLabel" value={formData.reportCardLayout?.examLabel || 'Exam'} onChange={handleLayoutChange} className="w-full border rounded p-2 text-sm"/>
                  </div>
                   <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Total</label>
                      <input type="text" name="totalLabel" value={formData.reportCardLayout?.totalLabel || 'Total'} onChange={handleLayoutChange} className="w-full border rounded p-2 text-sm"/>
                  </div>
                   <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Grade</label>
                      <input type="text" name="gradeLabel" value={formData.reportCardLayout?.gradeLabel || 'Grade'} onChange={handleLayoutChange} className="w-full border rounded p-2 text-sm"/>
                  </div>
                   <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Remark</label>
                      <input type="text" name="remarkLabel" value={formData.reportCardLayout?.remarkLabel || 'Remark'} onChange={handleLayoutChange} className="w-full border rounded p-2 text-sm"/>
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
