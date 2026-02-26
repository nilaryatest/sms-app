import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Users, ShieldCheck, Settings, Activity, Loader2, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

export default function SuperAdminDashboard() {
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState({ totalUsers: 0, actionsToday: 0 });
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [logsRes, usersRes] = await Promise.all([
                api.get('/super-admin/audit-logs?limit=50'),
                api.get('/users/')
            ]);

            setLogs(logsRes.data);

            const today = new Date().toDateString();
            const todayLogs = logsRes.data.filter(log => new Date(log.timestamp).toDateString() === today);

            setStats({
                totalUsers: usersRes.data.length,
                actionsToday: todayLogs.length
            });
        } catch (error) {
            console.error("Failed to fetch super admin data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-gray-400">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-red-500" />
                <p className="font-bold text-gray-500">Super Admin connection establishing...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight text-gray-900">System Command Center</h1>
                    <p className="text-lg text-gray-500 font-medium">Welcome, System Owner. You have global administrative control.</p>
                </div>
                <button onClick={fetchDashboardData} className="inline-flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-colors">
                    <RefreshCw className="w-5 h-5" />
                    Refresh Logs
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-red-50 p-6 rounded-3xl shadow-sm border border-red-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-black text-red-400 uppercase tracking-widest">System Status</p>
                        <p className="text-4xl font-black text-red-900 tracking-tighter">SECURE</p>
                    </div>
                    <ShieldCheck className="w-10 h-10 text-red-500" />
                </div>

                <div className="bg-indigo-50 p-6 rounded-3xl shadow-sm border border-indigo-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-black text-indigo-400 uppercase tracking-widest">Total Accounts</p>
                        <p className="text-4xl font-black text-indigo-900 tracking-tighter">{stats.totalUsers}</p>
                    </div>
                    <Users className="w-10 h-10 text-indigo-500" />
                </div>

                <div className="bg-amber-50 p-6 rounded-3xl shadow-sm border border-amber-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-black text-amber-500 uppercase tracking-widest">Actions Logged Today</p>
                        <p className="text-4xl font-black text-amber-900 tracking-tighter">{stats.actionsToday}</p>
                    </div>
                    <Activity className="w-10 h-10 text-amber-500" />
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-2xl font-black text-gray-900">Live Audit Logs</h3>
                </div>

                {logs.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider font-bold">
                                    <th className="px-8 py-4 border-b border-gray-100">Time</th>
                                    <th className="px-8 py-4 border-b border-gray-100">User ID</th>
                                    <th className="px-8 py-4 border-b border-gray-100">Action</th>
                                    <th className="px-8 py-4 border-b border-gray-100">Resource Target</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-medium text-gray-700 divide-y divide-gray-50">
                                {logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-red-50/30 transition-colors">
                                        <td className="px-8 py-4 text-gray-500">
                                            {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')}
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 font-bold text-xs">
                                                {log.user_id || 'SYS'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold tracking-wide">
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 text-gray-500 font-mono text-xs">
                                            {log.resource}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-16 text-center text-gray-400">
                        <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="font-medium text-lg">No audit logs recorded yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
