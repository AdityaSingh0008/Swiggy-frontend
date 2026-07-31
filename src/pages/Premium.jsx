import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import client from '../api/client.js';
import { useNavigate } from 'react-router-dom';

const perks = [
  { icon: '💳', title: 'Exclusive member pricing', desc: '10-20% off at every Plus partner cafe, automatically applied.' },
  { icon: '⚡', title: 'Priority live pulse', desc: 'See seating & noise updates 5 minutes before free users do.' },
  { icon: '🎁', title: 'Birthday treats', desc: 'A free drink or dessert at any partner cafe during your birthday month.' },
  { icon: '🏆', title: '2x pulse points', desc: 'Earn double points for every check-in you contribute.' },
  { icon: '📍', title: 'Extended radius search', desc: 'Search up to 25km instead of the standard 10km.' },
  { icon: '🎧', title: 'Priority support', desc: 'Skip the queue with a dedicated support line.' },
];

const Premium = () => {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();
  const [upgrading, setUpgrading] = useState(false);
  const navigate = useNavigate();

  const handleUpgrade = async () => {
    if (!user) return navigate('/login');
    setUpgrading(true);
    try {
      await client.post('/users/me/upgrade-premium');
      await refreshUser();
      showToast('Welcome to Swiggy Plus! 🎉', 'success');
    } catch (err) {
      showToast('Could not upgrade — try again', 'error');
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
        <span className="text-xs font-semibold tracking-widest text-gold-400 uppercase">Membership</span>
        <h1 className="font-display text-4xl font-extrabold mt-3 mb-4">
          Go <span className="text-gradient">Plus</span>
        </h1>
        <p className="text-slate-400 max-w-lg mx-auto">
          One membership, every partner cafe. Real savings, real perks — no gimmicks.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 mb-14">
        {perks.map((perk, i) => (
          <motion.div
            key={perk.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-5 flex items-start gap-4"
          >
            <div className="text-2xl">{perk.icon}</div>
            <div>
              <h3 className="font-semibold mb-1">{perk.title}</h3>
              <p className="text-slate-400 text-sm">{perk.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="glass rounded-3xl p-10 text-center max-w-md mx-auto shadow-premium"
      >
        {user?.isPremium ? (
          <>
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="font-display text-xl font-bold mb-2">You're already a Plus member!</h3>
            <p className="text-slate-400 text-sm">Enjoy your perks at every partner cafe.</p>
          </>
        ) : (
          <>
            <p className="text-4xl font-display font-extrabold mb-1">
              ₹99<span className="text-base font-normal text-slate-400">/month</span>
            </p>
            <p className="text-slate-500 text-sm mb-6">Cancel anytime, no lock-in.</p>
            <button
              onClick={handleUpgrade}
              disabled={upgrading}
              className="w-full py-3.5 rounded-xl font-semibold bg-gradient-to-r from-gold-500 to-gold-400 text-ink-950 hover:shadow-glow transition-shadow disabled:opacity-50"
            >
              {upgrading ? 'Upgrading…' : user ? 'Upgrade now' : 'Log in to upgrade'}
            </button>
            <p className="text-[11px] text-slate-500 mt-3">Demo mode — no real payment is processed.</p>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Premium;
