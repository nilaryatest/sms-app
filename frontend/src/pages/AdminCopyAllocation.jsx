import { BookCopy } from 'lucide-react';

export default function AdminCopyAllocation() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header>
                <h1 className="text-3xl font-black tracking-tight text-gray-900">Exam Copy Allocation</h1>
                <p className="text-gray-500 mt-1 font-medium">
                    Allocate and track the exact number of blank exam copy booklets provided for exams.
                </p>
            </header>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center py-20">
                <BookCopy className="w-16 h-16 text-indigo-200 mb-4" />
                <h3 className="text-xl font-bold text-gray-900">No Copies Allocated</h3>
                <p className="text-gray-500 mt-2 max-w-md">
                    You can manage the distribution of blank answer scripts to specific halls right before the examination begins.
                </p>
                <button className="mt-8 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition duration-200">
                    Allocate New Copies
                </button>
            </div>
        </div>
    );
}
