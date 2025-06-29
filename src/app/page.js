// src/app/page.js
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Home() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="bg-white text-gray-800">
      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto px-4 md:px-12 lg:px-20 py-16 grid grid-cols-1 md:grid-cols-2 items-center gap-10">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Uncover the <span className="text-blue-600">AI</span> Travel <br/>
            <span className="text-blue-600">Plan</span>
          </h1>
          <p className="flex items-center gap-2 text-lg text-gray-800">
            <span className="text-yellow-500 text-2xl">💡</span>
            Imagine telling your travel planner,
          </p>
          <p className="italic text-blue-700 font-semibold text-base md:text-lg">
            ‘Weekend escape to a vibrant city, with mid-range budget in summer.’
          </p>
          <p className="text-base md:text-lg text-gray-700">
            Our AI not only understands but crafts a personalized adventure. Discover local
            secrets, savor culinary delights, and explore iconic landmarks with an itinerary
            designed just for you.
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-7 py-3 text-lg bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </Link>
        </div>
        <div className="flex justify-center md:justify-end">
          <Image
            src="/2.jpg"
            alt="Travel Illustration"
            width={460}
            height={460}
            priority
          />
        </div>
      </div>

      {/* HOW IT WORKS SECTION */}
      <div className="bg-gray-50 py-24 px-4 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-600 text-sm font-semibold">How it works?</p>
            <h2 className="text-4xl md:text-5xl font-bold mt-2">
              Craft Your Ideal Journey Swiftly
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div
              data-aos="fade-up"
              className="bg-white rounded-2xl shadow-md px-10 py-12 text-center min-h-[460px] flex flex-col items-center space-y-6 hover:shadow-xl transition"
            >
              <div className="text-5xl">🔐</div>
              <h3 className="text-2xl font-semibold">Login</h3>
              <p className="text-base text-gray-600 leading-relaxed">
                Log in to your account to access your personalized dashboard and begin your
                travel planning journey with ease and confidence. Gain access to saved
                itineraries, browse recommended destinations, and manage your preferences —
                all from one secure place.
              </p>
            </div>
            {/* Step 2 */}
            <div
              data-aos="fade-up"
              data-aos-delay="100"
              className="bg-white rounded-2xl shadow-md px-10 py-12 text-center min-h-[460px] flex flex-col items-center space-y-6 hover:shadow-xl transition"
            >
              <div className="text-5xl">💡</div>
              <h3 className="text-2xl font-semibold">Key in the travel idea</h3>
              <p className="text-base text-gray-600 leading-relaxed">
                Tell us your dream destination, travel dates, vibe, and budget. Whether it’s a
                beach escape or a city adventure, our AI captures every detail to understand
                your travel style and curate the best possible plan.
              </p>
            </div>
            {/* Step 3 */}
            <div
              data-aos="fade-up"
              data-aos-delay="200"
              className="bg-white rounded-2xl shadow-md px-10 py-12 text-center min-h-[460px] flex flex-col items-center space-y-6 hover:shadow-xl transition"
            >
              <div className="text-5xl">🧭</div>
              <h3 className="text-2xl font-semibold">Get AI Plan</h3>
              <p className="text-base text-gray-600 leading-relaxed">
                Sit back while our AI crafts a fully customized itinerary tailored to your
                preferences — complete with local gems, must-see attractions, and smart
                recommendations to make every moment memorable.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BENEFITS SECTION */}
      <div className="bg-white py-24 px-4 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto space-y-32">
          <div className="text-center mb-16">
            <p className="text-blue-600 text-sm font-semibold">Why choose us?</p>
            <h2 className="text-4xl md:text-5xl font-bold mt-2">
              Benefits of Our AI Travel Planner
            </h2>
          </div>

          {/* Benefit 1 */}
          <div
            data-aos="fade-right"
            className="flex flex-col md:flex-row items-center gap-12"
          >
            <div className="md:w-2/5 flex justify-start">
              <Image
                src="/B1.png"
                alt="Speed & Efficiency"
                width={300}
                height={200}
                className="mx-0"
              />
            </div>
            <div className="md:w-3/5 space-y-6">
              <h3 className="text-3xl md:text-4xl font-semibold text-gray-900">
                ⚡️ Speed & Efficiency
              </h3>
              <p className="text-lg md:text-xl text-gray-800">
                Generate a complete, day-by-day itinerary in seconds—no more endless research.
                Focus on the fun stuff, not the planning.{' '}
                <em>Save hours of prep time so you can start your trip earlier.</em>
              </p>
            </div>
          </div>

          {/* Benefit 2 */}
          <div
            data-aos="fade-left"
            className="flex flex-col md:flex-row-reverse items-center gap-12"
          >
            <div className="md:w-2/5 flex justify-end">
              <Image
                src="/B2.png"
                alt="Local Expertise"
                width={300}
                height={200}
                className="mx-0"
              />
            </div>
            <div className="md:w-3/5 space-y-6">
              <h3 className="text-3xl md:text-4xl font-semibold text-gray-900">
                🌍 Local Expertise
              </h3>
              <p className="text-lg md:text-xl text-gray-800">
                Unlock insider tips and hidden gems—our AI combs thousands of local sources to
                bring you authentic experiences.{' '}
                <em>Feel like you have a friend on the ground in every city.</em>
              </p>
            </div>
          </div>

          {/* Benefit 3 */}
          <div
            data-aos="fade-right"
            className="flex flex-col md:flex-row items-center gap-12"
          >
            <div className="md:w-2/5 flex justify-start">
              <Image
                src="/B3.png"
                alt="Budget Optimization"
                width={300}
                height={200}
                className="mx-0"
              />
            </div>
            <div className="md:w-3/5 space-y-6">
              <h3 className="text-3xl md:text-4xl font-semibold text-gray-900">
                💰 Budget Optimization
              </h3>
              <p className="text-lg md:text-xl text-gray-800">
                Whether you’re splurging or saving, get cost-effective recommendations that
                stretch every dollar further.{' '}
                <em>Maximize value without sacrificing quality.</em>
              </p>
            </div>
          </div>

          {/* Benefit 4 */}
          <div
            data-aos="fade-left"
            className="flex flex-col md:flex-row-reverse items-center gap-12"
          >
            <div className="md:w-2/5 flex justify-end">
              <Image
                src="/B4.png"
                alt="Flexibility & Customization"
                width={300}
                height={200}
                className="mx-0"
              />
            </div>
            <div className="md:w-3/5 space-y-6">
              <h3 className="text-3xl md:text-4xl font-semibold text-gray-900">
                🔄 Flexibility & Customization
              </h3>
              <p className="text-lg md:text-xl text-gray-800">
                Swap activities, adjust timings, or add new stops on the fly—your itinerary
                adapts as your plans evolve.{' '}
                <em>Travel on your terms, every step of the way.</em>
              </p>
            </div>
          </div>

          {/* Benefit 5 */}
          <div
            data-aos="fade-right"
            className="flex flex-col md:flex-row items-center gap-12"
          >
            <div className="md:w-2/5 flex justify-start">
              <Image
                src="/B5.png"
                alt="24/7 Assistance"
                width={300}
                height={200}
                className="mx-0"
              />
            </div>
            <div className="md:w-3/5 space-y-6">
              <h3 className="text-3xl md:text-4xl font-semibold text-gray-900">
                🕑 24/7 Assistance
              </h3>
              <p className="text-lg md:text-xl text-gray-800">
                Our support is always on—get help, make adjustments, and troubleshoot anywhere,
                anytime.{' '}
                <em>Peace of mind from takeoff to touchdown.</em>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
