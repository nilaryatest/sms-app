import { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import api from '../utils/api';
import { User, Mail, Shield, Key, Loader2, Save, Camera, Smartphone, MapPin } from 'lucide-react';

export default function Profile() {
    const { user, role } = useAuthStore();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const endpoint = role === 'STUDENT' ? '/students/me' : '/users/me';
            // Note: Add /users/me or similar for general profile if needed
            const res = await api.get(endpoint);
            setProfile(res.data);
        } catch (err) {
            console.error("Failed to fetch profile", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-gray-400">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-500" />
                <p className="font-bold uppercase tracking-widest text-xs">Syncing your digital identity...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-gray-100">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="relative group cursor-pointer">
                        <div className="w-40 h-40 rounded-[3rem] bg-indigo-600 flex items-center justify-center text-5xl font-black text-white shadow-2xl shadow-indigo-200 border-8 border-white group-hover:scale-105 transition-transform duration-500 relative z-10">
                            {user?.first_name[0]}{user?.last_name[0]}
                        </div>
                        <div className="absolute inset-0 bg-black/40 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center text-white scale-105 transition-transform border-8 border-transparent">
                            <Camera className="w-8 h-8" />
                        </div>
                    </div>
                    <div className="text-center md:text-left space-y-2">
                        <span className="px-5 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                            Account {role}
                        </span>
                        <h1 className="text-5xl font-black text-gray-900 tracking-tighter">{user?.first_name} {user?.last_name}</h1>
                        <p className="text-gray-400 font-bold flex items-center justify-center md:justify-start gap-2 uppercase tracking-widest text-xs">
                            <Shield className="w-4 h-4 text-emerald-400" /> Member since {profile?.enrollment_date || profile?.joining_date || '2026'}
                        </p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-8">
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-3">
                        <User className="w-4 h-4 text-indigo-500" /> Personal Profile
                    </h3>

                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="email"
                                    defaultValue={user?.username}
                                    readOnly
                                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-500 cursor-not-allowed outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                            <div className="relative">
                                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="+1 (555) 000-0000"
                                    className="w-full pl-12 pr-6 py-4 bg-white border-2 border-gray-100 rounded-2xl font-bold text-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none placeholder:text-gray-300"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Current Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="City, State, Country"
                                    className="w-full pl-12 pr-6 py-4 bg-white border-2 border-gray-100 rounded-2xl font-bold text-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none placeholder:text-gray-300"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Settings */}
                <div className="bg-gray-900 p-10 rounded-[2.5rem] shadow-2xl text-white space-y-8 relative overflow-hidden group">
                    <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest flex items-center gap-3 relative z-10">
                        <Key className="w-4 h-4" /> Security & Access
                    </h3>

                    <div className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">New Password</label>
                            <input
                                type="password"
                                placeholder="••••••••••••"
                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-white focus:bg-white/10 focus:border-indigo-500 transition-all outline-none placeholder:text-gray-600"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Confirm Password</label>
                            <input
                                type="password"
                                placeholder="••••••••••••"
                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-white focus:bg-white/10 focus:border-indigo-500 transition-all outline-none placeholder:text-gray-600"
                            />
                        </div>

                        <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-950 transition-all active:scale-95">
                            Update Security
                        </button>
                    </div>

                    {/* Gradient Blob */}
                    <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-colors"></div>
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <button
                    onClick={fetchProfile}
                    className="px-8 py-4 bg-white border border-gray-200 text-gray-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors"
                >
                    Discard
                </button>
                <button
                    disabled={saving}
                    className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 flex items-center gap-2 transition-all active:scale-95"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Profile Changes
                </button>
            </div>
        </div>
    );
}
