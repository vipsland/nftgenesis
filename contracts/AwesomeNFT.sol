// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract AwesomeNFT is ERC1155, Ownable {

    string public name = "VIPSLAND GENESIS";
    string public notRevealedUri = "https://ipfs.vipsland.com/nft/collections/genesis/json/hidden.json";
    bool public revealed = false;
    mapping (uint256 => string) private _uris;
    string public symbol = "VLND";

    constructor() ERC1155(notRevealedUri) {
        _mint(msg.sender, 1, 1, "");
        _mint(msg.sender, 2, 1, "");
        _mint(msg.sender, 3, 1, "");
    }

    function reveal() public onlyOwner {
        revealed = true;
    }

    function mintByOwner(uint256 tokenId) public onlyOwner {
       _mint(msg.sender, tokenId, 1, "");
    }

    
    function uri(uint256) override public view returns (string memory) {
        if (revealed == false) {
            return notRevealedUri;
        }
        return (
            string(
                abi.encodePacked("https://ipfs.vipsland.com/nft/collections/genesis/json/", 
                "{id}", 
                ".json")
            )
        );
    }


}