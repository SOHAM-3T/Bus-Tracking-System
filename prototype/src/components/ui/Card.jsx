import React from 'react';
import { motion } from 'framer-motion';

export function Card({ children, className = '', animate = false, style = {}, ...props }) {
  const Component = animate ? motion.div : 'div';
  const animationProps = animate ? {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { stiffness: 300, damping: 30 }
  } : {};

  return (
    <Component 
      className={`glass-panel ${className}`}
      style={{
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        background: 'var(--bg-card)',
        ...style
      }}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div style={{ 
      padding: '20px 24px', 
      borderBottom: '1px solid var(--border-light)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: '600' }}>{title}</h3>
        {subtitle && <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
