
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

const SignUp: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    if (!password) {
        setError("A ruler must have a secret password.");
        return;
    }
    if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
    }
    if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
    }

    try {
      await signup(username.trim(), password);
      router.push('/');
    } catch (err: any) {
      console.error('Signup error:', err);
      if (err.message) {
        setError(err.message);
      } else if (err.status === 409) {
        setError('This ruler name is already taken. Choose another.');
      } else if (err.status === 500) {
        setError('Server error. Please try again later.');
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
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2 font-orbitron">
          Create Secret Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
          className="bg-gray-800 border border-gray-600 text-white text-lg rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-4"
          required
        />
      </div>
      <div>
        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300 mb-2 font-orbitron">
          Confirm Secret Password
        </label>
        <input
          type="password"
          id="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repeat your password"
          className="bg-gray-800 border border-gray-600 text-white text-lg rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-4"
          required
        />
      </div>
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Forging Dynasty...' : 'Begin Your Reign'}
      </Button>
    </form>
  );
};

export default SignUp;
