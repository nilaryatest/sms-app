import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { Users, Loader2, FileText, Search, Printer, GraduationCap, ChevronLeft, Award } from 'lucide-react';

export default function TeacherMarksheet() {
    const [sections, setSections] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchingStudents, setFetchingStudents] = useState(false);
    
    const [selectedSection, setSelectedSection] = useState('');
    const [activeStudent, setActiveStudent] = useState(null);
    const [studentResults, setStudentResults] = useState([]);
    const [fetchingResults, setFetchingResults] = useState(false);

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

    const handleViewMarksheet = async (student) => {
        setActiveStudent(student);
        setFetchingResults(true);
        try {
            const res = await api.get(`/results/student/${student.id}`);
            setStudentResults(res.data);
        } catch (err) {
            console.error("Failed to fetch results", err);
        } finally {
            setFetchingResults(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    // Calculate Grade
    const getGrade = (obtained, total) => {
        const pct = (obtained / total) * 100;
        if (pct >= 90) return { letter: 'A+', color: 'text-indigo-600' };
        if (pct >= 80) return { letter: 'A', color: 'text-emerald-600' };
        if (pct >= 70) return { letter: 'B+', color: 'text-blue-600' };
        if (pct >= 60) return { letter: 'B', color: 'text-amber-600' };
        if (pct >= 50) return { letter: 'C', color: 'text-orange-600' };
        return { letter: 'F', color: 'text-red-600' };
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 print:space-y-0 print:p-0">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1 print:hidden">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <FileText className="w-8 h-8 text-indigo-500" />
                        Marksheet Generation
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium">Generate and view academic report cards for your students.</p>
                </div>
                {activeStudent && (
                    <button 
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-colors uppercase tracking-widest text-xs"
                    >
                        <Printer className="w-4 h-4" /> Print Marksheet
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
                                    <div key={student.id} onClick={() => handleViewMarksheet(student)} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all group">
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
                // --- STEP 2: View Marksheet ---
                <div className="animate-in slide-in-from-bottom-8 duration-700">
                    <button 
                        onClick={() => setActiveStudent(null)}
                        className="mb-6 flex flex-row items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 print:hidden uppercase tracking-widest"
                    >
                        <ChevronLeft className="w-5 h-5" /> Back to Class List
                    </button>
                    
                    {/* Marksheet Form */}
                    <div className="max-w-4xl mx-auto bg-white border-2 border-double border-gray-200 rounded-xl p-0 shadow-lg print:shadow-none print:border-none print:w-full print:max-w-none">
                        
                        {/* Header Box */}
                        <div className="border-b-4 border-indigo-900 p-10 bg-indigo-50/30 text-center print:bg-transparent print:border-b-2 print:border-black">
                            <GraduationCap className="w-16 h-16 mx-auto mb-4 text-indigo-600 print:text-black hidden md:block print:block" />
                            <h1 className="text-4xl font-black text-indigo-950 tracking-tighter uppercase print:text-black">EduManage Academy</h1>
                            <p className="font-medium tracking-[0.3em] uppercase text-indigo-500 mt-2 text-sm print:text-black">Official Academic Record</p>
                        </div>
                        
                        {/* Student Details Section */}
                        <div className="px-10 py-8 grid grid-cols-2 gap-8 border-b-2 border-dashed border-gray-200">
                            <div className="space-y-4">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 print:text-gray-600">Student Name</span>
                                    <span className="text-xl font-bold text-gray-900 capitalize print:text-black">{activeStudent.first_name} {activeStudent.last_name}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 print:text-gray-600">Enrollment / Roll No</span>
                                    <span className="text-xl font-bold text-gray-900 uppercase tracking-widest print:text-black">{activeStudent.roll_number || 'N/A'}</span>
                                </div>
                            </div>
                            <div className="space-y-4 text-right">
                                 <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 print:text-gray-600">Student ID</span>
                                    <span className="text-xl font-bold text-gray-900 tracking-widest print:text-black">#{activeStudent.id}</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 print:text-gray-600">Date Issued</span>
                                    <span className="text-xl font-bold text-gray-900 print:text-black">{new Date().toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Marks Table */}
                        <div className="p-10">
                            <h3 className="text-lg font-black text-gray-900 border-b-2 border-gray-900 inline-block pb-1 mb-6 print:text-black">Academic Performance</h3>
                            
                            {fetchingResults ? (
                                <div className="py-20 text-center">
                                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-500 mb-2" />
                                    <span className="font-bold text-gray-500">Retrieving Records...</span>
                                </div>
                            ) : studentResults.length === 0 ? (
                                <div className="py-20 text-center border-2 border-dashed border-gray-200 rounded-xl">
                                    <Award className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                                    <span className="font-bold text-gray-400 uppercase tracking-widest text-sm">No Examination Records Found</span>
                                </div>
                            ) : (
                                <table className="w-full text-left border border-gray-200">
                                    <thead className="bg-gray-100 print:bg-gray-200 border-b-2 border-gray-300">
                                        <tr className="uppercase text-[11px] font-black tracking-widest text-gray-700">
                                            <th className="px-6 py-4">Subject ID</th>
                                            <th className="px-6 py-4">Examination</th>
                                            <th className="px-6 py-4 text-right">Total Marks</th>
                                            <th className="px-6 py-4 text-right">Obtained</th>
                                            <th className="px-6 py-4 text-center">Grade</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {studentResults.map((result, idx) => {
                                            const { letter, color } = getGrade(result.marks_obtained, result.total_marks);
                                            return (
                                                <tr key={result.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} print:bg-white`}>
                                                    <td className="px-6 py-4 font-bold text-gray-900"># {result.subject_id}</td>
                                                    <td className="px-6 py-4 font-medium text-gray-600 uppercase text-xs tracking-wider">{result.exam_name}</td>
                                                    <td className="px-6 py-4 text-right font-bold text-gray-500">{result.total_marks}</td>
                                                    <td className="px-6 py-4 text-right font-black text-gray-900">{result.marks_obtained}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className={`text-xl font-black ${color} print:text-black`}>{letter}</span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {/* Total calculation */}
                                        <tr className="bg-indigo-50/50 print:bg-gray-100 border-t-2 border-gray-300">
                                            <td colSpan="2" className="px-6 py-5 text-right font-black text-gray-900 uppercase tracking-widest">Aggregate Total</td>
                                            <td className="px-6 py-5 text-right font-black text-gray-900">{studentResults.reduce((acc, curr) => acc + curr.total_marks, 0)}</td>
                                            <td className="px-6 py-5 text-right font-black text-indigo-700 text-xl print:text-black">{studentResults.reduce((acc, curr) => acc + curr.marks_obtained, 0)}</td>
                                            <td className="px-6 py-5 text-center font-black text-indigo-700 text-2xl print:text-black">
                                                {getGrade(
                                                    studentResults.reduce((acc, curr) => acc + curr.marks_obtained, 0),
                                                    studentResults.reduce((acc, curr) => acc + curr.total_marks, 0) || 1
                                                ).letter}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Signatures */}
                        <div className="p-10 mt-10 grid grid-cols-2 gap-20">
                            <div className="border-t-2 border-black pt-2 text-center">
                                <span className="font-bold uppercase tracking-widest textxs text-gray-600">Class Teacher</span>
                            </div>
                            <div className="border-t-2 border-black pt-2 text-center">
                                <span className="font-bold uppercase tracking-widest textxs text-gray-600">Principal</span>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
