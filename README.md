# 🚌 Full-Stack Bus Tracking System

A complete, real-time bus tracking application that connects bus drivers with passengers. Built with a modern full-stack web architecture, it allows passengers to see live bus movements on an interactive map and tracks fleets across predefined routes in real-time using WebSockets.

## ✨ Features

- **Real-Time GPS Tracking**: Live location updates of buses on routes using WebSockets.
- **Interactive Maps**: Rich map visualization using Leaflet for rendering routes, current bus locations, and stops.
- **Driver & Passenger Views**: Dedicated interfaces for drivers to broadcast their location and for passengers to track incoming buses.
- **Modern UI**: A premium, responsive, green-themed design aesthetic with micro-animations.
- **Robust Persistence**: Maintains records of users, drivers, buses, stops, and routes using a relational PostgreSQL database.

## 🛠 Technology Stack

### Frontend (`/prototype`)
- **Framework**: React 18 with Vite
- **Mapping**: Leaflet & React-Leaflet
- **Real-Time Communication**: Socket.io-client
- **Animations & Icons**: Framer Motion, Lucide React
- **Styling**: Vanilla CSS with modern aesthetics

### Backend (`/backend`)
- **Runtime & Framework**: Node.js, Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Real-Time Communication**: Socket.IO

---

## 🏛 System Architecture

The application is built using a classic Client-Server Architecture distributed over two primary tiers, augmented with a real-time event-driven layer:

1. **Presentation Layer (React Frontend)**: Employs a component-based architecture. Drivers broadcast location coordinates (simulated or real GPS) via websockets. Passengers listen to these WebSocket events to see smooth map updates.
2. **Application Layer (Express / Node.js)**: Handles REST API requests (e.g., fetching routes, available buses) and orchestrates WebSocket connections. It acts as a middleman, efficiently broadcasting coordinates received from drivers to all subscribed passenger clients.
3. **Data Layer (PostgreSQL & Prisma)**: The relational database acting as the single source of truth for the systemic entities (Buses, Drivers, Routes).

```mermaid
graph TD
    A[Driver Client] -->|WebSocket: emit location| B(Node/Express Server + Socket.IO)
    B -->|WebSocket: broadcast location| C[Passenger Client 1]
    B -->|WebSocket: broadcast location| D[Passenger Client 2]
    B <-->|Prisma ORM| E[(PostgreSQL Database)]
    C -->|REST API: Fetch Routes/Stops| B
    D -->|REST API: Fetch Routes/Stops| B
```

---

## 🗄️ Database Schema

Managed via Prisma, the data model consists of interconnected tables:

- **User**: Core system users with a role-based access system (`username`, `role`).
- **Driver**: Stores driver details. Each driver is uniquely identified and can be assigned to routes.
- **Route**: Contains route names, start/end destinations, and an array of associated Stop IDs.
- **Stop**: Represents geographical points of interest (lat/lng) along routes.
- **Bus**: The primary tracker entity, linking a `route`, a `driver`, and its current geographical coordinates (`lat`, `lng`), along with operational `status`.

---

## 🚀 Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v18+)
- [PostgreSQL](https://www.postgresql.org/) (Local or Cloud like Neon/Supabase)

### 1. Database Setup
Ensure you have a PostgreSQL database running. Create a `.env` file in the `/backend` directory and add your connection string:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/bustracker?schema=public"
```

### 2. Backend Setup
Navigate to the backend directory, install dependencies, and run Prisma migrations:
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
```

### 3. Frontend Setup
Navigate to the frontend prototype directory and install dependencies:
```bash
cd prototype
npm install
```

---

## 💻 Running the Application

You will need two terminal windows to run both the backend and frontend simultaneously.

**Terminal 1: Backend Development Server**
```bash
cd backend
npm run dev
```

**Terminal 2: Frontend Development Server**
```bash
cd prototype
npm run dev
```

Visit the local URL provided by Vite (usually `http://localhost:5173`) in your browser to interact with the application.

 Remove-Item -Recurse -Force node_modules\.vite