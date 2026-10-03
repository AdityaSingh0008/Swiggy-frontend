import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import client from '../api/client.js';
import { useToast } from '../context/ToastContext.jsx';

const ReservationModal = ({ isOpen, onClose, cafe }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleReserve = async (e) => {
    e.preventDefault();
    if (!date || !time) return showToast('Please select date and time', 'error');
    
    setLoading(true);
    try {
      await client.post(`/cafes/${cafe._id}/reserve`, { date, time, guests: 1 });
      showToast('Reservation confirmed! Check your dashboard.', 'success');
      onClose();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to reserve', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-ink-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 text-slate-400"
            >
              ✕
            </button>

            <h2 className="text-2xl font-display font-bold mb-2">Reserve a Desk</h2>
            <p className="text-slate-400 text-sm mb-6">
              Guaranteed quiet seating with plug points for up to 3 hours at <span className="text-white font-semibold">{cafe.name}</span>.
            </p>

            <form onSubmit={handleReserve} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-400/50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Time</label>
                <select
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-ink-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-400/50"
                >
                  <option value="" disabled>Select a time</option>
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">01:00 PM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                  <option value="17:00">05:00 PM</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-ink-950 font-bold hover:shadow-glow transition-all disabled:opacity-50"
                >
                  {loading ? 'Confirming...' : 'Confirm Workpass (Free)'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ReservationModal;
