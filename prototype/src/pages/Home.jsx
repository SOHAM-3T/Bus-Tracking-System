import React from 'react';
import { Card, CardHeader } from '../components/Card';
import { Users, Truck, Shield } from 'lucide-react';

export default function Home({ onNavigate }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at center, rgba(37,99,235,0.15) 0%, var(--bg-dark) 70%)', padding: '24px' }}>
      
      <div style={{ textAlign: 'center', maxWidth: '800px', marginBottom: '48px' }}>
        <h1 style={{ fontSize: '3.5rem', margin: '0 0 16px 0', lineHeight: 1.2, background: 'linear-gradient(45deg, #fff, var(--text-muted))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Bus Tracking System
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', margin: 0, fontWeight: 300 }}>
          Real-time tracking, intelligent routing, and seamless transit management.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', width: '100%', maxWidth: '1000px' }}>
        
        <div className="glow-effect" onClick={() => onNavigate('passenger')} style={{ cursor: 'pointer' }}>
          <Card className="h-full" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '32px 24px', transition: 'transform 0.2s', ':hover': { transform: 'translateY(-4px)' } }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: 'var(--accent)' }}>
              <Users size={32} />
            </div>
            <CardHeader title="Passenger" subtitle="Find routes, track buses in real-time, and get ETA." />
            <button className="btn" style={{ marginTop: 'auto', width: '100%' }}>Enter as Passenger</button>
          </Card>
        </div>

        <div className="glow-effect" onClick={() => onNavigate('driver')} style={{ cursor: 'pointer' }}>
          <Card style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '32px 24px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: 'var(--success)' }}>
              <Truck size={32} />
            </div>
            <CardHeader title="Driver" subtitle="Start your route and transmit live GPS locations." />
            <button className="btn" style={{ marginTop: 'auto', width: '100%', background: 'var(--success)' }}>Enter as Driver</button>
          </Card>
        </div>

        <div className="glow-effect" onClick={() => onNavigate('admin')} style={{ cursor: 'pointer' }}>
          <Card style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '32px 24px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: 'var(--warning)' }}>
              <Shield size={32} />
            </div>
            <CardHeader title="Admin" subtitle="Manage fleet, monitor routes, and oversee operations." />
            <button className="btn" style={{ marginTop: 'auto', width: '100%', background: 'var(--warning)' }}>Enter as Admin</button>
          </Card>
        </div>

      </div>
    </div>
  );
}
