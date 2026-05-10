"use client";
import { ethers } from "ethers";
import abi from "@/abi/GreenWattCertificate.json";

const AMOY_CHAIN_ID_HEX = "0x13882"; // 80002

export class WalletNotFoundError extends Error {
  constructor() {
    super("MetaMask not detected. Install it and reload.");
  }
}

export class WrongNetworkError extends Error {
  constructor() {
    super("Switch MetaMask to Polygon Amoy and try again.");
  }
}

async function ensureAmoy() {
  const eth = (typeof window !== "undefined" && (window as any).ethereum) || null;
  if (!eth) throw new WalletNotFoundError();
  const current = await eth.request({ method: "eth_chainId" });
  if (current === AMOY_CHAIN_ID_HEX) return eth;
  try {
    await eth.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: AMOY_CHAIN_ID_HEX }],
    });
    return eth;
  } catch (err: any) {
    if (err?.code === 4902) {
      await eth.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: AMOY_CHAIN_ID_HEX,
            chainName: "Polygon Amoy",
            nativeCurrency: { name: "POL", symbol: "POL", decimals: 18 },
            rpcUrls: [
              process.env.NEXT_PUBLIC_AMOY_RPC_URL || "https://rpc-amoy.polygon.technology",
            ],
            blockExplorerUrls: ["https://amoy.polygonscan.com"],
          },
        ],
      });
      return eth;
    }
    throw new WrongNetworkError();
  }
}

export interface CancelResult {
  txHash: string;
  blockNumber: number;
  explorerUrl: string;
}

export async function cancelCertificate(
  tokenId: string | bigint,
  quantity: string | bigint,
  beneficiary: string,
): Promise<CancelResult> {
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  if (!contractAddress) {
    throw new Error("NEXT_PUBLIC_CONTRACT_ADDRESS is not set.");
  }
  if (!ethers.isAddress(beneficiary)) {
    throw new Error("Beneficiary must be a valid Ethereum address.");
  }
  const eth = await ensureAmoy();
  const provider = new ethers.BrowserProvider(eth);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);
  // Polygon Amoy enforces a minimum priority fee of 25 gwei. Default ethers
  // estimation undershoots; bump the tip explicitly to clear the floor.
  const minTip = 30_000_000_000n; // 30 gwei
  const feeData = await provider.getFeeData();
  const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas && feeData.maxPriorityFeePerGas > minTip
    ? feeData.maxPriorityFeePerGas
    : minTip;
  const maxFeePerGas = feeData.maxFeePerGas && feeData.maxFeePerGas > maxPriorityFeePerGas
    ? feeData.maxFeePerGas
    : maxPriorityFeePerGas * 2n;
  const tx = await contract.cancel(BigInt(tokenId), BigInt(quantity), beneficiary, {
    maxPriorityFeePerGas,
    maxFeePerGas,
  });
  const receipt = await tx.wait();
  if (!receipt) throw new Error("No receipt returned from cancel transaction.");
  return {
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
    explorerUrl: `https://amoy.polygonscan.com/tx/${receipt.hash}`,
  };
}
