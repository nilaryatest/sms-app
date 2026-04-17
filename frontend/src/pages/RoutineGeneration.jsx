import { useState, useEffect } from 'react';
import api from '../utils/api';
import { CalendarPlus, Loader2, Save, Trash2, Clock } from 'lucide-react';

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

export default function RoutineGeneration() {
    const [sections, setSections] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Existing routine logic
    const [existingRoutines, setExistingRoutines] = useState([]);
    const [fetchingRoutines, setFetchingRoutines] = useState(false);

    // Form
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedDay, setSelectedDay] = useState('MONDAY');
    const [subjectId, setSubjectId] = useState('');
    const [teacherId, setTeacherId] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [roomNumber, setRoomNumber] = useState('');
    
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [secRes, subRes, teacherRes] = await Promise.all([
                    api.get('/academics/sections/'),
                    api.get('/academics/subjects/'),
                    api.get('/users/?role=TEACHER') // Ensure your backend supports this or just fetches users
                ]);
                setSections(secRes.data);
                setSubjects(subRes.data);
                
                // We'll extract only TEACHERS if the endpoint returns all
                const tData = teacherRes.data.filter ? teacherRes.data.filter(u => u.role === 'TEACHER') : [];
                setTeachers(tData);

            } catch (err) {
                console.error("Failed to fetch scheduling data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const handleFetchSectionRoutine = async () => {
        if (!selectedSection) return;
        setFetchingRoutines(true);
        try {
            const res = await api.get(`/routine/?section_id=${selectedSection}`);
            setExistingRoutines(res.data);
        } catch (err) {
            console.error("Failed to fetch section routines", err);
        } finally {
            setFetchingRoutines(false);
        }
    };

    // Auto-fetch when section changes
    useEffect(() => {
        handleFetchSectionRoutine();
    }, [selectedSection]);

    const handleAddRoutine = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        
        // Find class_id from section_id
        const sectionObj = sections.find(s => s.id === parseInt(selectedSection));
        
        try {
            await api.post('/routine/', {
                class_id: sectionObj ? sectionObj.class_id : 1, // Fallback purely for robustness
                section_id: parseInt(selectedSection),
                subject_id: parseInt(subjectId),
                teacher_id: parseInt(teacherId),
                day_of_week: selectedDay,
                start_time: startTime + ":00", // Append seconds for SQL Time
                end_time: endTime + ":00",
                room_number: roomNumber || "TBD"
            });
            
            // Clear time inputs
            setStartTime('');
            setEndTime('');
            setRoomNumber('');
            
            handleFetchSectionRoutine();
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to create routine entry. Conflict with teacher?");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteRoutine = async (id) => {
        if (!window.confirm("Are you sure you want to delete this schedule entry?")) return;
        try {
            await api.delete(`/routine/${id}`);
            handleFetchSectionRoutine();
        } catch (err) {
            alert("Failed to delete routine.");
        }
    };

    if (loading) {
        return <div className="p-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-500" /></div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <CalendarPlus className="w-8 h-8 text-indigo-500" />
                        Class Master Routine
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium">Schedule periods, assign teachers, and generate time tables.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                {/* Master Entry Form */}
                <div className="xl:col-span-1 bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm h-fit">
                    <h2 className="text-xl font-black text-gray-900 mb-6 border-b border-gray-50 pb-4">Schedule a Class</h2>

                    <div className="mb-6 pb-6 border-b border-gray-100">
                        <label className="block text-xs font-black text-indigo-500 uppercase tracking-widest mb-2">Target Section</label>
                        <select
                            className="w-full px-5 py-3 bg-indigo-50/50 border border-indigo-100 rounded-xl font-bold text-indigo-900 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer"
                            value={selectedSection}
                            onChange={(e) => setSelectedSection(e.target.value)}
                        >
                            <option value="">Choose Section...</option>
                            {sections.map(s => <option key={s.id} value={s.id}>Section {s.name}</option>)}
                        </select>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold border border-rose-100 uppercase tracking-widest">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleAddRoutine} className={`space-y-4 ${!selectedSection ? 'opacity-30 pointer-events-none' : ''}`}>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Day of Week</label>
                            <select
                                required
                                value={selectedDay}
                                onChange={e => setSelectedDay(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl font-bold text-gray-900 focus:ring-2 outline-none appearance-none"
                            >
                                {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Subject</label>
                                <select required value={subjectId} onChange={e => setSubjectId(e.target.value)} className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:ring-2 outline-none appearance-none">
                                    <option value="">Select...</option>
                                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Teacher</label>
                                <select required value={teacherId} onChange={e => setTeacherId(e.target.value)} className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:ring-2 outline-none appearance-none">
                                    <option value="">Select...</option>
                                    {teachers.map(t => <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Start Time</label>
                                <input type="time" required value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-black text-gray-900 outline-none" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">End Time</label>
                                <input type="time" required value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-black text-gray-900 outline-none" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Room # (Optional)</label>
                            <input type="text" value={roomNumber} onChange={e => setRoomNumber(e.target.value)} placeholder="E.g. 104A" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 outline-none" />
                        </div>

                        <button disabled={submitting} type="submit" className="w-full mt-4 py-4 bg-indigo-600 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Save Schedule
                        </button>
                    </form>
                </div>

                {/* Section Timetable Output */}
                <div className="xl:col-span-2">
                    {!selectedSection ? (
                        <div className="h-full bg-white border border-gray-100 border-dashed rounded-[2rem] p-20 flex flex-col items-center justify-center text-gray-400 opacity-60">
                            <CalendarPlus className="w-16 h-16 mb-4" />
                            <p className="font-bold uppercase tracking-widest">Select a section to view routine</p>
                        </div>
                    ) : fetchingRoutines ? (
                        <div className="h-full flex items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {DAYS.map(day => {
                                const dayRoutines = existingRoutines.filter(r => r.day_of_week === day);
                                if (dayRoutines.length === 0) return null;
                                return (
                                    <div key={day} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                                        <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                                            <h3 className="font-black text-gray-900 capitalize tracking-wide">{day.toLowerCase()}</h3>
                                            <span className="text-xs font-bold px-3 py-1 bg-white text-gray-500 rounded-full border border-gray-200">{dayRoutines.length} Periods</span>
                                        </div>
                                        <div className="p-4 space-y-3">
                                            {dayRoutines.map(r => {
                                                const subjName = subjects.find(s => s.id === r.subject_id)?.name || `Subj #${r.subject_id}`;
                                                const tName = teachers.find(t => t.id === r.teacher_id)?.first_name || `Teacher #${r.teacher_id}`;
                                                return (
                                                    <div key={r.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-gray-100 rounded-2xl hover:bg-gray-50/50 group transition-colors">
                                                        <div className="flex items-center gap-4">
                                                            <div className="bg-white border border-gray-100 px-3 py-2 rounded-xl flex items-center gap-2 font-black text-xs text-indigo-600 tracking-widest shadow-sm">
                                                                <Clock className="w-3 h-3" />
                                                                {r.start_time.substring(0,5)} - {r.end_time.substring(0,5)}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-black text-sm text-gray-900">{subjName}</h4>
                                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{tName} &bull; Room {r.room_number}</p>
                                                            </div>
                                                        </div>
                                                        <button 
                                                            onClick={() => handleDeleteRoutine(r.id)}
                                                            className="p-2 text-rose-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors md:opacity-0 md:group-hover:opacity-100"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                            {existingRoutines.length === 0 && (
                                <div className="bg-white border border-gray-100 rounded-[2rem] p-16 text-center text-gray-400 shadow-sm">
                                    <p className="font-bold">No classes scheduled yet for Section {selectedSection}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
