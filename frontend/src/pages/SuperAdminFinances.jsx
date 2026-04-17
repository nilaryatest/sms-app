import { Landmark, IndianRupee, PieChart, Edit3 } from 'lucide-react';

export default function SuperAdminFinances() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header>
                <h1 className="text-3xl font-black tracking-tight text-gray-900">Fees Modification & Finances</h1>
                <p className="text-gray-500 mt-1 font-medium">
                    Master control over fee structures, discounts, and financial ledgers.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                    <Edit3 className="w-10 h-10 text-indigo-400 mb-4" />
                    <h4 className="font-bold text-gray-900">Modify Fee Structures</h4>
                    <p className="text-xs text-gray-500 mt-2">Adjust base fees by grade level or session.</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                    <IndianRupee className="w-10 h-10 text-emerald-400 mb-4" />
                    <h4 className="font-bold text-gray-900">Override Defaulters</h4>
                    <p className="text-xs text-gray-500 mt-2">Grant special permissions or extensions.</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                    <PieChart className="w-10 h-10 text-amber-400 mb-4" />
                    <h4 className="font-bold text-gray-900">Financial Reports</h4>
                    <p className="text-xs text-gray-500 mt-2">View high-level income/expenditure tracking.</p>
                </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-[2rem] p-8 flex flex-col sm:flex-row items-center justify-between mt-8">
                <div>
                    <h3 className="text-lg font-bold text-indigo-900">Global Financial Access</h3>
                    <p className="text-indigo-700/70 text-sm mt-1 max-w-lg">
                        As a Super Admin, you have unrestricted access. Use caution when making permanent destructive changes to global fee templates.
                    </p>
                </div>
                <button className="mt-4 sm:mt-0 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-indigo-700 transition">
                    Open Finance Tools
                </button>
            </div>
        </div>
    );
}
