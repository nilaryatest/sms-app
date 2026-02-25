import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { GraduationCap, Mail, Lock, AlertCircle, Loader2, BookOpen, ShieldCheck, Sparkles } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
});

const ROLE_THEMES = {
    STUDENT: {
        id: 'STUDENT',
        label: 'Scholar',
        color: 'from-emerald-500 to-sky-500',
        textColor: 'text-emerald-600',
        ringColor: 'focus:ring-emerald-500',
        borderColor: 'focus:border-emerald-500',
        buttonBg: 'bg-emerald-600 hover:bg-emerald-700',
        icon: GraduationCap,
        greeting: 'Ready to learn?',
        subtext: 'Join your virtual classroom',
        blobColor: 'bg-emerald-200'
    },
    TEACHER: {
        id: 'TEACHER',
        label: 'Faculty',
        color: 'from-indigo-600 to-violet-600',
        textColor: 'text-indigo-600',
        ringColor: 'focus:ring-indigo-500',
        borderColor: 'focus:border-indigo-500',
        buttonBg: 'bg-indigo-600 hover:bg-indigo-700',
        icon: BookOpen,
        greeting: 'Manage your classes',
        subtext: 'Access student records & grading',
        blobColor: 'bg-indigo-200'
    },
    ADMIN: {
        id: 'ADMIN',
        label: 'Admin',
        color: 'from-slate-800 to-slate-900',
        textColor: 'text-slate-900',
        ringColor: 'focus:ring-slate-800',
        borderColor: 'focus:border-slate-800',
        buttonBg: 'bg-slate-900 hover:bg-black',
        icon: ShieldCheck,
        greeting: 'Command Center',
        subtext: 'Oversee school infrastructure',
        blobColor: 'bg-slate-300'
    }
};

export default function Login() {
    const navigate = useNavigate();
    const { login, isLoading, error } = useAuthStore();
    const [selectedRole, setSelectedRole] = useState('STUDENT');
    const theme = ROLE_THEMES[selectedRole];

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data) => {
        const success = await login(data.email, data.password);
        if (success) {
            const role = useAuthStore.getState().role;
            if (role === 'ADMIN') navigate('/admin/dashboard');
            else if (role === 'TEACHER') navigate('/teacher/dashboard');
            else if (role === 'STUDENT') navigate('/student/dashboard');
        }
    };

    return (
        <div className={`min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-1000 bg-gray-50`}>

            {/* Animated Blobs centered behind the card */}
            <div className={`absolute top-1/4 -left-20 w-96 h-96 ${theme.blobColor} rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob transition-colors duration-1000`}></div>
            <div className={`absolute top-1/3 -right-20 w-96 h-96 ${theme.blobColor} rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 transition-colors duration-1000`}></div>
            <div className={`absolute -bottom-20 left-1/3 w-96 h-96 ${theme.blobColor} rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 transition-colors duration-1000`}></div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 space-y-8">
                {/* Brand & Toggle Section */}
                <div className="text-center space-y-6">
                    <div className="flex justify-center">
                        <div className={`p-4 bg-white rounded-3xl shadow-2xl border border-gray-100 flex items-center justify-center transition-transform duration-500 hover:scale-110 active:scale-95 cursor-pointer`}>
                            <theme.icon className={`w-12 h-12 transition-colors duration-500 ${theme.textColor}`} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-5xl font-black text-gray-900 tracking-tighter animate-in slide-in-from-top-4 duration-500">
                            {theme.greeting}
                        </h2>
                        <p className="text-gray-500 font-medium text-sm md:text-base opacity-70 flex items-center justify-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-400" /> {theme.subtext}
                        </p>
                    </div>

                    {/* Role Switcher */}
                    <div className="flex justify-center p-1.5 bg-white rounded-[2rem] shadow-sm border border-gray-100 w-fit mx-auto scale-95 md:scale-100">
                        {Object.values(ROLE_THEMES).map((r) => (
                            <button
                                key={r.id}
                                onClick={() => setSelectedRole(r.id)}
                                className={`
                                    px-6 py-2.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2
                                    ${selectedRole === r.id
                                        ? `bg-gray-900 text-white shadow-lg shadow-gray-200`
                                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                    }
                                `}
                            >
                                <r.icon className="w-3.5 h-3.5" />
                                {r.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-3xl py-10 px-6 shadow-2xl shadow-indigo-100/20 sm:rounded-[3rem] border border-white sm:px-12 animate-in fade-in zoom-in-95 duration-700">
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <p className="font-bold">{error}</p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:${theme.textColor} transition-colors`}>
                                    <Mail className="h-5 w-5" />
                                </div>
                                <input
                                    {...register("email")}
                                    className={`appearance-none block w-full pl-12 pr-4 py-4 border-2 ${errors.email ? 'border-red-100 bg-red-50 focus:border-red-500 focus:ring-red-500' : `border-gray-50 focus:bg-white ${theme.borderColor} ${theme.ringColor}`} rounded-[1.5rem] shadow-sm placeholder-gray-300 focus:outline-none sm:text-sm bg-gray-50/50 transition-all duration-300 font-bold text-gray-900`}
                                    placeholder="you@school.edu"
                                />
                            </div>
                            {errors.email && <p className="mt-2 text-[10px] text-red-600 font-black uppercase tracking-widest ml-4">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                Password
                            </label>
                            <div className="relative group">
                                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:${theme.textColor} transition-colors`}>
                                    <Lock className="h-5 w-5" />
                                </div>
                                <input
                                    {...register("password")}
                                    type="password"
                                    className={`appearance-none block w-full pl-12 pr-4 py-4 border-2 ${errors.password ? 'border-red-100 bg-red-50 focus:border-red-500 focus:ring-red-500' : `border-gray-50 focus:bg-white ${theme.borderColor} ${theme.ringColor}`} rounded-[1.5rem] shadow-sm placeholder-gray-300 focus:outline-none sm:text-sm bg-gray-50/50 transition-all duration-300 font-bold text-gray-900`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && <p className="mt-2 text-[10px] text-red-600 font-black uppercase tracking-widest ml-4">{errors.password.message}</p>}
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-[1.5rem] shadow-xl text-xs font-black uppercase tracking-widest text-white transition-all duration-500 transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100 ${theme.buttonBg}`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Verifying Credentials...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <theme.icon className="w-5 h-5" />
                                        Authenticating {theme.label}
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
                            EduManage Secure Gateway v2.0
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
