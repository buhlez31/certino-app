import fetch from 'node-fetch';

import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL || "postgresql://treetino:password@localhost:5432/treetino_db?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/**
 * This script executes the Chainlink DON javascript logic
 * to query the Aggregator API.
 */
async function simulate() {
  const installation = await prisma.installation.findFirst({ where: { provider: 'Victron' } });
  if (!installation) throw new Error("No installation found. Run seed script.");
  const installationId = installation.id;
  
  const startTs = 1715126400;
  const endTs = 1715212800;

  console.log(`[Chainlink Node] Starting Function request for ${installation.provider}...`);
  const url = `http://localhost:3000/api/v1/generation/${installationId}?start=${startTs}&end=${endTs}`;
  
  console.log(`[Chainlink Node] Calling ${url}`);

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      console.error(`[Chainlink Node] Request failed with status ${res.status}:`, data);
      return;
    }

    console.log(`[Chainlink Node] Received Payload:`);
    console.log(JSON.stringify(data, null, 2));

    const kwhProduced = Math.round(data.Output.kWh_produced * 100);
    console.log(`[Chainlink Node] Final Encoded Value (x100 integer): ${kwhProduced}`);
    
  } catch (err) {
    console.error(`[Chainlink Node] Failed to execute request:`, err);
  }
}

simulate();
