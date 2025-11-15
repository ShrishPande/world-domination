
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

const SignUp: React.FC = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { signup, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim()) {
        setError("A ruler's name cannot be empty.");
        return;
    }
    if (username.length < 3) {
        setError("A name must have at least 3 characters to be remembered.");
        return;
    }
    try {
      await signup(username);
      router.push('/');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown force prevents your rise. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <p className="text-red-400 bg-red-900/50 border border-red-700 p-3 rounded-md text-center">{error}</p>}
      <div>
        <label htmlFor="new-username" className="block text-sm font-medium text-gray-300 mb-2 font-orbitron">
          Choose Your Ruler Name
        </label>
        <input
          type="text"
          id="new-username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g., Cleopatra"
          className="bg-gray-800 border border-gray-600 text-white text-lg rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-4"
        />
      </div>
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Forging Dynasty...' : 'Begin Your Reign'}
      </Button>
    </form>
  );
};

export default SignUp;
