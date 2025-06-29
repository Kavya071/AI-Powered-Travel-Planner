// src/app/dashboard/page.js
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from '../../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
  getFirestore,
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  where
} from 'firebase/firestore';
import {
  MapPin,
  CalendarDays,
  DollarSign,
  Eye,
  Trash2,
  LogOut
} from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const db = getFirestore();

  useEffect(() => {
    let unsubAuth, unsubSnap;
    unsubAuth = onAuthStateChanged(auth, u => {
      if (!u) {
        router.push('/login');
      } else {
        setUser(u);
        const q = query(
          collection(db, 'itineraries'),
          where('userId', '==', u.uid)
        );
        unsubSnap = onSnapshot(
          q,
          snap => {
            setItineraries(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            setLoading(false);
          },
          err => {
            console.error('snapshot error:', err);
            setLoading(false);
          }
        );
      }
    });
    return () => {
      unsubAuth && unsubAuth();
      unsubSnap && unsubSnap();
    };
  }, [db, router]);

  const handleDelete = async id => {
    try {
      await deleteDoc(doc(db, 'itineraries', id));
    } catch (err) {
      console.error(err);
      alert('Delete failed.');
    }
  };

  const handleLogout = () => {
    signOut(auth).then(() => router.push('/login'));
  };

  // helper to pick badge colors
  const budgetBadgeClass = budget => {
    switch (budget) {
      case 'Low':
        return 'bg-green-100 text-green-800';
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'High':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-extrabold text-gray-800">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            <LogOut size={18} /> <span>Logout</span>
          </button>
        </div>
        {user && (
          <p className="mt-2 text-gray-600">
            Welcome, <strong>{user.displayName}</strong> &mdash; {user.email}
          </p>
        )}
      </div>

      {/* Itineraries */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Your Saved Itineraries</h2>

        {loading ? (
          <p className="text-gray-500">⏳ Loading your itineraries…</p>
        ) : itineraries.length === 0 ? (
          <p className="text-gray-500">
            No saved itineraries found.{' '}
            <Link href="/generate" className="text-indigo-600 hover:underline">
              Generate one now
            </Link>
            .
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {itineraries.map(item => (
              <div
                key={item.id}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
              >
                <div>
                  <h3 className="flex items-center text-xl font-semibold text-gray-800 mb-2">
                    <MapPin className="w-5 h-5 text-blue-500 mr-2" />
                    {item.destination}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      <CalendarDays className="w-4 h-4 mr-1" />
                      {item.days} day{item.days > 1 ? 's' : ''}
                    </span>
                    <span
                      className={`inline-flex items-center ${budgetBadgeClass(
                        item.budget
                      )} text-xs px-2 py-1 rounded-full`}
                    >
                      <DollarSign className="w-4 h-4 mr-1" />
                      {item.budget}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <Link
                    href={`/itinerary/${item.id}`}
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm"
                  >
                    <Eye className="w-4 h-4 mr-1" /> View
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="inline-flex items-center px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition"
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
