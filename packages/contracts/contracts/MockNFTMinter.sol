// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MockNFTMinter {
    uint256 public totalMinted;
    uint256 public bundleQuantity;
    uint256 public lastTimestamp;

    event NFTMinted(uint256 bundleQuantity, uint256 timestamp);

    function issue(
        address producer,
        uint256 _bundleQuantity,
        uint256 faceValueWh,
        string calldata fuel,
        uint256 startTs,
        uint256 endTs,
        bytes32 deviceLabel,
        bytes32 issuanceId,
        string calldata uri
    ) external {
        totalMinted += 1;
        bundleQuantity = _bundleQuantity;
        lastTimestamp = endTs;
        emit NFTMinted(_bundleQuantity, endTs);
    }
}
