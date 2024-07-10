import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import BlogPage from './BlogPage';
import SocialsDropdown from './SocialsDropdown';
import { TokenDataProvider } from './context/TokenDataContext';
import HomePage from './pages/HomePage';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-900 shadow-lg z-50 transition-all duration-300" style={{ backgroundColor: `rgba(23, 25, 35, ${Math.min(scrollY / 500, 0.9)})` }}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-teal-400 glow">CoinBag</h1>
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="text-teal-300 hover:text-teal-100 transition duration-200 hover:glow">Home</Link>
          <Link to="/blog" className="text-teal-300 hover:text-teal-100 transition duration-200 hover:glow">Blog</Link>
          <SocialsDropdown />
        </nav>
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-teal-300 hover:text-teal-100">
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-gray-800 py-2">
          <Link to="/" className="block px-4 py-2 text-teal-300 hover:text-teal-100 hover:bg-gray-700">Home</Link>
          <Link to="/blog" className="block px-4 py-2 text-teal-300 hover:text-teal-100 hover:bg-gray-700">Blog</Link>
          <SocialsDropdown />
        </div>
      )}
    </header>
  );
};

const App = () => {
  return (
    <TokenDataProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogPage />} />
        </Routes>
      </Router>
    </TokenDataProvider>
  );
};

export default App;