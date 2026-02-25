import { useState, useEffect } from 'react';
import api from '../utils/api';
import { User, Download, Search, Loader2, CreditCard } from 'lucide-react';

export default function IDCards() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [generatingId, setGeneratingId] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            // For now, let's fetch all users and filter by student role
            const response = await api.get('/users/');
            setStudents(response.data.filter(u => u.role === 'STUDENT'));
        } catch (err) {
            console.error("Failed to fetch students", err);
        } finally {
            setLoading(false);
        }
    };

    const generateCard = async (studentId) => {
        setGeneratingId(studentId);
        try {
            const response = await api.get(`/id-card/generate/${studentId}`);
            setSelectedCard(response.data.data);
        } catch (err) {
            console.error("Failed to generate ID card", err);
        } finally {
            setGeneratingId(null);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">ID Card Center</h1>
                    <p className="mt-2 text-lg text-gray-500">Generate and manage student identification cards.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search students..."
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all w-full md:w-64"
                    />
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Student List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/30">
                            <h3 className="font-bold text-gray-900">Active Students</h3>
                        </div>
                        {loading ? (
                            <div className="p-12 flex flex-col items-center justify-center text-gray-400">
                                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                                <p>Loading student directory...</p>
                            </div>
                        ) : students.length === 0 ? (
                            <div className="p-12 flex flex-col items-center justify-center text-gray-400 text-center">
                                <User className="w-12 h-12 mb-4 opacity-20" />
                                <p className="max-w-xs">No students found. Use the 'Users' panel to add your first student.</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-50">
                                {students.map((student) => (
                                    <li key={student.id} className="px-6 py-4 flex items-center justify-between hover:bg-indigo-50/30 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm">
                                                {student.first_name[0]}{student.last_name[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{student.first_name} {student.last_name}</p>
                                                <p className="text-xs text-gray-500">{student.email}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => generateCard(student.id)}
                                            disabled={generatingId === student.id}
                                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-indigo-600 bg-white border border-indigo-100 rounded-xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                                        >
                                            {generatingId === student.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <CreditCard className="w-4 h-4" />
                                            )}
                                            Preview Card
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Card Viewer */}
                <div className="lg:col-span-1">
                    <div className="sticky top-8 space-y-6">
                        <div className="bg-white rounded-3xl shadow-xl border border-indigo-50 p-6 min-h-[400px] flex flex-col">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Preview</h3>

                            {selectedCard ? (
                                <div className="flex-1 flex flex-col items-center animate-in zoom-in-95 duration-300">
                                    {/* Digital ID Card */}
                                    <div className="w-full max-w-sm bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl shadow-2xl p-6 text-white relative overflow-hidden aspect-[1.6/1]">
                                        {/* School Logo/Name */}
                                        <div className="flex items-center gap-2 mb-8 relative z-10">
                                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-md">
                                                <CreditCard className="w-5 h-5" />
                                            </div>
                                            <span className="font-black text-sm uppercase tracking-tighter">{selectedCard.school_name}</span>
                                        </div>

                                        {/* Student Info */}
                                        <div className="flex gap-4 relative z-10">
                                            <div className="w-20 h-20 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 overflow-hidden">
                                                <User className="w-12 h-12 text-white/50" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs text-indigo-200 font-bold uppercase tracking-widest">Student</p>
                                                <h4 className="text-lg font-black leading-tight">{selectedCard.student_name}</h4>
                                                <p className="text-sm text-indigo-100">{selectedCard.section} | Roll: {selectedCard.roll_number}</p>
                                            </div>
                                        </div>

                                        {/* Bottom Bar */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md p-4 flex justify-between items-center z-10">
                                            <div className="text-[10px] text-white/60">
                                                <p>VALID UNTIL</p>
                                                <p className="font-bold text-white">{selectedCard.valid_until}</p>
                                            </div>
                                            <div className="w-10 h-10 bg-white/90 rounded flex items-center justify-center">
                                                {/* Mock QR */}
                                                <div className="grid grid-cols-2 gap-0.5">
                                                    <div className="w-1.5 h-1.5 bg-black"></div><div className="w-1.5 h-1.5 bg-black"></div>
                                                    <div className="w-1.5 h-1.5 bg-black"></div><div className="w-1.5 h-1.5 bg-transparent"></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Decorative Background Elements */}
                                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                                        <div className="absolute top-1/2 -left-8 w-24 h-24 bg-indigo-400/20 rounded-full blur-2xl"></div>
                                    </div>

                                    <div className="mt-8 flex gap-3 w-full">
                                        <button className="flex-1 inline-flex justify-center items-center gap-3 bg-gray-900 text-white rounded-2xl py-4 font-bold hover:bg-black transition-all shadow-lg">
                                            <Download className="w-5 h-5" />
                                            Download PDF
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-100 rounded-2xl">
                                    <div className="w-20 h-20 bg-indigo-50 text-indigo-200 rounded-full flex items-center justify-center mb-4">
                                        <CreditCard className="w-10 h-10" />
                                    </div>
                                    <h4 className="text-gray-900 font-bold">No Card Selected</h4>
                                    <p className="text-gray-400 text-sm mt-2">Pick a student from the list to preview their digital ID card.</p>
                                </div>
                            )}

                            <div className="mt-8 pt-6 border-t border-gray-50">
                                <div className="bg-amber-50 rounded-2xl p-4 flex gap-3 border border-amber-100/50">
                                    <div className="w-5 h-5 text-amber-500 shrink-0">
                                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </div>
                                    <p className="text-xs text-amber-700 leading-relaxed">
                                        ID cards are automatically formatted for standard CR80 (86mm x 54mm) printing.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
