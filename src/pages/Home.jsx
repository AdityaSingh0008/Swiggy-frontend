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
      <section className="relative overflow-hidden min-h-[85vh] flex items-center">
        {/* Subtle animated gradient mesh */}
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[30%] -right-[10%] w-[800px] h-[800px] bg-gradient-to-br from-gold-500/5 to-emerald-500/5 rounded-full blur-[100px]" 
          />
        </div>

        <div className="max-w-7xl mx-auto px-5 sm:px-8 w-full relative grid lg:grid-cols-2 gap-12 items-center z-10 py-20">
          <div>
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
              className="font-display text-5xl sm:text-7xl font-extrabold leading-[1.05] mb-6"
            >
              Find your <span className="text-gradient">perfect table</span>, right now.
            </motion.h1>
            <motion.p
              initial="hidden"
              animate="show"
              custom={2}
              variants={fadeUp}
              className="text-slate-400 text-lg sm:text-xl max-w-lg mb-10"
            >
              Swiggy Plus shows real-time seating, noise, and wifi conditions crowd-sourced by
              people at the cafe right now — plus exclusive member perks at partner cafes near you.
            </motion.p>
            <motion.div initial="hidden" animate="show" custom={3} variants={fadeUp} className="flex flex-wrap gap-4">
              <Link
                to="/discover"
                className="px-8 py-4 rounded-full font-bold bg-gradient-to-r from-gold-500 to-gold-400 text-ink-950 hover:shadow-glow hover:-translate-y-1 transition-all duration-300"
              >
                Discover cafes near me
              </Link>
              <Link
                to="/premium"
                className="px-8 py-4 rounded-full font-bold glass hover:bg-white/10 hover:-translate-y-1 transition-all duration-300"
              >
                Explore Plus membership
              </Link>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="show"
              custom={4}
              variants={fadeUp}
              className="flex flex-wrap gap-x-10 gap-y-6 mt-16 pt-10 border-t border-white/10"
            >
              {[
                ['200+', 'Partner cafes'],
                ['15K+', 'Live check-ins'],
                ['4.6★', 'Average rating'],
              ].map(([stat, label]) => (
                <div key={label}>
                  <p className="font-display font-bold text-3xl">{stat}</p>
                  <p className="text-slate-500 text-sm mt-1">{label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="hidden lg:block relative h-[500px] perspective-[1000px]"
          >
            {/* Floating 3D Cards */}
            <motion.div 
              animate={{ y: [-10, 10, -10], rotateX: [5, -5, 5], rotateY: [-5, 5, -5] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 right-10 w-72 glass p-6 rounded-3xl shadow-premium border border-white/10 z-20 backdrop-blur-md"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">☕</div>
                <div>
                  <h4 className="font-bold text-white">Blue Tokai Coffee</h4>
                  <p className="text-xs text-slate-400">2.4 km away</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Seating</span>
                  <span className="text-emerald-400 font-semibold px-2 py-1 bg-emerald-500/10 rounded-md">Available</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Wifi</span>
                  <span className="text-gold-400 font-semibold px-2 py-1 bg-gold-500/10 rounded-md">Fast (45 Mbps)</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [15, -15, 15], rotateZ: [-2, 2, -2] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-10 left-0 w-64 bg-[#14151a] p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 z-10"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xl">🌟</span>
                <p className="font-semibold text-sm">Plus Member Perk</p>
              </div>
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">Enjoy 1+1 on all handcrafted beverages every Tuesday.</p>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-full bg-gradient-to-r from-gold-500 to-emerald-400"
                />
              </div>
            </motion.div>

            {/* Decorative background shapes */}
            <motion.div 
              animate={{ scale: [1, 1.1, 1], rotate: 180 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full z-0"
            />
            <motion.div 
              animate={{ scale: [1.1, 1, 1.1], rotate: -180 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 border-dashed rounded-full z-0 opacity-50"
            />
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
