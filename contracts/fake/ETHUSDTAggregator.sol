// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract ETHUSDTAggregator {
    int256 temp = 250000000000000;

    function latestAnswer() external view returns (int256) {
        return temp;
    }
}
