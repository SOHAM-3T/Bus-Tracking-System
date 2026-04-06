const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Clearing old data...');
  await prisma.bus.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.route.deleteMany();
  await prisma.stop.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding Users...');
  await prisma.user.createMany({
    data: [
      { id: 1, username: 'admin', role: 'admin' },
      { id: 2, username: 'passenger1', role: 'passenger' }
    ]
  });

  console.log('Seeding Drivers...');
  await prisma.driver.createMany({
    data: [
      { id: 1, name: 'John Doe', driver_id: 101, route_id: 1 },
      { id: 2, name: 'Jane Smith', driver_id: 102, route_id: 2 }
    ]
  });

  console.log('Seeding Stops...');
  await prisma.stop.createMany({
    data: [
      { id: 1, name: 'Central Station', lat: 34.0522, lng: -118.2437 },
      { id: 2, name: 'Tech Park', lat: 34.0530, lng: -118.2500 },
      { id: 3, name: 'University Campus', lat: 34.0600, lng: -118.2600 },
      { id: 4, name: 'Downtown Mall', lat: 34.0450, lng: -118.2550 }
    ]
  });

  console.log('Seeding Routes...');
  await prisma.route.create({
    data: { id: 1, route_name: 'Metro Line A', start_stop: 'Central Station', end_stop: 'University Campus', stops: [1, 2, 3] }
  });
  await prisma.route.create({
    data: { id: 2, route_name: 'City Loop B', start_stop: 'Downtown Mall', end_stop: 'Tech Park', stops: [4, 1, 2] }
  });

  console.log('Seeding Buses...');
  await prisma.bus.createMany({
    data: [
      { id: 1, bus_number: 'B-100', route_id: 1, driver_id: 1, lat: 34.0522, lng: -118.2437, status: 'Active' },
      { id: 2, bus_number: 'B-205', route_id: 2, driver_id: 2, lat: 34.0450, lng: -118.2550, status: 'Active' }
    ]
  });

  console.log('Seed completed successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
