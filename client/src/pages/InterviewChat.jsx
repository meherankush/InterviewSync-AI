import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewChat, endSession as endSessionAPI } from '../services/api';
import { Send, Clock, User, Mic, MicOff, AlertCircle, ShieldAlert, Monitor, Video, Code2, Play, Terminal, Zap } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { sendAlert } from '../services/api';
import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';
import * as cocossd from '@tensorflow-models/coco-ssd';

const InterviewChat = () => {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [timeLeft, setTimeLeft] = useState(0);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isCodingMode, setIsCodingMode] = useState(false);
    const [code, setCode] = useState('');
    const [codingTopic, setCodingTopic] = useState('');
    const [language, setLanguage] = useState('javascript');

    // Proctoring & Speech states
    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isAutoListen, setIsAutoListen] = useState(true); // Default to true per user request
    const [interimSpeech, setInterimSpeech] = useState('');
    const recognitionRef = useRef(null);
    const chatEndRef = useRef(null);
    const sessionRef = useRef(null);

    // Text to Speech
    const speakText = (text) => {
        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            
            utterance.onend = () => {
                if (isAutoListen) {
                    // Slight delay to avoid picking up the echoes
                    setTimeout(() => startListening(), 500); 
                }
            };

            window.speechSynthesis.speak(utterance);
        }
    };

    // Speech to Text (Recognition) Init
    const startListening = () => {
        if (isListening) return; // Don't start if already active
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return alert("Speech recognition not supported in this browser.");

        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-IN';

        recognitionRef.current.onstart = () => setIsListening(true);
        recognitionRef.current.onend = () => setIsListening(false);
        recognitionRef.current.onerror = (event) => {
            console.error("Speech Recognition Error", event);
            setIsListening(false);
        };

        recognitionRef.current.onresult = (event) => {
            let currentFinalTranscript = '';
            let currentInterimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    currentFinalTranscript += transcript;
                } else {
                    currentInterimTranscript += transcript;
                }
            }

            // Sync with input field: Use functional update to ensure we don't lose typed text
            // We append the final results and show interim at the end
            if (currentFinalTranscript) {
                setInterimSpeech(''); // Reset interim once finalized
                setInputText(prev => {
                    const base = prev.trim();
                    return base ? `${base} ${currentFinalTranscript.trim()}` : currentFinalTranscript.trim();
                });
            } else {
                setInterimSpeech(currentInterimTranscript);
            }
        };

        recognitionRef.current.start();
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setInterimSpeech('');
        }
    };

    const triggerAlert = (msg) => {
        setAlertMsg(msg);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 4000);
        const currentSessionId = sessionRef.current?._id || session?._id;
        if (currentSessionId) {
            console.log("Sending Alert to Backend:", msg);
            sendAlert({ interviewId: currentSessionId, message: msg });
        } else {
            console.warn("No Session ID found for alert:", msg);
        }
    };

    useEffect(() => {
        const interviewData = localStorage.getItem('currentInterview');
        if (!interviewData) return navigate('/dashboard');

        const parsed = JSON.parse(interviewData);
        setSession(parsed.session);
        sessionRef.current = parsed.session;
        setTimeLeft(parsed.session.duration * 60);
        setMessages([{ role: 'assistant', content: parsed.firstQuestion }]);
        speakText(parsed.firstQuestion);

        let faceModel = null;
        let objectModel = null;
        let detectionInterval = null;

        // Proctoring / Camera Init
        const initProctoring = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => videoRef.current.play();
                }

                await tf.setBackend('webgl');
                faceModel = await blazeface.load();
                objectModel = await cocossd.load();

                detectionInterval = setInterval(async () => {
                    if (videoRef.current && videoRef.current.readyState === 4) {
                        try {
                            // 1. Face & Gaze Detection
                            const faces = await faceModel.estimateFaces(videoRef.current, false);

                            if (faces.length === 0) {
                                triggerAlert('Security Alert: No face detected! Please stay in frame.');
                            } else if (faces.length > 1) {
                                triggerAlert('Security Alert: Multiple people detected in frame!');
                            } else if (faces.length === 1) {
                                // Simple gaze detection: check if facial landmarks are centered
                                const face = faces[0];
                                const rightEye = face.landmarks[0];
                                const leftEye = face.landmarks[1];
                                const nose = face.landmarks[2];

                                // If nose is significantly offset from the eyes horizontal center, they're looking away
                                const eyeCenter = (rightEye[0] + leftEye[0]) / 2;
                                const lookOffset = Math.abs(nose[0] - eyeCenter);

                                if (lookOffset > 25) { // Sensitivity threshold
                                    triggerAlert('Security Alert: Please look directly at the screen!');
                                }
                            }

                            // 2. Object Detection (Cell Phone, Electronic Devices)
                            const objects = await objectModel.detect(videoRef.current);
                            const forbidden = ['cell phone', 'mobile phone', 'phone', 'laptop', 'tablet', 'book', 'remote'];

                            // Log detected objects for debugging
                            const found = objects.filter(o => o.score > 0.45);
                            if (found.length > 0) console.log("Detected Objects:", found.map(f => f.class));

                            const detectedForbidden = objects.find(obj =>
                                forbidden.includes(obj.class.toLowerCase()) && obj.score > 0.45
                            );

                            if (detectedForbidden) {
                                triggerAlert(`Security Alert: Restricted device detected (${detectedForbidden.class})!`);
                            }

                        } catch (e) { console.error("Detection interval error", e); }
                    }
                }, 3000); // Faster interval for better security
            } catch (err) { console.error("Proctoring Init Error", err); }
        };

        if (parsed.session) initProctoring();

        // Window / Mouse Listeners
        const handleVisibility = () => { if (document.hidden) triggerAlert('Warning: Tab switch detected!'); };
        const handleMouseLeave = (e) => { if (e.clientY <= 0) triggerAlert('Warning: Mouse left the window boundaries!'); };

        document.addEventListener('visibilitychange', handleVisibility);
        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            if (detectionInterval) clearInterval(detectionInterval);
            document.removeEventListener('visibilitychange', handleVisibility);
            document.removeEventListener('mouseleave', handleMouseLeave);
            const stream = videoRef.current?.srcObject;
            if (stream) stream.getTracks().forEach(t => t.stop());
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        };
    }, [navigate]);

    useEffect(() => {
        if (!session) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleEndSession();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [session]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if ((!inputText.trim() && !code.trim()) || loading) return;

        const userMsg = inputText.trim();
        const currentCode = code;

        // Final message to send to AI
        const fullUserMessage = isCodingMode
            ? `${userMsg}\n\n[SOLVED CODE]:\n\`\`\`${language}\n${currentCode}\n\`\`\``
            : userMsg;

        setInputText('');
        setMessages((prev) => [...prev, {
            role: 'user',
            content: userMsg,
            hasCode: isCodingMode,
            codeSnippet: currentCode
        }]);
        setLoading(true);

        try {
            const res = await interviewChat({
                sessionId: session._id,
                userMessage: fullUserMessage
            });

            const data = res.data;
            const aiReply = data.reply + " " + (data.next_question || "");

            // Determine if the next step is coding
            if (data.is_coding) {
                setIsCodingMode(true);
                setCodingTopic(data.coding_topic || "Technical Task");
                setCode(data.initial_code || "");
                // Detect language from topic or domain
                if (session.domain.toLowerCase().includes('sql')) setLanguage('sql');
                else if (session.domain.toLowerCase().includes('java')) setLanguage('java');
                else if (session.domain.toLowerCase().includes('python')) setLanguage('python');
                else setLanguage('javascript');
            } else {
                setIsCodingMode(false);
            }

            setMessages((prev) => [...prev, { role: 'assistant', content: aiReply }]);
            speakText(aiReply);

        } catch (err) {
            console.error("Chat Error:", err);
            setMessages((prev) => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleEndSession = async () => {
        try {
            await endSessionAPI({ interviewId: session._id });
            const stream = videoRef.current?.srcObject;
            if (stream) {
                stream.getTracks().forEach(t => t.stop());
            }
            navigate(`/results/${session._id}`);
        } catch (err) {
            console.error("End Session Error", err);
            navigate('/dashboard');
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    if (!session) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-bold tracking-widest animate-pulse uppercase">Starting your interview...</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#fcfcfe] overflow-hidden font-sans">
            {/* Sidebar: Futuristic Monitoring Station */}
            <div className="w-80 border-r border-gray-100 bg-white p-6 hidden lg:flex flex-col gap-8 animate-in fade-in slide-in-from-left duration-700">
                <div className="space-y-4">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover transform scale-x-110" />
                            <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1.5 bg-black/60 backdrop-blur-md rounded-lg border border-white/10">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                                <span className="text-[10px] font-black text-white uppercase tracking-wider">Your Camera</span>
                            </div>
                            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2 py-1 bg-indigo-600/80 backdrop-blur-md rounded flex-col items-end">
                                <span className="text-[8px] font-bold text-white/70 uppercase">Time used</span>
                                <span className="text-[10px] font-black text-white tracking-widest">{formatTime(Math.max(0, (session.duration * 60) - timeLeft))}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-indigo-50 to-white rounded-2xl border border-indigo-100/50 shadow-sm transition-all group">
                            <div className="p-2.5 bg-white rounded-xl shadow-sm border border-indigo-50 group-hover:scale-110 transition-transform">
                                <ShieldAlert className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest">Security Mode</p>
                                <p className="text-sm font-black text-indigo-950">Active Safeguard</p>
                            </div>
                        </div>

                        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-5">
                            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Monitor className="w-4 h-4 text-indigo-400" /> Security Check
                            </h4>
                            <div className="space-y-4">
                                {[
                                    { label: 'Looking at screen', status: 'Fine', color: 'emerald' },
                                    { label: 'No phone seen', status: 'Clear', color: 'emerald' },
                                    { label: 'Quiet room', status: 'Good', color: 'emerald' },
                                    { label: 'Sitting properly', status: 'Yes', color: 'indigo' }
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center group">
                                        <span className="text-[11px] font-bold text-gray-500 group-hover:text-gray-700 transition-colors uppercase tracking-tight">{item.label}</span>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full bg-${item.color}-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]`}></div>
                                            <span className={`text-[11px] font-black text-${item.color}-600 uppercase`}>{item.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-auto p-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-[10px] leading-relaxed text-gray-400 font-medium text-center italic">
                        "Your session is being analyzed in real-time."
                    </p>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-grow flex flex-col bg-white overflow-hidden relative">
                {/* Alert Overlay */}
                {showAlert && (
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 animate-in zoom-in slide-in-from-top-10 duration-500 w-max max-w-[90%]">
                        <div className="bg-white/95 backdrop-blur-md px-6 py-3 rounded-2xl shadow-[0_15px_40px_rgba(239,68,68,0.2)] border border-rose-100 flex items-center gap-3">
                            <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center shrink-0">
                                <AlertCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h5 className="text-rose-600 font-extrabold text-[10px] uppercase tracking-tighter">System Alert</h5>
                                <p className="text-gray-900 font-bold text-sm tracking-tight">{alertMsg}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header / Timer */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-white/60 backdrop-blur-xl sticky top-0 z-10 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-100 flex items-center justify-center transform hover:rotate-6 transition-all duration-300">
                            <User className="text-white w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="font-black text-gray-900 text-lg tracking-tight mb-0">AI Interviewer</h2>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{session.domain} • ENCRYPTED</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 bg-gray-50 px-5 py-2.5 rounded-2xl border border-gray-100 shadow-inner">
                            <Clock className={`w-4 h-4 ${timeLeft < 60 ? 'text-rose-500' : 'text-gray-400'}`} />
                            <span className={`font-mono font-black text-xl tracking-tighter ${timeLeft < 60 ? 'text-rose-500 animate-pulse' : 'text-gray-800'}`}>
                                {formatTime(timeLeft)}
                            </span>
                        </div>
                        <button
                            onClick={handleEndSession}
                            className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-black text-[11px] hover:bg-black transition-all active:scale-95 uppercase tracking-widest shadow-lg hover:shadow-gray-200"
                        >
                            Complete
                        </button>
                    </div>
                </div>

                {/* Chat Body */}
                <div className="flex-grow overflow-y-auto px-8 py-10 space-y-8 scroll-smooth custom-scrollbar bg-gradient-to-b from-white to-gray-50/20">
                    <div className="mx-auto max-w-3xl space-y-8">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                                <div className={`group relative flex items-start gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-7 h-7 rounded-lg shrink-0 mt-1 flex items-center justify-center border shadow-sm ${msg.role === 'user'
                                        ? 'bg-white border-indigo-100 text-indigo-600'
                                        : 'bg-indigo-600 border-indigo-500 text-white'
                                        }`}>
                                        {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
                                    </div>
                                    <div className={`px-6 py-4 rounded-2xl shadow-sm relative transition-all ${msg.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-tr-none'
                                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                        }`}>
                                        <p className="leading-relaxed text-base font-medium whitespace-pre-wrap">{msg.content}</p>

                                        {msg.hasCode && (
                                            <div className="mt-3 p-3 bg-black/20 rounded-xl border border-white/10 font-mono text-[11px] overflow-x-auto">
                                                <div className="flex justify-between items-center mb-1 opacity-50">
                                                    <span>{language.toUpperCase()} Snippet</span>
                                                </div>
                                                <pre className="text-indigo-100">{msg.codeSnippet}</pre>
                                            </div>
                                        )}

                                        <span className={`text-[8px] font-bold uppercase tracking-widest absolute -bottom-5 ${msg.role === 'user' ? 'right-0 text-indigo-300' : 'left-0 text-gray-300'}`}>
                                            {msg.role === 'user' ? 'You' : 'AI Interviewer'} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start animate-in fade-in duration-300">
                                <div className="flex items-start gap-3">
                                    <div className="w-7 h-7 rounded-lg shrink-0 mt-1 flex items-center justify-center bg-indigo-600 text-white">
                                        <Monitor className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="bg-white px-6 py-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-3">
                                        <div className="flex gap-1.5">
                                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        </div>
                                        <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">AI is thinking...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div ref={chatEndRef} />
                </div>

                {/* Input Footer */}
                <div className="p-8 border-t border-gray-100 bg-white shrink-0">
                    <div className="mx-auto max-w-4xl relative">
                        <div className="relative flex items-end gap-4 bg-gray-50 rounded-[1.5rem] p-2 border border-gray-100 focus-within:border-indigo-200 focus-within:bg-white transition-all shadow-inner">
                            <textarea
                                rows="1"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                placeholder={isListening ? (interimSpeech || "Listening...") : (isCodingMode ? "Explain your code here..." : "Type or speak your answer...")}
                                className="flex-grow bg-transparent border-none px-5 py-3 focus:ring-0 outline-none transition-all resize-none font-medium text-gray-700 min-h-[48px] text-base placeholder:text-indigo-400"
                            />
                            <div className="flex gap-2 items-center pr-2 pb-1.5">
                                <button
                                    onClick={isListening ? stopListening : startListening}
                                    className={`p-2.5 rounded-xl transition-all active:scale-90 shadow-sm border border-transparent ${isListening
                                        ? 'bg-rose-100 text-rose-600 animate-pulse border-rose-200'
                                        : 'text-gray-400 hover:text-indigo-600 hover:bg-white hover:border-gray-50'
                                        }`}
                                >
                                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                                </button>
                                <button
                                    onClick={handleSendMessage}
                                    disabled={loading || (!inputText.trim() && !code.trim())}
                                    className={`pl-4 pr-6 py-3 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 ${loading || (!inputText.trim() && !code.trim())
                                        ? 'bg-gray-100 text-gray-300'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        }`}
                                >
                                    <span className="text-xs font-black uppercase tracking-widest">{isCodingMode ? 'Send Code' : 'Send'}</span>
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Coding Pane (Slide-in) */}
            {isCodingMode && (
                <div className="w-full lg:w-[45%] h-full bg-[#1e1e1e] border-l border-gray-800 flex flex-col animate-in slide-in-from-right duration-500 z-30">
                    <div className="p-5 border-b border-gray-800 bg-[#252526] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                                <Code2 className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-white/90 uppercase tracking-widest leading-none mb-1.5">Coding Area</h3>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{codingTopic}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 group cursor-pointer hover:bg-emerald-500/20 transition-all">
                                <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Run / Test</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex-grow relative">
                        <Editor
                            height="100%"
                            theme="vs-dark"
                            language={language}
                            value={code}
                            onChange={(val) => setCode(val)}
                            options={{
                                fontSize: 14,
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                padding: { top: 20 },
                                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                fontWeight: "500"
                            }}
                        />
                    </div>
                    <div className="p-4 bg-[#252526] border-t border-gray-800 flex items-center gap-3">
                        <div className="p-1.5 bg-gray-800 rounded-md">
                            <Terminal className="w-3.5 h-3.5 text-gray-400" />
                        </div>
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Console Output</span>
                        <div className="flex-grow h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div className="w-full h-full bg-emerald-500/30"></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InterviewChat;
