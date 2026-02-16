import { useState } from 'react';
import './LoginForm.css';

function SignupForm({ onSignup, onGoToLogin }) {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!username.trim()) {
            setError('Please enter your name');
            return;
        }
        onSignup(username.trim());
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
                    <h2>Create Account</h2>

                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                setError('');
                            }}
                            className={error ? 'error' : ''}
                            autoFocus
                        />
                        {error && <span className="error-text">Please enter a username</span>}
                    </div>

                    <button type="submit" className="auth-btn primary">
                        Get Started
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <button onClick={onGoToLogin} className="link-btn">Login</button></p>
                </div>
            </div>
        </div>
    );
}

export default SignupForm;
