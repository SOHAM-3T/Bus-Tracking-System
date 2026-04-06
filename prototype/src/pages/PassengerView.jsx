import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardHeader } from '../components/ui/Card';
import { Search, MapPin, Clock, Bus } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const FALLBACK_CENTER = [16.815, 81.527];

const MapUpdater = ({ routeCoordinates }) => {
  const map = useMap();

  useEffect(() => {
    if (!routeCoordinates.length) {
      map.setView(FALLBACK_CENTER, 13);
      return;
    }

    if (routeCoordinates.length === 1) {
      map.setView(routeCoordinates[0], 15);
      return;
    }

    map.fitBounds(L.latLngBounds(routeCoordinates), { padding: [32, 32] });
  }, [map, routeCoordinates]);

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

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const busIcon = new L.DivIcon({
  className: 'custom-bus-icon',
  html: '<div style="background: #0f3d8a; color: white; border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 10px 24px rgba(15, 61, 138, 0.35); font-size: 16px;">🚌</div>',
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

function LoadingState({ message }) {
  return (
    <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '48px 24px' }}>
      <p style={{ margin: 0, fontWeight: '600' }}>{message}</p>
    </div>
  );
}

export default function PassengerView({ buses, routes, stops, isLoading, loadError }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRouteId, setSelectedRouteId] = useState(null);

  useEffect(() => {
    if (!routes.length) {
      setSelectedRouteId(null);
      return;
    }

    setSelectedRouteId((currentRouteId) => {
      const routeStillExists = routes.some((route) => route.id === currentRouteId);
      return routeStillExists ? currentRouteId : routes[0].id;
    });
  }, [routes]);

  const stopsById = useMemo(() => new Map(stops.map((stop) => [stop.id, stop])), [stops]);

  const filteredRoutes = useMemo(
    () =>
      routes.filter((route) => {
        const query = searchQuery.toLowerCase();
        return (
          route.route_name.toLowerCase().includes(query) ||
          route.start_stop.toLowerCase().includes(query) ||
          route.end_stop.toLowerCase().includes(query)
        );
      }),
    [routes, searchQuery],
  );

  const selectedRoute = routes.find((route) => route.id === selectedRouteId) ?? null;
  const routeStops = selectedRoute?.stops.map((stopId) => stopsById.get(stopId)).filter(Boolean) ?? [];
  const routeCoordinates = routeStops.map((stop) => [stop.lat, stop.lng]);
  const activeBuses = selectedRoute ? buses.filter((bus) => bus.route_id === selectedRoute.id) : [];
  const initialCenter = routeCoordinates[0] ?? FALLBACK_CENTER;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) 2fr', gap: '24px', height: 'calc(100vh - 120px)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }} className="styled-scroll">
        <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardHeader title="Find Your Route" subtitle="Search active transit lines from live backend data" />

          <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }} className="styled-scroll">
            <div style={{ position: 'relative', marginBottom: '24px' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-light)' }} />
              <input
                type="text"
                placeholder="Search route or stop..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="clean-input"
                style={{ paddingLeft: '38px' }}
              />
            </div>

            {isLoading && <LoadingState message="Loading routes, stops, and buses..." />}
            {!isLoading && loadError && <LoadingState message={loadError} />}
            {!isLoading && !loadError && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredRoutes.map((route) => {
                  const isSelected = selectedRoute?.id === route.id;
                  const routeBusCount = buses.filter((bus) => bus.route_id === route.id).length;

                  return (
                    <div
                      key={route.id}
                      style={{
                        padding: '16px',
                        cursor: 'pointer',
                        background: isSelected ? 'var(--emerald-50)' : 'var(--bg-main)',
                        border: isSelected ? '2px solid var(--emerald-500)' : '2px solid transparent',
                        borderRadius: 'var(--radius-md)',
                        transition: 'all 0.2s ease',
                      }}
                      onClick={() => setSelectedRouteId(route.id)}
                    >
                      <div style={{ fontWeight: '700', marginBottom: '6px', color: isSelected ? 'var(--emerald-700)' : 'var(--text-main)' }}>
                        {route.route_name}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={14} color="var(--emerald-500)" /> {route.start_stop} ➔ {route.end_stop}
                      </div>
                      <div style={{ marginTop: '10px', fontSize: '0.8rem', color: routeBusCount ? 'var(--emerald-700)' : 'var(--text-light)' }}>
                        {routeBusCount ? `${routeBusCount} active bus${routeBusCount > 1 ? 'es' : ''}` : 'No active bus assigned'}
                      </div>
                    </div>
                  );
                })}

                {!filteredRoutes.length && <LoadingState message="No routes matched your search." />}
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', zIndex: 0 }}>
        <div style={{ padding: '20px 24px', background: 'var(--bg-card)', borderBottom: '1px solid var(--border-light)' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-main)' }}>
            Live Map {selectedRoute ? <span style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>— {selectedRoute.route_name}</span> : ''}
          </h2>
        </div>

        <div style={{ flex: 1, position: 'relative', background: 'var(--bg-main)' }}>
          {isLoading ? (
            <LoadingState message="Preparing passenger map..." />
          ) : loadError ? (
            <LoadingState message={loadError} />
          ) : !selectedRoute ? (
            <div style={{ color: 'var(--text-light)', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ background: 'var(--border-light)', padding: '24px', borderRadius: '50%', marginBottom: '20px' }}>
                <MapPin size={48} color="white" />
              </div>
              <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>Select a route to view the live map</p>
            </div>
          ) : (
            <MapContainer center={initialCenter} zoom={14} style={{ height: '100%', width: '100%', zIndex: 1 }}>
              <MapUpdater routeCoordinates={routeCoordinates} />
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
              />

              {!!routeCoordinates.length && <Polyline positions={routeCoordinates} color="var(--emerald-500)" weight={6} opacity={0.8} />}

              {routeStops.map((stop) => (
                <Marker key={stop.id} position={[stop.lat, stop.lng]}>
                  <Popup>
                    <div>
                      <b>{stop.name}</b>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {activeBuses.map((bus) => (
                <Marker key={bus.id} position={[bus.lat, bus.lng]} icon={busIcon}>
                  <Popup>
                    <div>
                      <b>Bus {bus.bus_number}</b>
                      <br />
                      <span style={{ color: 'var(--success)', fontWeight: '500' }}>{bus.status}</span>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>

        {selectedRoute && !isLoading && !loadError && (
          <div style={{ padding: '20px 24px', background: 'var(--bg-main)', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '12px', background: 'white', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                <Clock size={24} color="var(--emerald-500)" />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Route start</div>
                <div style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--text-main)' }}>{selectedRoute.start_stop}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '12px', background: 'white', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                <Bus size={24} color="#0f3d8a" />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Live buses on route</div>
                <div style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--text-main)' }}>
                  {activeBuses.length ? activeBuses.map((bus) => bus.bus_number).join(', ') : 'No active bus assigned'}
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
