import React from 'react';
import { motion } from 'framer-motion';

// Visualizes the "Live Cafe Pulse" — the unique feature. Shows a live,
// crowd-sourced vibe score instead of a static star rating.
const getPulseColor = (score) => {
  if (score === null || score === undefined) return 'text-slate-500 border-slate-600/40 bg-slate-600/10';
  if (score >= 70) return 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10';
  if (score >= 40) return 'text-gold-400 border-gold-400/30 bg-gold-400/10';
  return 'text-red-400 border-red-400/30 bg-red-400/10';
};

const PulseBadge = ({ vibeScore, hasLivePulse, size = 'sm' }) => {
  const sizeClasses = size === 'lg' ? 'text-sm px-3 py-1.5 gap-2' : 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <div className={`inline-flex items-center rounded-full border font-semibold ${sizeClasses} ${getPulseColor(vibeScore)}`}>
      {hasLivePulse ? (
        <motion.span
          className="w-1.5 h-1.5 rounded-full bg-current"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
      ) : (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-30" />
      )}
      {hasLivePulse ? `${vibeScore}% Live Vibe` : 'No live data yet'}
    </div>
  );
};

export default PulseBadge;
