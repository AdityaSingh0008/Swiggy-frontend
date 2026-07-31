import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const navLinks = [
  { to: '/discover', label: 'Discover' },
  { to: '/premium', label: 'Plus' },
  { to: '/favorites', label: 'Favorites' },
  { to: '/dashboard', label: 'Dashboard' },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400 to-emerald-400 grid place-items-center font-display font-extrabold text-ink-950 text-sm group-hover:scale-105 transition-transform">
              S+
            </span>
            <span className="font-display font-bold text-lg tracking-tight">
              Swiggy <span className="text-gradient">Plus</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-white/10 text-gold-400'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-9 h-9 rounded-full grid place-items-center bg-white/5 hover:bg-white/10 transition-colors text-sm"
            >
              {theme === 'dark' ? '🌙' : '☀️'}
            </button>
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <span className="w-7 h-7 rounded-full bg-gradient-to-br from-gold-400 to-emerald-400 grid place-items-center text-xs font-bold text-ink-950">
                    {user.name?.[0]?.toUpperCase()}
                  </span>
                  <span className="text-sm font-medium">{user.name?.split(' ')[0]}</span>
                  {user.isPremium && <span className="text-[10px] text-gold-400 font-semibold">PLUS</span>}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-semibold bg-gradient-to-r from-gold-500 to-gold-400 text-ink-950 px-4 py-2 rounded-full hover:shadow-glow transition-shadow"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden w-9 h-9 grid place-items-center"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            <div className="space-y-1.5">
              <span className={`block w-6 h-0.5 bg-current transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`block w-6 h-0.5 bg-current transition-opacity ${open ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-current transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden glass border-b border-white/5 overflow-hidden"
          >
            <div className="px-5 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-white/5"
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="h-px bg-white/10 my-2" />
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setOpen(false)} className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-white/5">
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="px-3 py-2.5 rounded-lg text-sm font-medium text-left text-red-300 hover:bg-white/5">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-white/5">
                    Log in
                  </Link>
                  <Link to="/signup" onClick={() => setOpen(false)} className="px-3 py-2.5 rounded-lg text-sm font-semibold text-gold-400 hover:bg-white/5">
                    Sign up
                  </Link>
                </>
              )}
              <button onClick={toggleTheme} className="px-3 py-2.5 rounded-lg text-sm font-medium text-left hover:bg-white/5">
                {theme === 'dark' ? '🌙 Dark mode' : '☀️ Light mode'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
