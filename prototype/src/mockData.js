export const users = [
  { id: 1, username: 'admin', role: 'admin' },
  { id: 2, username: 'passenger1', role: 'passenger' },
];

export const drivers = [
  { id: 1, name: 'Srinivas', driver_id: 101, route_id: 1 },
  { id: 2, name: 'Ramesh', driver_id: 102, route_id: 2 },
];

export const stops = [
  { id: 1, name: 'NIT Main Gate', lat: 16.8202, lng: 81.5235 },
  { id: 2, name: 'Tadepalligudem Railway Station', lat: 16.8123, lng: 81.5284 },
  { id: 3, name: 'RTC Bus Stand', lat: 16.8150, lng: 81.5270 },
  { id: 4, name: 'Pentapadu Junction', lat: 16.8340, lng: 81.5600 },
];

export const routes = [
  { id: 1, route_name: 'Campus Express', start_stop: 'NIT Main Gate', end_stop: 'Railway Station', stops: [1, 3, 2] },
  { id: 2, route_name: 'City Connector', start_stop: 'Bus Stand', end_stop: 'Pentapadu Junction', stops: [3, 2, 4] },
];

export const initialBuses = [
  { id: 1, bus_number: 'AP37 TA 5544', route_id: 1, driver_id: 101, lat: 16.8202, lng: 81.5235, status: 'Active' },
  { id: 2, bus_number: 'AP37 BC 9876', route_id: 2, driver_id: 102, lat: 16.8150, lng: 81.5270, status: 'Active' },
];
