import React, { useState } from 'react';
import Home from './pages/Home';
import PassengerView from './pages/PassengerView';
import AdminDashboard from './pages/AdminDashboard';
import DriverConsole from './pages/DriverConsole';
import { initialBuses } from './mockData';

function App() {
  const [currentView, setCurrentView] = useState('home');
  // Global state for buses to simulate real-time updates across components
  const [buses, setBuses] = useState(initialBuses);

  const navigate = (view) => {
    setCurrentView(view);
  };

  const updateBusLocation = (busId, lat, lng) => {
    setBuses(buses.map(b => b.id === busId ? { ...b, lat, lng } : b));
  };

  return (
    <div className="app-container">
      {/* Simple Top Navigation */}
      {currentView !== 'home' && (
        <nav style={{ padding: '16px', background: 'var(--bg-card)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 'bold', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--accent)' }}>🚌</span> BusTracker Pro
          </div>
          <button className="btn btn-secondary" onClick={() => navigate('home')} style={{ padding: '6px 12px', fontSize: '0.875rem' }}>
            Back to Home
          </button>
        </nav>
      )}

      <main style={{ padding: currentView === 'home' ? '0' : '24px', maxWidth: '1200px', margin: '0 auto' }}>
        {currentView === 'home' && <Home onNavigate={navigate} />}
        {currentView === 'passenger' && <PassengerView buses={buses} />}
        {currentView === 'admin' && <AdminDashboard buses={buses} />}
        {currentView === 'driver' && <DriverConsole buses={buses} onUpdateLocation={updateBusLocation} />}
      </main>
    </div>
  );
}

export default App;
