// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../role/MinterRole.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title Shrug ERC-721 Token
 */
contract ShrugToken is MinterRole, ERC721 {
    using Strings for uint256;

    // Base URI
    string private baseURI;

    /// @notice max supply of token
    uint256 public constant maxSupply = 500;

    /// @notice total supply of token
    uint256 public totalSupply;

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
     * @dev Mint token function
     * @param to Address of owner
     */
    function mint(
        address to
    ) external onlyMinter {
        require(
            totalSupply < maxSupply,
            "ShrugToken: All tokens are minted"
        );
        totalSupply += 1;
        _mint(to, maxSupply + 1 - totalSupply);
    }
}