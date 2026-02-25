import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Users, BookOpen, GraduationCap, LayoutGrid, Loader2, ArrowUpRight, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass, subtitle }) => (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-indigo-100 transition-all duration-300">
        <div className="space-y-1">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{title}</p>
            <div className="flex items-baseline gap-2">
                <p className="text-4xl font-black text-gray-900 tracking-tighter">{value}</p>
                {subtitle && <span className="text-xs font-bold text-emerald-500 flex items-center gap-0.5"><TrendingUp className="w-3 h-3" /> {subtitle}</span>}
            </div>
        </div>
        <div className={`h-14 w-14 rounded-2xl ${colorClass} flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
            <Icon className="w-8 h-8" />
        </div>
    </div>
);

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        students: 0,
        teachers: 0,
        classes: 0,
        recentActivity: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const [usersRes, classesRes] = await Promise.all([
                api.get('/users/'),
                api.get('/academics/classes/')
            ]);

            const users = usersRes.data;
            setStats({
                students: users.filter(u => u.role === 'STUDENT').length,
                teachers: users.filter(u => u.role === 'TEACHER').length,
                classes: classesRes.data.length,
                recentActivity: [] // To be implemented with a real activity feed
            });
        } catch (err) {
            console.error("Failed to fetch dashboard stats", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-gray-400">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-500" />
                <p className="font-bold text-gray-500">Synchronizing school data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight text-gray-900">Admin Dashboard</h1>
                    <p className="text-lg text-gray-500 font-medium">Welcome back, Super Admin. Here's your school's current status.</p>
                </div>
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold shadow-xl hover:bg-black hover:translate-y-[-2px] transition-all active:translate-y-0">
                    <LayoutGrid className="w-5 h-5" />
                    Configure Layout
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <StatCard
                    title="Total Students"
                    value={stats.students}
                    icon={GraduationCap}
                    colorClass="bg-blue-50 text-blue-600"
                    subtitle="+4% growth"
                />
                <StatCard
                    title="Total Teachers"
                    value={stats.teachers}
                    icon={Users}
                    colorClass="bg-emerald-50 text-emerald-600"
                />
                <StatCard
                    title="Active Classes"
                    value={stats.classes}
                    icon={BookOpen}
                    colorClass="bg-purple-50 text-purple-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-10 min-h-[400px] flex flex-col items-center justify-center text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8">
                        <ArrowUpRight className="w-6 h-6 text-gray-200 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-300 mb-6 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-all duration-500">
                        <TrendingUp className="w-12 h-12" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900">Performance Analytics</h3>
                    <p className="text-gray-500 mt-3 max-w-sm font-medium leading-relaxed">
                        Class-wise performance data will appear here once examinations are conducted.
                    </p>
                    <button className="mt-8 px-8 py-3 bg-gray-50 text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-colors">
                        View Sample Report
                    </button>
                </div>

                <div className="bg-indigo-600 rounded-[2rem] shadow-2xl p-10 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-black">System Status</h3>
                        <p className="mt-2 text-indigo-100 font-medium">All school services are currently operating normally.</p>

                        <div className="mt-10 space-y-4">
                            {[
                                { name: 'Student Portal', status: 'Online' },
                                { name: 'Teacher Portal', status: 'Online' },
                                { name: 'API Server', status: 'Degraded' }
                            ].map(service => (
                                <div key={service.name} className="flex items-center justify-between p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                                    <span className="font-bold">{service.name}</span>
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${service.status === 'Online' ? 'bg-emerald-400 text-emerald-950' : 'bg-amber-400 text-amber-950'}`}>
                                        {service.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Background blob */}
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                </div>
            </div>
        </div>
    );
}
