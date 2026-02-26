import { useState, useEffect } from 'react';
import api from '../utils/api';
import useAuthStore from '../store/authStore';
import { CalendarDays, Clock, Users, BookOpen, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function TeacherDashboard() {
    const { user } = useAuthStore();
    const [routines, setRoutines] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoutines = async () => {
            try {
                const res = await api.get('/routine/');
                setRoutines(res.data);
            } catch (err) {
                console.error("Failed to fetch routine", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRoutines();
    }, []);

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
    const todaysClasses = routines
        .filter(r => r.day_of_week === today)
        .sort((a, b) => a.start_time.localeCompare(b.start_time));

    if (loading) {
        return (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-indigo-500" />
                <p>Loading your schedule...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-3xl p-10 text-white shadow-lg overflow-hidden relative">
                <div className="relative z-10">
                    <h1 className="text-4xl font-black tracking-tight drop-shadow-md">Welcome back, Prof. {user?.last_name || 'Teacher'}</h1>
                    <p className="mt-2 text-indigo-100 font-medium text-lg">Here is your schedule overview for today.</p>
                </div>
                <BookOpen className="absolute -right-10 -bottom-10 w-64 h-64 text-indigo-500/20 rotate-12" />
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Classes Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden lg:col-span-2">
                    <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                        <div className="flex items-center gap-3">
                            <CalendarDays className="w-6 h-6 text-indigo-500" />
                            <h3 className="text-xl font-black text-gray-900">Today's Timetable</h3>
                        </div>
                        <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-black tracking-widest uppercase bg-indigo-100 text-indigo-800">
                            {todaysClasses.length} Sessions
                        </span>
                    </div>

                    {todaysClasses.length > 0 ? (
                        <ul className="divide-y divide-gray-50">
                            {todaysClasses.map((cls, idx) => (
                                <li key={cls.id} className="px-8 py-6 hover:bg-indigo-50/30 transition-colors flex items-center justify-between group">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black border border-indigo-100/50 group-hover:scale-110 transition-transform">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <p className="text-lg font-black text-gray-900 flex items-center gap-2">
                                                {cls.subject?.name || 'Class Subject'}
                                                <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded-md tracking-wider uppercase">
                                                    {cls.class_info?.name} - {cls.section?.name}
                                                </span>
                                            </p>
                                            <div className="flex items-center gap-4 text-xs font-bold text-gray-500 mt-2">
                                                <span className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md shadow-sm border border-gray-100">
                                                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                                                    {cls.start_time.substring(0, 5)} - {cls.end_time.substring(0, 5)}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Users className="w-3.5 h-3.5 text-blue-500" />
                                                    {cls.class_info?.name} ({cls.section?.name})
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="px-6 py-2.5 bg-white border-2 border-indigo-100 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 hover:border-indigo-200 transition-all text-sm shadow-sm active:scale-95">
                                        Take Attendance
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-16 text-center">
                            <CalendarDays className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium text-lg">You have no classes scheduled for today.</p>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col justify-center text-center space-y-6 lg:col-span-1">
                    <div className="mx-auto w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center text-indigo-600 rotate-3 shadow-inner">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-gray-900 mb-2">Upload Exam Results</h3>
                        <p className="text-sm text-gray-500 max-w-sm mx-auto font-medium leading-relaxed">
                            The Mid-Term examination results portal is currently open. Ensure all marks are entered by Friday to avoid delays.
                        </p>
                    </div>
                    <div>
                        <button className="w-full inline-flex justify-center items-center gap-2 px-6 py-4 text-sm font-black rounded-[1.5rem] tracking-wide text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-1 transition-all active:translate-y-0">
                            Open Results Portal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
