import React, { useState } from 'react';

interface SignupFormProps {
    onSignup: (username: string) => void;
    onGoToLogin: () => void;
}

function SignupForm({ onSignup, onGoToLogin }: SignupFormProps) {
    const [username, setUsername] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) {
            setError(true);
            return;
        }
        onSignup(username.trim());
    };

    return (
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 md:p-10 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-lg shadow-blue-600/20">
                    CB
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Course Buddy</h1>
                <p className="text-slate-500 text-sm md:text-base">Your AI Course Recommendation Assistant</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-lg font-semibold text-slate-800 text-center">Create Account</h2>

                <div className="space-y-2">
                    <label htmlFor="username" className="block text-sm font-medium text-slate-600">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        placeholder="Choose a username"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            setError(false);
                        }}
                        className={`w-full px-4 py-2.5 rounded-lg border text-slate-900 bg-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all ${error ? 'border-red-500' : 'border-slate-200'
                            }`}
                        autoFocus
                    />
                    {error && <span className="text-xs text-red-500 block">Please enter a username</span>}
                </div>

                <button
                    type="submit"
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                >
                    Get Started
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <p className="text-sm text-slate-600">
                    Already have an account? {' '}
                    <button
                        onClick={onGoToLogin}
                        className="text-blue-600 font-semibold hover:underline"
                    >
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
}

export default SignupForm;
