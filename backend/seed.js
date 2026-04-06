const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

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
      { id: 1, name: 'Srinivas', driver_id: 101, passwordHash: hashPassword('driver101'), route_id: 1 },
      { id: 2, name: 'Ramesh', driver_id: 102, passwordHash: hashPassword('driver102'), route_id: 2 }
    ]
  });

  console.log('Seeding Stops...');
  await prisma.stop.createMany({
    data: [
      { id: 1, name: 'NIT Main Gate', lat: 16.8202, lng: 81.5235 },
      { id: 2, name: 'Tadepalligudem Railway Station', lat: 16.8123, lng: 81.5284 },
      { id: 3, name: 'RTC Bus Stand', lat: 16.815, lng: 81.527 },
      { id: 4, name: 'Pentapadu Junction', lat: 16.834, lng: 81.56 }
    ]
  });

  console.log('Seeding Routes...');
  await prisma.route.create({
    data: { id: 1, route_name: 'Campus Express', start_stop: 'NIT Main Gate', end_stop: 'Tadepalligudem Railway Station', stops: [1, 3, 2] }
  });
  await prisma.route.create({
    data: { id: 2, route_name: 'City Connector', start_stop: 'RTC Bus Stand', end_stop: 'Pentapadu Junction', stops: [3, 2, 4] }
  });

  console.log('Seeding Buses...');
  await prisma.bus.createMany({
    data: [
      { id: 1, bus_number: 'AP37 TA 5544', route_id: 1, driver_id: 1, lat: 16.8202, lng: 81.5235, status: 'Active' },
      { id: 2, bus_number: 'AP37 BC 9876', route_id: 2, driver_id: 2, lat: 16.815, lng: 81.527, status: 'Active' }
    ]
  });

  console.log('Seed completed successfully!');
  console.log('Driver credentials: 101 / driver101, 102 / driver102');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
