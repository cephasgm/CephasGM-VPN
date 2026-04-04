import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Sign Up</h1>
        {error && <div className="bg-red-500 text-white p-3 rounded-lg mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password (min 6)" className="w-full p-3 mb-6 rounded-lg bg-gray-700 text-white" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg">Sign Up</button>
        </form>
        <p className="text-gray-400 text-center mt-6">Already have an account? <a href="/login" className="text-blue-400">Login</a></p>
      </div>
    </div>
  );
}
