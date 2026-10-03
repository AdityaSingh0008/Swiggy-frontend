import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import client from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import PulseBadge from '../components/PulseBadge.jsx';
import PulseCheckInModal from '../components/PulseCheckInModal.jsx';
import MapView from '../components/MapView.jsx';

const pulseFields = [
  { key: 'seatingAvailability', label: 'Seating', icons: { plenty: '🪑 Plenty', limited: '⏳ Limited', full: '🚫 Full' } },
  { key: 'noiseLevel', label: 'Noise', icons: { quiet: '🤫 Quiet', moderate: '🗣️ Moderate', loud: '📢 Loud' } },
  { key: 'wifiSpeed', label: 'Wifi', icons: { fast: '🚀 Fast', okay: '👍 Okay', slow: '🐌 Slow', none: '📵 None' } },
];

const CafeDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [favBusy, setFavBusy] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const { user } = useAuth();
  const { showToast } = useToast();

  const load = useCallback(async () => {
    try {
      const { data } = await client.get(`/cafes/${id}`);
      setData(data);
    } catch (err) {
      showToast('Could not load cafe', 'error');
    } finally {
      setLoading(false);
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    load();
  }, [load]);

  const toggleFavorite = async () => {
    if (!user) return showToast('Log in to save favorites', 'info');
    setFavBusy(true);
    try {
      const { data: res } = await client.post(`/favorites/${id}`);
      setData((d) => ({ ...d, isFavorite: res.isFavorite }));
      showToast(res.isFavorite ? 'Added to favorites' : 'Removed from favorites', 'success');
    } catch (err) {
      showToast('Something went wrong', 'error');
    } finally {
      setFavBusy(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return showToast('Log in to leave a review', 'info');
    try {
      await client.post('/reviews', { cafe: id, rating: reviewRating, comment: reviewComment });
      showToast('Review submitted', 'success');
      setReviewComment('');
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not submit review', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) return null;
  const { cafe, pulse, reviews, isFavorite } = data;

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative rounded-3xl overflow-hidden mb-8 h-64 sm:h-80 shadow-premium">
        <img src={cafe.image || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&q=80'} alt={cafe.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between flex-wrap gap-3">
          <div>
            {cafe.isPremiumPartner && (
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-ink-950 mb-2 inline-block">
                PLUS PARTNER
              </span>
            )}
            <h1 className="font-display text-3xl sm:text-4xl font-bold">{cafe.name}</h1>
            <p className="text-slate-300 text-sm mt-1">{cafe.address}</p>
          </div>
          <button
            onClick={toggleFavorite}
            disabled={favBusy}
            className={`w-11 h-11 rounded-full grid place-items-center text-lg transition-colors ${
              isFavorite ? 'bg-red-500/20 text-red-400' : 'glass hover:bg-white/20'
            }`}
          >
            {isFavorite ? '♥' : '♡'}
          </button>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="flex flex-wrap items-center gap-3">
            {cafe.rating ? (
              <span className="flex items-center gap-1 font-semibold text-gold-400">★ {cafe.rating.toFixed(1)} {cafe.ratingCount ? <span className="text-slate-500 font-normal">({cafe.ratingCount})</span> : ''}</span>
            ) : (
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">New</span>
            )}
            <span className="text-slate-500">·</span>
            <span className="text-slate-300 text-sm">{'₹'.repeat(cafe.priceLevel || 2)}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300 text-sm">{cafe.openingHours || 'Open today'}</span>
          </div>

          <p className="text-slate-300 leading-relaxed">{cafe.description}</p>

          <div className="flex flex-wrap gap-2">
            {cafe.tags.map((tag) => (
              <span key={tag} className="text-xs font-medium px-3 py-1.5 rounded-full glass capitalize">{tag.replace('-', ' ')}</span>
            ))}
          </div>

          {cafe.isPremiumPartner && cafe.premiumPerks?.length > 0 && (
            <div className="glass rounded-2xl p-5 border border-gold-400/20">
              <p className="text-sm font-semibold text-gold-400 mb-2">Plus member perks here</p>
              <ul className="space-y-1.5">
                {cafe.premiumPerks.map((perk) => (
                  <li key={perk} className="text-sm text-slate-300 flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> {perk}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Location</h3>
            <MapView cafes={[cafe]} userLocation={null} height="320px" />
          </div>

          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Reviews ({reviews.length})</h3>
            {user && (
              <form onSubmit={submitReview} className="glass rounded-2xl p-5 mb-5 space-y-3">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      type="button"
                      key={n}
                      onClick={() => setReviewRating(n)}
                      className={`text-xl transition-colors ${n <= reviewRating ? 'text-gold-400' : 'text-slate-600'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience…"
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-400/50 transition-colors resize-none"
                />
                <button type="submit" className="text-sm font-semibold px-5 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-ink-950">
                  Post review
                </button>
              </form>
            )}
            <div className="space-y-4">
              {reviews.length === 0 && <p className="text-slate-500 text-sm">No reviews yet — be the first.</p>}
              {reviews.map((r) => (
                <div key={r._id} className="glass rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-sm">{r.user?.name}</span>
                    <span className="text-gold-400 text-xs">{'★'.repeat(r.rating)}</span>
                  </div>
                  {r.comment && <p className="text-slate-400 text-sm">{r.comment}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass rounded-2xl p-5 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold">Live Pulse</h3>
              <PulseBadge vibeScore={pulse?.vibeScore ?? null} hasLivePulse={!!pulse} size="lg" />
            </div>

            {pulse ? (
              <div className="space-y-3 mb-5">
                {pulseFields.map((f) => (
                  <div key={f.key} className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">{f.label}</span>
                    <span className="font-medium">{f.icons[pulse[f.key]]}</span>
                  </div>
                ))}
                <p className="text-[11px] text-slate-500 pt-1">
                  Based on {pulse.sampleSize} check-ins · updated {new Date(pulse.lastUpdated).toLocaleTimeString()}
                </p>
                {pulse.recentNotes?.length > 0 && (
                  <div className="pt-2 border-t border-white/10 space-y-1.5">
                    {pulse.recentNotes.map((note, i) => (
                      <p key={i} className="text-xs text-slate-400 italic">"{note}"</p>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-500 mb-5">No recent check-ins yet. Be the first to share the vibe.</p>
            )}

            <button
              onClick={() => (user ? setModalOpen(true) : showToast('Log in to check in', 'info'))}
              className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-emerald-500 to-emerald-400 text-ink-950 hover:shadow-lg transition-shadow"
            >
              Check in here
            </button>
          </div>
        </div>
      </div>

      <PulseCheckInModal cafeId={id} open={modalOpen} onClose={() => setModalOpen(false)} onSuccess={load} />
    </div>
  );
};

export default CafeDetail;
