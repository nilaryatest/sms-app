import { Signal, RadioReceiver, Monitor } from 'lucide-react';

export default function SuperAdminCommunications() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header>
                <h1 className="text-3xl font-black tracking-tight text-gray-900">Communication Hub</h1>
                <p className="text-gray-500 mt-1 font-medium">
                    Direct access to public website content, push notifications, and global alerts.
                </p>
            </header>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center py-20">
                <Signal className="w-16 h-16 text-indigo-200 mb-4" />
                <h3 className="text-xl font-bold text-gray-900">Global Broadcasting</h3>
                <p className="text-gray-500 mt-2 max-w-lg mx-auto">
                    Manage overriding push notifications, emergency SMS blasts, and main website gallery approvals across all roles (Students, Teachers, Admins).
                </p>
                <button className="flex items-center gap-2 mt-8 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition duration-200 shadow shadow-indigo-600/20">
                    <Monitor className="w-4 h-4" />
                    Manage Public Content
                </button>
            </div>
        </div>
    );
}
