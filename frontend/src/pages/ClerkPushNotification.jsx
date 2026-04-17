import { Bell, Send } from 'lucide-react';

export default function ClerkPushNotification() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header>
                <h1 className="text-3xl font-black tracking-tight text-gray-900">Push Notification</h1>
                <p className="text-gray-500 mt-1 font-medium">
                    Send important announcements and alerts directly to the main school website.
                </p>
            </header>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center py-20">
                <Bell className="w-16 h-16 text-indigo-200 mb-4" />
                <h3 className="text-xl font-bold text-gray-900">Push System Ready</h3>
                <p className="text-gray-500 mt-2 max-w-md">
                    Use this tool to compose short messages that will appear as pop-up notifications or banners on the informational school site.
                </p>
                <button className="mt-8 px-6 py-2.5 flex items-center gap-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition duration-200">
                    <Send className="w-4 h-4" />
                    Compose Notification
                </button>
            </div>
        </div>
    );
}
