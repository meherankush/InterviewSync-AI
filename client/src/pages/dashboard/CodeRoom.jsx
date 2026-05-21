import React, { useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { Copy, DoorOpen, KeyRound, Link as LinkIcon, Play, Plus, Users, Wifi, WifiOff } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
];

const snippets = {
    javascript: [
        { trigger: 'main', label: 'Node.js starter', code: 'function main() {\n  \n}\n\nmain();' },
        { trigger: 'fun', label: 'function declaration', code: 'function solve() {\n  \n}' },
        { trigger: 'for', label: 'for loop', code: 'for (let i = 0; i < n; i += 1) {\n  \n}' },
        { trigger: 'if', label: 'if statement', code: 'if (condition) {\n  \n}' },
        { trigger: 'arr', label: 'array declaration', code: 'const arr = [];' },
        { trigger: 'map', label: 'Map initialization', code: 'const map = new Map();' },
        { trigger: 'log', label: 'console output', code: 'console.log(result);' },
    ],
    python: [
        { trigger: 'main', label: 'Python main guard', code: 'def main():\n    \n\nif __name__ == "__main__":\n    main()' },
        { trigger: 'def', label: 'function declaration', code: 'def solve():\n    pass' },
        { trigger: 'for', label: 'for loop', code: 'for i in range(n):\n    pass' },
        { trigger: 'if', label: 'if statement', code: 'if condition:\n    pass' },
        { trigger: 'while', label: 'while loop', code: 'while condition:\n    pass' },
        { trigger: 'list', label: 'list input', code: 'nums = list(map(int, input().split()))' },
        { trigger: 'inp', label: 'read input', code: 'n = int(input())' },
        { trigger: 'print', label: 'print output', code: 'print(result)' },
    ],
    java: [
        { trigger: 'publ', label: 'Java main class', code: 'public class Main {\n    public static void main(String[] args) {\n        \n    }\n}' },
        { trigger: 'main', label: 'main method', code: 'public static void main(String[] args) {\n    \n}' },
        { trigger: 'class', label: 'class declaration', code: 'class Solution {\n    \n}' },
        { trigger: 'for', label: 'for loop', code: 'for (int i = 0; i < n; i++) {\n    \n}' },
        { trigger: 'arr', label: 'array declaration', code: 'int[] arr = new int[n];' },
        { trigger: 'scan', label: 'Scanner input', code: 'Scanner sc = new Scanner(System.in);' },
        { trigger: 'sout', label: 'System.out.println', code: 'System.out.println(result);' },
    ],
    cpp: [
        { trigger: 'main', label: 'C++ main function', code: 'int main() {\n    \n    return 0;\n}' },
        { trigger: 'inc', label: 'C++ starter', code: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}' },
        { trigger: 'for', label: 'for loop', code: 'for (int i = 0; i < n; i++) {\n    \n}' },
        { trigger: 'if', label: 'if statement', code: 'if (condition) {\n    \n}' },
        { trigger: 'vec', label: 'vector declaration', code: 'vector<int> nums(n);' },
        { trigger: 'cout', label: 'cout output', code: 'cout << result << endl;' },
    ],
};

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
    const [stdin, setStdin] = useState('');
    const [runResult, setRunResult] = useState(null);
    const [runError, setRunError] = useState('');
    const [running, setRunning] = useState(false);
    const socketRef = useRef(null);
    const editorRef = useRef(null);
    const lastRemoteCodeRef = useRef('');
    const [cursorPosition, setCursorPosition] = useState(0);
    const lineNumbers = useMemo(() => {
        const count = Math.max(code.split('\n').length, 1);
        return Array.from({ length: count }, (_, index) => index + 1).join('\n');
    }, [code]);
    const currentWord = useMemo(() => {
        const beforeCursor = code.slice(0, cursorPosition);
        return beforeCursor.match(/[A-Za-z_][A-Za-z0-9_]*$/)?.[0] || '';
    }, [code, cursorPosition]);
    const recommendations = useMemo(() => {
        if (!currentWord) return [];
        return (snippets[language] || [])
            .filter((item) => item.trigger.startsWith(currentWord.toLowerCase()) || item.label.toLowerCase().includes(currentWord.toLowerCase()))
            .slice(0, 3);
    }, [currentWord, language]);

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

    const updateCursorPosition = () => {
        setCursorPosition(editorRef.current?.selectionStart || 0);
    };

    const insertRecommendation = (recommendation) => {
        const start = Math.max(cursorPosition - currentWord.length, 0);
        const nextCode = `${code.slice(0, start)}${recommendation.code}${code.slice(cursorPosition)}`;
        const nextCursor = start + recommendation.code.length;

        handleCodeChange(nextCode);
        window.requestAnimationFrame(() => {
            editorRef.current?.focus();
            editorRef.current?.setSelectionRange(nextCursor, nextCursor);
            setCursorPosition(nextCursor);
        });
    };

    const handleEditorKeyDown = (event) => {
        if (event.key === 'Tab' && recommendations.length > 0) {
            event.preventDefault();
            insertRecommendation(recommendations[0]);
        }
    };

    const handleLanguageChange = (event) => {
        const nextLanguage = event.target.value;
        setLanguage(nextLanguage);
        socketRef.current?.emit('language-change', { roomId, language: nextLanguage });
    };

    const runCode = async () => {
        setRunning(true);
        setRunError('');
        setRunResult(null);

        try {
            const response = await fetch(`${API_URL}/code/run`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code, language, stdin }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Code execution failed.');
            }

            setRunResult(data);
        } catch (error) {
            setRunError(error.message);
        } finally {
            setRunning(false);
        }
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
                            <div className="flex flex-wrap items-center gap-3">
                                <select value={language} onChange={handleLanguageChange} className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-indigo-300">
                                    {languageOptions.map((option) => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={runCode}
                                    disabled={running || !code.trim()}
                                    className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Play size={16} />
                                    {running ? 'Running' : 'Run Code'}
                                </button>
                            </div>
                        </div>
                        <div className="h-[34rem] bg-slate-950 text-slate-100 grid grid-cols-[3.5rem_1fr] overflow-hidden">
                            <pre className="select-none overflow-hidden bg-slate-900/80 px-4 py-5 text-right font-mono text-sm leading-6 text-slate-500">
                                {lineNumbers}
                            </pre>
                            <div className="relative min-w-0">
                                <textarea
                                    ref={editorRef}
                                    value={code}
                                    onChange={(event) => {
                                        handleCodeChange(event.target.value);
                                        setCursorPosition(event.target.selectionStart);
                                    }}
                                    onClick={updateCursorPosition}
                                    onKeyUp={updateCursorPosition}
                                    onKeyDown={handleEditorKeyDown}
                                    spellCheck="false"
                                    className="h-full w-full resize-none bg-slate-950 px-5 py-5 font-mono text-sm leading-6 text-slate-100 outline-none placeholder:text-slate-600"
                                    placeholder="Start coding here..."
                                />
                                {recommendations.length > 0 && (
                                    <div className="absolute left-5 top-14 w-[min(34rem,calc(100%-2.5rem))] rounded-2xl border border-slate-700 bg-slate-900/95 p-3 shadow-2xl">
                                        <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-500">Recommendations</div>
                                        <div className="space-y-2">
                                            {recommendations.map((recommendation) => (
                                                <button
                                                    key={`${recommendation.trigger}-${recommendation.label}`}
                                                    onClick={() => insertRecommendation(recommendation)}
                                                    className="block w-full rounded-xl bg-slate-800 px-3 py-2 text-left font-mono text-xs text-slate-100 transition-colors hover:bg-indigo-600"
                                                >
                                                    <span className="font-bold">{recommendation.trigger}</span>
                                                    <span className="ml-2 text-slate-400">{recommendation.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                        <div className="mt-2 text-[10px] font-bold text-slate-500">Press Tab to insert the first suggestion.</div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="grid gap-4 border-t border-slate-100 bg-white p-5 lg:grid-cols-2">
                            <label className="space-y-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Input</span>
                                <textarea
                                    value={stdin}
                                    onChange={(event) => setStdin(event.target.value)}
                                    className="h-32 w-full resize-none rounded-2xl border border-slate-100 bg-slate-50 p-4 font-mono text-sm text-slate-800 outline-none focus:border-indigo-300"
                                    placeholder="Optional stdin..."
                                />
                            </label>
                            <div className="space-y-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Output</span>
                                <pre className="h-32 overflow-auto rounded-2xl border border-slate-800 bg-slate-950 p-4 font-mono text-sm text-slate-100">
                                    {runError || runResult?.stderr || runResult?.compileOutput || runResult?.stdout || (running ? 'Running your code...' : 'Run code to see output.')}
                                </pre>
                                {runResult && (
                                    <div className="flex flex-wrap gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <span>Status: {runResult.status}</span>
                                        {runResult.time && <span>Time: {runResult.time}s</span>}
                                        {runResult.memory && <span>Memory: {runResult.memory} KB</span>}
                                    </div>
                                )}
                            </div>
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
