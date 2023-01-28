// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AwesomeNFTBatch is ERC1155Supply, Ownable {


    string public name = "VIPSLAND GENESIS";
    string public symbol = "VPSL";
    string public notRevealedUri = "https://ipfs.vipsland.com/nft/collections/genesis/json/hidden.json";
    bool public revealed = false;
    mapping (uint256 => string) private _uris;

    constructor() ERC1155(notRevealedUri) {

        
    }

     event Minted(uint256[] ids);



    function reveal() public onlyOwner {
        revealed = true;
    }

//added to test add to main contract
//https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/extensions/ERC1155Supply.sol
    function _totalSupply(uint256 id) public view virtual returns (uint256) {
        return totalSupply(id);
    }

//added to test add to main contract
    function _exists(uint256 id) public view returns (bool) {
        return exists(id);
    }

//manually mint and transfer start
    function mintByOwner(uint256 tokenId) public onlyOnceCanBeMinted(tokenId) onlyOwner {
       _mint(msg.sender, tokenId, 1, "");
    }

    function safeTransferFromByOwner(uint256 tokenId, address addr) public tokenExist(tokenId) onlyOwner {
       safeTransferFrom(msg.sender, addr, tokenId, 1, "");
    }


    modifier onlyOnceCanBeMinted (uint256 tokenId) { //for security
        require(totalSupply(tokenId) == 0, "Only once can be minted");
        _;
    }

    modifier tokenExist (uint256 tokenId) { //for security
        require(exists(tokenId), "Token is not exist");
        _;
    }
//manually mint and transfer end


    function mintNFTBatch(uint256[] memory ids, uint256[] memory amounts) public onlyOwner {
       _mintBatch(msg.sender, ids, amounts, "");
       emit Minted(ids);
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