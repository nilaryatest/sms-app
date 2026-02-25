import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Plus, BookOpen, Layers, Grid2X2, Loader2, Trash2 } from 'lucide-react';

export default function Academics() {
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form states
    const [newClassName, setNewClassName] = useState('');
    const [newSubjectName, setNewSubjectName] = useState('');
    const [newSubjectCode, setNewSubjectCode] = useState('');
    const [activeTab, setActiveTab] = useState('classes');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [classesRes, subjectsRes] = await Promise.all([
                api.get('/academics/classes/'),
                api.get('/academics/subjects/')
            ]);
            setClasses(classesRes.data);
            setSubjects(subjectsRes.data);
        } catch (err) {
            console.error("Failed to fetch academic data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddClass = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/academics/classes/', { name: newClassName });
            setClasses([...classes, res.data]);
            setNewClassName('');
        } catch (err) {
            console.error("Failed to add class", err);
        }
    };

    const handleAddSubject = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/academics/subjects/', { name: newSubjectName, code: newSubjectCode });
            setSubjects([...subjects, res.data]);
            setNewSubjectName('');
            setNewSubjectCode('');
        } catch (err) {
            console.error("Failed to add subject", err);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Academic Management</h1>
                <p className="mt-2 text-lg text-gray-500">Configure your school's classes, sections, and subjects.</p>
            </header>

            <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl w-fit">
                <button
                    onClick={() => setActiveTab('classes')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'classes' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Classes & Sections
                </button>
                <button
                    onClick={() => setActiveTab('subjects')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'subjects' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Subjects
                </button>
            </div>

            {loading ? (
                <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                    <Loader2 className="w-8 h-8 animate-spin mb-4" />
                    <p>Loading school structure...</p>
                </div>
            ) : activeTab === 'classes' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Add Class Form */}
                    <div className="space-y-6">
                        <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Plus className="w-5 h-5 text-indigo-500" />
                                Add New Class
                            </h3>
                            <form onSubmit={handleAddClass} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Class Name</label>
                                    <input
                                        type="text"
                                        value={newClassName}
                                        onChange={(e) => setNewClassName(e.target.value)}
                                        placeholder="e.g. Grade 10"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                        required
                                    />
                                </div>
                                <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                                    Create Class
                                </button>
                            </form>
                        </section>

                        <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100/50 flex gap-4">
                            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 shrink-0">
                                <Layers className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-amber-900 text-sm">Managing Sections</h4>
                                <p className="text-amber-700 text-xs mt-1 leading-relaxed">
                                    After creating a class, you can add multiple sections (e.g., A, B, C) to it by clicking on the class card.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Class List */}
                    <div className="space-y-4">
                        {classes.map((cls) => (
                            <div key={cls.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:border-indigo-100 transition-all group">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                            <Grid2X2 className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{cls.name}</h4>
                                            <p className="text-sm text-gray-500">{cls.sections.length} Sections Active</p>
                                        </div>
                                    </div>
                                    <button className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                                {cls.sections.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {cls.sections.map(sec => (
                                            <span key={sec.id} className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold border border-gray-100">
                                                Section {sec.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Add Subject Form */}
                    <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Plus className="w-5 h-5 text-indigo-500" />
                            Register Subject
                        </h3>
                        <form onSubmit={handleAddSubject} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Subject Name</label>
                                    <input
                                        type="text"
                                        value={newSubjectName}
                                        onChange={(e) => setNewSubjectName(e.target.value)}
                                        placeholder="e.g. Mathematics"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Code</label>
                                    <input
                                        type="text"
                                        value={newSubjectCode}
                                        onChange={(e) => setNewSubjectCode(e.target.value)}
                                        placeholder="e.g. MATH101"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                        required
                                    />
                                </div>
                            </div>
                            <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                                Register Subject
                            </button>
                        </form>
                    </section>

                    {/* Subject List */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Subject</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Code</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {subjects.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 flex items-center gap-3">
                                            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
                                                <BookOpen className="w-4 h-4" />
                                            </div>
                                            <span className="font-bold text-gray-900">{sub.name}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black tracking-widest rounded-md uppercase">
                                                {sub.code}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-gray-300 hover:text-red-500 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
