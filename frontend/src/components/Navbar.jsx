import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
    ShieldCheck, Home, User, LayoutDashboard,
    LogIn, LogOut, UserPlus, Menu, X, ChevronRight, Bell, CheckCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePortal } from '../context/PortalContext';
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from '../services/api.jsx';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, userRole, logout } = useAuth();
    const { portal } = usePortal();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [notificationsLoading, setNotificationsLoading] = useState(false);

    // ─── Scroll-aware styling ──────────────────────────────
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    const fetchNotifications = async () => {
        if (!isAuthenticated) return;
        try {
            setNotificationsLoading(true);
            const response = await getNotifications();
            setNotifications(response.data || []);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        } finally {
            setNotificationsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [isAuthenticated]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const unreadCount = notifications.filter((notification) => !notification.read).length;

    const handleNotificationClick = async (notification) => {
        if (!notification.read) {
            try {
                await markNotificationAsRead(notification.id);
                setNotifications((current) => current.map((item) => item.id === notification.id ? { ...item, read: true } : item));
            } catch (error) {
                console.error('Failed to mark notification as read', error);
            }
        }
        if (notification.complaintId && userRole === 'CITIZEN') {
            navigate('/citizen');
        }
        setNotificationsOpen(false);
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsAsRead();
            setNotifications((current) => current.map((item) => ({ ...item, read: true })));
        } catch (error) {
            console.error('Failed to mark notifications as read', error);
        }
    };

    const linkClasses = (path) => {
        const base =
            'px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900';
        return location.pathname === path
            ? `${base} bg-slate-800 text-white`
            : `${base} text-slate-300 hover:bg-slate-800 hover:text-white`;
    };

    const navLinks = [
        { to: '/', label: 'Home', icon: Home, show: true },
        {
            to: '/citizen',
            label: 'Command Center',
            icon: User,
            show: isAuthenticated && userRole === 'CITIZEN',
        },
        {
            to: '/officer',
            label: 'Officer Dashboard',
            icon: LayoutDashboard,
            show: isAuthenticated && userRole === 'OFFICER',
        },
        {
            to: '/admin',
            label: 'Admin Analytics',
            icon: LayoutDashboard,
            show: isAuthenticated && userRole === 'ADMIN',
        },
    ].filter((l) => l.show && l.to !== location.pathname);

    // ─── Portal mode: merged single bar ────────────────────
    const isPortalMode = !!portal;

    return (
        <nav
            aria-label="Main navigation"
            className={`sticky top-0 z-50 border-b border-slate-800 transition-all duration-300 ${
                scrolled
                    ? 'bg-slate-900/85 backdrop-blur-md shadow-xl'
                    : 'bg-slate-900 shadow-lg'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ── Main Row ───────────────────────────── */}
                <div className="flex items-center justify-between h-16">

                    {/* Left: Logo + Portal breadcrumb */}
                    <div className="flex items-center gap-2 min-w-0">
                        <Link
                            to="/"
                            className="flex items-center gap-2.5 group shrink-0 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-lg"
                        >
                            <div className="bg-blue-600/20 p-1.5 rounded-lg border border-blue-500/30 group-hover:bg-blue-600/30 group-hover:scale-110 transition-all duration-200">
                                <ShieldCheck className="h-5 w-5 text-blue-400" />
                            </div>
                            <span className="font-bold text-lg text-white tracking-tight group-hover:text-blue-300 transition-colors duration-200">
                                LokShikayat
                            </span>
                        </Link>

                        {/* Portal breadcrumb — shown when on a portal page */}
                        {isPortalMode && (
                            <div className="hidden md:flex items-center gap-2 text-slate-500 min-w-0">
                                <ChevronRight className="w-4 h-4 shrink-0" />
                                <span className="text-sm font-semibold text-slate-300 truncate">
                                    {portal.title}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Center: Portal-injected content OR regular nav links */}
                    {isPortalMode ? (
                        <div className="hidden md:flex items-center gap-3">
                            {portal.content}
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center space-x-1">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        className={linkClasses(link.to)}
                                        aria-current={location.pathname === link.to ? 'page' : undefined}
                                    >
                                        <Icon className="h-4 w-4" /> {link.label}
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    {/* Right: Auth buttons */}
                    <div className="hidden md:flex items-center gap-3 shrink-0">
                        {isAuthenticated ? (
                            <>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setNotificationsOpen((value) => !value);
                                            fetchNotifications();
                                        }}
                                        className="relative bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg transition-colors duration-200 border border-slate-700 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                                        aria-label="Open notifications"
                                    >
                                        <Bell className="h-4 w-4" />
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </button>
                                    {notificationsOpen && (
                                        <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50">
                                            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                                                <p className="font-bold text-slate-900 text-sm">Notifications</p>
                                                <button onClick={handleMarkAllRead} className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                                    <CheckCheck className="w-3.5 h-3.5" />
                                                    Mark all read
                                                </button>
                                            </div>
                                            <div className="max-h-96 overflow-y-auto">
                                                {notificationsLoading ? (
                                                    <p className="p-4 text-sm text-slate-500">Loading notifications...</p>
                                                ) : notifications.length === 0 ? (
                                                    <p className="p-4 text-sm text-slate-500">No notifications yet.</p>
                                                ) : notifications.slice(0, 10).map((notification) => (
                                                    <button
                                                        key={notification.id}
                                                        type="button"
                                                        onClick={() => handleNotificationClick(notification)}
                                                        className={`w-full text-left px-4 py-3 border-b border-slate-100 hover:bg-slate-50 ${notification.read ? 'bg-white' : 'bg-blue-50/60'}`}
                                                    >
                                                        <p className="text-sm font-semibold text-slate-900">{notification.title}</p>
                                                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">{notification.message}</p>
                                                        <p className="text-[11px] text-slate-400 mt-2">{new Date(notification.createdAt).toLocaleString('en-IN')}</p>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 border border-slate-700 flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                                >
                                    <LogOut className="h-4 w-4" /> Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
                                        location.pathname === '/login'
                                            ? 'text-white bg-slate-800'
                                            : 'text-slate-300 hover:text-white'
                                    }`}
                                    aria-current={location.pathname === '/login' ? 'page' : undefined}
                                >
                                    <LogIn className="h-4 w-4" /> Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className={`px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors duration-200 shadow-sm focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
                                        location.pathname === '/register'
                                            ? 'bg-blue-700 text-white'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    }`}
                                    aria-current={location.pathname === '/register' ? 'page' : undefined}
                                >
                                    <UserPlus className="h-4 w-4" /> Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <div className="flex md:hidden items-center">
                        <button
                            onClick={() => setMobileMenuOpen((v) => !v)}
                            className="text-slate-300 hover:text-white p-2 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                            aria-expanded={mobileMenuOpen}
                            aria-controls="mobile-nav-menu"
                            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Mobile slide-down ─────────────────────────── */}
            <div
                id="mobile-nav-menu"
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                    mobileMenuOpen ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="px-4 pb-4 pt-2 space-y-2 border-t border-slate-800">

                    {/* Portal info on mobile */}
                    {isPortalMode && (
                        <div className="pb-3 mb-2 border-b border-slate-800">
                            <p className="text-sm font-semibold text-slate-300">{portal.title}</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {portal.mobileContent || portal.content}
                            </div>
                        </div>
                    )}

                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`block ${linkClasses(link.to)}`}
                                aria-current={location.pathname === link.to ? 'page' : undefined}
                            >
                                <Icon className="h-4 w-4" /> {link.label}
                            </Link>
                        );
                    })}

                    <div className="border-t border-slate-800 pt-3 mt-3 space-y-1">
                        {isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 transition-colors duration-200"
                            >
                                <LogOut className="h-4 w-4" /> Sign Out
                            </button>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className={`block px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors duration-200 ${
                                        location.pathname === '/login'
                                            ? 'text-white bg-slate-800'
                                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                    }`}
                                >
                                    <LogIn className="h-4 w-4" /> Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="block px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 transition-colors duration-200"
                                >
                                    <UserPlus className="h-4 w-4" /> Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
