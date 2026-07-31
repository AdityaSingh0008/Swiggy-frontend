import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(name, email, password);
      showToast('Account created — welcome to Swiggy Plus!', 'success');
      navigate('/discover');
    } catch (err) {
      showToast(err.response?.data?.message || 'Signup failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] grid place-items-center px-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="glass rounded-3xl p-8 sm:p-10 w-full max-w-md shadow-premium"
      >
        <h1 className="font-display text-2xl font-bold mb-1.5">Create your account</h1>
        <p className="text-slate-400 text-sm mb-8">Join Swiggy Plus and start earning points from day one.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">Full name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-400/50 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-400/50 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-400/50 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-semibold bg-gradient-to-r from-gold-500 to-gold-400 text-ink-950 hover:shadow-glow transition-shadow disabled:opacity-50"
          >
            {loading ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <p className="text-sm text-slate-400 mt-6 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-gold-400 font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
