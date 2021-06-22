// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.0;

/**
 * @title Shrug ERC-721 Token Interface
 */
interface IShrugToken {
    /**
     * @dev Public Function returns base URI.
     */
    function getBaseURI() external view returns (string memory);

    /**
     * @dev Mint function
     * @param to Address of owner
     */
    function mint(
        address to
    ) external;

    /**
     * @dev See {IERC721-ownerOf}.
     */
    function ownerOf(uint256 tokenId) external view returns (address);

    /**
     * @dev Burn token function
     * @param tokenId Id of the token
     */
    function burn(
        uint256 tokenId
    ) external;

    function totalSupply() external view returns (uint256);
    function maxSupply() external view returns (uint256);
}