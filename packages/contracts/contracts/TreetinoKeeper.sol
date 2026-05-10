// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

interface ITreetinoOracle {
    function requestEnergyData(string[] calldata args) external returns (bytes32);
    function lastUpdateTimestamp() external view returns (uint256);
}

contract TreetinoKeeper is AutomationCompatibleInterface, Ownable {
    ITreetinoOracle public oracle;
    uint256 public interval;
    string public targetInstallationId;

    constructor(address _oracleAddress, uint256 _interval, string memory _targetInstallationId) Ownable(msg.sender) {
        oracle = ITreetinoOracle(_oracleAddress);
        interval = _interval;
        targetInstallationId = _targetInstallationId;
    }

    function setOracle(address _oracleAddress) external onlyOwner {
        oracle = ITreetinoOracle(_oracleAddress);
    }

    function setInterval(uint256 _interval) external onlyOwner {
        interval = _interval;
    }

    function checkUpkeep(
        bytes calldata /* checkData */
    ) external view override returns (bool upkeepNeeded, bytes memory performData) {
        upkeepNeeded = (block.timestamp - oracle.lastUpdateTimestamp()) > interval;
        // In a production environment, you might calculate start/end timestamps dynamically here
        performData = abi.encode(targetInstallationId);
    }

    function performUpkeep(bytes calldata performData) external override {
        require((block.timestamp - oracle.lastUpdateTimestamp()) > interval, "Upkeep not needed");

        string memory instId = abi.decode(performData, (string));
        
        // Build the arguments for the Chainlink Functions request
        string[] memory args = new string[](3);
        args[0] = instId;
        
        // Calculate timestamps dynamically based on the current block and interval
        uint256 endTimestamp = block.timestamp;
        uint256 startTimestamp = endTimestamp - interval;

        args[1] = Strings.toString(startTimestamp);
        args[2] = Strings.toString(endTimestamp);

        oracle.requestEnergyData(args);
    }
}
