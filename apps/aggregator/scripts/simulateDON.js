"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const client_1 = require("@prisma/client");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const connectionString = process.env.DATABASE_URL || "postgresql://treetino:password@localhost:5432/treetino_db?schema=public";
const pool = new pg_1.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
/**
 * This script executes the Chainlink DON javascript logic
 * to query the Aggregator API.
 */
async function simulate() {
    const installation = await prisma.installation.findFirst({ where: { provider: 'Victron' } });
    if (!installation)
        throw new Error("No installation found. Run seed script.");
    const installationId = installation.id;
    const startTs = 1715126400;
    const endTs = 1715212800;
    console.log(`[Chainlink Node] Starting Function request for ${installation.provider}...`);
    const url = `http://localhost:3000/api/v1/generation/${installationId}?start=${startTs}&end=${endTs}`;
    console.log(`[Chainlink Node] Calling ${url}`);
    try {
        const res = await (0, node_fetch_1.default)(url);
        const data = await res.json();
        if (!res.ok) {
            console.error(`[Chainlink Node] Request failed with status ${res.status}:`, data);
            return;
        }
        console.log(`[Chainlink Node] Received Payload:`);
        console.log(JSON.stringify(data, null, 2));
        const kwhProduced = Math.round(data.Output.kWh_produced * 100);
        console.log(`[Chainlink Node] Final Encoded Value (x100 integer): ${kwhProduced}`);
    }
    catch (err) {
        console.error(`[Chainlink Node] Failed to execute request:`, err);
    }
}
simulate();
