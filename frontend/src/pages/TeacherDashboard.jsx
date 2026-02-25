export default function TeacherDashboard() {
    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Teacher Dashboard</h1>
                <p className="mt-2 text-lg text-gray-500">Manage your classes and enter results.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Classes Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900">My Classes Today</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            3 Sessions
                        </span>
                    </div>
                    <ul className="divide-y divide-gray-50">
                        <li className="px-6 py-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-900">Grade 10 - Section A</p>
                                <p className="text-xs text-gray-500 mt-1">Mathematics • 09:00 AM - 10:30 AM</p>
                            </div>
                            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                                Take Attendance
                            </button>
                        </li>
                        <li className="px-6 py-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-900">Grade 11 - Section B</p>
                                <p className="text-xs text-gray-500 mt-1">Physics • 11:00 AM - 12:30 PM</p>
                            </div>
                            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                                Take Attendance
                            </button>
                        </li>
                        <li className="px-6 py-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-900">Grade 10 - Section C</p>
                                <p className="text-xs text-gray-500 mt-1">Mathematics • 01:30 PM - 03:00 PM</p>
                            </div>
                            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                                Take Attendance
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Upload Exam Results</h3>
                    <p className="text-sm text-gray-500 max-w-sm mx-auto">
                        The Mid-Term examination results portal is currently open. Ensure all marks are entered by Friday.
                    </p>
                    <div className="pt-2">
                        <button className="inline-flex justify-center px-4 py-2 text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all">
                            Start Uploading
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
