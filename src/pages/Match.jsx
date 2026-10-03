import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import client from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const SwipeCard = ({ cafe, onSwipe, active }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  
  // Save indicator (Right)
  const saveOpacity = useTransform(x, [0, 100], [0, 1]);
  // Skip indicator (Left)
  const skipOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 100) {
      onSwipe('right', cafe._id);
    } else if (info.offset.x < -100) {
      onSwipe('left', cafe._id);
    }
  };

  return (
    <motion.div
      style={{
        x: active ? x : 0,
        rotate: active ? rotate : 0,
        opacity: active ? opacity : 1,
      }}
      drag={active ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className={`absolute inset-0 rounded-[2rem] overflow-hidden bg-ink-900 shadow-2xl ${active ? 'z-20 cursor-grab active:cursor-grabbing' : 'z-10 scale-95 -translate-y-4'}`}
      initial={false}
      animate={!active ? { scale: 0.95, y: -20, opacity: 0.5 } : { scale: 1, y: 0, opacity: 1 }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-transparent z-10 pointer-events-none" />
      <img src={cafe.image || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80'} className="w-full h-full object-cover" />
      
      {/* Swipe Indicators */}
      {active && (
        <>
          <motion.div style={{ opacity: saveOpacity }} className="absolute top-10 left-10 z-20 border-4 border-emerald-400 rounded-xl px-4 py-2 rotate-[-15deg]">
            <p className="text-emerald-400 font-display font-bold text-4xl uppercase tracking-widest">Save</p>
          </motion.div>
          <motion.div style={{ opacity: skipOpacity }} className="absolute top-10 right-10 z-20 border-4 border-rose-400 rounded-xl px-4 py-2 rotate-[15deg]">
            <p className="text-rose-400 font-display font-bold text-4xl uppercase tracking-widest">Skip</p>
          </motion.div>
        </>
      )}

      <div className="absolute bottom-0 left-0 w-full p-8 z-20 pointer-events-none">
        <h2 className="text-4xl font-display font-bold mb-2">{cafe.name}</h2>
        <p className="text-slate-300 text-lg mb-4 line-clamp-2">{cafe.description || cafe.address}</p>
        <div className="flex gap-2 flex-wrap mb-4">
          {cafe.tags?.map(tag => (
            <span key={tag} className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-md">{tag}</span>
          ))}
        </div>
        <div className="flex items-center gap-4 text-sm font-semibold">
          <span className="flex items-center gap-1 text-gold-400">★ {cafe.rating || 'New'}</span>
          <span>{'₹'.repeat(cafe.priceLevel || 2)}</span>
        </div>
      </div>
    </motion.div>
  );
};

const Match = () => {
  const { user } = useAuth();
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    client.get('/cafes').then(({ data }) => {
      // Filter out favorites so we don't show them again
      const favIds = user?.favorites?.map(f => typeof f === 'object' ? f._id : f) || [];
      const deck = data.filter(c => !favIds.includes(c._id));
      // Shuffle
      setCafes(deck.sort(() => 0.5 - Math.random()));
    }).finally(() => setLoading(false));
  }, [user]);

  const handleSwipe = async (dir, id) => {
    if (dir === 'right') {
      try {
        await client.post(`/favorites/${id}`);
        showToast('Saved to Favorites! ❤️', 'success');
      } catch (err) {
        console.error(err);
      }
    }
    // Remove from front of array
    setCafes((prev) => prev.slice(1));
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="skeleton w-80 h-[500px] rounded-[2rem]" /></div>;

  return (
    <div className="min-h-screen bg-ink-950 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute top-8 w-full px-6 flex justify-between items-center z-50 pointer-events-none">
        <Link to="/" className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center pointer-events-auto hover:bg-white/10 transition-colors">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </Link>
        <h1 className="font-display font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-emerald-400">Cafe Match</h1>
        <div className="w-12 h-12" /> {/* spacer */}
      </div>

      <div className="relative w-full max-w-md aspect-[3/4] mt-10">
        <AnimatePresence>
          {cafes.length > 0 ? (
            cafes.slice(0, 3).map((cafe, i) => (
              <SwipeCard 
                key={cafe._id} 
                cafe={cafe} 
                active={i === 0}
                onSwipe={handleSwipe}
              />
            )).reverse()
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-6xl mb-4">🎉</span>
              <h2 className="text-2xl font-display font-bold mb-2">You've seen them all!</h2>
              <p className="text-slate-400">Check back later for more spots.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="mt-12 flex items-center gap-8 z-30">
        <button onClick={() => cafes.length > 0 && handleSwipe('left', cafes[0]._id)} className="w-16 h-16 rounded-full bg-ink-900 border border-white/5 shadow-xl flex items-center justify-center text-rose-400 hover:bg-white/5 hover:scale-110 transition-all">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <button onClick={() => cafes.length > 0 && handleSwipe('right', cafes[0]._id)} className="w-16 h-16 rounded-full bg-ink-900 border border-white/5 shadow-xl flex items-center justify-center text-emerald-400 hover:bg-white/5 hover:scale-110 transition-all">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
        </button>
      </div>
    </div>
  );
};

export default Match;
