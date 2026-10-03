import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PulseBadge from './PulseBadge.jsx';

const priceLabel = (level) => '₹'.repeat(level || 1);

const CafeCard = ({ cafe, index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.3), ease: [0.22, 1, 0.36, 1] }}
    whileHover={{ y: -6 }}
    className="group"
  >
    <Link
      to={`/cafe/${cafe._id}`}
      className="relative block rounded-2xl overflow-hidden shadow-premium group-hover:shadow-glow transition-all duration-300 transform-gpu"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />
      <div className="relative glass h-full w-full z-0">
      <div className="relative h-44 overflow-hidden">
        <img
          src={cafe.image || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80'}
          alt={cafe.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
        {cafe.isPremiumPartner && (
          <span className="absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-ink-950">
            PLUS PARTNER
          </span>
        )}
        {typeof cafe.distanceKm === 'number' && (
          <span className="absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-1 rounded-full glass">
            {cafe.distanceKm} km
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-display font-semibold text-base leading-tight">{cafe.name}</h3>
          <div className="flex flex-col items-end shrink-0">
            {cafe.rating ? (
              <span className="flex items-center gap-1 text-xs font-semibold text-gold-400">
                ★ {cafe.rating.toFixed(1)} {cafe.ratingCount ? <span className="text-slate-500 font-normal">({cafe.ratingCount})</span> : ''}
              </span>
            ) : (
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">New</span>
            )}
          </div>
        </div>
        <p className="text-slate-400 text-sm mb-3 line-clamp-2">{cafe.description || 'A cozy spot.'}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>{priceLabel(cafe.priceLevel)}</span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span>{cafe.cuisine?.slice(0, 2).join(', ')}</span>
          </div>
          <PulseBadge vibeScore={cafe.vibeScore} hasLivePulse={cafe.hasLivePulse} />
        </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

export default CafeCard;
