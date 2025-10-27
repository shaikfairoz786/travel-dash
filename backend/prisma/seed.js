const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // Create an admin user
  const passwordHash = await bcrypt.hash('Admin123456', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash,
      role: 'admin',
    },
  });
  console.log({ adminUser });

  // Create some packages
  const package1 = await prisma.package.upsert({
    where: { slug: 'bali-adventure' },
    update: {},
    create: {
      title: 'Bali Adventure',
      slug: 'bali-adventure',
      shortDesc: 'Explore the beautiful island of Bali',
      overview: 'A 7-day adventure through Bali\'s stunning landscapes, ancient temples, and vibrant culture.',
      itinerary: { days: [{ title: 'Day 1', description: 'Arrival in Denpasar' }] },
      inclusions: { items: ['Accommodation', 'Breakfast', 'Tours'] },
      price: 1200.00,
      currency: 'USD',
      images: { main: 'bali.jpg' },
      createdBy: adminUser.id,
    },
  });
  console.log({ package1 });

  const package2 = await prisma.package.upsert({
    where: { slug: 'thai-getaway' },
    update: {},
    create: {
      title: 'Thai Getaway',
      slug: 'thai-getaway',
      shortDesc: 'Discover the wonders of Thailand',
      overview: 'An unforgettable 10-day journey through Thailand\'s bustling cities, serene beaches, and rich history.',
      itinerary: { days: [{ title: 'Day 1', description: 'Arrival in Bangkok' }] },
      inclusions: { items: ['Accommodation', 'Breakfast', 'Tours'] },
      price: 1500.00,
      currency: 'USD',
      images: { main: 'thailand.jpg' },
      createdBy: adminUser.id,
    },
  });
  console.log({ package2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
