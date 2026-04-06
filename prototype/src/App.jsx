import React, { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import Home from './pages/Home';
import PassengerView from './pages/PassengerView';
import AdminDashboard from './pages/AdminDashboard';
import DriverConsole from './pages/DriverConsole';
import { DashboardLayout } from './layouts/DashboardLayout';
import {
  apiBaseUrl,
  fetchBuses,
  fetchDriverSession,
  fetchRoutes,
  fetchStops,
  loginDriver,
  updateDriverLocation,
  updateRoute,
  updateStop,
} from './lib/api';

const socket = io(apiBaseUrl, { autoConnect: true });
const DRIVER_TOKEN_STORAGE_KEY = 'bus-tracker-driver-token';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [routes, setRoutes] = useState([]);
  const [stops, setStops] = useState([]);
  const [buses, setBuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [driverSession, setDriverSession] = useState(null);
  const [driverToken, setDriverToken] = useState(localStorage.getItem(DRIVER_TOKEN_STORAGE_KEY) ?? '');
  const [authLoading, setAuthLoading] = useState(Boolean(localStorage.getItem(DRIVER_TOKEN_STORAGE_KEY)));

  const refreshData = async () => {
    const [routesResponse, stopsResponse, busesResponse] = await Promise.all([fetchRoutes(), fetchStops(), fetchBuses()]);
    setRoutes(routesResponse);
    setStops(stopsResponse);
    setBuses(busesResponse);
  };

  useEffect(() => {
    let active = true;

    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        setLoadError('');
        const [routesResponse, stopsResponse, busesResponse] = await Promise.all([fetchRoutes(), fetchStops(), fetchBuses()]);

        if (!active) {
          return;
        }

        setRoutes(routesResponse);
        setStops(stopsResponse);
        setBuses(busesResponse);
      } catch (error) {
        if (active) {
          setLoadError(error.message);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadInitialData();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const handleBusLocationUpdate = (updatedBus) => {
      setBuses((currentBuses) =>
        currentBuses.map((bus) => (bus.id === updatedBus.id ? { ...bus, lat: updatedBus.lat, lng: updatedBus.lng } : bus)),
      );
    };

    socket.on('busLocationUpdate', handleBusLocationUpdate);
    return () => socket.off('busLocationUpdate', handleBusLocationUpdate);
  }, []);

  useEffect(() => {
    let active = true;

    const loadDriverSession = async () => {
      if (!driverToken) {
        setDriverSession(null);
        setAuthLoading(false);
        return;
      }

      try {
        setAuthLoading(true);
        const session = await fetchDriverSession(driverToken);
        if (active) {
          setDriverSession(session);
        }
      } catch (error) {
        if (active) {
          localStorage.removeItem(DRIVER_TOKEN_STORAGE_KEY);
          setDriverToken('');
          setDriverSession(null);
        }
      } finally {
        if (active) {
          setAuthLoading(false);
        }
      }
    };

    loadDriverSession();

    return () => {
      active = false;
    };
  }, [driverToken]);

  const navigate = (view) => setCurrentView(view);

  const handleDriverLogin = async (driverId, password) => {
    const session = await loginDriver(driverId, password);
    localStorage.setItem(DRIVER_TOKEN_STORAGE_KEY, session.token);
    setDriverToken(session.token);
    setDriverSession(session);
    await refreshData();
    return session;
  };

  const handleDriverLogout = () => {
    localStorage.removeItem(DRIVER_TOKEN_STORAGE_KEY);
    setDriverToken('');
    setDriverSession(null);
  };

  const handleUpdateBusLocation = async (busId, lat, lng) => {
    if (!driverToken) {
      throw new Error('You must be logged in to update bus location.');
    }

    const updatedBus = await updateDriverLocation(driverToken, busId, lat, lng);
    setBuses((currentBuses) => currentBuses.map((bus) => (bus.id === updatedBus.id ? updatedBus : bus)));
    return updatedBus;
  };

  const handleStopUpdate = async (stopId, payload) => {
    await updateStop(driverToken, stopId, payload);
    await refreshData();
  };

  const handleRouteUpdate = async (routeId, payload) => {
    await updateRoute(driverToken, routeId, payload);
    await refreshData();
  };

  const assignedBus = useMemo(() => {
    const sessionBusId = driverSession?.assignedBus?.id;
    if (!sessionBusId) {
      return null;
    }

    return buses.find((bus) => bus.id === sessionBusId) ?? driverSession.assignedBus;
  }, [buses, driverSession]);

  const sharedProps = {
    buses,
    routes,
    stops,
    isLoading,
    loadError,
    onRefresh: refreshData,
  };

  return (
    <DashboardLayout currentView={currentView} onNavigate={navigate}>
      {currentView === 'home' && <Home onNavigate={navigate} />}
      {currentView === 'passenger' && <PassengerView {...sharedProps} />}
      {currentView === 'admin' && (
        <AdminDashboard {...sharedProps} onUpdateStop={handleStopUpdate} onUpdateRoute={handleRouteUpdate} />
      )}
      {currentView === 'driver' && (
        <DriverConsole
          {...sharedProps}
          authLoading={authLoading}
          driverSession={driverSession}
          assignedBus={assignedBus}
          onLogin={handleDriverLogin}
          onLogout={handleDriverLogout}
          onUpdateLocation={handleUpdateBusLocation}
        />
      )}
    </DashboardLayout>
  );
}

export default App;
