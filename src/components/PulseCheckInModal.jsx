import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import client from '../api/client.js';
import { useToast } from '../context/ToastContext.jsx';

const seatingOptions = [
  { value: 'plenty', label: 'Plenty of seats', emoji: '🪑' },
  { value: 'limited', label: 'Filling up', emoji: '⏳' },
  { value: 'full', label: 'Completely full', emoji: '🚫' },
];
const noiseOptions = [
  { value: 'quiet', label: 'Quiet', emoji: '🤫' },
  { value: 'moderate', label: 'Buzzing', emoji: '🗣️' },
  { value: 'loud', label: 'Loud', emoji: '📢' },
];
const wifiOptions = [
  { value: 'fast', label: 'Fast', emoji: '🚀' },
  { value: 'okay', label: 'Okay', emoji: '👍' },
  { value: 'slow', label: 'Slow', emoji: '🐌' },
  { value: 'none', label: 'No wifi', emoji: '📵' },
];

const OptionRow = ({ label, options, value, onChange }) => (
  <div className="mb-5">
    <p className="text-sm font-medium text-slate-300 mb-2.5">{label}</p>
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`px-2 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
            value === opt.value
              ? 'border-gold-400 bg-gold-400/10 text-gold-400 scale-[1.03]'
              : 'border-white/10 text-slate-400 hover:border-white/25 hover:text-slate-200'
          }`}
        >
          <div className="text-lg mb-1">{opt.emoji}</div>
          {opt.label}
        </button>
      ))}
    </div>
  </div>
);

const PulseCheckInModal = ({ cafeId, open, onClose, onSuccess }) => {
  const [seating, setSeating] = useState('');
  const [noise, setNoise] = useState('');
  const [wifi, setWifi] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const canSubmit = seating && noise && wifi && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const { data } = await client.post('/checkins', {
        cafe: cafeId,
        seatingAvailability: seating,
        noiseLevel: noise,
        wifiSpeed: wifi,
        note,
      });
      showToast(`Pulse shared — you earned ${data.pointsEarned} points!`, 'success');
      setSeating('');
      setNoise('');
      setWifi('');
      setNote('');
      onSuccess?.();
      onClose();
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not submit check-in', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm grid place-items-end sm:place-items-center p-0 sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-md glass rounded-t-3xl sm:rounded-3xl p-6 sm:p-7 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-display font-bold text-lg">Share the live pulse</h3>
              <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-white/10 grid place-items-center">✕</button>
            </div>
            <p className="text-sm text-slate-400 mb-6">
              Help others know what it's like right now. Your check-in expires after 90 minutes.
            </p>

            <OptionRow label="Seating availability" options={seatingOptions} value={seating} onChange={setSeating} />
            <OptionRow label="Noise level" options={noiseOptions} value={noise} onChange={setNoise} />
            <OptionRow label="Wifi speed" options={wifiOptions} value={wifi} onChange={setWifi} />

            <div className="mb-6">
              <p className="text-sm font-medium text-slate-300 mb-2.5">Quick note (optional)</p>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={140}
                placeholder="e.g. Great corner table by the window"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-400/50 transition-colors"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="w-full py-3.5 rounded-xl font-semibold bg-gradient-to-r from-gold-500 to-gold-400 text-ink-950 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-glow transition-shadow"
            >
              {submitting ? 'Sharing…' : 'Share pulse · +5 points'}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PulseCheckInModal;
