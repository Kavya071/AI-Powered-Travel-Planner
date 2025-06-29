'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import '../../firebase'; // Adjust this path if your firebase.js location is different

export default function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // true if user exists, false otherwise
    });

    return () => unsubscribe();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-5">
        <Link href="/" className="flex items-center text-2xl font-bold text-gray-800 tracking-tight">
          <Sparkles className="text-yellow-500 mr-3 h-7 w-7" />
          TravelPlanner<span className="text-blue-600">AI</span>
        </Link>

        <nav className="flex space-x-10 text-gray-800 text-lg font-medium">
          <Link href="/" className="hover:text-blue-600 transition">Home</Link>
          <Link href="/generate" className="hover:text-blue-600 transition">Generate</Link>
          {isLoggedIn ? (
            <Link href="/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
          ) : (
            <Link href="/login" className="hover:text-blue-600 transition">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
