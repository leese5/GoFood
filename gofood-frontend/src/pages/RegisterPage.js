import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { register } from '../services/authService';

function RegisterPage({ setIsAuthenticated }) {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (credentials) => {
    try {
      await register(credentials);
      setIsAuthenticated(true);
      navigate('/dashboard'); // Redirect to dashboard on successful registration
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-page">
      <h1>Register</h1>
      {error && <p className="error-message">{error}</p>}
      <AuthForm onSubmit={handleRegister} buttonText="Register" />
      <p>
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
}

export default RegisterPage;
