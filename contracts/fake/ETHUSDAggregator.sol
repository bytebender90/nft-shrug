// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.0;

contract ETHUSDAggregator {
    int256 temp = 250729030969;

    function latestAnswer() external view returns (int256) {
        return temp;
    }

    function latestRoundData()
        external
        view
    returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    )
    {
        return (
            0,
            temp,
            0,
            0,
            0
        );
    }
}
