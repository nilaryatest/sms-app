import { Send } from 'lucide-react';

export default function AdminScriptDistribution() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header>
                <h1 className="text-3xl font-black tracking-tight text-gray-900">Answer Script Distribution</h1>
                <p className="text-gray-500 mt-1 font-medium">
                    Distribute filled answer scripts to respective subject teachers for checking.
                </p>
            </header>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center py-20">
                <Send className="w-16 h-16 text-indigo-200 mb-4" />
                <h3 className="text-xl font-bold text-gray-900">Pending Distributions</h3>
                <p className="text-gray-500 mt-2 max-w-md">
                    Assign the bundled answer scripts collected after the exam to the authorized examiners.
                </p>
                <button className="mt-8 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition duration-200">
                    Distribute Scripts
                </button>
            </div>
        </div>
    );
}
