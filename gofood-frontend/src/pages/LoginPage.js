import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/LoginForm';
import { login } from '../services/authService';

function LoginPage({ setIsAuthenticated }) {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
      setIsAuthenticated(true);
      navigate('/dashboard'); // Redirect to dashboard on success
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-page">
      <h1>Login</h1>
      {error && <p className="error-message">{error}</p>}
      <AuthForm onSubmit={handleLogin} buttonText="Login" />
      <p>
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
}

export default LoginPage;
