import { useState, useEffect } from 'react';
import api from '../utils/api';
import { TrendingUp, TrendingDown, Clock, Search, Wallet, Plus, Loader2 } from 'lucide-react';

export default function IncomeExpenditure() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Form payload
    const [type, setType] = useState('INCOME');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    
    // Filters
    const [filterType, setFilterType] = useState('ALL');

    useEffect(() => {
        fetchLedger();
    }, []);

    const fetchLedger = async () => {
        try {
            const res = await api.get('/finance/ledger');
            setTransactions(res.data);
        } catch (err) {
            console.error("Failed to fetch ledger details", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRecordTransaction = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            await api.post('/finance/ledger', {
                amount: parseFloat(amount),
                type,
                category,
                description
            });
            // Reset form
            setAmount('');
            setCategory('');
            setDescription('');
            // Refresh
            fetchLedger();
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to record transaction');
        } finally {
            setSubmitting(false);
        }
    };

    const income = transactions.filter(t => t.type === 'INCOME').reduce((acc, curr) => acc + curr.amount, 0);
    const expense = transactions.filter(t => t.type === 'EXPENDITURE').reduce((acc, curr) => acc + curr.amount, 0);
    const totalBalance = income - expense;

    const filteredTransactions = filterType === 'ALL' 
        ? transactions 
        : transactions.filter(t => t.type === filterType);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <Wallet className="w-8 h-8 text-indigo-500" />
                        Income & Expenditure
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium">Manage the school's general ledger and record transactions.</p>
                </div>
            </header>

            {/* Financial Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">Total Income</p>
                        <h2 className="text-3xl font-black text-gray-900">${income.toFixed(2)}</h2>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                </div>
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-1">Total Expenses</p>
                        <h2 className="text-3xl font-black text-gray-900">${expense.toFixed(2)}</h2>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                        <TrendingDown className="w-6 h-6" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-3xl p-6 shadow-lg flex items-center justify-between text-white border border-indigo-700">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-1">Net Balance</p>
                        <h2 className="text-3xl font-black">${totalBalance.toFixed(2)}</h2>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white">
                        <Wallet className="w-6 h-6" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Record New Transaction */}
                <div className="lg:col-span-1 bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm h-fit">
                    <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-50 pb-4">
                        <Plus className="w-5 h-5 text-indigo-500" /> New Transaction
                    </h2>

                    {error && (
                        <div className="mb-4 p-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold border border-rose-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRecordTransaction} className="space-y-5">
                        <div className="flex bg-gray-50 rounded-xl p-1 border border-gray-100">
                            <button
                                type="button"
                                onClick={() => setType('INCOME')}
                                className={`flex-1 py-2 text-xs font-black tracking-widest uppercase rounded-lg transition-all ${type === 'INCOME' ? 'bg-white shadow-sm text-emerald-600 border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                Income
                            </button>
                            <button
                                type="button"
                                onClick={() => setType('EXPENDITURE')}
                                className={`flex-1 py-2 text-xs font-black tracking-widest uppercase rounded-lg transition-all ${type === 'EXPENDITURE' ? 'bg-white shadow-sm text-rose-600 border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                Expenditure
                            </button>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Category / Title</label>
                            <input
                                type="text"
                                required
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                placeholder="E.g. Term 1 Fee or Stationery"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-gray-900"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Amount ($)</label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="any"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-black text-gray-900"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Notes</label>
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                rows="3"
                                placeholder="Optional details..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium resize-none"
                            />
                        </div>

                        <button
                            disabled={submitting}
                            type="submit"
                            className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50"
                        >
                            {submitting ? 'Recording...' : 'Save to Ledger'}
                        </button>
                    </form>
                </div>

                {/* Ledger History */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-xl font-black text-gray-900">Transaction History</h2>
                        <div className="flex bg-white rounded-lg border border-gray-100 p-1 shadow-sm">
                            {['ALL', 'INCOME', 'EXPENDITURE'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilterType(f)}
                                    className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${filterType === f ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:bg-gray-50'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm">
                        {loading ? (
                            <div className="p-20 text-center flex items-center justify-center text-gray-400">
                                <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading ledger...
                            </div>
                        ) : filteredTransactions.length === 0 ? (
                            <div className="p-20 text-center text-gray-400 flex flex-col items-center">
                                <Search className="w-8 h-8 mb-2 opacity-20" />
                                <span className="font-bold">No transactions found.</span>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {filteredTransactions.map(tx => {
                                    const isIncome = tx.type === 'INCOME';
                                    return (
                                        <div key={tx.id} className="p-5 hover:bg-gray-50/50 transition-colors flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isIncome ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                                                    {isIncome ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-gray-900">{tx.category}</h3>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {new Date(tx.timestamp).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className={`text-lg font-black ${isIncome ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                    {isIncome ? '+' : '-'}${tx.amount.toFixed(2)}
                                                </span>
                                                {tx.description && (
                                                    <span className="text-xs text-gray-400 font-medium">Tx #{tx.id}</span>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
