// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Valuation {
    mapping(bytes32 => uint256) public valuations;

    event ValuationSet(address indexed contractAddress, uint256 indexed tokenId, uint256 value);

    function setValuation(address contractAddress, uint256 tokenId, uint256 value) public {
        bytes32 key = keccak256(abi.encodePacked(contractAddress, tokenId));
        valuations[key] = value;
        emit ValuationSet(contractAddress, tokenId, value);
    }

    function getValuation(address contractAddress, uint256 tokenId) public view returns (uint256) {
        bytes32 key = keccak256(abi.encodePacked(contractAddress, tokenId));
        return valuations[key];
    }
}