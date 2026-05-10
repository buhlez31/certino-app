const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TreetinoChainlink", function () {
  let oracle;
  let keeper;
  let deployer;

  const donId = "0x66756e2d706f6c79676f6e2d616d6f792d310000000000000000000000000000";
  const routerAddress = "0xC22a79eBA640940ABB6dF0f7982cc119578E11De"; // Example
  const subscriptionId = 1234;
  const gasLimit = 300000;
  const sourceCode = "return Functions.encodeUint256(420);";
  const nftMinterAddress = "0x0000000000000000000000000000000000000000";

  before(async function () {
    [deployer] = await ethers.getSigners();

    const OracleConsumer = await ethers.getContractFactory("TreetinoOracleConsumer");
    oracle = await OracleConsumer.deploy(
      routerAddress,
      donId,
      subscriptionId,
      gasLimit,
      sourceCode,
      nftMinterAddress
    );
    await oracle.waitForDeployment();

    const Keeper = await ethers.getContractFactory("TreetinoKeeper");
    keeper = await Keeper.deploy(await oracle.getAddress(), 3600, "TEST_ID");
    await keeper.waitForDeployment();
  });

  it("should deploy correctly and set owners", async function () {
    expect(await oracle.owner()).to.equal(deployer.address);
    expect(await keeper.owner()).to.equal(deployer.address);
  });

  it("should indicate upkeep needed if interval passed", async function () {
    // We cannot easily test block.timestamp - lastUpdateTimestamp without mocking the oracle
    // since lastUpdateTimestamp is initialized to 0, block.timestamp is > 3600
    const [upkeepNeeded] = await keeper.checkUpkeep("0x");
    expect(upkeepNeeded).to.be.true;
  });
});
