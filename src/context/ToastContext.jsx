import React, { createContext, useContext, useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const ToastContext = createContext(null);

let idCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = ++idCounter;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((toast) => toast.id !== id));
    }, 3500);
  }, []);

  const typeStyles = {
    success: 'border-emerald-400/40 text-emerald-300',
    error: 'border-red-400/40 text-red-300',
    info: 'border-gold-400/40 text-gold-400',
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-3 items-end">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className={`glass rounded-xl px-5 py-3 shadow-premium border text-sm font-medium max-w-xs ${typeStyles[toast.type] || typeStyles.info}`}
            >
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
