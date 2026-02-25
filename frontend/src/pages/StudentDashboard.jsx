import { useState, useEffect } from 'react';
import api from '../utils/api';
import useAuthStore from '../store/authStore';
import { BookOpen, GraduationCap, TrendingUp, Award, Calendar, Loader2, User as UserIcon } from 'lucide-react';

export default function StudentDashboard() {
    const { user } = useAuthStore();
    const [profile, setProfile] = useState(null);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStudentData();
    }, []);

    const fetchStudentData = async () => {
        setLoading(true);
        try {
            const [profileRes, resultsRes] = await Promise.all([
                api.get('/students/me'),
                api.get('/results/me')
            ]);
            setProfile(profileRes.data);
            setResults(resultsRes.data);
        } catch (err) {
            console.error("Failed to fetch student data", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-gray-400">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-500" />
                <p className="font-bold">Loading your student profile...</p>
            </div>
        );
    }

    const averageScore = results.length > 0
        ? (results.reduce((acc, curr) => acc + curr.marks_obtained, 0) / results.length).toFixed(1)
        : 0;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight text-gray-900 leading-tight">
                        Hello, {user?.first_name}! 👋
                    </h1>
                    <p className="text-lg text-gray-500 font-medium">
                        You're currently enrolled in <span className="text-indigo-600 font-bold">Section {profile?.section?.name || 'A'}</span>. Here's your academic summary.
                    </p>
                </div>
                <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-12 h-12 rounded-2xl bg-indigo-100 border-4 border-gray-50 flex items-center justify-center text-indigo-600 font-bold shadow-sm">
                            {user?.first_name[0]}
                        </div>
                    ))}
                    <div className="w-12 h-12 rounded-2xl bg-white border-4 border-gray-50 flex items-center justify-center text-gray-400 font-bold shadow-sm text-xs">
                        +12
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Score Card */}
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <p className="text-indigo-100 font-black text-xs uppercase tracking-widest opacity-80">Academic Average</p>
                            <div className="flex items-baseline gap-2 mt-2">
                                <h3 className="text-5xl font-black tracking-tighter">{averageScore}%</h3>
                                <div className="px-2 py-0.5 bg-emerald-400/20 backdrop-blur-md rounded-lg flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                                    <span className="text-[10px] font-black text-emerald-400">+2.1%</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                            <span className="text-xs font-bold text-indigo-100 uppercase tracking-widest">Global Rank: #14</span>
                            <Award className="w-6 h-6 text-indigo-300" />
                        </div>
                    </div>
                    {/* Background blob */}
                    <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors"></div>
                </div>

                {/* Info Card */}
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-indigo-100 transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Calendar</span>
                    </div>
                    <div className="mt-6">
                        <h4 className="text-lg font-black text-gray-900 tracking-tight">Final Examinations</h4>
                        <p className="text-sm text-gray-500 font-medium mt-1">Starting in <span className="text-rose-500 font-bold">12 days</span></p>
                    </div>
                    <div className="mt-6 flex gap-2">
                        {[1, 2, 3, 4].map(i => <div key={i} className="h-1 flex-1 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full bg-indigo-500 transition-all duration-1000 ${i <= 2 ? 'w-full' : 'w-0'}`}></div>
                        </div>)}
                    </div>
                </div>

                {/* Identity Card */}
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-indigo-100 transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                            <UserIcon className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Id Card</span>
                    </div>
                    <div className="mt-6">
                        <h4 className="text-lg font-black text-gray-900 tracking-tight">Roll: {profile?.roll_number || 'PENDING'}</h4>
                        <p className="text-sm text-gray-500 font-medium mt-1">Verified on <span className="text-gray-900 font-bold">{profile?.enrollment_date || 'N/A'}</span></p>
                    </div>
                    <button className="mt-6 w-full py-3 bg-gray-50 text-gray-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-colors">
                        View Digital ID
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Results Table */}
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <div className="px-10 py-8 border-b border-gray-50 bg-gray-50/20 flex items-center justify-between">
                        <h3 className="text-xl font-black text-gray-900 tracking-tighter">Recent Results</h3>
                        <BookOpen className="w-5 h-5 text-gray-400" />
                    </div>
                    {results.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-20 text-center text-gray-300">
                            <h4 className="font-bold">No results published yet.</h4>
                            <p className="text-sm">Check back after your mid-term exams!</p>
                        </div>
                    ) : (
                        <div className="p-4">
                            <div className="space-y-2">
                                {results.map((result) => (
                                    <div key={result.id} className="flex items-center justify-between px-8 py-5 rounded-2xl hover:bg-indigo-50/20 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-black text-xs">
                                                {result.subject_id}
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 leading-none mb-1">{result.exam_name}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Score: {result.marks_obtained}/{result.total_marks}</p>
                                            </div>
                                        </div>
                                        <div className={`px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${result.marks_obtained >= 80 ? 'bg-emerald-50 text-emerald-600' :
                                                result.marks_obtained >= 60 ? 'bg-amber-50 text-amber-600' :
                                                    'bg-rose-50 text-rose-600'
                                            }`}>
                                            {result.grade || (result.marks_obtained >= 80 ? 'EXCELLENT' : 'GOOD')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Additional Hub Content */}
                <div className="bg-gray-900 rounded-[2.5rem] shadow-2xl p-10 text-white flex flex-col justify-between relative overflow-hidden group">
                    <div className="relative z-10">
                        <h3 className="text-3xl font-black tracking-tight leading-tight">EduManage <br /> Student Hub</h3>
                        <p className="mt-4 text-gray-400 font-medium leading-relaxed">
                            Access your timetable, library resources, and school announcements all in one place.
                        </p>

                        <div className="mt-10 grid grid-cols-2 gap-4">
                            <div className="p-6 bg-white/5 rounded-[2rem] backdrop-blur-md border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                                <h5 className="font-black text-xs uppercase tracking-widest text-indigo-400">Library</h5>
                                <p className="mt-2 font-bold text-sm">2 Overdue Books</p>
                            </div>
                            <div className="p-6 bg-white/5 rounded-[2rem] backdrop-blur-md border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                                <h5 className="font-black text-xs uppercase tracking-widest text-emerald-400">Notices</h5>
                                <p className="mt-2 font-bold text-sm">4 New Updates</p>
                            </div>
                        </div>
                    </div>
                    {/* Background blob */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-colors"></div>
                </div>
            </div>
        </div>
    );
}
