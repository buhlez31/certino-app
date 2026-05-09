import { NextRequest, NextResponse } from "next/server";
import { getReadContract, MissingEnvError } from "@/lib/contract.server";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let tokenId: bigint;
  try {
    tokenId = BigInt(id);
    if (tokenId <= 0n) throw new Error("tokenId must be positive");
  } catch {
    return NextResponse.json({ error: "id must be a positive integer" }, { status: 400 });
  }

  let contract;
  try {
    contract = getReadContract();
  } catch (err) {
    if (err instanceof MissingEnvError) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    throw err;
  }

  try {
    const [owner, bundle, status, remaining, totalEnergy, uri] = await Promise.all([
      contract.ownerOf(tokenId),
      contract.bundles(tokenId),
      contract.status(tokenId),
      contract.remainingQuantity(tokenId),
      contract.totalEnergyWh(tokenId),
      contract.tokenURI(tokenId),
    ]);

    return NextResponse.json({
      tokenId: tokenId.toString(),
      owner,
      bundle: {
        bundleQuantity: bundle.bundleQuantity.toString(),
        faceValueWh: bundle.faceValueWh.toString(),
        cancelledQuantity: bundle.cancelledQuantity.toString(),
        energySource: bundle.energySource,
        productionStart: bundle.productionStart.toString(),
        productionEnd: bundle.productionEnd.toString(),
        deviceId: bundle.deviceId,
        issuanceId: bundle.issuanceId,
      },
      status: Number(status),
      statusLabel: Number(status) === 0 ? "Active" : "Cancelled",
      remaining: remaining.toString(),
      totalEnergyWh: totalEnergy.toString(),
      tokenURI: uri,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (
      message.includes("ERC721NonexistentToken") ||
      message.includes("nonexistent token") ||
      message.includes("invalid token ID")
    ) {
      return NextResponse.json({ error: `Token ${id} does not exist` }, { status: 404 });
    }
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
