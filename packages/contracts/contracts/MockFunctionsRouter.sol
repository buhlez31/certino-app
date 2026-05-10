// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MockFunctionsRouter {
    event RequestSent(
        uint64 subscriptionId,
        bytes data,
        uint16 dataVersion,
        uint32 callbackGasLimit,
        bytes32 donId
    );

    function sendRequest(
        uint64 subscriptionId,
        bytes calldata data,
        uint16 dataVersion,
        uint32 callbackGasLimit,
        bytes32 donId
    ) external returns (bytes32) {
        emit RequestSent(subscriptionId, data, dataVersion, callbackGasLimit, donId);
        return keccak256(abi.encodePacked("test-request-id"));
    }

    function sendRequestToProposed(
        uint64 subscriptionId,
        bytes calldata data,
        uint16 dataVersion,
        uint32 callbackGasLimit,
        bytes32 donId
    ) external returns (bytes32) {
        emit RequestSent(subscriptionId, data, dataVersion, callbackGasLimit, donId);
        return keccak256(abi.encodePacked("test-request-id"));
    }

    function fulfill(
        address consumer,
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) external {
        (bool success, ) = consumer.call(
            abi.encodeWithSignature("handleOracleFulfillment(bytes32,bytes,bytes)", requestId, response, err)
        );
        require(success, "Fulfill failed");
    }
}
