'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  getFirestore,
  doc,
  getDoc
} from 'firebase/firestore';
import {
  getAuth,
  onAuthStateChanged
} from 'firebase/auth';
import {
  CalendarDays,
  Sunrise,
  Sun,
  Moon,
  Tag
} from 'lucide-react';
import '../../../firebase';

export default function ItineraryDetail() {
  const { id } = useParams();
  const router = useRouter();
  const db     = getFirestore();
  const auth   = getAuth();

  const [user, setUser] = useState(null);
  const [it, setIt]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Auth guard and get user
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      if (!u) router.push('/login');
      else setUser(u);
    });
    return () => unsub();
  }, [auth, router]);

  // Fetch itinerary from user-scoped subcollection
  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, 'users', user.uid, 'itineraries', id))
      .then(snap => setIt(snap.exists() ? snap.data() : null))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [db, id, user]);

  if (loading) return <p className="p-8">Loading…</p>;
  if (!it)      return <p className="p-8">Itinerary not found.</p>;

  // Reuse same render logic
  const renderItinerary = text => {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    let buf = [], key = 0, out = [];
    const flush = () => {
      if (!buf.length) return;
      out.push(
        <ul key={key++} className="list-disc ml-8 mb-6">
          {buf.map(item => <li key={key++} className="mb-2">{item}</li>)}
        </ul>
      );
      buf = [];
    };

    lines.forEach(line => {
      if (/^Day\s*\d+/i.test(line)) {
        flush();
        out.push(
          <div key={key++} className="border-l-4 border-indigo-400 bg-indigo-50 p-4 rounded mb-4">
            <CalendarDays className="inline w-5 h-5 text-indigo-600 mr-2" />
            <strong className="text-indigo-800">{line}</strong>
          </div>
        );
      } else if (/^Morning/i.test(line)) {
        flush();
        out.push(
          <h3 key={key++} className="flex items-center text-lg font-semibold text-yellow-800 mt-4 mb-2">
            <Sunrise className="w-5 h-5 mr-2" /> {line}
          </h3>
        );
      } else if (/^Afternoon/i.test(line)) {
        flush();
        out.push(
          <h3 key={key++} className="flex items-center text-lg font-semibold text-orange-700 mt-4 mb-2">
            <Sun className="w-5 h-5 mr-2" /> {line}
          </h3>
        );
      } else if (/^Evening/i.test(line)) {
        flush();
        out.push(
          <h3 key={key++} className="flex items-center text-lg font-semibold text-purple-700 mt-4 mb-2">
            <Moon className="w-5 h-5 mr-2" /> {line}
          </h3>
        );
      } else if (/^Tips/i.test(line)) {
        flush();
        out.push(
          <h3 key={key++} className="flex items-center text-lg font-semibold text-green-800 mt-6 mb-2">
            <Tag className="w-5 h-5 mr-2" /> {line}
          </h3>
        );
      } else {
        buf.push(line);
      }
    });
    flush();
    return out;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-indigo-800 mb-4">
          {it.destination} — {it.days} day{it.days > 1 ? 's' : ''} trip
        </h1>
        <div className="flex items-center space-x-4 mb-6">
          <span className="inline-flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
            <CalendarDays className="w-4 h-4 mr-1" /> {it.days} day{it.days > 1 ? 's' : ''}
          </span>
          <span className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full">
            <Tag className="w-4 h-4 mr-1" /> {it.budget}
          </span>
        </div>

        {renderItinerary(it.text)}

        <button
          onClick={() => router.push('/dashboard')}
          className="mt-8 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
