const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000';

function buildHeaders(token, hasBody = false) {
  const headers = {};

  if (hasBody) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error ?? 'Request failed.');
  }

  return data;
}

export const apiBaseUrl = API_BASE_URL;

export function fetchRoutes() {
  return request('/api/routes');
}

export function fetchStops() {
  return request('/api/stops');
}

export function fetchBuses() {
  return request('/api/buses');
}

export function loginDriver(driverId, password) {
  return request('/api/driver/login', {
    method: 'POST',
    headers: buildHeaders(null, true),
    body: JSON.stringify({ driver_id: Number(driverId), password }),
  });
}

export function fetchDriverSession(token) {
  return request('/api/driver/me', {
    headers: buildHeaders(token),
  });
}

export function updateDriverLocation(token, busId, lat, lng) {
  return request('/api/driver/location', {
    method: 'POST',
    headers: buildHeaders(token, true),
    body: JSON.stringify({ busId, lat, lng }),
  });
}

export function updateStop(token, stopId, payload) {
  return request(`/api/stops/${stopId}`, {
    method: 'PUT',
    headers: buildHeaders(token, true),
    body: JSON.stringify(payload),
  });
}

export function updateRoute(token, routeId, payload) {
  return request(`/api/routes/${routeId}`, {
    method: 'PUT',
    headers: buildHeaders(token, true),
    body: JSON.stringify(payload),
  });
}
