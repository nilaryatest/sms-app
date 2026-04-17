import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Users, Loader2, GraduationCap, Search, Phone, Mail } from 'lucide-react';

export default function TeacherClassManagement() {
    const [sections, setSections] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchingStudents, setFetchingStudents] = useState(false);
    
    const [selectedSection, setSelectedSection] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const res = await api.get('/academics/sections/');
                setSections(res.data);
            } catch (err) {
                console.error("Failed to fetch sections", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSections();
    }, []);

    const handleFetchStudents = async () => {
        if (!selectedSection) return;
        setFetchingStudents(true);
        try {
            const res = await api.get(`/students/section/${selectedSection}`);
            setStudents(res.data);
        } catch (err) {
            console.error("Failed to fetch students", err);
        } finally {
            setFetchingStudents(false);
        }
    };

    const filteredStudents = students.filter(student => {
        const query = searchQuery.toLowerCase();
        return (
            (student.first_name && student.first_name.toLowerCase().includes(query)) ||
            (student.last_name && student.last_name.toLowerCase().includes(query)) ||
            (student.roll_number && student.roll_number.toLowerCase().includes(query))
        );
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <Users className="w-8 h-8 text-indigo-500" />
                        Class Management
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium">View and manage student rosters for your sections.</p>
                </div>
            </header>

            <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm flex flex-col md:flex-row md:items-end gap-4">
                <div className="flex-1 space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2">Select Section</label>
                    <select
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer transition-all"
                        value={selectedSection}
                        onChange={(e) => setSelectedSection(e.target.value)}
                    >
                        <option value="">Choose a class section...</option>
                        {sections.map(s => <option key={s.id} value={s.id}>Section {s.name}</option>)}
                    </select>
                </div>
                <button
                    onClick={handleFetchStudents}
                    disabled={!selectedSection || fetchingStudents}
                    className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {fetchingStudents ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                    Load Class
                </button>
            </div>

            {students.length > 0 && (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
                        <h2 className="text-lg font-black text-gray-900">
                            Class Roster <span className="text-gray-400 font-medium ml-2">({students.length} students)</span>
                        </h2>
                        <div className="relative">
                            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search by name or roll..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none w-full md:w-64"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredStudents.length === 0 ? (
                            <div className="col-span-full py-12 text-center text-gray-400 font-medium bg-white rounded-[2rem] border border-gray-100 border-dashed">
                                No students match your search.
                            </div>
                        ) : (
                            filteredStudents.map(student => (
                                <div key={student.id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all group flex flex-col items-center text-center relative overflow-hidden">
                                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    
                                    <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-black text-2xl mb-4 border-4 border-white shadow-sm ring-1 ring-gray-100">
                                        {student.first_name ? student.first_name.charAt(0) : 'S'}
                                        {student.last_name ? student.last_name.charAt(0) : ''}
                                    </div>
                                    
                                    <h3 className="font-black text-lg text-gray-900 leading-tight mb-1">
                                        {student.first_name} {student.last_name}
                                    </h3>
                                    
                                    <div className="px-3 py-1 bg-gray-50 rounded-lg border border-gray-100 mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">
                                        <GraduationCap className="w-3.5 h-3.5" />
                                        Roll: {student.roll_number || 'N/A'}
                                    </div>
                                    
                                    <div className="w-full space-y-2 mt-auto pt-4 border-t border-gray-50">
                                        <p className="flex items-center justify-center gap-2 text-xs font-medium text-gray-500">
                                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                                            {student.email || 'No Email'}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
            
            {students.length === 0 && !fetchingStudents && selectedSection && (
                <div className="p-16 text-center bg-white rounded-3xl border border-gray-100 shadow-sm col-span-full">
                    <Users className="w-16 h-16 mx-auto mb-4 text-gray-200" />
                    <p className="font-bold text-xl text-gray-500 mb-2">Empty Section</p>
                    <p className="text-gray-400">There are no students enrolled in this section yet.</p>
                </div>
            )}
        </div>
    );
}
