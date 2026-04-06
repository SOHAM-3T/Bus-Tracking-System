import React, { useState } from 'react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Activity, Clock, LogOut } from 'lucide-react';
import { users } from '../mockData';

export default function DriverConsole({ buses, onUpdateLocation }) {
  // Simple mock login state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [driverId, setDriverId] = useState('');
  
  const currentBus = buses.find(b => b.driver_id === parseInt(driverId));

  if (!isLoggedIn) {
    return (
      <div style={{ maxWidth: '400px', margin: '80px auto' }}>
        <Card>
          <div style={{ padding: '40px 32px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
              <div style={{ background: 'var(--emerald-100)', padding: '20px', borderRadius: '50%' }}>
                <Activity size={32} color="var(--emerald-600)" />
              </div>
            </div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', color: 'var(--text-main)' }}>Driver Login</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Enter your employee ID to continue</p>
            
            <input 
              type="text" 
              placeholder="Enter Driver ID (e.g. 101)" 
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
              className="clean-input"
              style={{ marginBottom: '24px', textAlign: 'center', fontSize: '1.1rem' }}
            />
            
            <Button variant="primary" onClick={() => setIsLoggedIn(true)} style={{ width: '100%', padding: '14px' }}>
              Login to Console
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0 }}>Driver Console</h2>
        <Button variant="ghost" onClick={() => setIsLoggedIn(false)}><LogOut size={16} /> Logout</Button>
      </div>

      {!currentBus ? (
        <Card style={{ padding: '32px', textAlign: 'center' }}>
          <p style={{ color: 'var(--danger)', fontWeight: '600', margin: 0 }}>Cannot find active bus assignment for Driver ID {driverId}.</p>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card>
            <CardHeader title={`Bus ${currentBus.bus_number}`} subtitle="Currently Active" />
            <div style={{ padding: '24px' }}>
               <div style={{ background: 'var(--bg-main)', padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border-light)' }}>
                 <div>
                   <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Current Coordinates</div>
                   <div style={{ fontWeight: 'mono', fontSize: '1.1rem', marginTop: '4px' }}>{currentBus.lat.toFixed(4)}, {currentBus.lng.toFixed(4)}</div>
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--emerald-600)', fontWeight: '600', padding: '6px 12px', background: 'var(--emerald-50)', borderRadius: '100px' }}>
                   <div style={{ width: '8px', height: '8px', background: 'var(--emerald-500)', borderRadius: '50%', animation: 'pulse 2s infinite' }}></div>
                   Broadcasting
                 </div>
               </div>
            </div>
          </Card>
          
          <Card>
            <CardHeader title="Mock Movement Actions" subtitle="Tap to simulate manual GPS update" />
            <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
               <Button 
                 variant="secondary" 
                 onClick={() => onUpdateLocation(currentBus.id, currentBus.lat + 0.005, currentBus.lng)}
                 style={{ padding: '24px' }}
               >
                  Move North ⬆️
               </Button>
               <Button 
                 variant="secondary" 
                 onClick={() => onUpdateLocation(currentBus.id, currentBus.lat - 0.005, currentBus.lng)}
                 style={{ padding: '24px' }}
               >
                  Move South ⬇️
               </Button>
               <Button 
                 variant="secondary" 
                 onClick={() => onUpdateLocation(currentBus.id, currentBus.lat, currentBus.lng + 0.005)}
                 style={{ padding: '24px' }}
               >
                  Move East ➡️
               </Button>
               <Button 
                 variant="secondary" 
                 onClick={() => onUpdateLocation(currentBus.id, currentBus.lat, currentBus.lng - 0.005)}
                 style={{ padding: '24px' }}
               >
                  Move West ⬅️
               </Button>
            </div>
          </Card>
        </div>
      )}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
      `}</style>
    </div>
  );
}
