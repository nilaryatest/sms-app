import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Loader2, Receipt, AlertCircle, CheckCircle2, IndianRupee, Clock, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount || 0);
};

export default function StudentFees() {
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFees = async () => {
            try {
                const res = await api.get('/finance/fees/me');
                setFees(res.data);
            } catch (error) {
                console.error("Failed to fetch fees", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFees();
    }, []);

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-gray-400">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-rose-500" />
                <p className="font-bold text-gray-500">Retrieving fee records...</p>
            </div>
        );
    }

    // Summaries
    const totalFees = fees.reduce((sum, f) => sum + f.total_amount, 0);
    const totalPaid = fees.reduce((sum, f) => sum + f.paid_amount, 0);
    const totalDue = totalFees - totalPaid;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight text-gray-900">Fees Amount</h1>
                    <p className="text-lg text-gray-500 font-medium">Tracking your academic fees and payments.</p>
                </div>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Fees</p>
                        <p className="text-3xl font-black text-gray-900 tracking-tighter mt-1">{formatCurrency(totalFees)}</p>
                    </div>
                    <Receipt className="w-10 h-10 text-gray-300" />
                </div>
                <div className="bg-emerald-50 p-6 rounded-3xl shadow-sm border border-emerald-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">Amount Paid</p>
                        <p className="text-3xl font-black text-emerald-900 tracking-tighter mt-1">{formatCurrency(totalPaid)}</p>
                    </div>
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <div className="bg-rose-50 p-6 rounded-3xl shadow-sm border border-rose-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-black text-rose-600 uppercase tracking-widest">Pending Due</p>
                        <p className="text-3xl font-black text-rose-900 tracking-tighter mt-1">{formatCurrency(totalDue)}</p>
                    </div>
                    <AlertCircle className="w-10 h-10 text-rose-500" />
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-2xl font-black text-gray-900">Fee Breakdown</h3>
                </div>

                {fees.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider font-bold">
                                    <th className="px-8 py-4 border-b border-gray-100">Academic Year</th>
                                    <th className="px-8 py-4 border-b border-gray-100">Due Date</th>
                                    <th className="px-8 py-4 border-b border-gray-100 text-center">Status</th>
                                    <th className="px-8 py-4 border-b border-gray-100 text-right">Total Amount</th>
                                    <th className="px-8 py-4 border-b border-gray-100 text-right">Paid Amount</th>
                                    <th className="px-8 py-4 border-b border-gray-100 text-right">Balance Due</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-medium text-gray-700 divide-y divide-gray-50">
                                {fees.map((fee) => {
                                    const balance = fee.total_amount - fee.paid_amount;
                                    const isPaid = balance <= 0 || fee.status === 'PAID';
                                    
                                    return (
                                        <tr key={fee.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2 font-bold text-gray-900">
                                                    <CalendarDays className="w-4 h-4 text-indigo-400" />
                                                    {fee.academic_year}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-gray-500">
                                                {format(new Date(fee.due_date), 'MMM d, yyyy')}
                                            </td>
                                            <td className="px-8 py-5 text-center">
                                                <span className={`px-3 py-1 text-[10px] font-black tracking-widest uppercase rounded-lg inline-flex items-center gap-1.5 ${isPaid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                                                    }`}>
                                                    {isPaid ? "PAID" : "DUE"}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right font-semibold text-gray-500">
                                                {formatCurrency(fee.total_amount)}
                                            </td>
                                            <td className="px-8 py-5 text-right font-semibold text-emerald-600">
                                                {formatCurrency(fee.paid_amount)}
                                            </td>
                                            <td className={`px-8 py-5 text-right font-black text-lg ${isPaid ? 'text-gray-400' : 'text-rose-600'}`}>
                                                {formatCurrency(balance)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-16 text-center text-gray-400">
                        <Receipt className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="font-bold text-xl text-gray-500 mb-2">No fees found</p>
                        <p className="text-gray-400">You do not have any fee records assigned to you yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
