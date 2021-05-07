// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "../interfaces/IShrugToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IShrugToken.sol";
import "../curves/Exponential.sol";

/**
 * @title Shrug Sale Contract
 */
contract ShrugSale is Ownable, Exponential {

    /// @notice Event emitted only on construction. To be used by indexers
    event ShrugSaleDeployed();

    /// @notice Recipients update event
    event UpdatedRecipients(
        address[] recipients
    );

    /// @notice Token bought event
    event TokenBought(
        address buyer,
        uint256 tokenId,
        uint256 value
    );

    /// @notice addresses of recipients who received the funds
    address[] public recipients;

    /// @notice ERC721 NFT
    IShrugToken public token;

    /// @notice max supply of token
    uint256 public maxSupply = 500;

    /// @notice total supply of token
    uint256 public totalSupply;

    /**
     * @dev Constructor function
     * @param _token Token Instance
     */
    constructor(
        IShrugToken _token
    ) {
        token = _token;

        emit ShrugSaleDeployed();
    }

    /**
     * @dev Set recipients
     * @param _recipients array of recipients' address
     */
    function setRecipients(address[] memory _recipients) external onlyOwner {
        require(
            _recipients.length > 0,
            "ShrugSale: Empty array is provided"
        );
        require(
            _recipients.length <= 50,
            "ShrugSale: Count of recipients can't exceed 50"
        );
        
        for(uint256 i = 0; i < _recipients.length; i++) {
            require(_recipients[i] != address(0), "ShrugSale: Invalid recipient address");
        }

        recipients = _recipients;

        emit UpdatedRecipients(_recipients);
    }

    /**
     * @dev Buy Function
     * @param _count Count of tokens to buy
     */
    function buy(uint256 _count) external payable {
        require(
            _count < 100,
            "ShrugSale: Count should be less than 100"
        );
        require(
            totalSupply < maxSupply,
            "ShrugSale: All tokens are minted"
        );

        uint256 price = getPrice(_count);
        require(
            msg.value == price,
            "ShrugSale: Value is not same as the price"
        );

        for(uint256 i = 0; i < _count; i++) {
            totalSupply++;
            token.mint(msg.sender, totalSupply);
        }

        for(uint256 i = 0; i < recipients.length; i++) {
            (bool transferSuccess, ) = recipients[i].call{value: price / recipients.length}("");
            require(
                transferSuccess,
                "ShrugSale: failed to transfer"
            );
        }

        emit TokenBought(msg.sender, totalSupply, price);
    }

    /**
     * @dev Public get price
     * @param _count Count of tokens which wanna get the price of
     */
    function getPrice(uint256 _count) public view returns (uint256) {
        require(
            _count < 100,
            "ShrugSale: Count should be less than 100"
        );
        uint256 price;
        for(uint256 i = 0; i < _count; i++) {
            price += calculatePrice(totalSupply + i);
        }

        return price;
    }
}