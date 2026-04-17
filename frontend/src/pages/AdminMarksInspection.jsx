import { SearchCheck } from 'lucide-react';

export default function AdminMarksInspection() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header>
                <h1 className="text-3xl font-black tracking-tight text-gray-900">Marks Entry Inspection</h1>
                <p className="text-gray-500 mt-1 font-medium">
                    Review, verify, and lock marks entered by subject teachers before publishing results.
                </p>
            </header>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center py-20">
                <SearchCheck className="w-16 h-16 text-indigo-200 mb-4" />
                <h3 className="text-xl font-bold text-gray-900">All Marks Verified</h3>
                <p className="text-gray-500 mt-2 max-w-md">
                    There are currently no new marks entries pending your inspection and approval.
                </p>
                <button className="mt-8 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition duration-200">
                    View Verified Marks
                </button>
            </div>
        </div>
    );
}
