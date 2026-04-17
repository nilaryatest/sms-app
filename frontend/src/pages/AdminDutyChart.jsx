import { ClipboardCheck } from 'lucide-react';

export default function AdminDutyChart() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header>
                <h1 className="text-3xl font-black tracking-tight text-gray-900">Duty Chart</h1>
                <p className="text-gray-500 mt-1 font-medium">
                    Assign and manage invigilation duties for teachers during exams.
                </p>
            </header>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center py-20">
                <ClipboardCheck className="w-16 h-16 text-indigo-200 mb-4" />
                <h3 className="text-xl font-bold text-gray-900">Duty Chart Empty</h3>
                <p className="text-gray-500 mt-2 max-w-md">
                    Allocate teachers to specific exam halls based on the generated exam routine to ensure proper monitoring.
                </p>
                <button className="mt-8 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition duration-200">
                    Generate Duty Chart
                </button>
            </div>
        </div>
    );
}
