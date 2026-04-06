import React, { useState } from 'react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LogOut, ShieldCheck, Lock } from 'lucide-react';

export default function DriverConsole({ authLoading, driverSession, assignedBus, onLogin, onLogout, onUpdateLocation }) {
  const [driverId, setDriverId] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      setSubmitting(true);
      setError('');
      await onLogin(driverId, password);
      setPassword('');
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleMove = async (latOffset, lngOffset) => {
    if (!assignedBus) {
      return;
    }

    try {
      setError('');
      await onUpdateLocation(assignedBus.id, assignedBus.lat + latOffset, assignedBus.lng + lngOffset);
    } catch (updateError) {
      setError(updateError.message);
    }
  };

  if (authLoading) {
    return (
      <div style={{ maxWidth: '420px', margin: '80px auto' }}>
        <Card style={{ padding: '40px 32px', textAlign: 'center' }}>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontWeight: '600' }}>Checking driver session...</p>
        </Card>
      </div>
    );
  }

  if (!driverSession) {
    return (
      <div style={{ maxWidth: '420px', margin: '80px auto' }}>
        <Card>
          <div style={{ padding: '40px 32px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
              <div style={{ background: 'var(--emerald-100)', padding: '20px', borderRadius: '50%' }}>
                <ShieldCheck size={32} color="var(--emerald-600)" />
              </div>
            </div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', color: 'var(--text-main)' }}>Driver Login</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Only authenticated drivers can access the dashboard.</p>

            <input
              type="number"
              placeholder="Enter Driver ID (e.g. 101)"
              value={driverId}
              onChange={(event) => setDriverId(event.target.value)}
              className="clean-input"
              style={{ marginBottom: '16px', textAlign: 'center', fontSize: '1.05rem' }}
            />

            <div style={{ position: 'relative', marginBottom: '24px' }}>
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-light)' }} />
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="clean-input"
                style={{ paddingLeft: '42px' }}
              />
            </div>

            {error && <p style={{ marginTop: 0, marginBottom: '16px', color: 'var(--danger)', fontWeight: '600' }}>{error}</p>}

            <Button variant="primary" onClick={handleLogin} disabled={submitting} style={{ width: '100%', padding: '14px' }}>
              {submitting ? 'Signing in...' : 'Login to Console'}
            </Button>

            <p style={{ margin: '18px 0 0 0', fontSize: '0.85rem', color: 'var(--text-light)' }}>
              Demo credentials: 101 / driver101 or 102 / driver102
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0 }}>Driver Console</h2>
          <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)' }}>
            Signed in as {driverSession.driver.name} ({driverSession.driver.driver_id})
          </p>
        </div>
        <Button variant="ghost" onClick={onLogout}>
          <LogOut size={16} /> Logout
        </Button>
      </div>

      {!assignedBus ? (
        <Card style={{ padding: '32px', textAlign: 'center' }}>
          <p style={{ color: 'var(--danger)', fontWeight: '600', margin: 0 }}>No active bus is currently assigned to this driver.</p>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card>
            <CardHeader title={`Bus ${assignedBus.bus_number}`} subtitle="Authenticated live broadcast session" />
            <div style={{ padding: '24px' }}>
              <div
                style={{
                  background: 'var(--bg-main)',
                  padding: '20px',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid var(--border-light)',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}
              >
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Current Coordinates</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', marginTop: '4px' }}>
                    {assignedBus.lat.toFixed(4)}, {assignedBus.lng.toFixed(4)}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--emerald-600)', fontWeight: '600', padding: '6px 12px', background: 'var(--emerald-50)', borderRadius: '100px' }}>
                  <div style={{ width: '8px', height: '8px', background: 'var(--emerald-500)', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
                  Broadcasting live
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Manual GPS Controls" subtitle="Simulate movement for the assigned bus only" />
            <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Button variant="secondary" onClick={() => handleMove(0.005, 0)} style={{ padding: '24px' }}>
                Move North
              </Button>
              <Button variant="secondary" onClick={() => handleMove(-0.005, 0)} style={{ padding: '24px' }}>
                Move South
              </Button>
              <Button variant="secondary" onClick={() => handleMove(0, 0.005)} style={{ padding: '24px' }}>
                Move East
              </Button>
              <Button variant="secondary" onClick={() => handleMove(0, -0.005)} style={{ padding: '24px' }}>
                Move West
              </Button>
            </div>
            {error && <p style={{ margin: '0 24px 24px', color: 'var(--danger)', fontWeight: '600' }}>{error}</p>}
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
