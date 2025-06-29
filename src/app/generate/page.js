// src/app/generate/page.js
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter }                   from 'next/navigation';
import {
  Sparkles,
  Sunrise,
  Sun,
  Moon,
  CalendarDays,
  Tag
} from 'lucide-react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc
} from 'firebase/firestore';
import '../../firebase'; // your firebase init

export default function GeneratePage() {
  const router    = useRouter();
  const auth      = getAuth();
  const db        = getFirestore();
  const resultRef = useRef(null);

  // form / result state
  const [user,        setUser]        = useState(null);
  const [destination, setDestination] = useState('');
  const [days,        setDays]        = useState('');
  const [budget,      setBudget]      = useState('');
  const [preferences, setPreferences] = useState('');
  const [dietary,     setDietary]     = useState('');
  const [mobility,    setMobility]    = useState('');
  const [result,      setResult]      = useState('');
  const [loading,     setLoading]     = useState(false);
  const [saving,      setSaving]      = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // load saved form + result from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('travelForm') || '{}');
    if (saved.destination) setDestination(saved.destination);
    if (saved.days)        setDays(saved.days);
    if (saved.budget)      setBudget(saved.budget);
    if (saved.preferences) setPreferences(saved.preferences);
    if (saved.dietary)     setDietary(saved.dietary);
    if (saved.mobility)    setMobility(saved.mobility);
    if (saved.result)      setResult(saved.result);
  }, []);

  // persist form + result to localStorage
  useEffect(() => {
    localStorage.setItem('travelForm', JSON.stringify({
      destination, days, budget, preferences, dietary, mobility, result
    }));
  }, [destination, days, budget, preferences, dietary, mobility, result]);

  // redirect if not logged in
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      if (!u) router.push('/login');
      else setUser(u);
    });
    return () => unsub();
  }, [auth, router]);

  // generate itinerary
  const handleGenerate = async e => {
    e.preventDefault();
    setLoading(true);
    setResult('');
    setSaveMessage('');
    const prompt = `
Create a ${days}-day itinerary for a trip to ${destination}.
Budget: ${budget.toLowerCase()}. Prefers: ${preferences}.
Dietary restrictions: ${dietary || 'None'}. Mobility concerns: ${mobility}.
Provide a detailed day-by-day plan broken into Morning, Afternoon, and Evening, with 2 bullet points each. End with Tips.
    `.trim();

    try {
      const res = await fetch('/api/generate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ prompt })
      });
      const jsn = await res.json();
      const txt = (jsn.generations?.[0]?.text || jsn.error || 'No response.')
                    .replace(/Let me know if[\s\S]*/i, '')
                    .trim();
      setResult(txt);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
    } catch {
      setResult('Error generating itinerary.');
    } finally {
      setLoading(false);
    }
  };

  // save to dashboard
  const handleSave = () => {
    if (!user || !result) return;
    setSaving(true);
    setSaveMessage('✅ Itinerary saved!');
    setTimeout(() => { setSaving(false); setSaveMessage(''); }, 3000);

    // Refactored: save to user-scoped itineraries subcollection
    addDoc(collection(db, 'users', user.uid, 'itineraries'), {
      userId:      user.uid,
      destination,
      days,
      budget,
      preferences,
      dietary,
      mobility,
      text:        result,
      createdAt:   Date.now()
    }).catch(console.error);
  };

  // reset form for new itinerary
  const handleReset = () => {
    setDestination('');
    setDays('');
    setBudget('');
    setPreferences('');
    setDietary('');
    setMobility('');
    setResult('');
    setSaveMessage('');
  };

  // render styled itinerary
  const renderItinerary = text => {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    let buffer = [], key = 0, out = [];
    const flush = () => {
      if (!buffer.length) return;
      out.push(
        <ul key={key++} className="list-disc ml-8 mb-6">
          {buffer.map(item => (
            <li key={key++} className="mb-2">
              {item.replace(/^[-–]\s*/, '')}
            </li>
          ))}
        </ul>
      );
      buffer = [];
    };

    lines.forEach(line => {
      if (/^Day\s*\d+/i.test(line)) {
        flush();
        out.push(
          <div key={key++} className="border-l-4 border-blue-400 bg-blue-50 p-4 rounded mb-4">
            <CalendarDays className="inline w-5 h-5 text-blue-600 mr-2" />
            <strong className="text-blue-800">{line}</strong>
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
        buffer.push(line);
      }
    });

    flush();
    return out;
  };

  return (
    <>
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0"
      >
        <source src="/Untitled design.mp4" type="video/mp4" />
      </video>
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-10" />

      {/* Content */}
      <div className="relative z-20 min-h-screen py-12">
        {/* Form card */}
        <div className="max-w-xl mx-auto bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-lg p-8 mb-12">
          <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
            <Sparkles className="inline w-6 h-6 mr-2 text-yellow-500" />
            Plan Your Dream Trip
          </h1>
          <form onSubmit={handleGenerate} className="space-y-4">
            <input
              type="text"
              placeholder="Destination (e.g., Paris)"
              className="w-full border rounded p-2"
              value={destination}
              onChange={e => setDestination(e.target.value)}
              required
            />
            <div className="flex gap-2">
              <input
                type="number"
                min={1}
                placeholder="Number of days"
                className="flex-1 border rounded p-2"
                value={days}
                onChange={e => setDays(e.target.value)}
                required
              />
              <select
                className="flex-1 border rounded p-2"
                value={budget}
                onChange={e => setBudget(e.target.value)}
                required
              >
                <option value="">Select budget</option>
                <option>Low</option>
                <option>Moderate</option>
                <option>High</option>
              </select>
            </div>
            <textarea
              placeholder="Preferences (e.g., food, museums)"
              className="w-full border rounded p-2"
              value={preferences}
              onChange={e => setPreferences(e.target.value)}
              required
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Dietary restrictions (optional)"
                className="flex-1 border rounded p-2"
                value={dietary}
                onChange={e => setDietary(e.target.value)}
              />
              <select
                className="flex-1 border rounded p-2"
                value={mobility}
                onChange={e => setMobility(e.target.value)}
                required
              >
                <option value="">Select mobility</option>
                <option>No mobility concerns</option>
                <option>Yes</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Generating…' : 'Generate Itinerary'}
            </button>
          </form>
        </div>

        {/* Result card */}
        {result && (
          <div
            ref={resultRef}
            className="max-w-4xl mx-auto bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-lg p-8 mb-12"
          >
            <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center">
              <Sparkles className="w-6 h-6 mr-2 text-yellow-500" /> Your Itinerary
            </h2>
            {renderItinerary(result)}
            <div className="mt-6 flex gap-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save to Dashboard'}
              </button>
              <button
                onClick={handleReset}
                className="bg-gray-200 text-gray-800 py-2 px-6 rounded hover:bg-gray-300"
              >
                Generate New Itinerary
              </button>
            </div>
            {saveMessage && <p className="mt-2 text-green-700">{saveMessage}</p>}
          </div>
        )}
      </div>
    </>
  );
}
