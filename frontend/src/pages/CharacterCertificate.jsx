import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Award, Loader2, Printer, Search, ChevronLeft } from 'lucide-react';

export default function CharacterCertificate() {
    const [sections, setSections] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchingStudents, setFetchingStudents] = useState(false);
    
    const [selectedSection, setSelectedSection] = useState('');
    const [activeStudent, setActiveStudent] = useState(null);

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
        setActiveStudent(null);
        try {
            const res = await api.get(`/students/section/${selectedSection}`);
            setStudents(res.data);
        } catch (err) {
            console.error("Failed to fetch students", err);
        } finally {
            setFetchingStudents(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 print:space-y-0 print:p-0">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1 print:hidden">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <Award className="w-8 h-8 text-indigo-500" />
                        Character Certificate Generation
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium">Generate official character and conduct certificates for students.</p>
                </div>
                {activeStudent && (
                    <button 
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-colors uppercase tracking-widest text-xs"
                    >
                        <Printer className="w-4 h-4" /> Print Certificate
                    </button>
                )}
            </header>

            {!activeStudent ? (
                // --- STEP 1: Select Student ---
                <div className="space-y-6 print:hidden">
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
                            Load Students
                        </button>
                    </div>

                    {students.length > 0 && (
                        <div className="bg-white border border-gray-100 rounded-[2rem] shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                             <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                                <h2 className="text-xl font-black text-gray-900">Select a Student</h2>
                                <span className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-500 uppercase tracking-widest">{students.length} Total</span>
                            </div>
                            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {students.map(student => (
                                    <div key={student.id} onClick={() => setActiveStudent(student)} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-lg border border-indigo-100">
                                                {student.first_name ? student.first_name.charAt(0) : '?'}
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight">{student.first_name} {student.last_name}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Roll: {student.roll_number}</p>
                                            </div>
                                        </div>
                                        <ChevronLeft className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 transform rotate-180 transition-all" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                // --- STEP 2: View Certificate ---
                <div className="animate-in slide-in-from-bottom-8 duration-700">
                    <button 
                        onClick={() => setActiveStudent(null)}
                        className="mb-6 flex flex-row items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 print:hidden uppercase tracking-widest"
                    >
                        <ChevronLeft className="w-5 h-5" /> Back to Class List
                    </button>
                    
                    {/* Certificate Container */}
                    <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-sm p-4 shadow-2xl relative print:shadow-none print:border-none print:w-full print:max-w-none">
                        <div className="border-4 border-double border-indigo-900 p-16 relative bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
                            
                            <div className="absolute top-8 left-8">
                                <img src="/logo.png" alt="" className="h-20 opacity-10" onError={(e) => e.target.style.display='none'} />
                            </div>

                            <div className="text-center space-y-4 mb-20">
                                <h1 className="text-5xl font-black text-indigo-950 tracking-wide uppercase italic font-serif">EduManage Academy</h1>
                                <p className="text-md font-bold text-gray-600 uppercase tracking-[0.4em]">Excellence logically applied</p>
                                <div className="py-6 border-b-2 border-indigo-900 w-1/2 mx-auto"></div>
                                <h2 className="text-4xl text-gray-900 font-black mt-8 tracking-widest uppercase title-font pt-8">Character Certificate</h2>
                            </div>

                            <div className="text-xl leading-loose font-serif text-gray-800 text-justify mb-32 px-10">
                                <p className="mb-4">
                                    <span className="font-black uppercase tracking-widest text-xs text-gray-400 mr-4">To whom it may concern</span>
                                </p>
                                <p>
                                    This is to certify that Mr./Ms. 
                                    <span className="font-black text-2xl mx-2 border-b-2 border-dashed border-gray-400 px-4 inline-block transform translate-y-1">
                                        {activeStudent.first_name} {activeStudent.last_name}
                                    </span> 
                                    (Roll Number: <span className="font-bold border-b border-gray-400 pb-1">{activeStudent.roll_number || 'N/A'}</span>), 
                                    a bona fide student of Section 
                                    <span className="font-bold border-b border-gray-400 pb-1 mx-2"> {selectedSection} </span>,
                                    has been a dedicated scholar at EduManage Academy.
                                </p>
                                <p className="mt-8">
                                    During their tenure at our institution, their moral character and conduct toward faculty and peers have been observed to be 
                                    <span className="font-black italic text-indigo-900 mx-2">exemplary</span>. 
                                    They have actively participated in curricular activities and upheld the disciplinary standards of the school. We wish them success in all future endeavors.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-20 px-10">
                                <div className="text-left font-serif">
                                    <p className="font-black text-gray-900 mb-8 border-b border-gray-400 pb-2 inline-block">Date of Issue</p>
                                    <p className="text-xl font-medium text-gray-700">{new Date().toLocaleDateString()}</p>
                                </div>
                                <div className="text-right font-serif flex flex-col items-end">
                                    <div className="h-20 w-48 border-b-2 border-indigo-900 flex items-end justify-center mb-2">
                                        <span className="italic font-bold text-indigo-200 opacity-50 text-4xl transform -rotate-6">Authorised</span>
                                    </div>
                                    <span className="font-black uppercase tracking-widest text-sm text-gray-600">Principal Signature</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
