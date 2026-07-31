import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import client from '../api/client.js';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, setUser } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await client.put('/users/me', { name });
      setUser(data.user);
      showToast('Profile updated', 'success');
    } catch (err) {
      showToast('Could not update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-8 shadow-premium">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-400 to-emerald-400 grid place-items-center text-2xl font-bold text-ink-950">
            {user.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">{user.name}</h1>
            <p className="text-slate-400 text-sm">{user.email}</p>
          </div>
          {user.isPremium && (
            <span className="ml-auto text-xs font-bold px-3 py-1.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-ink-950">
              PLUS MEMBER
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="glass rounded-2xl p-4 text-center">
            <p className="font-display font-bold text-2xl text-gold-400">{user.points}</p>
            <p className="text-slate-500 text-xs mt-1">Pulse points</p>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <p className="font-display font-bold text-2xl text-emerald-400">{user.favorites?.length || 0}</p>
            <p className="text-slate-500 text-xs mt-1">Favorites saved</p>
          </div>
        </div>

        {!user.isPremium && (
          <Link
            to="/premium"
            className="block text-center mb-8 py-3 rounded-xl font-semibold glass border border-gold-400/30 text-gold-400 hover:bg-gold-400/5 transition-colors"
          >
            Upgrade to Plus →
          </Link>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">Full name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-400/50 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-gold-500 to-gold-400 text-ink-950 hover:shadow-glow transition-shadow disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Profile;
