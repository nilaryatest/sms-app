import { useState, useEffect } from 'react';
import api from '../utils/api';
import { BookOpen, Award, GraduationCap, Loader2, Search, Filter } from 'lucide-react';

export default function StudentResults() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const res = await api.get('/results/me');
            setResults(res.data);
        } catch (err) {
            console.error("Failed to fetch results", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredResults = results.filter(r =>
        r.exam_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-gray-400">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-500" />
                <p className="font-bold uppercase tracking-widest text-xs">Accessing academic vault...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 border-l-4 border-indigo-600 pl-4 uppercase tracking-[0.2em] text-[0.8em]">Transcript</h1>
                    <h2 className="text-4xl font-black text-gray-900 mt-2 tracking-tighter">Academic Achievement</h2>
                </div>
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search examinations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 pr-6 py-3.5 bg-white border border-gray-100 rounded-2xl w-full md:w-80 font-bold text-gray-900 shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                    />
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Detailed Table */}
                <div className="lg:col-span-2 space-y-4">
                    {filteredResults.length === 0 ? (
                        <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 p-20 text-center flex flex-col items-center">
                            <BookOpen className="w-12 h-12 text-gray-200 mb-4" />
                            <h4 className="font-black text-gray-400">No results found</h4>
                            <p className="text-gray-300 text-sm font-medium mt-1">Try searching for a different term or check back later.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50/50 border-b border-gray-50">
                                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Examination</th>
                                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Score</th>
                                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Performance</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredResults.map((result) => (
                                            <tr key={result.id} className="group hover:bg-indigo-50/20 transition-all">
                                                <td className="px-8 py-6">
                                                    <p className="font-black text-gray-900">{result.exam_name}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Subject ID: {result.subject_id} • Published: {result.date_published}</p>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <span className="inline-block px-4 py-2 bg-gray-900 text-white rounded-xl font-black text-sm">
                                                        {result.marks_obtained}/{result.total_marks}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${result.marks_obtained >= 80 ? 'bg-emerald-50 text-emerald-600' :
                                                            result.marks_obtained >= 60 ? 'bg-amber-50 text-amber-600' :
                                                                'bg-rose-50 text-rose-600'
                                                        }`}>
                                                        {result.grade || (result.marks_obtained >= 80 ? 'DISTINCTION' : 'CREDIT')}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Performance Analytics Sidebar */}
                <div className="space-y-6">
                    <div className="bg-gray-900 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                        <div className="relative z-10">
                            <GraduationCap className="w-10 h-10 text-indigo-400 mb-6" />
                            <h3 className="text-2xl font-black tracking-tighter leading-tight">Academic <br /> Progress</h3>
                            <p className="mt-4 text-gray-400 text-sm font-medium leading-relaxed italic border-l-2 border-indigo-500 pl-4">
                                "Education is the most powerful weapon which you can use to change the world."
                            </p>

                            <div className="mt-10 space-y-4">
                                <div className="p-5 bg-white/5 rounded-2xl flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Credits</span>
                                    <span className="font-black">24 / 30</span>
                                </div>
                                <div className="p-5 bg-white/5 rounded-2xl flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Attendance</span>
                                    <span className="font-black text-emerald-400">96.8%</span>
                                </div>
                            </div>
                        </div>
                        {/* Background blob */}
                        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-colors"></div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm shadow-indigo-100/20">
                        <div className="flex items-center gap-3 mb-6">
                            <Filter className="w-4 h-4 text-gray-400" />
                            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Breakdown</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-500">English Language</span>
                                <div className="h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 w-[85%]"></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-500">Mathematics</span>
                                <div className="h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 w-[92%]"></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-500">World History</span>
                                <div className="h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 w-[78%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
