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
            "ShrugSale.setRecipients: Empty array is provided"
        );
        require(
            _recipients.length <= 50,
            "ShrugSale.setRecipients: Count of recipients can't exceed 50"
        );
        
        for(uint256 i = 0; i < _recipients.length; i++) {
            require(_recipients[i] != address(0), "ShrugSale.setRecipients: Invalid recipient address");
        }

        recipients = _recipients;

        emit UpdatedRecipients(_recipients);
    }

    /**
     * @dev Buy Function
     */
    function buy() external payable {
        require(
            totalSupply < maxSupply,
            "ShrugSale.buy: All tokens are minted"
        );

        uint256 price = getCurrentPrice();
        require(
            msg.value == price,
            "ShrugSale.buy: Value is not same as the price"
        );

        totalSupply++;
        token.mint(msg.sender, totalSupply);

        for(uint256 i = 0; i < recipients.length; i++) {
            (bool transferSuccess, ) = recipients[i].call{value: price / recipients.length}("");
            require(
                transferSuccess,
                "Auction._refundHighestBidder: failed to refund previous bidder"
            );
        }

        emit TokenBought(msg.sender, totalSupply, price);
    }

    /**
     * @dev Public get current price
     */
    function getCurrentPrice() public view returns (uint256) {
        return calculatePrice(totalSupply);
    }
}