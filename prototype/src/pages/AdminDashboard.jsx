import React from 'react';
import { Card, CardHeader } from '../components/ui/Card';
import { Users, Truck, Activity, AlertCircle } from 'lucide-react';
import { routes } from '../mockData';

export default function AdminDashboard({ buses }) {
  const activeBuses = buses.filter(b => b.status === 'Active').length;
  
  const StatCard = ({ title, value, icon, color }) => (
    <Card>
      <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ background: color + '20', padding: '16px', borderRadius: '16px' }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</div>
          <div style={{ fontSize: '2rem', fontWeight: '800', margin: '4px 0 0 0', color: 'var(--text-main)' }}>{value}</div>
        </div>
      </div>
    </Card>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        <StatCard title="Total Routes" value={routes.length} icon={<Activity size={28} color="var(--info)" />} color="var(--info)" />
        <StatCard title="Active Buses" value={activeBuses} icon={<Truck size={28} color="var(--emerald-500)" />} color="var(--emerald-500)" />
        <StatCard title="System Health" value="100%" icon={<Users size={28} color="var(--success)" />} color="var(--success)" />
        <StatCard title="Alerts" value="0" icon={<AlertCircle size={28} color="var(--warning)" />} color="var(--warning)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
         <Card>
           <CardHeader title="Live Fleet Status" subtitle="Real-time check on bus nodes" />
           <div style={{ padding: '24px' }}>
             <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
               <thead>
                 <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)' }}>
                   <th style={{ padding: '12px 8px', fontWeight: '600' }}>Bus Number</th>
                   <th style={{ padding: '12px 8px', fontWeight: '600' }}>Status</th>
                   <th style={{ padding: '12px 8px', fontWeight: '600' }}>Last Ping</th>
                 </tr>
               </thead>
               <tbody>
                 {buses.map(bus => (
                   <tr key={bus.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                     <td style={{ padding: '16px 8px', fontWeight: '600', color: 'var(--text-main)' }}>{bus.bus_number}</td>
                     <td style={{ padding: '16px 8px' }}>
                       <span style={{ 
                         background: bus.status === 'Active' ? 'var(--emerald-100)' : 'var(--warning-100)', 
                         color: bus.status === 'Active' ? 'var(--emerald-700)' : 'var(--warning-700)', 
                         padding: '6px 12px', 
                         borderRadius: '100px',
                         fontWeight: '600',
                         fontSize: '0.75rem'
                       }}>
                         {bus.status}
                       </span>
                     </td>
                     <td style={{ padding: '16px 8px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                        {bus.lat.toFixed(4)}, {bus.lng.toFixed(4)}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         </Card>
      </div>

    </div>
  );
}
