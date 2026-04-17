import { Image, UploadCloud } from 'lucide-react';

export default function ClerkPushGallery() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header>
                <h1 className="text-3xl font-black tracking-tight text-gray-900">Push Gallery Photo</h1>
                <p className="text-gray-500 mt-1 font-medium">
                    Upload and publish photos to the school's public website gallery.
                </p>
            </header>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center py-20">
                <Image className="w-16 h-16 text-indigo-200 mb-4" />
                <h3 className="text-xl font-bold text-gray-900">Gallery Sync Active</h3>
                <p className="text-gray-500 mt-2 max-w-md">
                    Select images of recent events, achievements, or campus activities to keep the main website's gallery refreshed and engaging.
                </p>
                <button className="mt-8 flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition duration-200">
                    <UploadCloud className="w-4 h-4" />
                    Upload Photos
                </button>
            </div>
        </div>
    );
}
