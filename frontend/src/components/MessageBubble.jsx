import CourseCard from './CourseCard';
import './MessageBubble.css';

function MessageBubble({ message }) {
    const { type, content, courses, matchType, isError } = message;

    if (type === 'user') {
        return (
            <div className="message-bubble user">
                <div className="bubble-content">
                    <p>{content}</p>
                </div>
                <img src="/user_avatar.png" alt="User" className="avatar user-avatar-img" />
            </div>
        );
    }

    // Bot message
    return (
        <div className="message-bubble bot">
            <img src="/bot_avatar.png" alt="Bot" className="avatar bot-avatar-img" />
            <div className="bubble-content">
                {isError ? (
                    <div className="error-message">
                        <span className="error-icon">⚠️</span>
                        <p>{content}</p>
                    </div>
                ) : courses && courses.length > 0 ? (
                    <div className="courses-response">
                        <p className="response-intro">{content}</p>
                        <div className="courses-grid">
                            {courses.map((course, index) => (
                                <CourseCard key={index} course={course} matchType={matchType} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <p>{content}</p>
                )}
            </div>
        </div>
    );
}

export default MessageBubble;
