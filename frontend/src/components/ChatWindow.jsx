import { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import Loader from './Loader';
import SuggestionChips from './SuggestionChips';
import './ChatWindow.css';

const API_URL = '/api/search';

function ChatWindow({ username, onLogout }) {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

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

            const welcomeMessage1 = {
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

            const welcomeMessage2 = {
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
        const userMessage = { type: 'user', content: query };
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
            // Reading user query time + Thinking time + Typing response time
            let contentText = data.message || data.ai_message || (data.courses ? "Found courses" : "");
            const letters = contentText.length;
            const typingDelay = Math.min(1000 + (letters * 20), 4000); // Min 1s, Max 4s

            // Ensure we wait at least the calculated delay
            const elapsed = Date.now() - startTime;
            const remainingDelay = Math.max(0, typingDelay - elapsed);
            await new Promise(r => setTimeout(r, remainingDelay));

            if (data.status === 'success') {
                // Course search results
                const botMessage = {
                    type: 'bot',
                    content: data.ai_message || `🎯 Here are the best matches for you (${data.total_results} results):`,
                    courses: data.courses,
                    matchType: data.matched_type
                };
                setMessages(prev => [...prev, botMessage]);
            } else if (data.status === 'chat') {
                // Intelligent chat response (no courses)
                const chatMessage = {
                    type: 'bot',
                    content: data.message
                };
                setMessages(prev => [...prev, chatMessage]);
            } else if (data.status === 'rejected') {
                // Query was filtered out by AI
                const rejectedMessage = {
                    type: 'bot',
                    content: data.message || 'I focus on course recommendations. Ask me about Python, AI, or Web Dev! 🎓'
                };
                setMessages(prev => [...prev, rejectedMessage]);
            } else {
                // not_found - no matching courses
                const notFoundMessage = {
                    type: 'bot',
                    content: data.message || 'Sorry, I couldn\'t find any courses matching that. Try checking your spelling or ask for a broader topic.'
                };
                setMessages(prev => [...prev, notFoundMessage]);
            }
        } catch (error) {
            console.error('API Error:', error);
            // Even errors should feel natural
            await new Promise(r => setTimeout(r, 1000));
            const errorMessage = {
                type: 'bot',
                content: 'Formatting response... (Server busy, please retry) 🔄',
                isError: true
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
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

    // Handle suggestion chip click
    const handleSuggestionClick = (suggestion) => {
        setInputValue(suggestion);
        // Optionally auto-send
        setTimeout(() => {
            const event = { target: { value: suggestion } };
            setInputValue(suggestion);
        }, 100);
    };

    return (
        <div className="chat-container">
            {/* Header */}
            <div className="chat-header">
                <div className="header-left">
                    <img src="/bot_avatar.png" alt="CB" className="header-icon-img" />
                    <div className="header-info">
                        <h1>Course Buddy</h1>
                        <span className="status-online">● Online</span>
                    </div>
                </div>
                <div className="header-right">
                    <div className="user-profile">
                        <span className="user-name">{username}</span>
                        <img src="/user_avatar.png" alt="User" className="header-user-img" />
                    </div>
                    <button onClick={onLogout} className="logout-btn">Logout</button>
                </div>
            </div>

            {/* Messages */}
            <div className="messages-container">
                {messages.map((msg, index) => (
                    <MessageBubble key={index} message={msg} />
                ))}
                {isLoading && <Loader />}

                {/* Suggestion Chips */}
                <SuggestionChips
                    visible={showSuggestions && messages.length <= 2}
                    onSelectSuggestion={handleSuggestionClick}
                />

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="input-container">
                <div className="input-wrapper">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Ask about courses, skills, or career paths..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={isLoading}
                        className="send-btn"
                    >
                        {isLoading ? (
                            <div className="custom-loader"></div>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                    </button>
                </div>
                <div className="input-hints">

                    {messages.some(m => m.isError) && (
                        <button onClick={handleRetry} className="retry-btn">🔄 Retry</button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChatWindow;
