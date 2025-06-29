import './globals.css';
import NavBar from './components/NavBar';
import Footer from './components/Footer';

export const metadata = {
  title: 'Travel Planner AI',
  description: 'Your personalized AI-powered travel itinerary assistant',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-800">
        <NavBar />
        <main className="pt-24 px-4">{children}</main> {/* Reduced from pt-32 to pt-24 */}
        <Footer />
      </body>
    </html>
  );
}
