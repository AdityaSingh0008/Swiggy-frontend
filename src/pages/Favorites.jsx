import React, { useEffect, useState } from 'react';
import client from '../api/client.js';
import CafeCard from '../components/CafeCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .get('/favorites')
      .then(({ data }) => setFavorites(data.favorites))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
      <h1 className="font-display text-3xl font-bold mb-1.5">Your favorites</h1>
      <p className="text-slate-400 text-sm mb-8">Cafes you've saved for later.</p>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : favorites.length === 0 ? (
        <EmptyState
          icon="♡"
          title="No favorites yet"
          subtitle="Tap the heart icon on any cafe to save it here."
          action={
            <Link to="/discover" className="px-5 py-2.5 rounded-full text-sm font-semibold bg-gradient-to-r from-gold-500 to-gold-400 text-ink-950">
              Discover cafes
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((cafe, i) => <CafeCard key={cafe._id} cafe={cafe} index={i} />)}
        </div>
      )}
    </div>
  );
};

export default Favorites;
