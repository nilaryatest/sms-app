import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Wallet, Receipt, CreditCard, TrendingUp, TrendingDown, Loader2, ArrowRightLeft } from 'lucide-react';
import { format } from 'date-fns';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
};

export default function ClerkDashboard() {
    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState({ income: 0, expenditure: 0, todayCollection: 0 });
    const [loading, setLoading] = useState(true);

    const fetchFinancialData = async () => {
        setLoading(true);
        try {
            const res = await api.get('/finance/ledger?limit=50');
            const data = res.data;
            setTransactions(data);

            const income = data.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
            const expenditure = data.filter(t => t.type === 'EXPENDITURE').reduce((sum, t) => sum + t.amount, 0);

            const today = new Date().toDateString();
            const todayCollection = data
                .filter(t => t.type === 'INCOME' && new Date(t.timestamp).toDateString() === today)
                .reduce((sum, t) => sum + t.amount, 0);

            setStats({ income, expenditure, todayCollection });
        } catch (error) {
            console.error("Failed to fetch financial data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFinancialData();
    }, []);

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-gray-400">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-emerald-500" />
                <p className="font-bold text-gray-500">Accessing secure ledger...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight text-gray-900">Financial Office</h1>
                    <p className="text-lg text-gray-500 font-medium">Manage tuition fees, record expenses, and overview the ledger.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-emerald-50 p-6 rounded-3xl shadow-sm border border-emerald-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">Today's Income</p>
                        <p className="text-3xl font-black text-gray-900 tracking-tighter">{formatCurrency(stats.todayCollection)}</p>
                    </div>
                    <Wallet className="w-10 h-10 text-emerald-500" />
                </div>

                <div className="bg-blue-50 p-6 rounded-3xl shadow-sm border border-blue-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Total Revenue</p>
                        <p className="text-3xl font-black text-gray-900 tracking-tighter">{formatCurrency(stats.income)}</p>
                    </div>
                    <TrendingUp className="w-10 h-10 text-blue-500" />
                </div>

                <div className="bg-rose-50 p-6 rounded-3xl shadow-sm border border-rose-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-black text-rose-600 uppercase tracking-widest">Total Expenses</p>
                        <p className="text-3xl font-black text-gray-900 tracking-tighter">{formatCurrency(stats.expenditure)}</p>
                    </div>
                    <TrendingDown className="w-10 h-10 text-rose-500" />
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-2xl font-black text-gray-900">Recent Transactions</h3>
                </div>

                {transactions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider font-bold">
                                    <th className="px-8 py-4 border-b border-gray-100">Date</th>
                                    <th className="px-8 py-4 border-b border-gray-100">Category</th>
                                    <th className="px-8 py-4 border-b border-gray-100">Description</th>
                                    <th className="px-8 py-4 border-b border-gray-100 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-medium text-gray-700 divide-y divide-gray-50">
                                {transactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-5 text-gray-500">
                                            {format(new Date(tx.timestamp), 'MMM d, yyyy HH:mm')}
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1 text-xs font-bold tracking-wide rounded-lg inline-flex items-center gap-1.5 ${tx.type === 'INCOME' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                                                }`}>
                                                {tx.type === 'INCOME' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                                {tx.category}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            {tx.description || <span className="text-gray-400 italic">No description</span>}
                                        </td>
                                        <td className={`px-8 py-5 text-right font-black ${tx.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'
                                            }`}>
                                            {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-16 text-center text-gray-400">
                        <ArrowRightLeft className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="font-medium text-lg">No ledger transactions found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
