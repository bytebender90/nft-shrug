// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "../interfaces/IShrugToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IShrugToken.sol";

/**
 * @title Shrug Sale Contract
 */
contract ShrugSale is Ownable {

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

    /// @notice Token sold event
    event TokenSold(
        address seller,
        uint256 tokenId,
        uint256 value
    );

    /// @notice addresses of recipients who received the funds
    address[] public recipients;

    /// @notice ERC721 NFT
    IShrugToken public token;

    /// @notice max supply of token
    uint256 public maxSupply = 200;

    /// @notice total supply of token
    uint256 public totalSupply;

    /// @notice token id of token
    uint256 public increasingTokenId;

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

    function buy() external payable {
        require(
            totalSupply < maxSupply,
            "ShrugSale.buy: All tokens are minted"
        );

        uint256 price = 100;

        token.mint(msg.sender, increasingTokenId);
        increasingTokenId++;
        totalSupply++;

        emit TokenBought(msg.sender, increasingTokenId, price);
    }

    function sell(uint256 tokenId) external {
        require(
            totalSupply > 0,
            "ShrugSale.sell: There is no token"
        );
        require(
            token.ownerOf(tokenId) == msg.sender,
            "ShrugSale.sell: Caller is not the owner"
        );

        token.burn(tokenId);
        totalSupply--;

        uint256 price = 100;

        (bool transferSuccess, ) =
            msg.sender.call{value: price}("");
        require(
            transferSuccess,
            "ShrugSale.sell: Failed to transfer"
        );

        emit TokenSold(msg.sender, tokenId, price);
    }
}