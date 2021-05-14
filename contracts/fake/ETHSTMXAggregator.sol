// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract ETHSTMXAggregator {
    int256 temp = 9373225713169;

    function latestAnswer() external view returns (int256) {
        return temp;
    }
}
