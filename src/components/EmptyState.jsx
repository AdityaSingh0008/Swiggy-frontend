import React from 'react';
import { motion } from 'framer-motion';

const EmptyState = ({ icon = '☕', title, subtitle, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center text-center py-20 px-6"
  >
    <div className="w-16 h-16 rounded-2xl glass grid place-items-center text-3xl mb-5">{icon}</div>
    <h3 className="font-display font-semibold text-lg mb-1.5">{title}</h3>
    {subtitle && <p className="text-slate-400 text-sm max-w-sm">{subtitle}</p>}
    {action && <div className="mt-6">{action}</div>}
  </motion.div>
);

export default EmptyState;
