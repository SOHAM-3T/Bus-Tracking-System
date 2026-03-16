import React, { useState, useEffect } from 'react';
import { Card, CardHeader } from '../components/Card';
import { Navigation, Play, Square, MapPin, Radio } from 'lucide-react';

export default function DriverConsole({ buses, onUpdateLocation }) {
  const myBusId = 1; // Mock driver is assigned to Bus 1
  const myBus = buses.find(b => b.id === myBusId);
  
  const [isDriving, setIsDriving] = useState(false);
  const [pulse, setPulse] = useState(false);

  // Simulate GPS coordinates changing
  useEffect(() => {
    let interval;
    if (isDriving) {
      interval = setInterval(() => {
        // Randomly jitter the location to simulate driving movement
        const newLat = myBus.lat + (Math.random() - 0.5) * 0.001;
        const newLng = myBus.lng + (Math.random() - 0.5) * 0.001;
        onUpdateLocation(myBusId, newLat, newLng);
        
        // UI Pulse effect
        setPulse(true);
        setTimeout(() => setPulse(false), 500);
      }, 5000); // 5 second mock GPS interval defined in SRS
    }
    return () => clearInterval(interval);
  }, [isDriving, myBus, onUpdateLocation]);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Card style={{ textAlign: 'center', padding: '40px 24px' }}>
        <div style={{ 
          width: '100px', 
          height: '100px', 
          borderRadius: '50%', 
          background: isDriving ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)', 
          margin: '0 auto 24px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          border: isDriving ? '2px solid var(--success)' : '2px dashed rgba(255,255,255,0.2)',
          boxShadow: pulse ? '0 0 20px var(--success)' : 'none',
          transition: 'all 0.3s ease'
        }}>
          <Navigation size={40} style={{ color: isDriving ? 'var(--success)' : 'var(--text-muted)' }} />
        </div>
        
        <h2 style={{ fontSize: '2rem', margin: '0 0 8px 0' }}>Bus {myBus?.bus_number}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '32px' }}>Route {myBus?.route_id} • Driver #{myBus?.driver_id}</p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          {!isDriving ? (
            <button className="btn glow-effect" style={{ padding: '16px 32px', fontSize: '1.25rem', background: 'var(--success)' }} onClick={() => setIsDriving(true)}>
              <Play fill="currentColor" /> Start Trip
            </button>
          ) : (
            <button className="btn btn-secondary" style={{ padding: '16px 32px', fontSize: '1.25rem', color: 'var(--danger)', border: '1px solid var(--danger)' }} onClick={() => setIsDriving(false)}>
              <Square fill="currentColor" /> End Trip
            </button>
          )}
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Radio size={20} style={{ color: isDriving ? 'var(--success)' : 'var(--text-muted)' }} />
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>GPS Transponder</h3>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Status</span>
            <span style={{ color: isDriving ? 'var(--success)' : 'var(--text-muted)', fontWeight: 'bold' }}>
              {isDriving ? 'Transmitting' : 'Idle'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Interval</span>
            <span>5 seconds</span>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <MapPin size={20} style={{ color: 'var(--accent)' }} />
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Current Location</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem', fontFamily: 'monospace' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>LAT:</span>
              <span>{myBus?.lat.toFixed(5)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>LNG:</span>
              <span>{myBus?.lng.toFixed(5)}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
