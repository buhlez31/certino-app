const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Network Specific Configurations
  const donId = process.env.DON_ID;
  const routerAddress = process.env.ROUTER_ADDRESS;
  const subscriptionId = process.env.SUBSCRIPTION_ID;
  const nftMinterAddress = process.env.NFT_MINTER_ADDRESS || "0x0000000000000000000000000000000000000000";
  const gasLimit = 300000;

  if (!donId || !routerAddress || !subscriptionId) {
    throw new Error("Missing required environment variables in .env");
  }

  // Read the JavaScript source code for the Chainlink Function
  const sourceCodePath = path.join(__dirname, "..", "functions", "ChainlinkRequest.js");
  const sourceCode = fs.readFileSync(sourceCodePath, "utf8");

  console.log("Deploying TreetinoOracleConsumer...");
  const OracleConsumer = await hre.ethers.getContractFactory("TreetinoOracleConsumer");
  const oracle = await OracleConsumer.deploy(
    routerAddress,
    donId,
    subscriptionId,
    gasLimit,
    sourceCode,
    nftMinterAddress
  );

  await oracle.waitForDeployment();
  const oracleAddress = await oracle.getAddress();
  console.log("TreetinoOracleConsumer deployed to:", oracleAddress);

  console.log("Deploying TreetinoKeeper...");
  const interval = 3600; // 1 hour in seconds
  const targetInstallationId = "DEFAULT_INSTALLATION_ID"; // Replace with your target ID

  const Keeper = await hre.ethers.getContractFactory("TreetinoKeeper");
  const keeper = await Keeper.deploy(oracleAddress, interval, targetInstallationId);

  await keeper.waitForDeployment();
  const keeperAddress = await keeper.getAddress();
  console.log("TreetinoKeeper deployed to:", keeperAddress);

  console.log("\nDeployment completed successfully!");
  console.log("-----------------------------------------");
  console.log(`Oracle Address: ${oracleAddress}`);
  console.log(`Keeper Address: ${keeperAddress}`);
  console.log("-----------------------------------------");
  console.log("Next Steps:");
  console.log("1. Add Oracle Address to your Chainlink Functions Subscription");
  console.log("2. Register the Keeper Address on the Chainlink Automation UI");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
