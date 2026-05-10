const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Treetino Protocol - Full End-to-End Flow", function () {
  let oracle;
  let keeper;
  let nftMinter;
  let deployer;
  let mockRouter;

  const donId = "0x66756e2d706f6c79676f6e2d616d6f792d310000000000000000000000000000";
  const subscriptionId = 1234;
  const gasLimit = 300000;
  const sourceCode = "return Functions.encodeUint256(420);";

  before(async function () {
    [deployer] = await ethers.getSigners();

    // Deploy Mock Router
    const MockRouter = await ethers.getContractFactory("MockFunctionsRouter");
    mockRouter = await MockRouter.deploy();
    await mockRouter.waitForDeployment();

    // 1. Deploy the NFT Minter (represents the other developer's contract)
    const NFTMinter = await ethers.getContractFactory("MockNFTMinter");
    nftMinter = await NFTMinter.deploy();
    await nftMinter.waitForDeployment();

    // 2. Deploy Oracle Consumer
    const OracleConsumer = await ethers.getContractFactory("TreetinoOracleConsumer");
    // We use mockRouter to simulate the Chainlink Functions Router
    oracle = await OracleConsumer.deploy(
      await mockRouter.getAddress(),
      donId,
      subscriptionId,
      gasLimit,
      sourceCode,
      await nftMinter.getAddress()
    );
    await oracle.waitForDeployment();

    // 3. Deploy Keeper
    const Keeper = await ethers.getContractFactory("TreetinoKeeper");
    keeper = await Keeper.deploy(await oracle.getAddress(), 3600, "DEVICE_123");
    await keeper.waitForDeployment();
  });

  it("Step 1: Keeper determines upkeep is needed", async function () {
    // Fast forward time by 3601 seconds (just over 1 hour)
    await ethers.provider.send("evm_increaseTime", [3601]);
    await ethers.provider.send("evm_mine");

    const [upkeepNeeded, performData] = await keeper.checkUpkeep("0x");
    expect(upkeepNeeded).to.be.true;
    
    // The performData should be the ABI encoded string "DEVICE_123"
    const decodedId = ethers.AbiCoder.defaultAbiCoder().decode(["string"], performData)[0];
    expect(decodedId).to.equal("DEVICE_123");
  });

  it("Step 2: Keeper performs upkeep and triggers Oracle", async function () {
    // performUpkeep will call requestEnergyData on the Oracle.
    // Normally, the oracle makes a call to the Chainlink Router.
    // Since we set MockFunctionsRouter as the router, this will succeed.
    
    // Call performUpkeep with the performData obtained from checkUpkeep
    const [_, performData] = await keeper.checkUpkeep("0x");
    await expect(keeper.performUpkeep(performData)).not.to.be.reverted;
  });

  it("Step 3: Chainlink DON fulfills the request with energy data (e.g. 420 kWh)", async function () {
    // Simulate the Chainlink DON sending back the data (e.g., 420 kWh produced)
    const encodedResponse = ethers.AbiCoder.defaultAbiCoder().encode(["uint256"], [420]);
    const requestId = ethers.id("test-request-id");

    // The mock router calls handleOracleFulfillment on the Oracle Consumer
    await expect(mockRouter.fulfill(await oracle.getAddress(), requestId, encodedResponse, "0x"))
      .to.emit(oracle, "DataUpdated");

    // Verify the data was saved in the Oracle
    expect(await oracle.lastGenerationKwh()).to.equal(420);
  });

  it("Step 4: The NFT Minter is automatically triggered", async function () {
    // We check if the MockNFTMinter received the call successfully
    expect(await nftMinter.totalMinted()).to.equal(1);
    
    // The Oracle multiplies by 1000 to convert kWh to Wh bundleQuantity
    expect(await nftMinter.bundleQuantity()).to.equal(420000);
    
    // The timestamp should be the block timestamp of the fulfillment
    const lastTimestamp = await nftMinter.lastTimestamp();
    expect(lastTimestamp).to.be.greaterThan(0);
  });
});
