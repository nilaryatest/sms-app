import { FileCheck, ShieldAlert, Award } from 'lucide-react';

export default function SuperAdminExams() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header>
                <h1 className="text-3xl font-black tracking-tight text-gray-900">Exam Master Control</h1>
                <p className="text-gray-500 mt-1 font-medium">
                    Global oversight on examination cycles, result tampering, and mark locks.
                </p>
            </header>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center py-20">
                <ShieldAlert className="w-16 h-16 text-indigo-200 mb-4" />
                <h3 className="text-xl font-bold text-gray-900">Exam Audit & Overrides</h3>
                <p className="text-gray-500 mt-2 max-w-lg mx-auto">
                    From here, you can unlock previously sealed marksheets, override routine locks, and perform final global result publications for the entire campus.
                </p>
                <div className="flex gap-4 mt-8">
                    <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition duration-200 shadow shadow-indigo-600/20">
                        View Active Exams
                    </button>
                    <button className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition duration-200">
                        Audit Logs
                    </button>
                </div>
            </div>
        </div>
    );
}
