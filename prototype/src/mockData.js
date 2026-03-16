export const users = [
  { id: 1, username: 'admin', role: 'admin' },
  { id: 2, username: 'passenger1', role: 'passenger' },
];

export const drivers = [
  { id: 1, name: 'John Doe', driver_id: 101, route_id: 1 },
  { id: 2, name: 'Jane Smith', driver_id: 102, route_id: 2 },
];

export const stops = [
  { id: 1, name: 'Central Station', lat: 34.0522, lng: -118.2437 },
  { id: 2, name: 'Tech Park', lat: 34.0530, lng: -118.2500 },
  { id: 3, name: 'University Campus', lat: 34.0600, lng: -118.2600 },
  { id: 4, name: 'Downtown Mall', lat: 34.0450, lng: -118.2550 },
];

export const routes = [
  { id: 1, route_name: 'Metro Line A', start_stop: 'Central Station', end_stop: 'University Campus', stops: [1, 2, 3] },
  { id: 2, route_name: 'City Loop B', start_stop: 'Downtown Mall', end_stop: 'Tech Park', stops: [4, 1, 2] },
];

export const initialBuses = [
  { id: 1, bus_number: 'B-100', route_id: 1, driver_id: 101, lat: 34.0522, lng: -118.2437, status: 'Active' },
  { id: 2, bus_number: 'B-205', route_id: 2, driver_id: 102, lat: 34.0450, lng: -118.2550, status: 'Active' },
];
