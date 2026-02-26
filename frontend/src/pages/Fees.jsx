import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Plus, Search, Loader2, CreditCard, Receipt, IndianRupee } from 'lucide-react';
import { format } from 'date-fns';

export default function FeesPage() {
    const [fees, setFees] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        student_id: '',
        academic_year: '2026-2027',
        total_amount: '',
        due_date: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [feesRes, usersRes] = await Promise.all([
                api.get('/finance/fees'),
                api.get('/users/')
            ]);
            setFees(feesRes.data);
            setStudents(usersRes.data.filter(u => u.role === 'STUDENT'));
        } catch (err) {
            console.error("Failed to fetch fee data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateFee = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/finance/fees', {
                ...formData,
                total_amount: parseFloat(formData.total_amount)
            });
            setFees([...fees, res.data]);
            setIsAddModalOpen(false);
            setFormData({ academic_year: '2026-2027', student_id: '', total_amount: '', due_date: '' });
        } catch (err) {
            console.error("Failed to create fee record", err);
            alert("Error: " + (err.response?.data?.detail || "Failed to create record"));
        }
    };

    const handleRecordPayment = async (fee, amountPayable) => {
        const newPaidAmount = fee.paid_amount + parseFloat(amountPayable);
        let newStatus = 'PARTIAL';
        if (newPaidAmount >= fee.total_amount) newStatus = 'PAID';

        try {
            const res = await api.put(`/finance/fees/${fee.id}`, {
                paid_amount: newPaidAmount,
                status: newStatus
            });

            // Also create a ledger entry automatically
            await api.post('/finance/ledger', {
                amount: parseFloat(amountPayable),
                type: 'INCOME',
                category: 'Tuition Fee',
                description: `Payment for Fee ID #${fee.id} by Student ID #${fee.student_id}`
            });

            setFees(fees.map(f => f.id === fee.id ? res.data : f));
            alert("Payment recorded successfully!");
        } catch (err) {
            console.error("Failed to record payment", err);
            alert("Error recording payment.");
        }
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            PENDING: 'bg-rose-50 text-rose-700',
            PARTIAL: 'bg-amber-50 text-amber-700',
            PAID: 'bg-emerald-50 text-emerald-700',
            OVERDUE: 'bg-red-100 text-red-800 font-black'
        };
        return <span className={`px-3 py-1 text-[10px] font-black tracking-widest uppercase rounded-lg ${styles[status]}`}>{status}</span>;
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Fee Management</h1>
                    <p className="mt-2 text-lg text-gray-500 font-medium">Generate fee slips and record manual payments.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg hover:bg-emerald-700 hover:translate-y-[-2px] transition-all active:translate-y-0"
                >
                    <Plus className="w-5 h-5" />
                    Generate Fee Slip
                </button>
            </header>

            <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by student ID..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-100 bg-white rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all cursor-not-allowed"
                    disabled
                />
            </div>

            {loading ? (
                <div className="h-96 flex flex-col items-center justify-center text-gray-400">
                    <Loader2 className="w-10 h-10 animate-spin mb-4 text-emerald-500" />
                    <p className="font-bold">Syncing financial database...</p>
                </div>
            ) : (
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden text-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 border-b border-gray-50">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Fee Slip #</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Student Info</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount / Due</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                                {fees.map((fee) => {
                                    const student = students.find(s => s.id === fee.student_id);
                                    return (
                                        <tr key={fee.id} className="hover:bg-emerald-50/20 transition-colors">
                                            <td className="px-8 py-5 font-mono text-xs text-gray-400">
                                                ORD-{fee.id.toString().padStart(5, '0')}
                                            </td>
                                            <td className="px-8 py-5">
                                                <p className="font-black text-gray-900 leading-none mb-1">
                                                    {student ? `${student.first_name} ${student.last_name}` : `Student #${fee.student_id}`}
                                                </p>
                                                <p className="text-xs text-gray-400 font-bold">{fee.academic_year}</p>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-1.5 font-black text-gray-900">
                                                    <IndianRupee className="w-3.5 h-3.5" />
                                                    {fee.total_amount}
                                                </div>
                                                <p className="text-xs text-rose-500 font-bold mt-1">Due: ₹{fee.total_amount - (fee.paid_amount || 0)}</p>
                                            </td>
                                            <td className="px-8 py-5">
                                                <StatusBadge status={fee.status} />
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                {fee.status !== 'PAID' && (
                                                    <button
                                                        onClick={() => {
                                                            const payAmt = prompt(`Enter amount to pay for ${student ? student.first_name : 'student'} (Due: ₹${fee.total_amount - (fee.paid_amount || 0)})`);
                                                            if (payAmt && !isNaN(payAmt)) {
                                                                handleRecordPayment(fee, payAmt);
                                                            }
                                                        }}
                                                        className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-bold hover:bg-emerald-100 transition-colors text-xs"
                                                    >
                                                        Record Payment
                                                    </button>
                                                )}
                                                {fee.status === 'PAID' && (
                                                    <span className="text-gray-400 text-xs font-bold line-through">Cleared</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="bg-emerald-600 p-10 text-white flex justify-between items-center">
                            <div>
                                <h3 className="text-3xl font-black tracking-tight">Generate Slip</h3>
                                <p className="text-emerald-100 font-bold mt-1 uppercase tracking-widest text-[10px]">Fee Generation Tool</p>
                            </div>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-white/50 hover:text-white transition-colors">
                                <Plus className="w-8 h-8 rotate-45" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateFee} className="p-10 space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Student</label>
                                <select
                                    className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none"
                                    value={formData.student_id}
                                    onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                                    required
                                >
                                    <option value="" disabled>-- Select a registered student --</option>
                                    {students.map(s => (
                                        <option key={s.id} value={s.id}>{s.first_name} {s.last_name} (ID: {s.id})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Total Amount (₹)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                        placeholder="e.g. 15000"
                                        value={formData.total_amount}
                                        onChange={(e) => setFormData({ ...formData, total_amount: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Due Date</label>
                                    <input
                                        type="date"
                                        className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm"
                                        value={formData.due_date}
                                        onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <button className="w-full py-5 bg-emerald-600 text-white rounded-[1.5rem] font-black text-lg tracking-tight hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-200 transition-all active:scale-95 mt-4">
                                Issue Fee Slip
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
