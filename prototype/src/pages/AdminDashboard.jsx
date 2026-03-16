import React from 'react';
import { Card, CardHeader } from '../components/Card';
import { Truck, AlertCircle, CheckCircle, Map } from 'lucide-react';

export default function AdminDashboard({ buses }) {
  const activeCount = buses.filter(b => b.status === 'Active').length;
  const issueCount = buses.filter(b => b.status === 'Delayed').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
        <Card style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '16px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '12px', color: 'var(--accent)' }}>
            <Truck size={32} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{buses.length}</div>
            <div style={{ color: 'var(--text-muted)' }}>Total Fleet</div>
          </div>
        </Card>
        <Card style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '16px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '12px', color: 'var(--success)' }}>
            <CheckCircle size={32} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{activeCount}</div>
            <div style={{ color: 'var(--text-muted)' }}>Active Buses</div>
          </div>
        </Card>
        <Card style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', color: 'var(--danger)' }}>
            <AlertCircle size={32} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{issueCount}</div>
            <div style={{ color: 'var(--text-muted)' }}>Alerts / Delays</div>
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <Card>
          <CardHeader title="Live Fleet Status" subtitle="Real-time overview of all buses in the network." />
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 8px' }}>Bus ID</th>
                <th style={{ padding: '12px 8px' }}>Route</th>
                <th style={{ padding: '12px 8px' }}>Driver ID</th>
                <th style={{ padding: '12px 8px' }}>Status</th>
                <th style={{ padding: '12px 8px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {buses.map(bus => (
                <tr key={bus.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>{bus.bus_number}</td>
                  <td style={{ padding: '12px 8px' }}>Route {bus.route_id}</td>
                  <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>#{bus.driver_id}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      fontSize: '0.75rem', 
                      background: bus.status === 'Active' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
                      color: bus.status === 'Active' ? 'var(--success)' : 'var(--danger)'
                    }}>
                      {bus.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>Ping Driver</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card>
          <CardHeader title="Quick Actions" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="btn" style={{ width: '100%', justifyContent: 'flex-start' }}><Truck size={18} /> Add New Bus</button>
            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}><Map size={18} /> Manage Routes</button>
            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}><AlertCircle size={18} /> Broadcast Alert</button>
          </div>
        </Card>
      </div>
    </div>
  );
}
