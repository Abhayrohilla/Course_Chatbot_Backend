import { useState } from 'react';
import './LoginForm.css';

function LoginForm({ onLogin, onGoToSignup }) {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!username.trim()) {
            setError('Please enter your name');
            return;
        }
        onLogin(username.trim());
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">CB</div>
                    <h1>Course Buddy</h1>
                    <p>Your AI Course Recommendation Assistant</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <h2>Sign In</h2>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={error ? 'error' : ''}
                        />
                        {error && <span className="error-text">Please enter a username</span>}
                    </div>

                    <button type="submit" className="auth-btn primary">
                        Continue without Password
                    </button>
                </form>

                <div className="auth-footer">
                    <p>New here? <button onClick={onGoToSignup} className="link-btn">Create Account</button></p>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;
