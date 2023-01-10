// contracts/access-control/Auth.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

import "hardhat/console.sol";

contract PRT is ERC1155, Ownable, ReentrancyGuard {

    using SafeMath for uint256;
    
    using Counters for Counters.Counter;

    Counters.Counter public _tokenPRTID_index;
    Counters.Counter public _win_counter;
    Counters.Counter public _tokenIdCounter;

    address proxyRegistryAddress;

    uint256 public constant NUM_TOTAL = 1000;
    uint256 public constant MAX_SUPPLY_FOR_TOKEN = 20000;


    uint256 public constant PRTID = 20000;
    uint256 public constant MAX_BUYABLE_AMOUNT = 100;
    uint256 public constant MAX_PRT_INDEX = 180000;
    uint256 public constant MAX_SUPPLY_PRT = 160000;//160000 + 20000
    uint256 public constant NUM_TOTAL_FOR_PRT = 10000;

    

// NORMAL 20001-160000
     uint256 public constant MAX_SUPPLY_FOR_PRT_TOKEN = 140000;
     uint256 public constant EACH_RAND_SLOT_NUM_TOTAL_FOR_PRT = 10000;
     uint256 public numIssuedForNormalUser  = 0;
     uint256 public constant STARTINGIDFORPRT = 20001;
     uint256[] public intArrPRT;

// INTERNAL TEAM - 160001-180000
    uint256 public constant MAX_SUPPLY_FOR_INTERNALTEAM_TOKEN = 20000;
    uint256 public constant EACH_RAND_SLOT_NUM_TOTAL_FOR_INTERNALTEAM = 1000;
    uint256 public numIssuedForInternalTeamIDs  = 0;
    uint256 public constant STARTINGIDFORINTERNALTEAM = 160001;
    uint256[] public intArrPRTInternalTeam;


 //AIRDROP8888 - 180001-188888
    uint256 public constant MAX_SUPPLY_FOR_AIRDROP_TOKEN = 8888;
    uint256 public constant EACH_RAND_SLOT_NUM_TOTAL_FOR_AIRDROP = 1111;
    uint256 public numIssuedForAIRDROP  = 0;
    uint256 public constant  STARTINGIDFORAIRDROP = 180001;
    uint256[] public intArrPRTAIRDROP;


    uint public constant PRICE_PRT = 0.01 ether;

    bool public presalePRT = false;
    bool public mintIsOpen = false;

    uint public idx = 0;

    bytes32 public root;
    
    uint256 public counterTokenID;
    mapping(address => uint256) userBalances;
    mapping (uint256 => string) private _uris;

    struct StatusPRT {
        uint256 mpid;
        uint256 qty;
    }

    struct Token {
        uint256 tokenID;
        uint tokenCount;
        bool isWinner;
        bool isMember;
        uint256[] tokenPRTIDs;
    }

    // Mapping from token ID to account balances
    mapping(address => Token) public _balancesnft;
 
     // Public Raffles Ticket (PRT) : 160,000
    // ID #20,001 to ID #180,000
    mapping(address => uint256[]) public userPRTs;
    mapping(uint => address) public prtPerAddress;


    uint16[] public intArr;

    constructor() 
        ERC1155(
            "https://ipfs.vipsland.com/nft/collections/genesis/json/{id}.json" //default way
        ) ReentrancyGuard() // A modifier that can prevent reentrancy during certain functions
    {

        intArr = new uint16[](MAX_SUPPLY_FOR_TOKEN/NUM_TOTAL);
        intArr[0]=3;
        
        //for normal user
        intArrPRT = new uint256[](MAX_SUPPLY_FOR_PRT_TOKEN/EACH_RAND_SLOT_NUM_TOTAL_FOR_PRT);

        //for internal team
        intArrPRTInternalTeam = new uint256[](MAX_SUPPLY_FOR_INTERNALTEAM_TOKEN/EACH_RAND_SLOT_NUM_TOTAL_FOR_INTERNALTEAM);

        //for airdrop
        intArrPRTAIRDROP = new uint256[](MAX_SUPPLY_FOR_AIRDROP_TOKEN/EACH_RAND_SLOT_NUM_TOTAL_FOR_AIRDROP);

    }

    function uri(uint256 tokenId) override public view returns (string memory) {
        return(_uris[tokenId]);
    }    

    function setTokenUri(uint256 tokenId, string memory uri_to_update) public onlyOwner {
        require(bytes(_uris[tokenId]).length == 0, "Cannot set uri twice"); //can do it once once
        _uris[tokenId] = uri_to_update; 
    }


    event DitributePRTs(address indexed from, uint256[] list); 
    event RTWinnerTokenID(uint index, uint winnerTokenPRTID, uint counter);
    event TransferFromToContract(address from, uint amount);
    event RTWinnerAddress(address winner, uint winnerTokenPRTID);
    event LastIntArrStore(uint index, uint indexArr);
    event EmitmintIsOpen(string msg);
    event Minter(address indexed from, uint256 tokenID, uint256 counterTokenID, uint price); 
    event TestGetNextNONMPIDEvent(address acc, uint256 initID, uint256 _qnt);


    // ---modifiers--- do not remove this function
    modifier isValidMerkleProof(bytes32[] calldata _proof) {//we need this magic to be sure accounts is holder of PRT
        require(MerkleProof.verify(
            _proof,
            root,
            keccak256(abi.encodePacked(msg.sender))
            ) == true, "Not allowed origin");
        _;
    }

    modifier isNotOwnedNFT() {
        require(balanceOf(msg.sender, _balancesnft[msg.sender].tokenID) == 0, "Mint only once");
        _;
    }

    modifier onlyAccounts () { //for security
        require(msg.sender == tx.origin, "Not allowed origin");
        _;
    }
    
    modifier mintIsOpenModifier () {
        require(mintIsOpen, "Mint is not open");
        _;
    }


    modifier presalePRTIsActiveAndNotOver () {
        require(presalePRT, "Presale PRT is not open.");//needs be true, is active (not paused)
        require(!mintIsOpen, "Presale PRT is done."); //is not over
        _;
    }

   

    function togglePreSalePRT() public onlyOwner {
        presalePRT = !presalePRT;
    }

    function toggleMintIsOpen() public onlyOwner {
        mintIsOpen = !mintIsOpen; //only owner can toggle presale
    }

    function setWinnerToggle(address addr) public onlyOwner {
        _balancesnft[addr].isWinner = !_balancesnft[addr].isWinner;
    }

    function setMemberToggle(address addr) public onlyOwner {
        _balancesnft[addr].isMember = !_balancesnft[addr].isMember;
    }

    function createXRAND(uint number)  internal view returns(uint)  {
        //number = 17, 0 - 16 <- this is what we want
        return uint(blockhash(block.number-1)) % number;
    }

    function getAddrFromPRTID (uint _winnerTokenPRTID) internal view returns (address) {
        return prtPerAddress[_winnerTokenPRTID];
    }

    
    function getTotalPRT() public view returns(uint){
        return _tokenPRTID_index.current();
    }
    
    function getTotalMinted() public view returns(uint){
        return _tokenIdCounter.current();
    }


    function random(uint number) public view returns(uint){
        // return uint(keccak256(abi.encodePacked(block.timestamp,block.difficulty,  
        // msg.sender))) % number;
        return uint(blockhash(block.number-1)) % number;
    }

    function isWinner(address addr) public view onlyAccounts returns(bool){
        return _balancesnft[addr].isWinner;
    }

    function _concatenate(string memory a, string memory b) private pure returns (string memory){
        return string(abi.encodePacked(a,' ',b));
    } 


    function publicSaleMint() external payable onlyAccounts isNotOwnedNFT {

        require(msg.sender != address(0), "Sender is not exist");
        
        require(_balancesnft[msg.sender].isWinner == true, "You are not a winner");

        counterTokenID = _tokenIdCounter.current();

        require(counterTokenID >= 0 && counterTokenID < NUM_TOTAL*10, "Error: exceeded max supply 10000");

        uint256 tokenID = getNextMPID();

        require(tokenID >= 5 && tokenID <= MAX_SUPPLY_FOR_TOKEN, "Error: tokenID < 5 OR tokenID > MAX_SUPPLY_FOR_TOKEN");

        mintFree(tokenID);
        
        _tokenIdCounter.increment();

    }

    function mintFree(uint256 tokenID) internal onlyAccounts nonReentrant {
        _mint(msg.sender, tokenID, 1, "");
        _balancesnft[msg.sender].tokenID = tokenID;

        emit Minter(msg.sender, tokenID, counterTokenID, 0);//free minted

    }

   

    function balanceOfNFTByAddress()  public view onlyAccounts  returns (uint256) {
        require(msg.sender != address(0), "Sender is not exist");
        
        require(_balancesnft[msg.sender].isWinner == true, "Sorry, you are not allowed to access this operation");
        
        // Mapping from token ID to account balances
        return balanceOf(msg.sender, _balancesnft[msg.sender].tokenID);
    }


    function getNextMPID() internal returns(uint256){
        
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
    
    function _setStartIdx(uint i) private onlyOwner {
        idx = i; //only owner can toggle presale
    }

//call 10 times to geenrate 10000 lucky mps
    function sendMP() public payable onlyAccounts onlyOwner mintIsOpenModifier {
        uint xrand = createXRAND(17);
        _win_counter.increment();
        uint counter = _win_counter.current();

        if (counter <= 10) {

            for (uint i = idx; i < 1000*counter; i++) {
                uint24 _winnerTokenPRTID = uint24(PRTID + 1 + xrand + uint24(uint32((168888*i)/10000)));  //updatede here 
                address winneraddr = getAddrFromPRTID(_winnerTokenPRTID);
                if (winneraddr != address(0)) {
                    _balancesnft[msg.sender].isWinner = true;
                    _balancesnft[msg.sender].tokenPRTIDs.push(_winnerTokenPRTID);
                    emit RTWinnerAddress(winneraddr, _winnerTokenPRTID); //this needs to be 10000+i <- and i needs to be random also, 1st stage sale
                }
                emit RTWinnerTokenID(i, _winnerTokenPRTID, counter);//in case to track all winer tickets in logs
            }
            _setStartIdx(1000*counter);
            

        }

       
    }

     function intArrIterate() public onlyAccounts onlyOwner mintIsOpenModifier {

        for (uint i=0; i < intArr.length; i++) {
            emit LastIntArrStore(i, intArr[i]); //we need this for 2nd stage sale
        }
    
    }

     function perAccountPRT (address account) public view returns(uint)  {
        return uint8(userPRTs[account].length);
    }
    
    function perAccountLuckTokenPRTID (address account) public view returns(uint256[] memory)  {
        return _balancesnft[account].tokenPRTIDs;
    }


     function buyPRT (address account, uint8 _amount_wanted_able_to_get) external payable onlyAccounts presalePRTIsActiveAndNotOver nonReentrant {
        require(account != owner(), "Owner of contract can not buy PRT");
        require(msg.sender == account, "Only allowed for caller");
        require(presalePRT, "Sale PRT is Not Open");
        require(_amount_wanted_able_to_get > 0, "Amount buyable needs to be greater than 0");

        uint8 _presaleClaimedAmount = uint8(userPRTs[account].length);

        if (_presaleClaimedAmount == 0) {
            require(_amount_wanted_able_to_get <= MAX_BUYABLE_AMOUNT, "You can't buy so much tokens");
        }
       
        require(_presaleClaimedAmount < MAX_BUYABLE_AMOUNT, "You have exceeded 100 raffle tickets limit");


        if (_amount_wanted_able_to_get + _presaleClaimedAmount > MAX_BUYABLE_AMOUNT) {
            _amount_wanted_able_to_get = uint8(MAX_BUYABLE_AMOUNT - _presaleClaimedAmount);
        }

        uint weiBalanceWallet = msg.value;

        require(weiBalanceWallet >= PRICE_PRT, "Min 0.01 ether");

        require(PRICE_PRT * _amount_wanted_able_to_get <= weiBalanceWallet, "Insufficient funds");

        uint latestprtIndex = _tokenPRTID_index.current() + PRTID + _amount_wanted_able_to_get;

        if (latestprtIndex > MAX_PRT_INDEX) {  
            _amount_wanted_able_to_get = uint8(MAX_PRT_INDEX - _tokenPRTID_index.current() - PRTID); 
        }

        //after recalc _amount_wanted_able_to_get, check again:
        require(PRICE_PRT * _amount_wanted_able_to_get <= weiBalanceWallet, "Insufficient funds");

        uint256 the_last_index_wanted = _tokenPRTID_index.current() + _amount_wanted_able_to_get + PRTID;
        require(the_last_index_wanted <= MAX_PRT_INDEX, "The Last ID PRT token is exceeded MAX_PRT_INDEX");    

        //pay first to owner of contract 
        payable(owner()).transfer(PRICE_PRT * _amount_wanted_able_to_get);// bulk send money from sender to owner
        emit TransferFromToContract(msg.sender, PRICE_PRT * _amount_wanted_able_to_get);

       
        for (uint i = 0; i < _amount_wanted_able_to_get; i++) {
           distributePRTInternal();
        }
        emit DitributePRTs(msg.sender, userPRTs[msg.sender]);
        
        if (_tokenPRTID_index.current() == MAX_SUPPLY_PRT) {
            mintIsOpen = true; //toggle presale is done
            emit EmitmintIsOpen('Presale PRT is done.');
            // console.log("Presale PRT is DONE!");
        } else {
            emit EmitmintIsOpen('Presale PRT is not done yet.');

        }

     }


    function distributePRTInternal() internal { 
        _tokenPRTID_index.increment();
        uint256 tokenPRTID = _tokenPRTID_index.current() + PRTID;
        
        //mint nft  "VIPSLAND GENESIS" PRT
        userPRTs[msg.sender].push(tokenPRTID);
        prtPerAddress[tokenPRTID] = msg.sender;
    }


    function testForAIRDROP(address acc, uint256 qty) public {
        //AIRDROP8888 - 180001-188888
        (uint256 initID, uint256 _qnt, uint256 _numIssued, uint8 _randval) = getNextNONMPID(qty, STARTINGIDFORAIRDROP, numIssuedForAIRDROP, MAX_SUPPLY_FOR_AIRDROP_TOKEN, EACH_RAND_SLOT_NUM_TOTAL_FOR_AIRDROP, intArrPRTAIRDROP); 
        numIssuedForAIRDROP = _numIssued;
        intArrPRTAIRDROP[_randval] = intArrPRTAIRDROP[_randval] + _qnt;
        emit TestGetNextNONMPIDEvent(acc, initID, _qnt);
    }

    function testForInternalTeam(address acc, uint256 qty) public {
        //INTERNAL TEAM - 160001-180000
        (uint256 initID, uint256 _qnt, uint256 _numIssued, uint8 _randval) = getNextNONMPID(qty, STARTINGIDFORINTERNALTEAM, numIssuedForInternalTeamIDs, MAX_SUPPLY_FOR_INTERNALTEAM_TOKEN, EACH_RAND_SLOT_NUM_TOTAL_FOR_INTERNALTEAM, intArrPRTInternalTeam); 
        numIssuedForInternalTeamIDs = _numIssued;
        intArrPRTInternalTeam[_randval] = intArrPRTInternalTeam[_randval] + _qnt;
        emit TestGetNextNONMPIDEvent(acc, initID, _qnt);
    }
    
    function testForNomalUser(address acc, uint256 qty) public {
        //NORMAL 20001-160000
        (uint256 initID, uint256 _qnt, uint256 _numIssued, uint8 _randval) = getNextNONMPID(qty, STARTINGIDFORPRT, numIssuedForNormalUser, MAX_SUPPLY_FOR_PRT_TOKEN, EACH_RAND_SLOT_NUM_TOTAL_FOR_PRT, intArrPRT); 
        numIssuedForNormalUser = _numIssued;
        intArrPRT[_randval] = intArrPRT[_randval] + _qnt;
        emit TestGetNextNONMPIDEvent(acc, initID, _qnt);
    }

    function getNextNONMPID(uint256 qty, uint256  initialNum, uint256 numIssued, uint256 max_supply_token, uint256 each_rand_slot_num_total, uint256[] memory intArray) public view returns(uint256, uint256, uint256, uint8){
       console.log('numIssued:::',numIssued, 'max_supply_token', max_supply_token);
       require(numIssued < max_supply_token, "all MPs issued");
 
       //uint8 randnum = uint8(random(255)); //0 to 254
 
       uint8 randval = uint8(random(max_supply_token/each_rand_slot_num_total)); //0 to 15
       uint8 iCheck = 0;
       uint8 randvalChk = randval;

	/** chk and reassign available IDs left from randomization */
       while (iCheck != (max_supply_token/each_rand_slot_num_total)) {
          if (intArray[randval] == each_rand_slot_num_total) {

             if (randvalChk == ((max_supply_token/each_rand_slot_num_total)-1)) {
                randvalChk = 0;
             } else{
		        randvalChk++;
             }
             randval++;

          } else{
             break;
          }
          iCheck++;
       }
  	/** end chk and reassign IDs */
 
 
       uint256 mpid = (intArray[randval])+(uint16(randval)*each_rand_slot_num_total);

       if (intArray[randval]+qty > each_rand_slot_num_total) {
           qty = each_rand_slot_num_total - intArray[randval];
       }
    //    intArray[randval] = intArray[randval]+qty;

       console.log('intArray[randval]:::', intArray[randval], randval);

       numIssued = qty + numIssued;
       return (mpid+initialNum, qty, numIssued, randval);
   }


    function withdraw () public payable onlyOwner {
        payable(msg.sender).transfer(address(this).balance);//This function allows the owner to withdraw from the contract

    }

      /**
     * Override isApprovedForAll to whitelist user's OpenSea proxy accounts to enable gas-less listings.
     */
    function isApprovedForAll(address owner, address operator)
        override
        public
        view
        returns (bool)
    {
        // Whitelist OpenSea proxy contract for easy trading.
        ProxyRegistry proxyRegistry = ProxyRegistry(proxyRegistryAddress);
        if (address(proxyRegistry.proxies(owner)) == operator) {
            return true;
        }

        return super.isApprovedForAll(owner, operator);
    }

}



/**
  @title An OpenSea delegate proxy contract which we include for whitelisting.
  @author OpenSea
*/
contract OwnableDelegateProxy {}

/**
  @title An OpenSea proxy registry contract which we include for whitelisting.
  @author OpenSea
*/
contract ProxyRegistry {
    mapping(address => OwnableDelegateProxy) public proxies;
}

