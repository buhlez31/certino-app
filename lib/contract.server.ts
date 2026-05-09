import "server-only";
import { ethers, FetchRequest } from "ethers";
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

function buildProvider(rpcUrl: string): ethers.JsonRpcProvider {
  const fetchReq = new FetchRequest(rpcUrl);
  fetchReq.timeout = 15_000;
  fetchReq.retryFunc = async (_req, resp, attempt) => {
    if (attempt >= 2) return false;
    return resp.statusCode === 0 || resp.statusCode >= 500;
  };
  return new ethers.JsonRpcProvider(fetchReq);
}

export function getReadContract() {
  const rpcUrl = requireEnv("AMOY_RPC_URL");
  const address = requireEnv("CONTRACT_ADDRESS");
  const provider = buildProvider(rpcUrl);
  return new ethers.Contract(address, abi, provider);
}

export function getIssuerContract() {
  const rpcUrl = requireEnv("AMOY_RPC_URL");
  const key = requireEnv("ISSUER_PRIVATE_KEY");
  const address = requireEnv("CONTRACT_ADDRESS");
  const provider = buildProvider(rpcUrl);
  const issuer = new ethers.Wallet(key, provider);
  const contract = new ethers.Contract(address, abi, issuer);
  return { contract, issuer, provider };
}

export { abi };
