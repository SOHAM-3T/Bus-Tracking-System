import React from 'react';

export function Card({ children, className = '' }) {
  return (
    <div className={`glass-panel p-6 ${className}`}>
      {children}
    </div>
  );
}

// Add some utility classes to our global CSS by updating index.css later
export function CardHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
      <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>{title}</h2>
      {subtitle && <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{subtitle}</p>}
    </div>
  );
}
