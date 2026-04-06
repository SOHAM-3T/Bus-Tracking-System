const express = require('express');
const http = require('http');
const crypto = require('crypto');
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
    methods: ['GET', 'POST', 'PUT'],
  },
});

const prisma = new PrismaClient();
const sessions = new Map();

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function createSession(driverId) {
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, { driverId, createdAt: Date.now() });
  return token;
}

async function getDriverSession(token) {
  const session = sessions.get(token);
  if (!session) {
    return null;
  }

  return prisma.driver.findUnique({
    where: { id: session.driverId },
    include: {
      Bus: {
        include: {
          route: true,
        },
      },
    },
  });
}

function getTokenFromRequest(req) {
  const authorization = req.headers.authorization || '';
  if (!authorization.startsWith('Bearer ')) {
    return null;
  }

  return authorization.slice('Bearer '.length);
}

async function requireDriverAuth(req, res, next) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return res.status(401).json({ error: 'Missing authentication token.' });
    }

    const driver = await getDriverSession(token);
    if (!driver) {
      return res.status(401).json({ error: 'Invalid or expired authentication token.' });
    }

    req.authenticatedDriver = driver;
    req.authToken = token;
    next();
  } catch (error) {
    next(error);
  }
}

function serializeDriver(driver, token) {
  const assignedBus = driver.Bus[0] || null;

  return {
    token,
    driver: {
      id: driver.id,
      driver_id: driver.driver_id,
      name: driver.name,
      route_id: driver.route_id,
    },
    assignedBus: assignedBus
      ? {
          id: assignedBus.id,
          bus_number: assignedBus.bus_number,
          route_id: assignedBus.route_id,
          driver_id: assignedBus.driver_id,
          lat: assignedBus.lat,
          lng: assignedBus.lng,
          status: assignedBus.status,
        }
      : null,
  };
}

async function ensureStopsExist(stopIds) {
  const uniqueIds = [...new Set(stopIds)];
  const stops = await prisma.stop.findMany({
    where: { id: { in: uniqueIds } },
  });

  return stops.length === uniqueIds.length;
}

app.get('/api/routes', async (req, res) => {
  const routes = await prisma.route.findMany({
    orderBy: { id: 'asc' },
  });
  res.json(routes);
});

app.get('/api/stops', async (req, res) => {
  const stops = await prisma.stop.findMany({
    orderBy: { id: 'asc' },
  });
  res.json(stops);
});

app.get('/api/buses', async (req, res) => {
  const buses = await prisma.bus.findMany({
    orderBy: { id: 'asc' },
  });
  res.json(buses);
});

app.post('/api/driver/login', async (req, res) => {
  const { driver_id, password } = req.body ?? {};

  if (!driver_id || !password) {
    return res.status(400).json({ error: 'Driver ID and password are required.' });
  }

  const driver = await prisma.driver.findUnique({
    where: { driver_id: Number(driver_id) },
    include: {
      Bus: {
        include: {
          route: true,
        },
      },
    },
  });

  if (!driver || driver.passwordHash !== hashPassword(password)) {
    return res.status(401).json({ error: 'Invalid driver ID or password.' });
  }

  const token = createSession(driver.id);
  res.json(serializeDriver(driver, token));
});

app.get('/api/driver/me', requireDriverAuth, async (req, res) => {
  res.json(serializeDriver(req.authenticatedDriver, req.authToken));
});

app.post('/api/driver/location', requireDriverAuth, async (req, res) => {
  const { busId, lat, lng } = req.body ?? {};
  const assignedBus = req.authenticatedDriver.Bus[0];

  if (!assignedBus) {
    return res.status(400).json({ error: 'No active bus is assigned to this driver.' });
  }

  if (Number(busId) !== assignedBus.id) {
    return res.status(403).json({ error: 'You can only update your assigned bus.' });
  }

  if (!Number.isFinite(Number(lat)) || !Number.isFinite(Number(lng))) {
    return res.status(400).json({ error: 'Latitude and longitude must be valid numbers.' });
  }

  const updatedBus = await prisma.bus.update({
    where: { id: assignedBus.id },
    data: {
      lat: Number(lat),
      lng: Number(lng),
    },
  });

  io.emit('busLocationUpdate', {
    id: updatedBus.id,
    lat: updatedBus.lat,
    lng: updatedBus.lng,
  });

  res.json(updatedBus);
});

app.put('/api/stops/:id', async (req, res) => {
  const stopId = Number(req.params.id);
  const { name, lat, lng } = req.body ?? {};

  if (!name || !Number.isFinite(Number(lat)) || !Number.isFinite(Number(lng))) {
    return res.status(400).json({ error: 'Stop name, latitude, and longitude are required.' });
  }

  const updatedStop = await prisma.stop.update({
    where: { id: stopId },
    data: {
      name: String(name).trim(),
      lat: Number(lat),
      lng: Number(lng),
    },
  });

  res.json(updatedStop);
});

app.put('/api/routes/:id', async (req, res) => {
  const routeId = Number(req.params.id);
  const { route_name, start_stop, end_stop, stops } = req.body ?? {};

  if (!route_name || !start_stop || !end_stop || !Array.isArray(stops) || stops.length === 0) {
    return res.status(400).json({ error: 'Route name, labels, and ordered stop IDs are required.' });
  }

  const parsedStopIds = stops.map((stopId) => Number(stopId));
  if (parsedStopIds.some((stopId) => !Number.isInteger(stopId))) {
    return res.status(400).json({ error: 'Route stop IDs must all be integers.' });
  }

  const allStopsExist = await ensureStopsExist(parsedStopIds);
  if (!allStopsExist) {
    return res.status(400).json({ error: 'One or more referenced stops do not exist.' });
  }

  const updatedRoute = await prisma.route.update({
    where: { id: routeId },
    data: {
      route_name: String(route_name).trim(),
      start_stop: String(start_stop).trim(),
      end_stop: String(end_stop).trim(),
      stops: parsedStopIds,
    },
  });

  res.json(updatedRoute);
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  if (error.code === 'P2025') {
    return res.status(404).json({ error: 'Requested record was not found.' });
  }

  res.status(500).json({ error: 'Internal server error.' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
