import React from 'react';
import { motion } from 'framer-motion';

export function Button({ children, onClick, variant = 'primary', className = '', ...props }) {
  const baseStyle = {
    padding: '10px 20px',
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: '0.95rem',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    border: 'none',
    outline: 'none',
    boxShadow: 'var(--shadow-sm)',
    transition: 'background 0.2s ease, box-shadow 0.2s ease',
  };

  const variants = {
    primary: {
      background: 'var(--emerald-500)',
      color: 'white',
      boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)',
    },
    secondary: {
      background: 'white',
      color: 'var(--text-main)',
      border: '1px solid var(--border-light)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-muted)',
      boxShadow: 'none',
    }
  };

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      style={{ ...baseStyle, ...variants[variant] }}
      className={className}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
}
