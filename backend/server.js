const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const prisma = new PrismaClient();

// API Routes
app.get('/api/routes', async (req, res) => {
  const routes = await prisma.route.findMany();
  res.json(routes);
});

app.get('/api/stops', async (req, res) => {
  const stops = await prisma.stop.findMany();
  res.json(stops);
});

app.get('/api/buses', async (req, res) => {
  const buses = await prisma.bus.findMany();
  res.json(buses);
});

// GPS Simulation Server Loop
// Emulates the bus moving along its route
async function simulateGPS() {
  setInterval(async () => {
    try {
      const buses = await prisma.bus.findMany();
      // For each bus, slightly modify its lat/lng to simulate movement
      // In a real app this would follow exact route polylines.
      // Here we just apply a tiny offset to simulate real-time streaming.
      for (let bus of buses) {
        const latOffset = (Math.random() - 0.5) * 0.001;
        const lngOffset = (Math.random() - 0.5) * 0.001;
        
        const updatedBus = await prisma.bus.update({
          where: { id: bus.id },
          data: {
            lat: bus.lat + latOffset,
            lng: bus.lng + lngOffset
          }
        });
        
        // Broadcast new location
        io.emit('busLocationUpdate', {
          id: updatedBus.id,
          lat: updatedBus.lat,
          lng: updatedBus.lng
        });
      }
    } catch (e) {
      console.error("Simulation error", e);
    }
  }, 3000); // Update every 3 seconds
}

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Custom manual update event (from DriverConsole)
  socket.on('driverUpdateLocation', async (data) => {
    try {
      const updatedBus = await prisma.bus.update({
        where: { id: data.busId },
        data: {
           lat: data.lat,
           lng: data.lng
        }
      });
      // Broadcast to everyone
      io.emit('busLocationUpdate', {
         id: updatedBus.id,
         lat: updatedBus.lat,
         lng: updatedBus.lng
      });
    } catch(e) { console.error(e) }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Start simulation loop
  simulateGPS();
});
