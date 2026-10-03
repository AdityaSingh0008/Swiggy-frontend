import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import client from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import EmptyState from '../components/EmptyState.jsx';

const Feed = () => {
  const { user, setUser } = useAuth();
  const [feed, setFeed] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      client.get('/users/feed'),
      client.get('/users/discover')
    ]).then(([feedRes, discRes]) => {
      setFeed(feedRes.data);
      setSuggested(discRes.data);
    }).finally(() => setLoading(false));
  }, [user]);

  const handleFollow = async (id) => {
    try {
      const { data } = await client.post(`/users/${id}/follow`);
      setUser({ ...user, following: data.following });
      // Remove from suggested list visually
      setSuggested(s => s.filter(u => u._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-20 text-center">
        <h1 className="font-display text-3xl font-bold mb-4">Social Feed</h1>
        <p className="text-slate-400 mb-6">Log in to see where your friends are working today.</p>
        <Link to="/login" className="px-6 py-3 rounded-full bg-gold-400 text-ink-950 font-bold">Log in</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold mb-1.5">Friend Activity</h1>
          <p className="text-slate-400 text-sm">See where your network is checking in.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-32 rounded-3xl" />)
          ) : feed.length > 0 ? (
            feed.map((checkIn) => (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={checkIn._id} className="glass rounded-3xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${checkIn.user?.avatarSeed}&backgroundColor=e2e8f0`} alt="" className="w-12 h-12 rounded-full border-2 border-white/10 bg-white/5" />
                    <div>
                      <p className="font-semibold">{checkIn.user?.name}</p>
                      <p className="text-xs text-slate-400">checked in {new Date(checkIn.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-5 glass p-4 rounded-2xl border border-white/5 flex gap-4 items-center group cursor-pointer">
                  <img src={checkIn.cafe?.image || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&q=80'} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <Link to={`/cafe/${checkIn.cafe?._id}`} className="font-display font-semibold hover:text-gold-400 transition-colors">
                      {checkIn.cafe?.name || 'Unknown Cafe'}
                    </Link>
                    <p className="text-xs text-slate-400 line-clamp-1">{checkIn.cafe?.address}</p>
                    <div className="flex gap-2 mt-2">
                      {checkIn.seatingAvailability && <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10">{checkIn.seatingAvailability}</span>}
                      {checkIn.wifiSpeed && <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10">{checkIn.wifiSpeed} wifi</span>}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <EmptyState icon="👀" title="It's quiet here" subtitle="Follow some friends to see their recent check-ins." />
          )}
        </div>

        <div>
          <div className="glass rounded-3xl p-6 sticky top-24">
            <h3 className="font-display font-bold text-lg mb-4">Suggested to Follow</h3>
            {loading ? (
              <div className="space-y-4">
                <div className="skeleton h-12 rounded-xl" />
                <div className="skeleton h-12 rounded-xl" />
              </div>
            ) : suggested.length > 0 ? (
              <div className="space-y-4">
                {suggested.map(u => (
                  <div key={u._id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${u.avatarSeed}&backgroundColor=e2e8f0`} alt="" className="w-10 h-10 rounded-full border border-white/10" />
                      <div>
                        <p className="text-sm font-semibold leading-tight">{u.name}</p>
                        <p className="text-[11px] text-slate-400 leading-tight">{u.points} pts</p>
                      </div>
                    </div>
                    <button onClick={() => handleFollow(u._id)} className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full hover:bg-emerald-500/20 transition-colors">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">You're following everyone we know!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
