import React, { useState, useEffect } from 'react';
import { Card, CardHeader } from '../components/ui/Card';
import { Search, MapPin, Clock } from 'lucide-react';
import { routes, stops } from '../mockData';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const MapUpdater = ({ routeCoordinates }) => {
  const map = useMap();

  useEffect(() => {
    if (!routeCoordinates.length) {
      return;
    }

    const bounds = L.latLngBounds(routeCoordinates);
    map.fitBounds(bounds, { padding: [32, 32] });
  }, [routeCoordinates, map]);

  useEffect(() => {
    const resizeMap = () => map.invalidateSize();
    resizeMap();

    const timeoutId = window.setTimeout(resizeMap, 150);
    window.addEventListener('resize', resizeMap);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener('resize', resizeMap);
    };
  }, [map]);

  return null;
};

// Fix for default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom Bus Icon
const busIcon = new L.DivIcon({
  className: 'custom-bus-icon',
  html: '<div style="background: var(--emerald-500); border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.2); font-size: 16px; transition: transform 0.2s ease;">🚌</div>',
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

export default function PassengerView({ buses }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoute, setSelectedRoute] = useState(null);
  
  const getCoordinatesForRoute = (route) => {
    return route.stops.map(stopId => {
      const stop = stops.find(s => s.id === stopId);
      return [stop.lat, stop.lng];
    }).filter(([lat, lng]) => lat != null && lng != null);
  };

  const filteredRoutes = routes.filter(r => 
    r.route_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.start_stop.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.end_stop.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const routeCoordinates = selectedRoute ? getCoordinatesForRoute(selectedRoute) : [];
  const initialCenter = routeCoordinates[0] ?? [16.8150, 81.5270];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) 2fr', gap: '24px', height: 'calc(100vh - 120px)' }}>
      {/* Sidebar - Search and Routes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }} className="styled-scroll">
        <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardHeader title="Find Your Route" subtitle="Search for active transit lines" />
          
          <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }} className="styled-scroll">
            <div style={{ position: 'relative', marginBottom: '24px' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-light)' }} />
              <input 
                type="text" 
                placeholder="Search route or stop..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="clean-input"
                style={{ paddingLeft: '38px' }}
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredRoutes.map(route => {
                const isSelected = selectedRoute?.id === route.id;
                return (
                  <div 
                    key={route.id} 
                    style={{ 
                      padding: '16px', 
                      cursor: 'pointer', 
                      background: isSelected ? 'var(--emerald-50)' : 'var(--bg-main)', 
                      border: isSelected ? '2px solid var(--emerald-500)' : '2px solid transparent',
                      borderRadius: 'var(--radius-md)',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => setSelectedRoute(route)}
                  >
                    <div style={{ fontWeight: '700', marginBottom: '6px', color: isSelected ? 'var(--emerald-700)' : 'var(--text-main)' }}>{route.route_name}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={14} color="var(--emerald-500)" /> {route.start_stop} ➔ {route.end_stop}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content - Map and Tracking */}
      <Card style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', zIndex: 0 }}>
        <div style={{ padding: '20px 24px', background: 'var(--bg-card)', borderBottom: '1px solid var(--border-light)' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-main)' }}>Live Map {selectedRoute ? <span style={{color: 'var(--text-muted)', fontWeight: 'normal'}}>— {selectedRoute.route_name}</span> : ''}</h2>
        </div>
        
        <div style={{ flex: 1, position: 'relative', background: 'var(--bg-main)' }}>
          {!selectedRoute ? (
             <div style={{ color: 'var(--text-light)', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
               <div style={{ background: 'var(--border-light)', padding: '24px', borderRadius: '50%', marginBottom: '20px' }}>
                 <MapPin size={48} color="white" />
               </div>
               <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>Select a route to view live map</p>
             </div>
          ) : (
             <MapContainer 
               center={initialCenter}
               zoom={14} 
               style={{ height: '100%', width: '100%', zIndex: 1 }}
             >
                <MapUpdater routeCoordinates={routeCoordinates} />
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                
                <Polyline 
                  positions={routeCoordinates} 
                  color="var(--emerald-500)" 
                  weight={6} 
                  opacity={0.8}
                />

                {selectedRoute.stops.map(stopId => {
                  const stop = stops.find(s => s.id === stopId);
                  return (
                    <Marker key={stop.id} position={[stop.lat, stop.lng]}>
                       <Popup><div><b>{stop.name}</b></div></Popup>
                    </Marker>
                  );
                })}

                {buses.filter(b => b.route_id === selectedRoute.id).map(bus => (
                  <Marker 
                    key={bus.id} 
                    position={[bus.lat, bus.lng]} 
                    icon={busIcon}
                  >
                    <Popup>
                      <div>
                        <b>Bus {bus.bus_number}</b><br/>
                        <span style={{color: 'var(--success)', fontWeight:'500'}}>{bus.status}</span>
                      </div>
                    </Popup>
                  </Marker>
                ))}
             </MapContainer>
          )}
        </div>

        {selectedRoute && (
          <div style={{ padding: '20px 24px', background: 'var(--bg-main)', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '12px', background: 'white', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                <Clock size={24} color="var(--emerald-500)" />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Next ETA ({selectedRoute.start_stop})</div>
                <div style={{ fontWeight: '700', fontSize: '1.25rem', color: 'var(--text-main)' }}>14 MINS</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '12px', background: 'white', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                <Clock size={24} color="var(--emerald-600)" />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Following Bus</div>
                <div style={{ fontWeight: '700', fontSize: '1.25rem', color: 'var(--text-main)' }}>32 MINS</div>
              </div>
            </div>
          </div>
        )}
      </Card>
      
    </div>
  );
}
