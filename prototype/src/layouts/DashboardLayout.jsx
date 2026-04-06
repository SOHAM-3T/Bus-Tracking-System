import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import logo from '../../Logo.png';

export function DashboardLayout({ children, currentView, onNavigate }) {
  const isHome = currentView === 'home';

  return (
    <div className="app-container" style={{ flexDirection: 'column' }}>
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          padding: '16px 32px',
          background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-sm)',
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '18px',
              overflow: 'hidden',
              border: '1px solid rgba(14, 116, 144, 0.12)',
              boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
              background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)',
              flexShrink: 0,
            }}
          >
            <img
              src={logo}
              alt="BusTracker Pro logo"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontWeight: '800', fontSize: '1.2rem', color: '#0f3d8a', letterSpacing: '-0.02em' }}>
              BusTracker Pro
            </span>
            <span
              style={{
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Real-time campus transit
            </span>
          </div>
        </div>

        <AnimatePresence>
          {!isHome && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <Button variant="secondary" onClick={() => onNavigate('home')} style={{ padding: '8px 16px' }}>
                <ArrowLeft size={16} /> Back
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <main
        style={{
          flex: 1,
          padding: isHome ? '40px 24px' : '24px',
          maxWidth: isHome || currentView === 'admin' ? '1200px' : '100%',
          margin: isHome || currentView === 'admin' ? '0 auto' : '0',
          width: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
        className="styled-scroll"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            style={{ height: '100%' }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
