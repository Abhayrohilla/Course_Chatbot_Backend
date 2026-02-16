import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import ChatWindow from './components/ChatWindow';

function App() {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'signup' | 'chat'>('login');
  const [username, setUsername] = useState<string>('');

  const handleLogin = (name: string) => {
    setUsername(name);
    setCurrentScreen('chat');
  };

  const handleSignup = (name: string) => {
    setUsername(name);
    setCurrentScreen('chat');
  };

  const goToSignup = () => setCurrentScreen('signup');
  const goToLogin = () => setCurrentScreen('login');
  const handleLogout = () => {
    setUsername('');
    setCurrentScreen('login');
  };

  return (
    <div className={`min-h-screen bg-slate-50 flex items-center justify-center font-inter ${currentScreen === 'chat' ? 'p-0' : 'p-4'}`}>
      <div className={`w-full transition-all duration-500 ${currentScreen === 'chat'
          ? 'h-screen md:h-[90vh] md:max-w-6xl md:rounded-2xl md:shadow-2xl md:border md:border-slate-200 overflow-hidden'
          : 'max-w-md'
        }`}>
        {currentScreen === 'login' && (
          <LoginForm onLogin={handleLogin} onGoToSignup={goToSignup} />
        )}
        {currentScreen === 'signup' && (
          <SignupForm onSignup={handleSignup} onGoToLogin={goToLogin} />
        )}
        {currentScreen === 'chat' && (
          <ChatWindow username={username} onLogout={handleLogout} />
        )}
      </div>
    </div>
  );
}

export default App;
