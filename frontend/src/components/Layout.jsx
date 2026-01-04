import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaShieldAlt, FaSignOutAlt, FaPlus, FaThLarge, FaUserCircle } from 'react-icons/fa';

const Layout = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', label: 'Vault', icon: FaThLarge },
        { path: '/add', label: 'New Entry', icon: FaPlus },
    ];

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-slate-800/50 backdrop-blur-xl border-r border-white/5 flex flex-col">
                <div className="p-6 md:p-8 border-b border-white/5">
                    <Link to="/" className="text-2xl font-bold flex items-center gap-2 text-blue-500">
                        <FaShieldAlt /> SecureVault
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${location.pathname === item.path
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon /> {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <FaUserCircle className="text-2xl text-slate-500" />
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                            <p className="text-xs text-slate-500">Free Plan</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 relative">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
                {/* Background Blobs */}
                <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
                    <div className="absolute top-20 right-20 w-96 h-96 bg-blue-600/5 blur-[100px] rounded-full"></div>
                    <div className="absolute bottom-20 left-64 w-96 h-96 bg-purple-600/5 blur-[100px] rounded-full"></div>
                </div>
            </main>
        </div>
    );
};

export default Layout;
