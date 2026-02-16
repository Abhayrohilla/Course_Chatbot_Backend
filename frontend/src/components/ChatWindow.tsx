import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import Loader from './Loader';
import SuggestionChips from './SuggestionChips';

interface Message {
    type: 'user' | 'bot';
    content: string;
    isError?: boolean;
    courses?: any[];
    matchType?: string;
}

interface ChatWindowProps {
    username: string;
    onLogout: () => void;
}

const API_URL = '/api/search';

function ChatWindow({ username, onLogout }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    // Show welcome messages with natural typing delay
    useEffect(() => {
        let isCancelled = false;

        const showWelcomeSequence = async () => {
            if (messages.length > 0) return; // Prevent double run

            // 1. First Welcome Message
            setIsLoading(true);
            await new Promise(r => setTimeout(r, 1000)); // Typing for 1s
            if (isCancelled) return;

            const welcomeMessage1: Message = {
                type: 'bot',
                content: `Hello! I'm Course Buddy. I can help you find certification courses and learning paths tailored to your career goals.`
            };
            setMessages(prev => [...prev, welcomeMessage1]);
            setIsLoading(false);

            // 2. Second Welcome Message (Follow-up)
            await new Promise(r => setTimeout(r, 600)); // Small pause
            if (isCancelled) return;
            setIsLoading(true);
            await new Promise(r => setTimeout(r, 1200)); // Typing for 1.2s
            if (isCancelled) return;

            const welcomeMessage2: Message = {
                type: 'bot',
                content: `Search for courses by skill, department, or job role.`
            };
            setMessages(prev => [...prev, welcomeMessage2]);
            setIsLoading(false);

            if (!isCancelled) {
                setShowSuggestions(true);
                inputRef.current?.focus();
            }
        };

        if (username && messages.length === 0) {
            setShowSuggestions(false); // Ensure hidden initially
            showWelcomeSequence();
        }

        return () => { isCancelled = true; };
    }, [username]);

    const sendMessage = async () => {
        const query = inputValue.trim();

        if (!query) {
            setMessages(prev => [...prev, {
                type: 'bot',
                content: 'Please enter a query to search courses.',
                isError: true
            }]);
            return;
        }

        // Add user message
        const userMessage: Message = { type: 'user', content: query };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setShowSuggestions(false); // Hide suggestions after first message
        setIsLoading(true);

        try {
            const startTime = Date.now();

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query })
            });

            if (!response.ok) throw new Error('Server error');
            const data = await response.json();

            // Calculate "Reading/Typing" time based on response length
            let contentText = data.message || data.ai_message || (data.courses ? "Found courses" : "");
            const letters = contentText.length;
            const typingDelay = Math.min(1000 + (letters * 20), 4000); // Min 1s, Max 4s

            // Ensure we wait at least the calculated delay
            const elapsed = Date.now() - startTime;
            const remainingDelay = Math.max(0, typingDelay - elapsed);
            await new Promise(r => setTimeout(r, remainingDelay));

            if (data.status === 'success') {
                const botMessage: Message = {
                    type: 'bot',
                    content: data.ai_message || `🎯 Here are the best matches for you (${data.total_results} results):`,
                    courses: data.courses,
                    matchType: data.matched_type
                };
                setMessages(prev => [...prev, botMessage]);
            } else if (data.status === 'chat') {
                const chatMessage: Message = {
                    type: 'bot',
                    content: data.message
                };
                setMessages(prev => [...prev, chatMessage]);
            } else if (data.status === 'rejected') {
                const rejectedMessage: Message = {
                    type: 'bot',
                    content: data.message || 'I focus on course recommendations. Ask me about Python, AI, or Web Dev! 🎓'
                };
                setMessages(prev => [...prev, rejectedMessage]);
            } else {
                const notFoundMessage: Message = {
                    type: 'bot',
                    content: data.message || 'Sorry, I couldn\'t find any courses matching that. Try checking your spelling or ask for a broader topic.'
                };
                setMessages(prev => [...prev, notFoundMessage]);
            }
        } catch (error) {
            console.error('API Error:', error);
            await new Promise(r => setTimeout(r, 1000));
            const errorMessage: Message = {
                type: 'bot',
                content: 'Formatting response... (Server busy, please retry) 🔄',
                isError: true
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleRetry = () => {
        if (messages.length > 0) {
            const lastUserMessage = [...messages].reverse().find(m => m.type === 'user');
            if (lastUserMessage) {
                setInputValue(lastUserMessage.content);
            }
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setInputValue(suggestion);
        setTimeout(() => {
            setInputValue(suggestion);
        }, 100);
    };

    return (
        <div className="flex flex-col w-full h-full bg-slate-50 relative overflow-hidden font-inter">
            {/* Header */}
            <header className="flex-none px-4 py-3 md:px-6 md:py-4 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                    <img src="/bot_avatar.png" alt="CB" className="w-10 h-10 rounded-xl object-cover shadow-md shadow-blue-600/10" />
                    <div className="flex flex-col">
                        <h1 className="text-base font-semibold text-slate-800 leading-tight">Course Buddy</h1>
                        <span className="text-[10px] md:text-xs text-emerald-600 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                            Online
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 mr-2">
                        <span className="text-sm font-medium text-slate-600">{username}</span>
                        <img src="/user_avatar.png" alt="User" className="w-8 h-8 rounded-full bg-slate-200 object-cover border border-slate-100" />
                    </div>
                    <button
                        onClick={onLogout}
                        className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 hover:text-slate-800 transition-all duration-200"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Messages */}
            <main className="flex-1 px-4 py-6 md:px-[10%] overflow-y-auto flex flex-col gap-6 scroll-smooth">
                {messages.map((msg, index) => (
                    <MessageBubble key={index} message={msg} />
                ))}
                {isLoading && <Loader />}

                <SuggestionChips
                    visible={showSuggestions && messages.length <= 2}
                    onSelectSuggestion={handleSuggestionClick}
                />

                <div ref={messagesEndRef} />
            </main>

            {/* Input */}
            <footer className="flex-none p-4 md:p-6 bg-white border-t border-slate-200">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-3xl px-5 py-2 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-600/5 transition-all duration-300">
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Ask about courses, skills, or career paths..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                            className="flex-1 bg-transparent border-none outline-none py-2 text-slate-800 placeholder:text-slate-400 text-sm md:text-base"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={isLoading || !inputValue.trim()}
                            className={`w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0 transition-all duration-300 ${isLoading || !inputValue.trim()
                                ? 'bg-slate-200 text-slate-400'
                                : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 shadow-md shadow-blue-600/20'
                                }`}
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </button>
                    </div>
                    {messages.some(m => m.isError) && (
                        <div className="mt-3 text-center">
                            <button onClick={handleRetry} className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 mx-auto">
                                🔄 Retry last query
                            </button>
                        </div>
                    )}
                </div>
            </footer>
        </div>
    );
}

export default ChatWindow;
