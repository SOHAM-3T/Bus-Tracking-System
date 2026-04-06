# BusTracker Pro

BusTracker Pro is a full-stack bus tracking system that lets passengers view live route activity, allows authenticated drivers to broadcast bus movement, and gives admins the ability to update route and stop information from the dashboard.

Live frontend deployment: [bus-tracking-system-vert.vercel.app](https://bus-tracking-system-vert.vercel.app/)

## Features

- Live passenger map with Leaflet and real-time bus marker updates
- Backend-driven routes, stops, buses, and driver assignments
- Driver authentication using driver ID and password
- Protected driver dashboard for location broadcasting
- Admin editing for existing stops, coordinates, route labels, and ordered stop assignments
- PostgreSQL persistence with Prisma
- Socket.IO-based live updates between driver and passenger views

## Tech Stack

### Frontend
- React 18
- Vite
- Leaflet and React Leaflet
- Socket.IO Client
- Framer Motion

### Backend
- Node.js
- Express
- Socket.IO
- Prisma
- PostgreSQL

## Project Structure

```text
Bus-Tracking-System/
├── backend/      # Express, Prisma, PostgreSQL, Socket.IO
├── prototype/    # React + Vite frontend
└── README.md
```

## Architecture

```mermaid
graph TD
    A["Driver Dashboard"] -->|Authenticated location update| B["Express + Socket.IO API"]
    C["Passenger Map"] -->|Fetch routes/stops/buses| B
    D["Admin Dashboard"] -->|Update stops/routes| B
    B -->|Prisma| E["PostgreSQL"]
    B -->|Socket.IO busLocationUpdate| C
```

## Core Data Model

- `Driver`: driver identity, driver ID, password hash, route assignment
- `Stop`: stop name and coordinates
- `Route`: route name, labels, and ordered stop IDs
- `Bus`: bus number, assigned route, assigned driver, current coordinates, status
- `User`: basic user table retained from the original project structure

## Local Setup

### Prerequisites

- Node.js 18+
- PostgreSQL

### 1. Configure the backend

Create `backend/.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/bus_tracker?schema=public"
PORT=5000
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Sync Prisma schema and seed demo data

```bash
npx prisma generate --no-engine
npx prisma db push
npm run seed
```

### 4. Install frontend dependencies

```bash
cd ../prototype
npm install
```

### 5. Configure the frontend

Create `prototype/.env`:

```env
VITE_API_BASE_URL="http://localhost:5000"
```

## Running Locally

Run the backend:

```bash
cd backend
npm run dev
```

Run the frontend:

```bash
cd prototype
npm run dev
```

Frontend default dev URL:

```text
http://localhost:5173
```

## Demo Driver Credentials

- `101 / driver101`
- `102 / driver102`

## Available Backend API Endpoints

- `GET /api/routes`
- `GET /api/stops`
- `GET /api/buses`
- `POST /api/driver/login`
- `GET /api/driver/me`
- `POST /api/driver/location`
- `PUT /api/stops/:id`
- `PUT /api/routes/:id`

## Deployment Notes

### Frontend

- Deploy `prototype/` to Vercel
- Set `VITE_API_BASE_URL` to your deployed backend URL

### Backend

- Deploy `backend/` to Render
- Set `DATABASE_URL`
- Run:

```bash
npx prisma db push
npm run seed
```

## Current Product Capabilities

- Passengers can search routes and view live bus positions between stops
- Drivers must authenticate before accessing the broadcast console
- Admins can update existing stop locations and route definitions without changing source code

## Future Improvements

- Restrict backend CORS to the deployed frontend domain
- Replace in-memory driver sessions with persistent auth storage
- Add admin authentication and role-based protection
- Optimize frontend bundle size and compress logo assets
