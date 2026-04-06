import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import PassengerView from './pages/PassengerView';
import AdminDashboard from './pages/AdminDashboard';
import DriverConsole from './pages/DriverConsole';
import { initialBuses } from './mockData';
import { DashboardLayout } from './layouts/DashboardLayout';
import { io } from 'socket.io-client';

// Connect to our new Express/Socket.io Backend
const socket = io('http://localhost:5000');

function App() {
  const [currentView, setCurrentView] = useState('home');
  // Global state for buses to track real-time socket updates
  const [buses, setBuses] = useState(initialBuses);

  useEffect(() => {
    socket.on('busLocationUpdate', (updatedBus) => {
       setBuses(currentBuses => 
         currentBuses.map(b => b.id === updatedBus.id ? { ...b, lat: updatedBus.lat, lng: updatedBus.lng } : b)
       );
    });

    return () => socket.off('busLocationUpdate');
  }, []);

  const navigate = (view) => setCurrentView(view);

  const updateBusLocation = (busId, lat, lng) => {
    // Optimistic UI update
    setBuses(buses.map(b => b.id === busId ? { ...b, lat, lng } : b));
    // Emit to backend
    socket.emit('driverUpdateLocation', { busId, lat, lng });
  };

  return (
    <DashboardLayout currentView={currentView} onNavigate={navigate}>
      {currentView === 'home' && <Home onNavigate={navigate} />}
      {currentView === 'passenger' && <PassengerView buses={buses} />}
      {currentView === 'admin' && <AdminDashboard buses={buses} />}
      {currentView === 'driver' && <DriverConsole buses={buses} onUpdateLocation={updateBusLocation} />}
    </DashboardLayout>
  );
}

export default App;
