import React, { useMemo, useState } from 'react';
import { Card, CardHeader } from '../components/ui/Card';
import { Users, Truck, Activity, AlertCircle, Save } from 'lucide-react';
import { Button } from '../components/ui/Button';

function StatCard({ title, value, icon, color }) {
  return (
    <Card>
      <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ background: `${color}20`, padding: '16px', borderRadius: '16px' }}>{icon}</div>
        <div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {title}
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', margin: '4px 0 0 0', color: 'var(--text-main)' }}>{value}</div>
        </div>
      </div>
    </Card>
  );
}

function EditableStopCard({ stop, onSave }) {
  const [name, setName] = useState(stop.name);
  const [lat, setLat] = useState(String(stop.lat));
  const [lng, setLng] = useState(String(stop.lng));
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      setStatus('');
      await onSave(stop.id, { name, lat: Number(lat), lng: Number(lng) });
      setStatus('Saved');
    } catch (error) {
      setStatus(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader title={stop.name} subtitle={`Stop #${stop.id}`} />
      <div style={{ padding: '24px', display: 'grid', gap: '14px' }}>
        <input className="clean-input" value={name} onChange={(event) => setName(event.target.value)} placeholder="Stop name" />
        <input className="clean-input" value={lat} onChange={(event) => setLat(event.target.value)} placeholder="Latitude" />
        <input className="clean-input" value={lng} onChange={(event) => setLng(event.target.value)} placeholder="Longitude" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: status === 'Saved' ? 'var(--emerald-600)' : 'var(--danger)', fontWeight: '600', minHeight: '20px' }}>{status}</span>
          <Button variant="secondary" onClick={handleSave} disabled={saving}>
            <Save size={16} /> {saving ? 'Saving...' : 'Save stop'}
          </Button>
        </div>
      </div>
    </Card>
  );
}

function EditableRouteCard({ route, stops, onSave }) {
  const [routeName, setRouteName] = useState(route.route_name);
  const [startStop, setStartStop] = useState(route.start_stop);
  const [endStop, setEndStop] = useState(route.end_stop);
  const [orderedStopIds, setOrderedStopIds] = useState(route.stops.join(', '));
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      setStatus('');

      const parsedStops = orderedStopIds
        .split(',')
        .map((value) => Number(value.trim()))
        .filter((value) => Number.isInteger(value));

      await onSave(route.id, {
        route_name: routeName,
        start_stop: startStop,
        end_stop: endStop,
        stops: parsedStops,
      });

      setStatus('Saved');
    } catch (error) {
      setStatus(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader title={route.route_name} subtitle={`Route #${route.id}`} />
      <div style={{ padding: '24px', display: 'grid', gap: '14px' }}>
        <input className="clean-input" value={routeName} onChange={(event) => setRouteName(event.target.value)} placeholder="Route name" />
        <input className="clean-input" value={startStop} onChange={(event) => setStartStop(event.target.value)} placeholder="Start label" />
        <input className="clean-input" value={endStop} onChange={(event) => setEndStop(event.target.value)} placeholder="End label" />
        <input
          className="clean-input"
          value={orderedStopIds}
          onChange={(event) => setOrderedStopIds(event.target.value)}
          placeholder="Ordered stop IDs, comma-separated"
        />
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          Available stops: {stops.map((stop) => `#${stop.id} ${stop.name}`).join(' | ')}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: status === 'Saved' ? 'var(--emerald-600)' : 'var(--danger)', fontWeight: '600', minHeight: '20px' }}>{status}</span>
          <Button variant="secondary" onClick={handleSave} disabled={saving}>
            <Save size={16} /> {saving ? 'Saving...' : 'Save route'}
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default function AdminDashboard({ buses, routes, stops, isLoading, loadError, onUpdateStop, onUpdateRoute }) {
  const activeBuses = buses.filter((bus) => bus.status === 'Active').length;
  const busRows = useMemo(() => buses, [buses]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        <StatCard title="Total Routes" value={routes.length} icon={<Activity size={28} color="var(--info)" />} color="var(--info)" />
        <StatCard title="Active Buses" value={activeBuses} icon={<Truck size={28} color="var(--emerald-500)" />} color="var(--emerald-500)" />
        <StatCard title="Tracked Stops" value={stops.length} icon={<Users size={28} color="var(--success)" />} color="var(--success)" />
        <StatCard title="Alerts" value={loadError ? '1' : '0'} icon={<AlertCircle size={28} color="var(--warning)" />} color="var(--warning)" />
      </div>

      <Card>
        <CardHeader title="Live Fleet Status" subtitle="Real backend coordinates currently visible to passengers" />
        <div style={{ padding: '24px', overflowX: 'auto' }}>
          {isLoading ? (
            <p style={{ margin: 0, color: 'var(--text-muted)', fontWeight: '600' }}>Loading fleet data...</p>
          ) : loadError ? (
            <p style={{ margin: 0, color: 'var(--danger)', fontWeight: '600' }}>{loadError}</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 8px', fontWeight: '600' }}>Bus Number</th>
                  <th style={{ padding: '12px 8px', fontWeight: '600' }}>Route</th>
                  <th style={{ padding: '12px 8px', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: '12px 8px', fontWeight: '600' }}>Current Coordinates</th>
                </tr>
              </thead>
              <tbody>
                {busRows.map((bus) => {
                  const route = routes.find((item) => item.id === bus.route_id);
                  return (
                    <tr key={bus.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '16px 8px', fontWeight: '600', color: 'var(--text-main)' }}>{bus.bus_number}</td>
                      <td style={{ padding: '16px 8px', color: 'var(--text-muted)' }}>{route?.route_name ?? `Route ${bus.route_id}`}</td>
                      <td style={{ padding: '16px 8px' }}>
                        <span
                          style={{
                            background: bus.status === 'Active' ? 'var(--emerald-100)' : '#fef3c7',
                            color: bus.status === 'Active' ? 'var(--emerald-700)' : '#92400e',
                            padding: '6px 12px',
                            borderRadius: '100px',
                            fontWeight: '600',
                            fontSize: '0.75rem',
                          }}
                        >
                          {bus.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px 8px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                        {bus.lat.toFixed(4)}, {bus.lng.toFixed(4)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {stops.map((stop) => (
          <EditableStopCard key={stop.id} stop={stop} onSave={onUpdateStop} />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {routes.map((route) => (
          <EditableRouteCard key={route.id} route={route} stops={stops} onSave={onUpdateRoute} />
        ))}
      </div>
    </div>
  );
}
