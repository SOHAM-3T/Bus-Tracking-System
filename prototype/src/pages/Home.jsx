import React from 'react';
import { motion } from 'framer-motion';
import { Users, Truck, ShieldAlert } from 'lucide-react';
import { Card } from '../components/ui/Card';
import logo from '../../Logo.png';

export default function Home({ onNavigate }) {
  const roles = [
    { id: 'passenger', title: 'Passenger', desc: 'Track your bus live, check ETAs, and view routes seamlessly.', icon: <Users size={32} color="#0f3d8a" /> },
    { id: 'driver', title: 'Bus Driver', desc: 'Update your active route and broadcast location to passengers.', icon: <Truck size={32} color="#1d4ed8" /> },
    { id: 'admin', title: 'System Admin', desc: 'Monitor whole fleet dashboard and manage system health.', icon: <ShieldAlert size={32} color="#f59e0b" /> },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  };

  return (
    <div style={{ maxWidth: '1040px', margin: '24px auto 40px', textAlign: 'center' }}>
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
        <div
          style={{
            display: 'inline-block',
            background: 'linear-gradient(90deg, #dbeafe 0%, #fef3c7 100%)',
            color: '#0f3d8a',
            padding: '7px 18px',
            borderRadius: '100px',
            fontWeight: '700',
            fontSize: '0.82rem',
            marginBottom: '26px',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            boxShadow: '0 12px 24px rgba(37, 99, 235, 0.12)',
          }}
        >
          Live beta version 1.0
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(280px, 360px) minmax(0, 1fr)',
            gap: '32px',
            alignItems: 'center',
            textAlign: 'left',
            marginBottom: '48px',
          }}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            style={{
              position: 'relative',
              padding: '18px',
              borderRadius: '32px',
              background: 'radial-gradient(circle at top, rgba(59, 130, 246, 0.14), rgba(255, 255, 255, 0.95) 62%)',
              boxShadow: '0 26px 70px rgba(15, 23, 42, 0.12)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: '14px',
                borderRadius: '26px',
                border: '1px solid rgba(59, 130, 246, 0.12)',
                pointerEvents: 'none',
              }}
            />
            <img
              src={logo}
              alt="BusTracker Pro"
              style={{ width: '100%', display: 'block', borderRadius: '24px', objectFit: 'cover' }}
            />
          </motion.div>

          <div>
            <h1
              style={{
                fontSize: 'clamp(2.6rem, 5vw, 4.2rem)',
                fontWeight: '800',
                margin: '0 0 16px 0',
                color: '#0f172a',
                letterSpacing: '-0.04em',
                lineHeight: 0.95,
              }}
            >
              Welcome to <span style={{ color: '#0f3d8a' }}>BusTracker Pro</span>
            </h1>
            <p
              style={{
                fontSize: '1.15rem',
                color: 'var(--text-muted)',
                margin: '0 0 24px',
                lineHeight: 1.7,
                maxWidth: '560px',
              }}
            >
              Follow your fleet with a clearer, stronger transit identity. Track buses, monitor routes, and move between passenger,
              driver, and admin experiences from one branded control surface.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '999px',
                  background: '#eff6ff',
                  color: '#1d4ed8',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                }}
              >
                Live route visibility
              </div>
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '999px',
                  background: '#fff7ed',
                  color: '#c2410c',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                }}
              >
                Driver location updates
              </div>
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '999px',
                  background: '#ecfdf5',
                  color: '#047857',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                }}
              >
                Fleet dashboard insights
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}
      >
        {roles.map((role) => (
          <motion.div key={role.id} variants={item}>
            <Card
              className="role-card"
              animate={false}
              style={{
                cursor: 'pointer',
                height: '100%',
                transition: 'all 0.3s ease',
                background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
              }}
            >
              <div
                onClick={() => onNavigate(role.id)}
                style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}
                onMouseEnter={(e) => {
                  e.currentTarget.parentElement.style.transform = 'translateY(-8px)';
                  e.currentTarget.parentElement.style.boxShadow = '0 18px 45px rgba(15, 23, 42, 0.12)';
                  e.currentTarget.parentElement.style.border = '1px solid rgba(37, 99, 235, 0.28)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.parentElement.style.transform = 'translateY(0)';
                  e.currentTarget.parentElement.style.boxShadow = 'var(--shadow-md)';
                  e.currentTarget.parentElement.style.border = 'initial';
                }}
              >
                <div
                  style={{
                    background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)',
                    padding: '20px',
                    borderRadius: '50%',
                    marginBottom: '24px',
                    border: '1px solid rgba(59, 130, 246, 0.12)',
                    boxShadow: '0 12px 24px rgba(37, 99, 235, 0.08)',
                  }}
                >
                  {role.icon}
                </div>
                <h3 style={{ fontSize: '1.5rem', margin: '0 0 12px 0', color: 'var(--text-main)' }}>{role.title}</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: '1.5' }}>{role.desc}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
