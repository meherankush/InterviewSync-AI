import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    PlayCircle,
    History,
    BarChart3,
    FileText,
    ShieldAlert,
    ChevronRight,
    LogOut
} from 'lucide-react';

const Sidebar = ({ onItemClick }) => {
    const location = useLocation();

    const menuItems = [
        { id: 'overview', label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
        { id: 'start', label: 'New Session', path: '/dashboard/start', icon: <PlayCircle size={18} /> },
        { id: 'history', label: 'History', path: '/dashboard/history', icon: <History size={18} /> },
        { id: 'analytics', label: 'Progress', path: '/dashboard/analytics', icon: <BarChart3 size={18} /> },
        { id: 'reports', label: 'Reports', path: '/dashboard/reports', icon: <FileText size={18} /> },
        { id: 'alerts', label: 'Security', path: '/dashboard/alerts', icon: <ShieldAlert size={18} /> },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <aside className="w-64 bg-white border-r border-slate-100 flex flex-col h-full overflow-y-auto">
            <div className="flex-grow py-10 px-4 space-y-1">
                <div className="px-5 mb-8">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Main Menu</p>
                </div>

                {menuItems.map((item) => (
                    <Link
                        key={item.id}
                        to={item.path}
                        onClick={onItemClick}
                        className={`flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-300 group ${isActive(item.path)
                            ? 'bg-indigo-50 text-indigo-600'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            <span className={`${isActive(item.path) ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500'} transition-colors`}>
                                {item.icon}
                            </span>
                            <span className="text-sm font-bold tracking-tight">{item.label}</span>
                        </div>
                        {isActive(item.path) && <div className="w-1 h-4 bg-indigo-500 rounded-full" />}
                    </Link>
                ))}
            </div>

            <div className="p-4 border-t border-slate-50">
                <button
                    onClick={() => { localStorage.removeItem('token'); window.location.href = '/'; }}
                    className="w-full flex items-center justify-between px-5 py-4 rounded-2xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <LogOut size={18} className="group-hover:rotate-12 transition-transform duration-500" />
                        <span className="text-sm font-bold tracking-tight">Logout</span>
                    </div>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
