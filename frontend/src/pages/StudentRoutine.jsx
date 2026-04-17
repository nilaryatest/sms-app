import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Loader2, Calendar, Clock, BookOpen, User, CalendarX2 } from 'lucide-react';
import { format, parse } from 'date-fns';

const DAYS_OF_WEEK = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

export default function StudentRoutine() {
    const [routineData, setRoutineData] = useState([]);
    const [classData, setClassData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoutine = async () => {
            try {
                // Fetch student routine
                const res = await api.get('/routine/me');
                setRoutineData(res.data);
                
                // Note: since students might not have permission to fetch /users or /subjects
                // we'll try to fetch subjects if possible, otherwise we display IDs
                try {
                    const classRes = await api.get('/academics/subjects/');
                    setClassData(classRes.data);
                } catch (e) {
                    console.warn("Could not fetch subjects details", e);
                }
                
            } catch (error) {
                console.error("Failed to fetch routine", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRoutine();
    }, []);

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-gray-400">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-500" />
                <p className="font-bold text-gray-500">Loading your schedule...</p>
            </div>
        );
    }

    // Attempt to map subject ID to Name
    const getSubjectName = (id) => {
        const subject = classData.find(s => s.id === id);
        return subject ? subject.name : `Subject #${id}`;
    };

    // Format time (e.g., "10:30:00" -> "10:30 AM")
    const formatTime = (timeString) => {
        try {
            return format(parse(timeString, 'HH:mm:ss', new Date()), 'h:mm a');
        } catch {
            return timeString;
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight text-gray-900">My Routine</h1>
                    <p className="text-lg text-gray-500 font-medium">Your weekly class schedule and timings.</p>
                </div>
            </header>

            {routineData.length === 0 ? (
                <div className="p-16 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <CalendarX2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="font-bold text-xl text-gray-500 mb-2">No routine found</p>
                    <p className="text-gray-400">Your classes haven't been scheduled yet. Check back later!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {DAYS_OF_WEEK.map((day) => {
                        const dayRoutines = routineData.filter(r => r.day_of_week === day);
                        if (dayRoutines.length === 0) return null;

                        return (
                            <div key={day} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden transform transition-all hover:-translate-y-1 hover:shadow-md">
                                <div className="bg-indigo-50/50 p-6 flex items-center justify-between border-b border-indigo-100">
                                    <h3 className="text-xl font-black text-indigo-900 capitalize flex items-center gap-2">
                                        <Calendar className="w-6 h-6 text-indigo-500" />
                                        {day.toLowerCase()}
                                    </h3>
                                    <span className="text-xs font-bold px-3 py-1 bg-white text-indigo-600 rounded-full border border-indigo-200">
                                        {dayRoutines.length} Classes
                                    </span>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {dayRoutines.map((routine) => (
                                            <div key={routine.id} className="group flex flex-col gap-3 p-4 rounded-2xl bg-gray-50/80 border border-gray-100 hover:bg-white hover:border-indigo-100 hover:shadow-sm transition-all">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
                                                        <BookOpen className="w-5 h-5 text-indigo-400 group-hover:text-indigo-600 transition-colors" />
                                                        {getSubjectName(routine.subject_id)}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
                                                    <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-gray-100">
                                                        <Clock className="w-4 h-4 text-emerald-500" />
                                                        {formatTime(routine.start_time)} - {formatTime(routine.end_time)}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-gray-100">
                                                        <User className="w-4 h-4 text-blue-500" />
                                                        Teacher #{routine.teacher_id}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
