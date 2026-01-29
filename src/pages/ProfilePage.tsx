import { useState } from 'react';
import { useAuthStore } from '@store/authStore';
import { useNavigate } from 'react-router-dom';
import { User, Shield, Package, Heart, LogOut, ChevronRight, Edit3, Camera, Sparkles, MapPin, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfilePage() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'orders' | 'wishlist'>('profile');

    // Form states
    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFirstName(user?.firstName || '');
        setLastName(user?.lastName || '');
        setEmail(user?.email || '');
        setIsEditing(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    const tabs = [
        { id: 'profile', label: 'Magic Profile', icon: User, color: 'text-blue-500' },
        { id: 'orders', label: 'My Adventures', icon: Package, color: 'text-pink-500' },
        { id: 'wishlist', label: 'Story Wishlist', icon: Heart, color: 'text-rose-500' },
        { id: 'security', label: 'Vault Security', icon: Shield, color: 'text-indigo-500' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 py-16 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

                    {/* Left: Nav Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
                            <div className="flex flex-col items-center mb-8">
                                <div className="relative group">
                                    <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-pink-100 border-4 border-white transition group-hover:scale-105">
                                        {user.firstName[0]}{user.lastName[0]}
                                    </div>
                                    <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-gray-900 rounded-2xl flex items-center justify-center text-white shadow-lg hover:bg-black transition border-4 border-white">
                                        <Camera className="w-4 h-4" />
                                    </button>
                                </div>
                                <h2 className="mt-6 text-2xl font-black text-gray-900">{user.firstName} {user.lastName}</h2>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">{user.email}</p>
                                {user.isAdmin && (
                                    <div className="mt-3 px-3 py-1 bg-gray-900 rounded-full flex items-center gap-1.5">
                                        <Sparkles className="w-3 h-3 text-pink-500" />
                                        <span className="text-[8px] font-black uppercase tracking-widest text-white">Magic Admin</span>
                                    </div>
                                )}
                            </div>

                            <nav className="space-y-2">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`w-full h-14 flex items-center justify-between px-6 rounded-2xl transition-all ${activeTab === tab.id
                                            ? 'bg-gray-900 text-white shadow-lg shadow-gray-200'
                                            : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900 font-bold'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-pink-500' : ''}`} />
                                            <span className="text-xs font-black uppercase tracking-widest">{tab.label}</span>
                                        </div>
                                        <ChevronRight className={`w-4 h-4 ${activeTab === tab.id ? 'opacity-100' : 'opacity-0'}`} />
                                    </button>
                                ))}
                                <div className="pt-4 border-t border-gray-100 mt-4">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full h-14 flex items-center gap-4 px-6 rounded-2xl text-rose-500 hover:bg-rose-50 transition-colors"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span className="text-xs font-black uppercase tracking-widest">Sign Out</span>
                                    </button>
                                </div>
                            </nav>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-[2.5rem] p-8 text-white text-center shadow-xl shadow-blue-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-full blur-xl"></div>
                            <Sparkles className="w-10 h-10 text-white/50 mx-auto mb-4" />
                            <h4 className="font-black text-lg mb-2">Magic Credits</h4>
                            <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest mb-6 leading-relaxed">
                                You have <span className="text-white font-black text-sm">240</span> points to spend!
                            </p>
                            <button className="h-12 px-6 bg-white text-blue-600 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:shadow-xl transition-all w-full">
                                Redeem Now
                            </button>
                        </div>
                    </div>

                    {/* Right: Content Area */}
                    <div className="lg:col-span-8 flex flex-col gap-6">

                        <AnimatePresence mode="wait">
                            {activeTab === 'profile' && (
                                <motion.div
                                    key="profile"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                                        <div className="bg-gray-900 p-8 text-white flex justify-between items-center">
                                            <div>
                                                <h3 className="text-lg font-black uppercase tracking-wider">Account Hero</h3>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-1">Manage your basic details</p>
                                            </div>
                                            {!isEditing ? (
                                                <button onClick={() => setIsEditing(true)} className="h-10 px-5 bg-white/10 hover:bg-white/20 rounded-xl flex items-center gap-2 transition">
                                                    <Edit3 className="w-4 h-4" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Edit</span>
                                                </button>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <button onClick={handleCancel} className="h-10 px-5 bg-white/10 hover:bg-white/20 rounded-xl transition">
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Cancel</span>
                                                    </button>
                                                    <button onClick={handleSave} className="h-10 px-5 bg-pink-500 hover:bg-pink-600 rounded-xl transition text-white">
                                                        <span className="text-[10px] font-black uppercase tracking-widest">{isSaving ? 'Saving...' : 'Save'}</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-8 md:p-10 space-y-10">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">First Name</label>
                                                    <input
                                                        value={firstName}
                                                        onChange={e => setFirstName(e.target.value)}
                                                        disabled={!isEditing}
                                                        className="w-full h-14 px-6 rounded-2xl border-2 border-gray-100 focus:border-blue-500 transition-all outline-none font-bold text-gray-900 disabled:bg-gray-50/50"
                                                    />
                                                </div>
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Last Name</label>
                                                    <input
                                                        value={lastName}
                                                        onChange={e => setLastName(e.target.value)}
                                                        disabled={!isEditing}
                                                        className="w-full h-14 px-6 rounded-2xl border-2 border-gray-100 focus:border-blue-500 transition-all outline-none font-bold text-gray-900 disabled:bg-gray-50/50"
                                                    />
                                                </div>
                                                <div className="md:col-span-2 space-y-4">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Email Connection</label>
                                                    <input
                                                        value={email}
                                                        onChange={e => setEmail(e.target.value)}
                                                        disabled={!isEditing}
                                                        className="w-full h-14 px-6 rounded-2xl border-2 border-gray-100 focus:border-blue-500 transition-all outline-none font-bold text-gray-900 disabled:bg-gray-50/50"
                                                    />
                                                </div>
                                            </div>

                                            <div className="pt-10 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-6">
                                                {[
                                                    { label: 'Orders', val: '12', color: 'text-blue-500', bg: 'bg-blue-50' },
                                                    { label: 'Books', val: '5', color: 'text-pink-500', bg: 'bg-pink-50' },
                                                    { label: 'Active', val: '3', color: 'text-amber-500', bg: 'bg-amber-50' },
                                                    { label: 'Likes', val: '8', color: 'text-rose-500', bg: 'bg-rose-50' }
                                                ].map((stat, idx) => (
                                                    <div key={idx} className={`${stat.bg} rounded-3xl p-6 text-center shadow-sm`}>
                                                        <div className={`text-2xl font-black ${stat.color}`}>{stat.val}</div>
                                                        <div className="text-[8px] font-black uppercase tracking-widest text-gray-400 mt-1">{stat.label}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex items-center gap-6">
                                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
                                                <MapPin className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Addresses</h4>
                                                <p className="text-[10px] font-bold text-gray-400 mt-1 underline cursor-pointer hover:text-blue-500 transition">Manage your drops</p>
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex items-center gap-6">
                                            <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-500">
                                                <Bell className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Notifications</h4>
                                                <p className="text-[10px] font-bold text-gray-400 mt-1 underline cursor-pointer hover:text-blue-500 transition">Control magic alerts</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {(activeTab === 'security' || activeTab === 'orders' || activeTab === 'wishlist') && (
                                <motion.div
                                    key="others"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-12 flex flex-col items-center text-center justify-center min-h-[400px]"
                                >
                                    <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-8">
                                        <Sparkles className="w-12 h-12 text-gray-200" />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tighter">Magical Area Coming Soon</h3>
                                    <p className="text-gray-400 font-bold max-w-xs mx-auto text-sm">
                                        We're busy polishing this enchanted corner of your account. Check back very soon!
                                    </p>
                                    <div className="mt-8 flex gap-2">
                                        {[1, 2, 3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-pink-500/20"></div>)}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
