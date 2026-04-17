import { useState, useEffect } from 'react';
import api from '../utils/api';
import { MessageSquare, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function ClerkFeedback() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Form
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const res = await api.get('/communication/complaints/me');
            setComplaints(res.data);
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
            await api.post('/communication/complaints', { subject, message });
            setSubject('');
            setMessage('');
            fetchComplaints(); // Refresh history
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to submit feedback');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'Resolved': return { bg: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: CheckCircle };
            case 'Reviewed': return { bg: 'bg-indigo-50 text-indigo-600 border-indigo-100', icon: AlertCircle };
            default: return { bg: 'bg-amber-50 text-amber-600 border-amber-100', icon: Clock };
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col gap-2">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Administrative Helpdesk</h1>
                <p className="text-gray-500 font-medium">Have an issue or some feedback? Let the administration know securely.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Submit New */}
                <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm h-fit">
                    <h2 className="text-xl font-black flex items-center gap-2 mb-6 text-gray-900 border-b border-gray-50 pb-5">
                        <MessageSquare className="w-5 h-5 text-indigo-500" /> Open a Ticket
                    </h2>

                    {error && (
                        <div className="mb-4 p-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold border border-rose-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Subject / Topic</label>
                            <input
                                type="text"
                                required
                                value={subject}
                                onChange={e => setSubject(e.target.value)}
                                placeholder="E.g. Computer issue"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Detailed Message</label>
                            <textarea
                                required
                                rows={6}
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                placeholder="Describe your issue or suggestion..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium resize-none"
                            />
                        </div>

                        <button
                            disabled={submitting}
                            type="submit"
                            className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50"
                        >
                            {submitting ? 'Sending to Admin...' : 'Submit Feedback'}
                        </button>
                    </form>
                </div>

                {/* Previous Tickets */}
                <div className="space-y-4">
                    <h2 className="text-xl font-black text-gray-900 mb-2 px-2 border-b border-gray-200 pb-3">My Tickets</h2>
                    <div className="space-y-4 h-[600px] overflow-y-auto pr-2">
                        {loading ? (
                            <div className="p-10 text-center text-gray-400 font-medium">Loading tickets...</div>
                        ) : complaints.length === 0 ? (
                            <div className="p-12 text-center text-gray-400 bg-white rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center">
                                <MessageSquare className="w-8 h-8 opacity-20 mb-3" />
                                <span>No previous tickets found.</span>
                            </div>
                        ) : (
                            complaints.map(comp => {
                                const { bg, icon: Icon } = getStatusConfig(comp.status);
                                return (
                                    <div key={comp.id} className="bg-white rounded-[1.5rem] border border-gray-100 p-6 shadow-sm hover:border-indigo-100 transition-colors group">
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="font-black text-lg text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight">
                                                {comp.subject}
                                            </h3>
                                            <div className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 rounded-lg border border-transparent ${bg}`}>
                                                <Icon className="w-3.5 h-3.5" />
                                                {comp.status}
                                            </div>
                                        </div>
                                        <p className="text-gray-500 font-medium text-sm leading-relaxed whitespace-pre-wrap line-clamp-3">
                                            {comp.message}
                                        </p>
                                        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            <span>Ticket #{comp.id}</span>
                                            <span>{new Date(comp.timestamp).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
