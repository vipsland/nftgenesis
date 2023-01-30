// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract concat {
  function concatenate(
    string memory a,
    string memory b
  ) public pure returns (string memory) {
    return string(abi.encodePacked(a, ' ', b));
  }
}
