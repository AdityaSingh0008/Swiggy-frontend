import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-[70vh] grid place-items-center text-center px-5">
    <div>
      <p className="font-display text-7xl font-extrabold text-gradient mb-4">404</p>
      <h1 className="font-display text-xl font-bold mb-2">Page not found</h1>
      <p className="text-slate-400 mb-8">The page you're looking for doesn't exist.</p>
      <Link to="/" className="px-6 py-3 rounded-full font-semibold bg-gradient-to-r from-gold-500 to-gold-400 text-ink-950">
        Back home
      </Link>
    </div>
  </div>
);

export default NotFound;
