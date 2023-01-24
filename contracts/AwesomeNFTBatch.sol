// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AwesomeNFTBatch is ERC1155Supply, Ownable {


    string public name = "VIPSLAND GENESIS";
    string public notRevealedUri = "https://ipfs.vipsland.com/nft/collections/genesis/json/hidden.json";
    bool public revealed = false;
    mapping (uint256 => string) private _uris;
    string public symbol = "VPSL";

    uint256 public constant NUM_TOTAL = 1000;
    uint256 public constant MAX_SUPPLY_FOR_TOKEN = 20009;
    
    using Counters for Counters.Counter;
    Counters.Counter public _tokenIdCounter;
    uint256 public counterTokenID;
    Counters.Counter public _mint_counter;

    uint256[] public tokenIds;

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

//added to test add to main contract
    function mintByOwner(uint256 tokenId) public onlyOnceCanBeMint(tokenId) onlyOwner {
       _mint(msg.sender, tokenId, 1, "");
    }

//added to test add to main contract
    modifier onlyOnceCanBeMint (uint256 tokenId) { //for security
        require(_totalSupply(tokenId) == 0, "Can mint only once!!!");
        _;
    }


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