import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function TeacherLeave() {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Form
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const res = await api.get('/communication/leaves/me');
            setLeaves(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            await api.post('/communication/leaves', {
                start_date: startDate,
                end_date: endDate,
                reason
            });
            setStartDate('');
            setEndDate('');
            setReason('');
            fetchLeaves(); // Refresh
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to submit leave request');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'Approved': return { bg: 'bg-emerald-50 text-emerald-600', icon: CheckCircle };
            case 'Rejected': return { bg: 'bg-rose-50 text-rose-600', icon: XCircle };
            default: return { bg: 'bg-amber-50 text-amber-600', icon: Clock };
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Staff Leave Requests</h1>
                <p className="text-gray-500 mt-1 font-medium">Apply for leaves and track your approval status with Administration.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Apply Form */}
                <div className="lg:col-span-1 border border-gray-100 bg-white rounded-[2rem] p-8 shadow-sm h-fit">
                    <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-indigo-500" /> New Request
                    </h2>

                    {error && (
                        <div className="mb-4 p-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold border border-rose-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">From Date</label>
                                <input
                                    type="date"
                                    required
                                    value={startDate}
                                    onChange={e => setStartDate(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">To Date</label>
                                <input
                                    type="date"
                                    required
                                    value={endDate}
                                    onChange={e => setEndDate(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Reason for Leave</label>
                            <textarea
                                required
                                rows={4}
                                value={reason}
                                onChange={e => setReason(e.target.value)}
                                placeholder="Please detail your reason..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium resize-none"
                            />
                        </div>

                        <button
                            disabled={submitting}
                            type="submit"
                            className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        >
                            {submitting ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </form>
                </div>

                {/* History */}
                <div className="lg:col-span-2 border border-gray-100 bg-white rounded-[2rem] overflow-hidden shadow-sm flex flex-col">
                    <div className="p-8 border-b border-gray-50 bg-gray-50/30">
                        <h2 className="text-xl font-black text-gray-900">Request History</h2>
                    </div>
                    <div className="p-4 flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="p-10 text-center text-gray-400 font-medium">Loading history...</div>
                        ) : leaves.length === 0 ? (
                            <div className="p-20 flex flex-col items-center justify-center text-gray-300">
                                <Calendar className="w-12 h-12 mb-4 text-gray-200" />
                                <p className="font-bold">No leave requests found.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {leaves.map(req => {
                                    const { bg, icon: StatusIcon } = getStatusConfig(req.status);
                                    return (
                                        <div key={req.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-50 transition-all gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-black text-gray-900">{req.start_date}</span>
                                                    <span className="text-gray-400 font-bold px-2">to</span>
                                                    <span className="font-black text-gray-900">{req.end_date}</span>
                                                </div>
                                                <p className="text-sm font-medium text-gray-500 line-clamp-2 leading-relaxed">{req.reason}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Status</p>
                                                    <div className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-white/50 ${bg}`}>
                                                        <StatusIcon className="w-3.5 h-3.5" />
                                                        <span className="text-xs font-black uppercase tracking-wider">{req.status}</span>
                                                    </div>
                                                </div>
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
