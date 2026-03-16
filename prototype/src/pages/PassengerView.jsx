import React, { useState } from 'react';
import { Card, CardHeader } from '../components/Card';
import { Search, MapPin, Clock } from 'lucide-react';
import { routes, stops } from '../mockData';

export default function PassengerView({ buses }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoute, setSelectedRoute] = useState(null);

  const filteredRoutes = routes.filter(r => 
    r.route_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.start_stop.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.end_stop.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '24px', height: 'calc(100vh - 100px)' }}>
      {/* Sidebar - Search and Routes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
        <Card>
          <CardHeader title="Find Your Bus" />
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search route or stop..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 38px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredRoutes.map(route => (
              <div 
                key={route.id} 
                className="glass-panel" 
                style={{ padding: '12px', cursor: 'pointer', background: selectedRoute?.id === route.id ? 'rgba(37,99,235,0.2)' : 'var(--bg-card)', border: selectedRoute?.id === route.id ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)' }}
                onClick={() => setSelectedRoute(route)}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '4px', color: 'var(--accent)' }}>{route.route_name}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} /> {route.start_stop} ➔ {route.end_stop}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Main Content - Map and Tracking */}
      <Card style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 24px', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Live Map {selectedRoute ? `- ${selectedRoute.route_name}` : ''}</h2>
        </div>
        
        <div style={{ flex: 1, position: 'relative', background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Mock Map Background Grid */}
          <div style={{ position: 'absolute', inset: 0, backgroundSize: '40px 40px', backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)' }}></div>
          
          {selectedRoute ? (
            <div style={{ width: '80%', height: '80%', position: 'relative' }}>
              {/* Draw Route Line Mock */}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
                <polyline points="10%,50% 50%,20% 90%,60%" fill="none" stroke="var(--primary)" strokeWidth="4" strokeDasharray="8 8" className="route-line" />
              </svg>
              
              {/* Plot Stops mock positions */}
              <div style={{ position: 'absolute', left: '10%', top: '50%', transform: 'translate(-50%, -50%)', width: '16px', height: '16px', borderRadius: '50%', background: 'white', border: '3px solid var(--primary)' }} title={selectedRoute.start_stop}></div>
              <div style={{ position: 'absolute', left: '50%', top: '20%', transform: 'translate(-50%, -50%)', width: '16px', height: '16px', borderRadius: '50%', background: 'white', border: '3px solid var(--primary)' }}></div>
              <div style={{ position: 'absolute', left: '90%', top: '60%', transform: 'translate(-50%, -50%)', width: '16px', height: '16px', borderRadius: '50%', background: 'white', border: '3px solid var(--primary)' }} title={selectedRoute.end_stop}></div>
              
              {/* Plot Buses on this route */}
              {buses.filter(b => b.route_id === selectedRoute.id).map(bus => (
                <div key={bus.id} style={{ position: 'absolute', left: bus.lng === -118.2437 ? '20%' : bus.lng === -118.2500 ? '50%' : '70%', top: bus.lat === 34.0522 ? '40%' : '30%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'all 1s ease' }}>
                  <div style={{ background: 'var(--success)', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '4px', boxShadow: '0 0 10px var(--success)' }}>
                    {bus.bus_number}
                  </div>
                  <div style={{ width: '24px', height: '24px', background: 'var(--bg-card)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--success)' }}>
                    🚌
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
              <MapPin size={48} style={{ opacity: 0.5, marginBottom: '16px', margin: '0 auto' }} />
              <p>Select a route from the sidebar to view the live map</p>
            </div>
          )}
        </div>

        {selectedRoute && (
          <div style={{ padding: '16px 24px', background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Clock style={{ color: 'var(--warning)' }} />
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Next ETA ({selectedRoute.start_stop})</div>
                <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>14 MINS</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Clock style={{ color: 'var(--success)' }} />
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Following Bus</div>
                <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>32 MINS</div>
              </div>
            </div>
          </div>
        )}
      </Card>
      
      <style>{`
        .route-line {
          animation: dash 20s linear infinite;
        }
        @keyframes dash {
          to { stroke-dashoffset: -100; }
        }
      `}</style>
    </div>
  );
}
