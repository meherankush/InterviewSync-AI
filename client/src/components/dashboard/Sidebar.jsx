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
        { id: 'overview', label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { id: 'start', label: 'New Interview', path: '/dashboard/start', icon: <PlayCircle size={20} /> },
        { id: 'history', label: 'Past Sessions', path: '/dashboard/history', icon: <History size={20} /> },
        { id: 'analytics', label: 'My Progress', path: '/dashboard/analytics', icon: <BarChart3 size={20} /> },
        { id: 'reports', label: 'Full Reports', path: '/dashboard/reports', icon: <FileText size={20} /> },
        { id: 'alerts', label: 'Rules Check', path: '/dashboard/alerts', icon: <ShieldAlert size={20} /> },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <aside className="w-72 bg-white border-r border-slate-100 flex flex-col h-full overflow-y-auto">
            <div className="flex-grow py-8 px-4 space-y-2">
                <div className="px-4 mb-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Main Menu</p>
                </div>

                {menuItems.map((item) => (
                    <Link
                        key={item.id}
                        to={item.path}
                        onClick={onItemClick}
                        className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all group ${isActive(item.path)
                            ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            <span className={`${isActive(item.path) ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'} transition-colors`}>
                                {item.icon}
                            </span>
                            <span className="text-sm font-black tracking-tight">{item.label}</span>
                        </div>
                        {isActive(item.path) && <ChevronRight size={14} className="opacity-70" />}
                    </Link>
                ))}
            </div>

            <div className="p-4 border-t border-slate-50">
                <button
                    onClick={() => { localStorage.removeItem('token'); window.location.href = '/'; }}
                    className="w-full flex items-center justify-between px-5 py-4 rounded-2xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
                        <span className="text-sm font-black tracking-tight">Logout</span>
                    </div>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
