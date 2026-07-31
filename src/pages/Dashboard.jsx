import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import client from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import EmptyState from '../components/EmptyState.jsx';

const pulseSummary = (checkIn) =>
  `${checkIn.seatingAvailability} seating · ${checkIn.noiseLevel} · ${checkIn.wifiSpeed} wifi`;

const Dashboard = () => {
  const { user } = useAuth();
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .get('/checkins/mine')
      .then(({ data }) => setCheckIns(data.checkIns))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-10">
      <h1 className="font-display text-3xl font-bold mb-1.5">Your dashboard</h1>
      <p className="text-slate-400 text-sm mb-8">Track the pulse data you've contributed to the community.</p>

      <div className="grid grid-cols-3 gap-4 mb-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-5 text-center">
          <p className="font-display font-bold text-2xl text-gold-400">{user?.points || 0}</p>
          <p className="text-slate-500 text-xs mt-1">Total points</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass rounded-2xl p-5 text-center">
          <p className="font-display font-bold text-2xl text-emerald-400">{checkIns.length}</p>
          <p className="text-slate-500 text-xs mt-1">Check-ins made</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-5 text-center">
          <p className="font-display font-bold text-2xl">{user?.favorites?.length || 0}</p>
          <p className="text-slate-500 text-xs mt-1">Favorites</p>
        </motion.div>
      </div>

      <h2 className="font-display text-lg font-semibold mb-4">Recent check-ins</h2>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-16 rounded-2xl" />)}
        </div>
      ) : checkIns.length === 0 ? (
        <EmptyState
          icon="📡"
          title="No check-ins yet"
          subtitle="Visit a cafe's page and tap 'Check in here' to start earning points."
          action={
            <Link to="/discover" className="px-5 py-2.5 rounded-full text-sm font-semibold bg-gradient-to-r from-gold-500 to-gold-400 text-ink-950">
              Discover cafes
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {checkIns.map((c, i) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="glass rounded-2xl p-4 flex items-center justify-between gap-4"
            >
              <div>
                <p className="font-semibold text-sm">
                  <Link to={`/cafe/${c.cafe?._id}`} className="hover:text-gold-400 transition-colors">
                    {c.cafe?.name}
                  </Link>
                </p>
                <p className="text-slate-500 text-xs mt-0.5 capitalize">{pulseSummary(c)}</p>
              </div>
              <span className="text-xs text-slate-500 whitespace-nowrap">
                {new Date(c.createdAt).toLocaleString()}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
