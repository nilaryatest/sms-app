import { FileText } from 'lucide-react';

export default function StudentRegistration() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header>
                <h1 className="text-3xl font-black tracking-tight text-gray-900">Registration</h1>
                <p className="text-gray-500 mt-1 font-medium">
                    Register for new academic sessions, subjects, or extracurricular programs here.
                </p>
            </header>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center py-20">
                <FileText className="w-16 h-16 text-indigo-200 mb-4" />
                <h3 className="text-xl font-bold text-gray-900">No Active Registrations</h3>
                <p className="text-gray-500 mt-2 max-w-md">
                    There are currently no open registration periods for your profile. Please check back later or contact administration.
                </p>
            </div>
        </div>
    );
}
