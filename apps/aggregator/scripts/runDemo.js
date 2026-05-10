"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const node_fetch_1 = __importDefault(require("node-fetch"));
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const connectionString = process.env.DATABASE_URL || "postgresql://treetino:password@localhost:5432/treetino_db?schema=public";
const pool = new pg_1.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function runDemo() {
    console.log('\n======================================================');
    console.log('🚀 TREETINO PROTOCOL - FULL SYSTEM DEMONSTRATION');
    console.log('======================================================\n');
    // 1. Fetch all registered installations from DB
    console.log('[1] Fetching registered solar installations from the database...');
    const installations = await prisma.installation.findMany();
    if (installations.length === 0) {
        console.log('No installations found! Please run the seed script first.');
        return;
    }
    console.log(`Found ${installations.length} installations.\n`);
    const startTs = 1715176800; // May 8, 2026, 14:00:00 UTC
    const endTs = 1715180400; // May 8, 2026, 15:00:00 UTC
    console.log(`[2] Chainlink Automation triggered!`);
    console.log(`Requesting generation data for May 8, 2026, Hour 14:00...\n`);
    let totalProtocolKwh = 0;
    for (const inst of installations) {
        console.log(`------------------------------------------------------`);
        console.log(`⚡ Processing Installation: ${inst.siteId} (${inst.provider})`);
        const apiUrl = `http://localhost:3000/api/v1/generation/${inst.id}?start=${startTs}&end=${endTs}`;
        console.log(`📡 DON Requesting: ${apiUrl}`);
        try {
            const response = await (0, node_fetch_1.default)(apiUrl);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: response.statusText }));
                console.error(`❌ [ERROR] Failed to fetch data from API for ${inst.provider}:`, errorData.error || errorData);
                continue;
            }
            const energyData = await response.json();
            console.log(`\n✅ Standardized EnergyTag Payload Received:`);
            console.log(JSON.stringify(energyData, null, 2));
            totalProtocolKwh += energyData.Output.kWh_produced;
            const encodedUint256 = Math.round(energyData.Output.kWh_produced * 100);
            console.log(`\n🔗 Pushing to Blockchain -> Encoded Uint256: ${encodedUint256}`);
        }
        catch (err) {
            console.error(`Failed to process ${inst.siteId}:`, err);
        }
    }
    console.log(`\n======================================================`);
    console.log(`🏆 DEMO COMPLETE`);
    console.log(`Total Treetino Protocol Generation: ${totalProtocolKwh.toFixed(2)} kWh`);
    console.log(`All NFTs would now be minted based on these standardized payloads!`);
    console.log(`======================================================\n`);
}
runDemo()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
