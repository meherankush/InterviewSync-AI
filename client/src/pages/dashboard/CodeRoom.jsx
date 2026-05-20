import React, { useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { Copy, DoorOpen, KeyRound, Link as LinkIcon, Play, Plus, Users, Wifi, WifiOff } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
];

const createRoomId = () => Math.random().toString(36).slice(2, 8).toUpperCase();

const CodeRoom = ({ publicAccess = false }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialRoomId = searchParams.get('room') || createRoomId();
    const [roomId, setRoomId] = useState(initialRoomId);
    const [displayName, setDisplayName] = useState(localStorage.getItem('codeRoomName') || 'Candidate');
    const [roomPassword, setRoomPassword] = useState('');
    const [joinError, setJoinError] = useState('');
    const [joined, setJoined] = useState(Boolean(searchParams.get('room')) && !publicAccess);
    const [connected, setConnected] = useState(false);
    const [copied, setCopied] = useState(false);
    const [language, setLanguage] = useState('javascript');
    const [code, setCode] = useState('');
    const [users, setUsers] = useState([]);
    const socketRef = useRef(null);
    const lastRemoteCodeRef = useRef('');
    const lineNumbers = useMemo(() => {
        const count = Math.max(code.split('\n').length, 1);
        return Array.from({ length: count }, (_, index) => index + 1).join('\n');
    }, [code]);

    const applyRemoteCode = (nextCode = '') => {
        lastRemoteCodeRef.current = nextCode;
        setCode(nextCode);
    };

    const roomLink = useMemo(() => {
        const url = new URL(window.location.href);
        url.searchParams.set('room', roomId);
        return url.toString();
    }, [roomId]);

    useEffect(() => {
        if (!joined) return undefined;

        localStorage.setItem('codeRoomName', displayName);
        setSearchParams({ room: roomId });
        setJoinError('');

        const socket = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            setConnected(true);
            socket.emit('join-room', { roomId, userName: displayName, password: roomPassword });
        });

        socket.on('disconnect', () => setConnected(false));

        socket.on('join-error', (message) => {
            setJoinError(message || 'Unable to join this room.');
            setJoined(false);
            setConnected(false);
            socket.disconnect();
        });

        socket.on('room-state', (state) => {
            applyRemoteCode(state.code || '');
            setLanguage(state.language || 'javascript');
            setUsers(state.users || []);
        });

        socket.on('code-update', (nextCode) => {
            applyRemoteCode(nextCode);
        });

        socket.on('language-update', (nextLanguage) => {
            setLanguage(nextLanguage);
        });

        socket.on('users-update', (nextUsers) => {
            setUsers(nextUsers);
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
            setConnected(false);
        };
    }, [displayName, joined, roomId, roomPassword, setSearchParams]);

    const handleJoin = (event) => {
        event.preventDefault();
        if (!roomId.trim()) return;
        if (!roomPassword.trim()) {
            setJoinError('Enter the room password.');
            return;
        }
        setJoinError('');
        setRoomId(roomId.trim().toUpperCase());
        setJoined(true);
    };

    const handleCodeChange = (value = '') => {
        setCode(value);

        if (value === lastRemoteCodeRef.current) {
            return;
        }

        socketRef.current?.emit('code-change', { roomId, code: value });
    };

    const handleLanguageChange = (event) => {
        const nextLanguage = event.target.value;
        setLanguage(nextLanguage);
        socketRef.current?.emit('language-change', { roomId, language: nextLanguage });
    };

    const copyLink = async () => {
        await navigator.clipboard.writeText(roomLink);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
    };

    const leaveRoom = () => {
        socketRef.current?.disconnect();
        setJoined(false);
        setUsers([]);
        setJoinError('');
        setSearchParams({});
    };

    return (
        <div className={`p-6 lg:p-10 max-w-7xl mx-auto min-h-[calc(100vh-4rem)] ${publicAccess ? 'pt-28 lg:pt-32' : ''}`}>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-500 mb-3">Real-time Collaboration</p>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Code Room</h1>
                    <p className="text-sm font-medium text-slate-500 mt-2">
                        {publicAccess
                            ? 'Join a coding interview room with your room ID and password.'
                            : 'Create a shared room and solve coding problems together during interviews.'}
                    </p>
                </div>

                {joined && (
                    <div className="flex flex-wrap items-center gap-3">
                        <div className={`flex items-center gap-2 px-4 py-3 rounded-2xl border text-xs font-bold ${connected ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                            {connected ? <Wifi size={16} /> : <WifiOff size={16} />}
                            {connected ? 'Connected' : 'Offline'}
                        </div>
                        <button onClick={copyLink} className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white border border-slate-100 text-slate-600 hover:text-indigo-600 font-bold text-xs transition-colors">
                            <Copy size={16} />
                            {copied ? 'Copied' : 'Invite Link'}
                        </button>
                        <button onClick={leaveRoom} className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors">
                            <DoorOpen size={16} />
                            Leave
                        </button>
                    </div>
                )}
            </div>

            {!joined ? (
                <form onSubmit={handleJoin} className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm max-w-4xl">
                    <div className="grid md:grid-cols-3 gap-5">
                        <label className="space-y-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Name</span>
                            <input
                                value={displayName}
                                onChange={(event) => setDisplayName(event.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 text-sm font-bold text-slate-800 outline-none focus:border-indigo-300"
                                placeholder="Candidate"
                            />
                        </label>
                        <label className="space-y-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Room ID</span>
                            <input
                                value={roomId}
                                onChange={(event) => setRoomId(event.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 text-sm font-bold uppercase tracking-widest text-slate-800 outline-none focus:border-indigo-300"
                                placeholder="ROOM42"
                            />
                        </label>
                        <label className="space-y-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Room Password</span>
                            <div className="relative">
                                <KeyRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="password"
                                    value={roomPassword}
                                    onChange={(event) => setRoomPassword(event.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-11 pr-4 text-sm font-bold text-slate-800 outline-none focus:border-indigo-300"
                                    placeholder="Enter password"
                                />
                            </div>
                        </label>
                    </div>
                    {joinError && (
                        <div className="mt-5 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">
                            {joinError}
                        </div>
                    )}
                    <div className="flex flex-wrap gap-3 mt-8">
                        <button type="submit" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-colors">
                            <Play size={16} />
                            {publicAccess ? 'Enter Code Room' : 'Join Room'}
                        </button>
                        <button type="button" onClick={() => setRoomId(createRoomId())} className="inline-flex items-center gap-2 bg-slate-100 text-slate-600 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-colors">
                            <Plus size={16} />
                            New ID
                        </button>
                    </div>
                </form>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-[1fr_18rem] gap-5">
                    <section className="bg-white border border-slate-100 rounded-[1.5rem] overflow-hidden shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-5 py-4 border-b border-slate-100">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center">
                                    <LinkIcon size={18} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Room</p>
                                    <p className="font-black text-slate-900 tracking-widest truncate">{roomId}</p>
                                </div>
                            </div>
                            <select value={language} onChange={handleLanguageChange} className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-indigo-300">
                                {languageOptions.map((option) => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="h-[34rem] bg-slate-950 text-slate-100 grid grid-cols-[3.5rem_1fr] overflow-hidden">
                            <pre className="select-none overflow-hidden bg-slate-900/80 px-4 py-5 text-right font-mono text-sm leading-6 text-slate-500">
                                {lineNumbers}
                            </pre>
                            <textarea
                                value={code}
                                onChange={(event) => handleCodeChange(event.target.value)}
                                spellCheck="false"
                                className="h-full w-full resize-none bg-slate-950 px-5 py-5 font-mono text-sm leading-6 text-slate-100 outline-none placeholder:text-slate-600"
                                placeholder="Start coding here..."
                            />
                        </div>
                    </section>

                    <aside className="bg-white border border-slate-100 rounded-[1.5rem] p-5 shadow-sm h-fit">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Participants</p>
                                <h2 className="text-lg font-black text-slate-900">{users.length} Online</h2>
                            </div>
                            <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center">
                                <Users size={18} />
                            </div>
                        </div>

                        <div className="space-y-3">
                            {users.map((user) => (
                                <div key={user.id} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50">
                                    <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-black uppercase">
                                        {user.name.slice(0, 2)}
                                    </div>
                                    <span className="text-sm font-bold text-slate-700 truncate">{user.name}</span>
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
};

export default CodeRoom;
