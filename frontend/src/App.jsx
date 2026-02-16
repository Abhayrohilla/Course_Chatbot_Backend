import { useState } from 'react';
import './App.css';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import ChatWindow from './components/ChatWindow';

function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [username, setUsername] = useState('');

  const handleLogin = (name) => {
    setUsername(name);
    setCurrentScreen('chat');
  };

  const handleSignup = (name) => {
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
    <div className="app-container">
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
  );
}

export default App;
