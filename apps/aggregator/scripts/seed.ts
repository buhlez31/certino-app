import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL || "postgresql://treetino:password@localhost:5432/treetino_db?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding the database with system installations...');

  // Clean existing data for a fresh run
  await prisma.energyRecord.deleteMany({});
  await prisma.installation.deleteMany({});

  const victronYacht = await prisma.installation.create({
    data: {
      provider: 'Victron',
      credentials: 'e1de6a79e2e398f4da8edcb2faab88f59f2bc9040a6301442333c63d9447596b',
      gpsLat: 50.0755,
      gpsLong: 14.4378,
      siteId: 'victron-yacht-151734',
    },
  });

  const smaFarm = await prisma.installation.create({
    data: {
      provider: 'SMA',
      credentials: 'api-sma-token-456',
      gpsLat: 48.1486,
      gpsLong: 17.1077,
      siteId: 'sma-farm-998877',
    },
  });

  const froniusRoof = await prisma.installation.create({
    data: {
      provider: 'Fronius',
      credentials: 'api-fronius-token-789',
      gpsLat: 49.1951,
      gpsLong: 16.6068,
      siteId: 'fronius-roof-112233',
    },
  });

  const windTurbine = await prisma.installation.create({
    data: {
      provider: 'ThingSpeak',
      credentials: 'public-no-auth',
      gpsLat: 51.5074,
      gpsLong: -0.1278,
      siteId: '2057381',
      fuelType: 'Wind',
    },
  });

  console.log('✅ Created Installations:');
  console.table([
    { ID: victronYacht.id, Provider: 'Victron', SiteID: victronYacht.siteId },
    { ID: smaFarm.id, Provider: 'SMA', SiteID: smaFarm.siteId },
    { ID: froniusRoof.id, Provider: 'Fronius', SiteID: froniusRoof.siteId },
    { ID: windTurbine.id, Provider: 'ThingSpeak (Wind)', SiteID: windTurbine.siteId }
  ]);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
