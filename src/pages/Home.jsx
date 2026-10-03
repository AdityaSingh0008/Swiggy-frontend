import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import client from '../api/client.js';
import CafeCard from '../components/CafeCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import InteractivePulseCards from '../components/InteractivePulseCards.jsx';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] } }),
};

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .get('/cafes?sort=rating')
      .then(({ data }) => setFeatured(data.cafes.slice(0, 4)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
        <div className="absolute -top-20 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-20 relative">
          <motion.p
            initial="hidden"
            animate="show"
            custom={0}
            variants={fadeUp}
            className="text-xs font-semibold tracking-[0.2em] text-gold-400 uppercase mb-4"
          >
            Cafe discovery, reimagined
          </motion.p>
          <motion.h1
            initial="hidden"
            animate="show"
            custom={1}
            variants={fadeUp}
            className="font-display text-4xl sm:text-6xl font-extrabold leading-[1.05] max-w-3xl mb-6"
          >
            Find your <span className="text-gradient">perfect table</span>, right now — not last month.
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="show"
            custom={2}
            variants={fadeUp}
            className="text-slate-400 text-lg max-w-xl mb-10"
          >
            Swiggy Plus shows real-time seating, noise, and wifi conditions crowd-sourced by
            people at the cafe right now — plus exclusive member perks at partner cafes near you.
          </motion.p>
          <motion.div initial="hidden" animate="show" custom={3} variants={fadeUp} className="flex flex-wrap gap-4">
            <Link
              to="/discover"
              className="px-7 py-3.5 rounded-full font-semibold bg-gradient-to-r from-gold-500 to-gold-400 text-ink-950 hover:shadow-glow transition-shadow"
            >
              Discover cafes near me
            </Link>
            <Link
              to="/premium"
              className="px-7 py-3.5 rounded-full font-semibold glass hover:bg-white/10 transition-colors"
            >
              Explore Plus membership
            </Link>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="show"
            custom={4}
            variants={fadeUp}
            className="flex flex-wrap gap-8 mt-16 pt-10 border-t border-white/10"
          >
            {[
              ['200+', 'Partner cafes'],
              ['15K+', 'Live check-ins / week'],
              ['4.6★', 'Average rating'],
              ['90 min', 'Pulse freshness window'],
            ].map(([stat, label]) => (
              <div key={label}>
                <p className="font-display font-bold text-2xl">{stat}</p>
                <p className="text-slate-500 text-sm">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl font-bold mb-1">Top rated this week</h2>
            <p className="text-slate-400 text-sm">Hand-picked cafes with the strongest live pulse.</p>
          </div>
          <Link to="/discover" className="text-sm font-semibold text-gold-400 hover:underline hidden sm:block">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : featured.map((cafe, i) => <CafeCard key={cafe._id} cafe={cafe} index={i} />)}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-24">
        <div className="glass rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="relative grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">Unique to Swiggy Plus</span>
              <h3 className="font-display text-3xl font-bold mt-3 mb-4">The Live Cafe Pulse</h3>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Every other app shows you a review from six months ago. We show you what a cafe
                feels like in the last 90 minutes — seating, noise, and wifi — reported by people
                sitting there right now. Check in, earn points, and help the next person find their spot.
              </p>
              <Link to="/discover" className="text-sm font-semibold text-gold-400 hover:underline">
                Try it on the map →
              </Link>
            </div>
            <div>
              <InteractivePulseCards cafes={featured} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
