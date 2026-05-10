// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

interface IGreenWattCertificate {
    function issue(
        address producer,
        uint256 bundleQuantity,
        uint256 faceValueWh,
        string calldata fuel,
        uint256 startTs,
        uint256 endTs,
        bytes32 deviceLabel,
        bytes32 issuanceId,
        string calldata uri
    ) external;
}

contract TreetinoOracleConsumer is FunctionsClient, Ownable {
    using FunctionsRequest for FunctionsRequest.Request;

    bytes32 public donId;
    uint64 public subscriptionId;
    uint32 public gasLimit;
    string public sourceCode;
    IGreenWattCertificate public nftMinter;

    uint256 public lastGenerationKwh;
    uint256 public lastUpdateTimestamp;

    event DataUpdated(bytes32 indexed requestId, uint256 generationKwh, uint256 timestamp);

    constructor(
        address router,
        bytes32 _donId,
        uint64 _subscriptionId,
        uint32 _gasLimit,
        string memory _sourceCode,
        address _nftMinter
    ) FunctionsClient(router) Ownable(msg.sender) {
        donId = _donId;
        subscriptionId = _subscriptionId;
        gasLimit = _gasLimit;
        sourceCode = _sourceCode;
        nftMinter = IGreenWattCertificate(_nftMinter);
    }

    function updateSourceCode(string memory _newSourceCode) external onlyOwner {
        sourceCode = _newSourceCode;
    }

    function setNFTMinter(address _nftMinter) external onlyOwner {
        nftMinter = IGreenWattCertificate(_nftMinter);
    }

    function requestEnergyData(
        string[] calldata args
    ) external returns (bytes32 requestId) {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(sourceCode);
        if (args.length > 0) {
            req.setArgs(args);
        }

        requestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donId
        );
    }

    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        if (err.length > 0) {
            revert(string(err));
        }

        lastGenerationKwh = abi.decode(response, (uint256));
        lastUpdateTimestamp = block.timestamp;

        // Trigger the NFT minting step if a minter is configured
        if (address(nftMinter) != address(0)) {
            nftMinter.issue(
                owner(),                                         // producer
                lastGenerationKwh * 1000,                        // bundleQuantity (kWh -> Wh)
                1,                                               // faceValueWh
                "Solar",                                         // fuel
                block.timestamp - 3600,                          // startTs (previous hour)
                block.timestamp,                                 // endTs
                keccak256("Treetino Device"),                    // deviceLabel
                keccak256(abi.encodePacked(block.timestamp, requestId)), // issuanceId
                "ipfs://bafybeibogusplaceholdercidforhackathondemo"      // uri
            );
        }

        emit DataUpdated(requestId, lastGenerationKwh, block.timestamp);
    }
}
