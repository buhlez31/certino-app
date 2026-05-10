import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

dotenv.config();

const connectionString = process.env.DATABASE_URL || "postgresql://treetino:password@localhost:5432/treetino_db?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

import { InverterFactory } from './inverters/InverterFactory';

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Generation Endpoint
app.get('/api/v1/generation/:installationId', async (req, res) => {
  try {
    const { installationId } = req.params;
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({ error: 'Missing start or end timestamps in query parameters' });
    }

    const startTime = parseInt(start as string, 10);
    const endTime = parseInt(end as string, 10);

    // 1. Look up the installation
    const installation = await prisma.installation.findUnique({
      where: { id: installationId }
    });

    if (!installation) {
      return res.status(404).json({ error: 'Installation not found' });
    }

    // 2. Get the correct adapter
    const adapter = InverterFactory.getAdapter(installation.provider);

    // 3. Fetch and transform data
    const energyData = await adapter.fetchGeneration(
      installation.credentials,
      installation.siteId,
      installation.gpsLat,
      installation.gpsLong,
      startTime,
      endTime,
      installation.fuelType
    );

    // 4. Return Standardized EnergyTag JSON Schema
    return res.status(200).json(energyData);

  } catch (error: any) {
    console.error('Aggregation API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Aggregator API is running on port ${PORT}`);
});
