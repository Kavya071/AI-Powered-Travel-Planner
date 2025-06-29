'use client';

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} TravelPlannerAI. All rights reserved.
      </div>
    </footer>
  );
}
