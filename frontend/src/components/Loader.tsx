function Loader() {
    return (
        <div className="flex gap-2.5 max-w-full md:max-w-[85%] self-start animate-in fade-in slide-in-from-bottom-2 duration-300 items-start mb-2.5">
            <img src="/bot_avatar.png" alt="Bot" className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-slate-100 object-cover flex-shrink-0 shadow-sm" />
            <div className="flex gap-1.5 p-4 bg-white border border-slate-200 rounded-2xl rounded-tl-md shadow-sm">
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            </div>
        </div>
    );
}

export default Loader;
