import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { getIssuerContract, MissingEnvError } from "@/lib/contract.server";

export const runtime = "nodejs";

const PLACEHOLDER_CID = "bafybeibogusplaceholdercidforhackathondemoaaaaaaaaaaaaaaaaaaaa";

type MintBody = {
  producer?: string;
  kWh?: number;
  productionStart?: string;
  deviceLabel?: string;
  energySource?: string;
};

export async function POST(req: NextRequest) {
  let body: MintBody;
  try {
    body = (await req.json()) as MintBody;
  } catch {
    return NextResponse.json({ error: "Body must be valid JSON" }, { status: 400 });
  }

  const { producer, kWh, productionStart, deviceLabel, energySource } = body;

  if (!producer || !ethers.isAddress(producer)) {
    return NextResponse.json({ error: "producer must be a valid address" }, { status: 400 });
  }
  if (typeof kWh !== "number" || !Number.isFinite(kWh) || kWh <= 0) {
    return NextResponse.json({ error: "kWh must be a positive number" }, { status: 400 });
  }
  if (!productionStart || Number.isNaN(Date.parse(productionStart))) {
    return NextResponse.json({ error: "productionStart must be an ISO date string" }, { status: 400 });
  }
  if (!deviceLabel || typeof deviceLabel !== "string") {
    return NextResponse.json({ error: "deviceLabel is required" }, { status: 400 });
  }

  let contract: ethers.Contract;
  try {
    ({ contract } = getIssuerContract());
  } catch (err) {
    if (err instanceof MissingEnvError) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    throw err;
  }

  const startTs = Math.floor(new Date(productionStart).getTime() / 1000);
  const endTs = startTs + 3600;
  const bundleQuantity = Math.round(kWh * 1000);
  const faceValueWh = 1n;
  const fuel = energySource && typeof energySource === "string" ? energySource : "Solar";
  const cid = PLACEHOLDER_CID;

  try {
    const tx = await contract.issue(
      producer,
      bundleQuantity,
      faceValueWh,
      fuel,
      startTs,
      endTs,
      ethers.id(deviceLabel),
      ethers.id(`issuance-${Date.now()}`),
      `ipfs://${cid}`
    );
    const receipt = await tx.wait();

    const issued = receipt!.logs
      .map((l: ethers.Log) => {
        try {
          return contract.interface.parseLog(l);
        } catch {
          return null;
        }
      })
      .find((e: ethers.LogDescription | null) => e && e.name === "CertificateIssued");

    return NextResponse.json({
      ok: true,
      txHash: tx.hash,
      tokenId: issued?.args.tokenId.toString() ?? null,
      explorerUrl: `https://amoy.polygonscan.com/tx/${tx.hash}`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Mint failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
