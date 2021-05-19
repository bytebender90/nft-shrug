// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "../interfaces/IAggregator.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Exponential is Ownable {
    uint256 constant public decimals = 10**18;

    IAggregator public ETHUSDTAggregator;
    IAggregator public ETHSTMXAggregator;

    function calculatePrice(
        uint256 totalSupply,
        uint256 currency
    )   public
        view
        returns (uint256)
    {
        if(currency == 0)
            return  decimals / 10 ** 8 * 120048 * (totalSupply + 1) ** 2;

        if(currency == 1)
            return  decimals / 10 ** 8 * 120048 * (totalSupply + 1) ** 2 * decimals / uint256(ETHUSDTAggregator.latestAnswer()) / 10 ** 12;
            
        return  decimals / 10 ** 8 * 120048 * (totalSupply + 1) ** 2 * decimals / uint256(ETHSTMXAggregator.latestAnswer());
    }

    /**
     * @dev Owner can set ETH / USDT Aggregator contract
     * @param _addr Address of aggregator contract
     */
    function setETHUSDTAggregatorContract(address _addr) public onlyOwner {
        ETHUSDTAggregator = IAggregator(address(_addr));
    }

    /**
     * @dev Owner can set ETH / STMX Aggregator contract
     * @param _addr Address of aggregator contract
     */
    function setETHSTMXAggregatorContract(address _addr) public onlyOwner {
        ETHSTMXAggregator = IAggregator(address(_addr));
    }
}