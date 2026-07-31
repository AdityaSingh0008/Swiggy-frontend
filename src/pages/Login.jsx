import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const Login = () => {
  const [email, setEmail] = useState('demo@swiggyplus.test');
  const [password, setPassword] = useState('demo1234');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      showToast('Welcome back!', 'success');
      navigate(location.state?.from?.pathname || '/discover');
    } catch (err) {
      showToast(err.response?.data?.message || 'Login failed', 'error');
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
        <h1 className="font-display text-2xl font-bold mb-1.5">Welcome back</h1>
        <p className="text-slate-400 text-sm mb-8">Log in to see live cafe pulse near you.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            {loading ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="text-xs text-slate-500 mt-5 text-center">
          Pre-filled with the seeded demo account — just hit "Log in".
        </p>

        <p className="text-sm text-slate-400 mt-6 text-center">
          Don't have an account?{' '}
          <Link to="/signup" className="text-gold-400 font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
