
import React, { useState } from 'react';
import { User, SchoolConfig, StaffAttendance } from '../types';
import Button from './Button';
import { MapPinIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

interface Props {
  user: User;
  schoolConfig: SchoolConfig;
  attendanceHistory: StaffAttendance[];
  onClockIn: (record: StaffAttendance) => void;
}

const StaffAttendancePanel: React.FC<Props> = ({ user, schoolConfig, attendanceHistory, onClockIn }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecord = attendanceHistory.find(a => a.staffId === user.id && a.date === todayStr);

  // Haversine formula to calculate distance in meters
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180; // φ, λ in radians
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // in metres
  };

  const handleClockIn = () => {
    // strict check
    if (todayRecord) {
        setError("You have already clocked in for today.");
        return;
    }

    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
        setError("Geolocation is not supported by this browser.");
        setLoading(false);
        return;
    }

    if (!schoolConfig.gpsCoordinates) {
        setError("School GPS coordinates are not configured. Please contact Admin.");
        setLoading(false);
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            const distance = calculateDistance(
                latitude, 
                longitude, 
                schoolConfig.gpsCoordinates!.lat, 
                schoolConfig.gpsCoordinates!.lng
            );

            if (distance > schoolConfig.allowedRadiusMeters) {
                setError(`You are ${Math.round(distance)}m away from school. Must be within ${schoolConfig.allowedRadiusMeters}m.`);
                setLoading(false);
                return;
            }

            const now = new Date();
            const newRecord: StaffAttendance = {
                id: `sa-${Date.now()}`,
                staffId: user.id,
                date: todayStr,
                time: now.toLocaleTimeString('en-US', { hour12: true }),
                timestamp: now.toISOString(),
                coordinates: { lat: latitude, lng: longitude },
                distanceFromSchool: distance,
                status: 'PRESENT' // Logic for LATE could be added here based on time
            };

            onClockIn(newRecord);
            setLoading(false);
        },
        (err) => {
            let msg = "Unable to retrieve location.";
            if (err.code === 1) msg = "Location permission denied. Please allow access.";
            else if (err.code === 2) msg = "Position unavailable. Check GPS.";
            else if (err.code === 3) msg = "Location request timed out.";
            setError(msg);
            setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="space-y-6">
       <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
              <h2 className="text-2xl font-bold font-display text-slate-900">Staff Attendance</h2>
              <p className="text-slate-500 text-sm">Clock in daily using GPS verification.</p>
          </div>
          <div className="text-right">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Today's Date</p>
              <p className="text-lg font-bold text-slate-800">{new Date().toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Clock In Card */}
           <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center justify-center text-center">
               {todayRecord ? (
                   <div className="space-y-4">
                       <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                           <CheckCircleIcon className="h-12 w-12" />
                       </div>
                       <div>
                           <h3 className="text-xl font-bold text-slate-800">Attendance Marked</h3>
                           <p className="text-slate-500">You clocked in at <span className="font-bold text-slate-800">{todayRecord.time}</span></p>
                           <p className="text-xs text-slate-400 mt-2">Distance: {Math.round(todayRecord.distanceFromSchool)}m</p>
                       </div>
                   </div>
               ) : (
                   <div className="space-y-6 w-full max-w-xs">
                       <div className="h-20 w-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                           <MapPinIcon className="h-10 w-10 animate-bounce" />
                       </div>
                       <Button 
                          onClick={handleClockIn} 
                          isLoading={loading}
                          className="w-full py-4 text-lg shadow-xl shadow-blue-500/20"
                       >
                           Clock In Now
                       </Button>
                       {error && (
                           <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 flex items-start gap-2 text-left">
                               <XCircleIcon className="h-5 w-5 shrink-0 mt-0.5" />
                               <span>{error}</span>
                           </div>
                       )}
                       <p className="text-xs text-slate-400">
                           You must be within {schoolConfig.allowedRadiusMeters}m of the school premises.
                       </p>
                   </div>
               )}
           </div>

           {/* Stats / Recent History */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
               <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                   <ClockIcon className="h-5 w-5 text-slate-400" /> Recent History
               </h3>
               <div className="flex-1 overflow-y-auto">
                   {attendanceHistory.length === 0 ? (
                       <p className="text-slate-400 text-sm text-center py-10">No records found.</p>
                   ) : (
                       <ul className="divide-y divide-slate-100">
                           {attendanceHistory.slice(0, 5).map(record => (
                               <li key={record.id} className="py-3 flex justify-between items-center">
                                   <div>
                                       <p className="text-sm font-bold text-slate-700">{new Date(record.date).toLocaleDateString()}</p>
                                       <p className="text-xs text-slate-400">Distance: {Math.round(record.distanceFromSchool)}m</p>
                                   </div>
                                   <div className="text-right">
                                       <span className="block text-sm font-bold text-blue-600">{record.time}</span>
                                       <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-[10px] rounded-full font-bold">
                                           {record.status}
                                       </span>
                                   </div>
                               </li>
                           ))}
                       </ul>
                   )}
               </div>
               <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                   <p className="text-xs text-slate-500">Total Days Present: <span className="font-bold text-slate-800">{attendanceHistory.length}</span></p>
               </div>
           </div>
       </div>
    </div>
  );
};

export default StaffAttendancePanel;
