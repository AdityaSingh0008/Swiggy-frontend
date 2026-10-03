import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const ICONS = {
  seating: { plenty: '🪑', limited: '⏳', full: '🚫', default: '🪑' },
  noise: { quiet: '🤫', moderate: '🗣️', loud: '📢', default: '🔊' },
  wifi: { fast: '🚀', okay: '👍', slow: '🐌', none: '📵', default: '📶' },
};

const LABELS = {
  seating: { plenty: 'Plenty', limited: 'Limited', full: 'Full', default: 'Seating' },
  noise: { quiet: 'Quiet', moderate: 'Moderate', loud: 'Loud', default: 'Noise' },
  wifi: { fast: 'Fast', okay: 'Okay', slow: 'Slow', none: 'None', default: 'Wifi' },
};

const COLORS = {
  plenty: 'text-emerald-400',
  limited: 'text-gold-400',
  full: 'text-red-400',
  quiet: 'text-emerald-400',
  moderate: 'text-gold-400',
  loud: 'text-red-400',
  fast: 'text-emerald-400',
  okay: 'text-gold-400',
  slow: 'text-orange-400',
  none: 'text-red-400',
  default: 'text-slate-100',
};

const PulseCard = ({ type, value, description }) => {
  const icon = ICONS[type][value] || ICONS[type].default;
  const label = LABELS[type][value] || LABELS[type].default;
  const colorClass = COLORS[value] || COLORS.default;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 20 }}
      className="glass rounded-2xl p-4 text-center relative overflow-hidden group cursor-default"
    >
      <motion.div 
        key={value}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10"
      >
        <div className="text-3xl mb-3 drop-shadow-lg">{icon}</div>
        <p className={`font-bold text-sm mb-1 ${colorClass} transition-colors`}>{label}</p>
        <p className="text-[11px] text-slate-400">{description}</p>
      </motion.div>
      
      {/* Subtle hover glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
};

const InteractivePulseCards = ({ cafes }) => {
  const activeCafes = cafes.filter(c => c.pulse);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-rotate if no interaction
  useEffect(() => {
    if (activeCafes.length === 0 || isHovered) return;
    const timer = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % activeCafes.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [activeCafes.length, isHovered]);

  if (activeCafes.length === 0) {
    return (
      <div className="grid grid-cols-3 gap-3">
        <PulseCard type="seating" value="default" description="Plenty / Limited / Full" />
        <PulseCard type="noise" value="default" description="Quiet / Moderate / Loud" />
        <PulseCard type="wifi" value="default" description="Fast / Okay / Slow" />
      </div>
    );
  }

  const selectedCafe = activeCafes[selectedIndex];
  const pulse = selectedCafe.pulse;

  return (
    <div className="space-y-6" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="grid grid-cols-3 gap-3">
        <PulseCard 
          type="seating" 
          value={pulse.seatingAvailability} 
          description="Live Seating" 
        />
        <PulseCard 
          type="noise" 
          value={pulse.noiseLevel} 
          description="Current Noise" 
        />
        <PulseCard 
          type="wifi" 
          value={pulse.wifiSpeed} 
          description="Wifi Speed" 
        />
      </div>

      <div className="glass rounded-2xl p-4 border border-white/5">
        <p className="text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">Select a cafe to view live pulse</p>
        <div className="flex flex-col gap-2">
          {activeCafes.slice(0, 3).map((cafe, idx) => (
            <button
              key={cafe._id}
              onClick={() => setSelectedIndex(idx)}
              className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex justify-between items-center ${
                idx === selectedIndex 
                  ? 'bg-gold-400/10 border border-gold-400/30 text-gold-400' 
                  : 'bg-white/5 border border-transparent text-slate-300 hover:bg-white/10'
              }`}
            >
              <span className="truncate pr-4">{cafe.name}</span>
              {idx === selectedIndex && (
                <motion.span layoutId="indicator" className="w-2 h-2 rounded-full bg-gold-400 shadow-[0_0_8px_rgba(224,172,95,0.8)]" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InteractivePulseCards;
