import React from 'react';
import CourseCard from './CourseCard';

interface Message {
    type: 'user' | 'bot';
    content: string;
    isError?: boolean;
    courses?: any[];
    matchType?: string;
}

interface MessageBubbleProps {
    message: Message;
}

function MessageBubble({ message }: MessageBubbleProps) {
    const { type, content, courses, matchType, isError } = message;

    if (type === 'user') {
        return (
            <div className="flex gap-2.5 max-w-[90%] md:max-w-[70%] self-end animate-in fade-in slide-in-from-bottom-2 duration-300 items-end">
                <div className="bg-blue-600 text-white p-3 md:px-4 md:py-3 rounded-2xl rounded-br-md text-sm md:text-base leading-relaxed shadow-md shadow-blue-600/10">
                    <p className="m-0 whitespace-pre-wrap">{content}</p>
                </div>
                <img src="/user_avatar.png" alt="User" className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-blue-100 object-cover flex-shrink-0" />
            </div>
        );
    }

    // Bot message
    return (
        <div className="flex gap-2.5 max-w-full md:max-w-[85%] self-start animate-in fade-in slide-in-from-bottom-2 duration-300 items-start">
            <img src="/bot_avatar.png" alt="Bot" className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-slate-100 object-cover flex-shrink-0 shadow-sm" />
            <div className={`p-3 md:px-4 md:py-3 rounded-2xl rounded-tl-md text-sm md:text-base leading-relaxed bg-white border border-slate-200 text-slate-800 shadow-sm min-w-[50px] ${isError ? 'bg-red-50 border-red-100' : ''}`}>
                {isError ? (
                    <div className="flex items-center gap-2 text-red-600">
                        <span className="text-lg">⚠️</span>
                        <p className="m-0">{content}</p>
                    </div>
                ) : courses && courses.length > 0 ? (
                    <div className="flex flex-col gap-3 w-full">
                        <p className="m-0 text-slate-500 font-medium text-xs md:text-sm">{content}</p>
                        <div className="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                            {courses.map((course, index) => (
                                <CourseCard key={index} course={course} matchType={matchType} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="m-0 whitespace-pre-wrap">{content}</p>
                )}
            </div>
        </div>
    );
}

export default MessageBubble;
