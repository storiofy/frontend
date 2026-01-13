import { useState } from 'react';
import { useAuthStore } from '@store/authStore';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

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
        // TODO: Call API to update user profile
    };

    const handleCancel = () => {
        setFirstName(user?.firstName || '');
        setLastName(user?.lastName || '');
        setEmail(user?.email || '');
        setIsEditing(false);
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div 
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='%234F46E5' fill-opacity='0.3'/%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            {/* Floating Shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-32 h-32 bg-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    {/* Header Section */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
                        <p className="text-gray-600">Manage your account settings and preferences</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 space-y-2 sticky top-24">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                                        activeTab === 'profile'
                                            ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span>Profile Info</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('security')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                                        activeTab === 'security'
                                            ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    <span>Security</span>
                                </button>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            {activeTab === 'profile' && (
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
                                    {/* Profile Header */}
                                    <div className="relative h-32 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600">
                                        <div className="absolute inset-0 bg-black/10"></div>
                                    </div>

                                    {/* Avatar Section */}
                                    <div className="relative px-6 sm:px-8 pb-8">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16 mb-6">
                                            <div className="relative">
                                                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white text-4xl font-bold shadow-2xl border-4 border-white">
                                                    {user.firstName[0]}{user.lastName[0]}
                                                </div>
                                                <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-indigo-600 hover:bg-indigo-50 transition-colors">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="flex-1">
                                                <h2 className="text-2xl font-bold text-gray-900">{user.firstName} {user.lastName}</h2>
                                                <p className="text-gray-600">{user.email}</p>
                                                {user.isAdmin && (
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 mt-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs font-semibold rounded-full">
                                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                                        </svg>
                                                        Admin
                                                    </span>
                                                )}
                                            </div>
                                            {!isEditing ? (
                                                <button
                                                    onClick={() => setIsEditing(true)}
                                                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                                >
                                                    Edit Profile
                                                </button>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={handleCancel}
                                                        disabled={isSaving}
                                                        className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all disabled:opacity-50"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={handleSave}
                                                        disabled={isSaving}
                                                        className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg disabled:opacity-50"
                                                    >
                                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Profile Information */}
                                        <div className="space-y-6 pt-6 border-t border-gray-200">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            First Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={firstName}
                                                            onChange={(e) => setFirstName(e.target.value)}
                                                            disabled={!isEditing}
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600 transition-all"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Last Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={lastName}
                                                            onChange={(e) => setLastName(e.target.value)}
                                                            disabled={!isEditing}
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600 transition-all"
                                                        />
                                                    </div>
                                                    <div className="sm:col-span-2">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Email Address
                                                        </label>
                                                        <input
                                                            type="email"
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            disabled={!isEditing}
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600 transition-all"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Account Stats */}
                                            <div className="pt-6 border-t border-gray-200">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h3>
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 text-center">
                                                        <div className="text-2xl font-bold text-indigo-600">12</div>
                                                        <div className="text-xs text-gray-600 mt-1">Books Ordered</div>
                                                    </div>
                                                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 text-center">
                                                        <div className="text-2xl font-bold text-green-600">5</div>
                                                        <div className="text-xs text-gray-600 mt-1">Personalized</div>
                                                    </div>
                                                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 text-center">
                                                        <div className="text-2xl font-bold text-orange-600">3</div>
                                                        <div className="text-xs text-gray-600 mt-1">In Progress</div>
                                                    </div>
                                                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 text-center">
                                                        <div className="text-2xl font-bold text-purple-600">8</div>
                                                        <div className="text-xs text-gray-600 mt-1">Favorites</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Security Settings</h3>
                                        <p className="text-gray-600 text-sm">Manage your password and security preferences</p>
                                    </div>

                                    {/* Change Password */}
                                    <div className="pt-4 border-t border-gray-200">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h4>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Current Password
                                                </label>
                                                <input
                                                    type="password"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                    placeholder="Enter current password"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                    placeholder="Enter new password"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Confirm New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                    placeholder="Confirm new password"
                                                />
                                            </div>
                                            <button className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl">
                                                Update Password
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
