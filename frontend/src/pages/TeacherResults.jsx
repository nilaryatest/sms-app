import { useState, useEffect } from 'react';
import api from '../utils/api';
import { BookOpen, GraduationCap, Plus, Loader2, Save, FileSpreadsheet, CheckCircle2, Layers } from 'lucide-react';

export default function Results() {
    const [sections, setSections] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Filter states
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [examName, setExamName] = useState('Mid-Term Examination 2026');

    // Results state (Map: studentId -> score)
    const [marks, setMarks] = useState({});

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [sectionsRes, subjectsRes] = await Promise.all([
                api.get('/academics/sections/'),
                api.get('/academics/subjects/')
            ]);
            setSections(sectionsRes.data);
            setSubjects(subjectsRes.data);
        } catch (err) {
            console.error("Failed to fetch initial data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleFetchStudents = async () => {
        if (!selectedSection) return;
        setLoading(true);
        try {
            const res = await api.get(`/students/section/${selectedSection}`);
            setStudents(res.data);
            // Initialize marks map
            const initialMarks = {};
            res.data.forEach(s => initialMarks[s.id] = '');
            setMarks(initialMarks);
        } catch (err) {
            console.error("Failed to fetch students", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitResults = async () => {
        if (!selectedSubject || !selectedSection) return;
        setUploading(true);
        setSuccess(false);
        try {
            // Bulk create results (Backend supports single, but we'll loop for now or implement bulk)
            const promises = Object.entries(marks)
                .filter(([_, value]) => value !== '')
                .map(([studentId, value]) => api.post('/results/', {
                    student_id: parseInt(studentId),
                    subject_id: parseInt(selectedSubject),
                    exam_name: examName,
                    marks_obtained: parseFloat(value),
                    total_marks: 100,
                    date_published: new Date().toISOString().split('T')[0]
                }));

            await Promise.all(promises);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 5000);
        } catch (err) {
            console.error("Failed to upload results", err);
            alert("Error uploading results. Ensure all values are numeric.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 border-l-4 border-indigo-600 pl-4 uppercase tracking-[0.2em] text-[0.8em]">Results Center</h1>
                    <h2 className="text-4xl font-black text-gray-900 mt-2 tracking-tighter">Academic Records Portal</h2>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl font-bold text-gray-600 shadow-sm hover:bg-gray-50 transition-all">
                        <FileSpreadsheet className="w-5 h-5" />
                        Import CSV
                    </button>
                    <button
                        onClick={handleSubmitResults}
                        disabled={uploading || students.length === 0}
                        className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-105 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100"
                    >
                        {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Submit Records
                    </button>
                </div>
            </header>

            {success && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 flex items-center gap-4 animate-in slide-in-from-top-4">
                    <div className="w-12 h-12 bg-emerald-400 rounded-2xl flex items-center justify-center text-white">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="font-black text-emerald-900 text-lg">Results Published Successfully!</p>
                        <p className="text-emerald-700 font-bold text-sm uppercase tracking-widest opacity-70">The marks are now visible on student dashboards.</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Configuration Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Layers className="w-4 h-4" /> configuration
                        </h3>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Examination</label>
                                <input
                                    type="text"
                                    value={examName}
                                    onChange={(e) => setExamName(e.target.value)}
                                    className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Class Section</label>
                                <select
                                    className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer"
                                    value={selectedSection}
                                    onChange={(e) => setSelectedSection(e.target.value)}
                                >
                                    <option value="">Select Section</option>
                                    {sections.map(s => <option key={s.id} value={s.id}>Section {s.name}</option>)}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Subject</label>
                                <select
                                    className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer"
                                    value={selectedSubject}
                                    onChange={(e) => setSelectedSubject(e.target.value)}
                                >
                                    <option value="">Select Subject</option>
                                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                                </select>
                            </div>

                            <button
                                onClick={handleFetchStudents}
                                disabled={!selectedSection || loading}
                                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Plus className="w-4 h-4" />}
                                Load Students
                            </button>
                        </div>
                    </div>
                </div>

                {/* Entry Form */}
                <div className="lg:col-span-3">
                    {students.length === 0 ? (
                        <div className="h-full bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center p-20 text-center text-gray-300">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                <GraduationCap className="w-12 h-12" />
                            </div>
                            <h4 className="text-xl font-black text-gray-400">Class selection required</h4>
                            <p className="max-w-xs mt-2 text-sm font-medium">Please configure the section and subject to pull student records.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden animate-in slide-in-from-right-8 duration-500">
                            <div className="px-10 py-8 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 tracking-tight">Student Enrollment List</h3>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Found {students.length} students in current section</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Marks/100</span>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="space-y-2">
                                    {students.map((student) => (
                                        <div key={student.id} className="group flex items-center justify-between px-8 py-4 rounded-2xl hover:bg-indigo-50/20 transition-all border border-transparent hover:border-indigo-100/30">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 font-black border-2 border-white shadow-sm ring-1 ring-gray-100 truncate">
                                                    {student.roll_number || 'RN'}
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900 leading-none mb-1">Student #{student.id}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Roll Number: {student.roll_number || 'PENDING'}</p>
                                                </div>
                                            </div>
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                placeholder="Score"
                                                value={marks[student.id]}
                                                onChange={(e) => setMarks({ ...marks, [student.id]: e.target.value })}
                                                className="w-32 px-6 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl font-black text-center text-gray-900 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-gray-300"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
