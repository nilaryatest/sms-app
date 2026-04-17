import { CalendarClock } from 'lucide-react';

export default function AdminExamRoutine() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header>
                <h1 className="text-3xl font-black tracking-tight text-gray-900">Exam Routine</h1>
                <p className="text-gray-500 mt-1 font-medium">
                    Schedule and manage exam dates and timings for all classes.
                </p>
            </header>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center py-20">
                <CalendarClock className="w-16 h-16 text-indigo-200 mb-4" />
                <h3 className="text-xl font-bold text-gray-900">No Exam Scheduled</h3>
                <p className="text-gray-500 mt-2 max-w-md">
                    Start by generating an exam timetable for the upcoming mid-term or final examinations.
                </p>
                <button className="mt-8 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition duration-200">
                    Create Exam Routine
                </button>
            </div>
        </div>
    );
}
