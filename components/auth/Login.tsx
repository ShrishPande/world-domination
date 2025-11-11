import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username) {
        setError("A ruler must have a name.");
        return;
    }
    try {
      await login(username);
      // On success, the AuthProvider will update the state and the App component will navigate away.
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown cataclysm occurred. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
       {error && <p className="text-red-400 bg-red-900/50 border border-red-700 p-3 rounded-md text-center">{error}</p>}
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2 font-orbitron">
          Ruler Name
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g., Genghis Khan"
          className="bg-gray-800 border border-gray-600 text-white text-lg rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-4"
        />
      </div>
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Ascending...' : 'Claim Throne'}
      </Button>
    </form>
  );
};

export default Login;