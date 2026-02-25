import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Plus, Users, Search, Loader2, Trash2, Mail, Phone, Shield, GraduationCap, Briefcase } from 'lucide-react';

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('ALL');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        role: 'STUDENT',
        phone_number: ''
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get('/users/');
            setUsers(res.data);
        } catch (err) {
            console.error("Failed to fetch users", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/users/', formData);
            setUsers([...users, res.data]);
            setIsAddModalOpen(false);
            setFormData({
                email: '',
                password: '',
                first_name: '',
                last_name: '',
                role: 'STUDENT',
                phone_number: ''
            });
        } catch (err) {
            console.error("Failed to add user", err);
            alert("Error: " + (err.response?.data?.detail || "Failed to create user"));
        }
    };

    const filteredUsers = activeTab === 'ALL' ? users : users.filter(u => u.role === activeTab);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Users & Staff</h1>
                    <p className="mt-2 text-lg text-gray-500 font-medium">Manage all accounts for students, teachers, and admins.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-700 hover:translate-y-[-2px] transition-all active:translate-y-0"
                >
                    <Plus className="w-5 h-5" />
                    Add New Account
                </button>
            </header>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl w-full md:w-fit overflow-x-auto no-scrollbar">
                    {['ALL', 'STUDENT', 'TEACHER', 'ADMIN'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all whitespace-nowrap ${activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search accounts..."
                        className="w-full pl-12 pr-4 py-3 border border-gray-100 bg-white rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                </div>
            </div>

            {loading ? (
                <div className="h-96 flex flex-col items-center justify-center text-gray-400">
                    <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-500" />
                    <p className="font-bold">Syncing user database...</p>
                </div>
            ) : (
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 border-b border-gray-50">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Identity</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-indigo-50/20 transition-colors group">
                                        <td className="px-8 py-5 flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500 font-black border-2 border-white shadow-sm ring-1 ring-gray-100">
                                                {user.first_name[0]}{user.last_name[0]}
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 leading-none mb-1">{user.first_name} {user.last_name}</p>
                                                <p className="text-xs text-gray-400 font-bold">{user.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase flex items-center gap-2 w-fit ${user.role === 'ADMIN' ? 'bg-purple-50 text-purple-700' :
                                                    user.role === 'TEACHER' ? 'bg-emerald-50 text-emerald-700' :
                                                        'bg-blue-50 text-blue-700'
                                                }`}>
                                                {user.role === 'ADMIN' ? <Shield className="w-3 h-3" /> :
                                                    user.role === 'TEACHER' ? <Briefcase className="w-3 h-3" /> :
                                                        <GraduationCap className="w-3 h-3" />}
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-xs text-gray-500 font-bold">
                                                    <Mail className="w-3 h-3 opacity-50" />
                                                    {user.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-500 font-bold">
                                                    <Phone className="w-3 h-3 opacity-50" />
                                                    {user.phone_number || 'No phone'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Add User Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="bg-indigo-600 p-10 text-white flex justify-between items-center">
                            <div>
                                <h3 className="text-3xl font-black tracking-tight">New Account</h3>
                                <p className="text-indigo-100 font-bold mt-1 uppercase tracking-widest text-[10px]">Credential Creation Portal</p>
                            </div>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-white/50 hover:text-white transition-colors">
                                <Plus className="w-8 h-8 rotate-45" />
                            </button>
                        </div>
                        <form onSubmit={handleAddUser} className="p-10 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        placeholder="John"
                                        value={formData.first_name}
                                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        placeholder="Doe"
                                        value={formData.last_name}
                                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                <input
                                    type="email"
                                    className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    placeholder="user@school.edu"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">User Role</label>
                                    <select
                                        className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="STUDENT">Student</option>
                                        <option value="TEACHER">Teacher</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                </div>
                            </div>

                            <button className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-lg tracking-tight hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-95 mt-4">
                                Create Account
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
