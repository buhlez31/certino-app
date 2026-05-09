import "server-only";
import { ethers } from "ethers";
import abi from "@/abi/GreenWattCertificate.json";

export class MissingEnvError extends Error {
  constructor(name: string) {
    super(`Missing required server env var: ${name}`);
    this.name = "MissingEnvError";
  }
}

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new MissingEnvError(name);
  return v;
}

export function getReadContract() {
  const rpcUrl = requireEnv("SEPOLIA_RPC_URL");
  const address = requireEnv("CONTRACT_ADDRESS");
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  return new ethers.Contract(address, abi, provider);
}

export function getIssuerContract() {
  const rpcUrl = requireEnv("SEPOLIA_RPC_URL");
  const key = requireEnv("ISSUER_PRIVATE_KEY");
  const address = requireEnv("CONTRACT_ADDRESS");
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const issuer = new ethers.Wallet(key, provider);
  const contract = new ethers.Contract(address, abi, issuer);
  return { contract, issuer, provider };
}

export { abi };
