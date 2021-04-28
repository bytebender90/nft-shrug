// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../role/MinterRole.sol";

/**
 * @title Shrug ERC-721 Token
 */
contract ShrugToken is MinterRole, ERC721 {
    // Base URI
    string private baseURI;

    /**
     * @dev Constructor function
     * @param _name name of the token
     * @param _symbol symbol of the token
     * @param baseURI_ base uri of the token
     */
    constructor(
        string memory _name,
        string memory _symbol,
        string memory baseURI_
    ) ERC721(_name, _symbol) {
        _setBaseURI(baseURI_);
    }

    /**
     * @dev Internal Function returns base URI.
     */
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    /**
     * @dev Public Function returns base URI.
     */
    function getBaseURI() public view returns (string memory) {
        return baseURI;
    }

    /**
     * @dev Internal function to set the base URI for all token IDs.
     * @param baseURI_ Base uri of the token
     */
    function _setBaseURI(string memory baseURI_) internal virtual {
        baseURI = baseURI_;
    }

    /**
     * @dev Mint function
     * @param to Address of owner
     * @param tokenId Id of the token
     */
    function mint(
        address to,
        uint256 tokenId
    ) external onlyMinter {
        _mint(to, tokenId);
    }
}