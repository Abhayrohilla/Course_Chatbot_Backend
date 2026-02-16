import './Loader.css';

function Loader() {
    return (
        <div className="message-bubble bot" style={{ marginBottom: '10px' }}>
            <img src="/bot_avatar.png" alt="Bot" className="avatar bot-avatar-img" />
            <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
            </div>
        </div>
    );
}

export default Loader;
