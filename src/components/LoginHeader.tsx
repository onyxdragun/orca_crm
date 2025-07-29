'use client';
import React, { useState } from 'react';
import { FiLogIn, FiLogOut } from 'react-icons/fi';
import Link from 'next/link';

interface LoginHeaderProps {
  onLogin: (username: string, password: string) => void;
  onLogout: () => void;
  isLoggedIn: boolean;
}

const LoginHeader: React.FC<LoginHeaderProps> = ({ onLogin, onLogout, isLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }
    setError('');
    onLogin(username, password);
  };

  if (isLoggedIn) {
    return (
      <header className="w-full p-4 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 text-white flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-bold text-white hover:underline">OrcaCRM</Link>
          <nav className="flex gap-6">
            <Link href="/customers" className="hover:underline">Customers</Link>
            <Link href="/tickets" className="hover:underline">Tickets</Link>
          </nav>
        </div>
        <button
          className="bg-red-600 px-3 py-1 rounded text-white ml-4 flex items-center gap-2 cursor-pointer"
          onClick={onLogout}
        >
          <span className="inline md:hidden"><FiLogOut /></span>
          <span className="hidden md:flex items-center gap-2"><FiLogOut /> Logout</span>
        </button>
      </header>
    );
  }

  return (
    <header className="w-full p-8 text-white flex justify-center items-center">
      <form className="flex flex-col sm:flex-row gap-2 items-center justify-center w-full max-w-md" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="p-3 rounded bg-gray-800 text-white placeholder-gray-400 outline-none border border-gray-700 w-full sm:w-auto"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="p-3 rounded bg-gray-800 text-white placeholder-gray-400 outline-none border border-gray-700 w-full sm:w-auto"
        />
        <button type="submit" className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 hover:from-gray-800 hover:to-black rounded-lg py-2 px-4 font-bold text-base text-white shadow-lg border border-white transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 active:scale-95 hover:scale-105 w-full sm:w-auto flex items-center gap-2">
          <FiLogIn /> Login
        </button>
      </form>
      {error && <span className="text-red-400 ml-4">{error}</span>}
    </header>
  );
};

export default LoginHeader;
