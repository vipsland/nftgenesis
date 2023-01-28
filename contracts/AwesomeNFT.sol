// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AwesomeNFT is ERC1155, Ownable {


    string public name = "VIPSLAND";
    string public notRevealedUri = "https://ipfs.vipsland.com/nft/collections/genesis/json/hidden.json";
    bool public revealed = false;
    mapping (uint256 => string) private _uris;
    string public symbol = "VPSL";

    uint256 public constant NUM_TOTAL = 1000;
    uint256 public constant MAX_SUPPLY_FOR_TOKEN = 20009;
    uint16[] public intArr;

    using Counters for Counters.Counter;
    Counters.Counter public _tokenIdCounter;
    uint256 public counterTokenID;
    Counters.Counter public _mint_counter;

    uint256[] public minted;

    constructor() ERC1155(notRevealedUri) {

        intArr = new uint16[](MAX_SUPPLY_FOR_TOKEN/NUM_TOTAL);
        intArr[0]=4;
        
        for (uint i = 0; i < 9; i++) {
            mintFree();
        }

    }

     event Minted(uint256[] total);

     function callMint() public onlyOwner {

        for (uint i = 0; i < 100; i++) {
            mintFree();
        }

        emit Minted(minted);
       
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
        //string(abi.encodePacked(_baseURI, tokenURI))
        return (
            string(
                abi.encodePacked("https://ipfs.vipsland.com/nft/collections/genesis/json/", 
                "{id}", 
                ".json")
            )
        );
    }

    function random(uint number) public view returns(uint){
        // return uint(keccak256(abi.encodePacked(block.timestamp,block.difficulty,  
        // msg.sender))) % number;
        return uint(blockhash(block.number-1)) % number;
    }

    function raffle1stStage() internal returns(uint256){
        
        //gold supply = ID 1-200, silver supply = 201-2000, bronze = 2001-20000
        uint8 randnum = uint8(random(255));
        uint8 randval = uint8(random(MAX_SUPPLY_FOR_TOKEN/NUM_TOTAL)); //0 to 19

        if (randval == 0) {
            if (uint8(randnum % 9) == 1) {
                if (intArr[randval] == 96) {
                    randval = uint8(random(MAX_SUPPLY_FOR_TOKEN/NUM_TOTAL-1)+1);
                }
            } else  {
                randval = uint8(random(MAX_SUPPLY_FOR_TOKEN/NUM_TOTAL-1)+1);
            }
            //randval == 0  gold ticket
        }
        intArr[randval] = intArr[randval]+1;
        uint16 getval = intArr[randval]+1;

        return uint256(getval)+(uint16(randval)*NUM_TOTAL);

    }
    
    function mintFree() public onlyOwner {
        
        counterTokenID = _tokenIdCounter.current();

        uint256 tokenID = raffle1stStage();

        _mint(msg.sender, tokenID, 1, "");
        
        minted.push(tokenID);

        _tokenIdCounter.increment();

    }

}