//contracts/access-control/Auth.sol
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

import "hardhat/console.sol";

contract Vipsland is ERC1155Supply, Ownable, ReentrancyGuard {

    //main
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    mapping(address => uint256) userBalances;

    //MP
    uint256 public constant PRTID = 20000;
    uint256 public constant MAX_SUPPLY_MP = 20000;
    uint256 public constant NUM_TOTAL_FOR_MP = 200;
    uint256 public constant NUM_TOTAL = 1000;
    uint public xrand = 18;
    Counters.Counter public _counter_for_generatelucky_mp;
    uint64 public numIssuedForMP  = 4;
    uint16[] public intArr;

    //NONMP 
    mapping(address => uint256) public userNONMPs;

    uint256 public constant MAX_PRT_AMOUNT_PER_ACC = 100;
    uint256 public constant  MAX_PRT_AMOUNT_PER_ACC_PER_TRANSACTION = 35;

    //NONMP NORMAL 20001-160000
    uint public constant PRICE_PRT = 0.05 ether;
    uint256 public constant MAX_SUPPLY_FOR_PRT_TOKEN = 140000;
    uint256 public constant EACH_RAND_SLOT_NUM_TOTAL_FOR_PRT = 10000;
    uint256 public numIssuedForNormalUser  = 0;
    uint256 public constant STARTINGIDFORPRT = 20001;
    uint256[] public intArrPRT;

    //NONMP INTERNAL TEAM - 160001-180000
    uint public constant PRICE_PRT_INTERNALTEAM = 0 ether;
    uint256 public constant MAX_SUPPLY_FOR_INTERNALTEAM_TOKEN = 20000;
    uint256 public constant EACH_RAND_SLOT_NUM_TOTAL_FOR_INTERNALTEAM = 1000;
    uint256 public numIssuedForInternalTeamIDs  = 0;
    uint256 public constant STARTINGIDFORINTERNALTEAM = 160001;
    uint256[] public intArrPRTInternalTeam;


    //NONMP AIRDROP8888 - 180001-188888
    uint public constant PRICE_PRT_AIRDROP = 0 ether;
    uint256 public constant MAX_SUPPLY_FOR_AIRDROP_TOKEN = 8888;
    uint256 public constant EACH_RAND_SLOT_NUM_TOTAL_FOR_AIRDROP = 1111;
    uint256 public numIssuedForAIRDROP  = 0;
    uint256 public constant  STARTINGIDFORAIRDROP = 180001;
    uint256[] public intArrPRTAIRDROP;

    //toggle start
    bool public presalePRT = false;
    bool public mintIsOpen = false;

    function togglePreSalePRT() public onlyOwner {
        presalePRT = !presalePRT;
    }

    function toggleMintIsOpen() public onlyOwner {
        mintIsOpen = !mintIsOpen; //only owner can toggle presale
    }
    //toggle end

    // events start
    event DitributePRTs(address indexed acc, uint256[] list); 
    event MPWinnerTokenID(address indexed acc, uint winnerTokenPRTID);
    event mintNONMPIDEvent(address indexed acc, uint256 initID, uint256 _qnt);
    // events end

    constructor() 
        ERC1155(
            "https://ipfs.vipsland.com/nft/collections/genesis/json/{id}.json" //default way
        ) ReentrancyGuard() //A modifier that can prevent reentrancy during certain functions
    {
        //for mp
        intArr = new uint16[](MAX_SUPPLY_MP/NUM_TOTAL);
        intArr[0]=3;
        
        //for normal user
        intArrPRT = new uint256[](MAX_SUPPLY_FOR_PRT_TOKEN/EACH_RAND_SLOT_NUM_TOTAL_FOR_PRT);

        //for internal team
        intArrPRTInternalTeam = new uint256[](MAX_SUPPLY_FOR_INTERNALTEAM_TOKEN/EACH_RAND_SLOT_NUM_TOTAL_FOR_INTERNALTEAM);

        //for airdrop
        intArrPRTAIRDROP = new uint256[](MAX_SUPPLY_FOR_AIRDROP_TOKEN/EACH_RAND_SLOT_NUM_TOTAL_FOR_AIRDROP);
   
   }

    modifier onlyAccounts () { 
        require(msg.sender == tx.origin, "Not allowed origin");
        _;
    }
    
    modifier onlyForCaller (address  _account) { 
        require(msg.sender == _account, "Only allowed for caller");
        _;
    }

    modifier mintIsOpenModifier () {
        require(mintIsOpen, "Mint is not open");
        _;
    }
    
    function random(uint number) public view returns(uint){
        //return uint(keccak256(abi.encodePacked(block.timestamp,block.difficulty,  
        //msg.sender))) % number;
        return uint(blockhash(block.number-1)) % number;
    }

    // function balanceOfNFTByAddress()  public view onlyAccounts  returns (uint256) {
    //     require(msg.sender != address(0), "Sender is not exist");
        
    //     require(_balancesnft[msg.sender].isWinner == true, "Sorry, you are not allowed to access this operation");
        
    //     //Mapping from token ID to account balances
    //     return balanceOf(msg.sender, _balancesnft[msg.sender].tokenID);
    // }

    //  function intArrIterate() public onlyAccounts onlyOwner mintIsOpenModifier {

    //     for (uint i=0; i < intArr.length; i++) {
    //         emit LastIntArrStore(i, intArr[i]); //we need this for 2nd stage sale
    //     }
    
    // }

    //clean code from here:


    //sendMP start
    function getNextMPID() internal returns(uint256){
        require(numIssuedForMP < MAX_SUPPLY_MP, "all MPs issued.");
        //gold supply = ID 1-200, silver supply = 201-2000, bronze = 2001-20000
        //uint8 randnum = uint8(random(255)); //0 to 254
    
        uint8 randval = uint8(random(MAX_SUPPLY_MP/NUM_TOTAL_FOR_MP)); //0 to 199
    
    
        /** chk and reassign available IDs left from randomization */
        uint8 iCheck = 0;
        uint8 randvalChk = randval;

        while (iCheck != (MAX_SUPPLY_MP/NUM_TOTAL_FOR_MP)) {
    
            if (intArr[randval] == NUM_TOTAL_FOR_MP) {

                if(randvalChk == ((MAX_SUPPLY_MP/NUM_TOTAL_FOR_MP)-1)) {
                    randvalChk = 0;
                } else{
                    randvalChk++;
                }
            randval++;

            } else {
                break;
            }
            iCheck++;

        }
        /** end chk and reassign IDs */
        uint256 mpid;
    
        if (intArr[randval] < 100) { //intArr[0] = 3; should be placed on top of global variable declaration
            mpid = (intArr[randval]*2)+(uint16(randval)*NUM_TOTAL_FOR_MP);
        }else{
            
            if (randval == 0 && intArr[randval] == (MAX_SUPPLY_MP/NUM_TOTAL_FOR_MP)) {
                intArr[randval] = 102;
            }
            mpid = (intArr[randval]-100)*2+1+(uint16(randval)*NUM_TOTAL_FOR_MP);
        }
    
        intArr[randval] = intArr[randval]+1;
        numIssuedForMP++;
        return mpid;
    }

    
    function createXRAND(uint number)  internal view returns(uint)  {
        //number = 17, 0 - 16 <- this is what we want
        return uint(blockhash(block.number-1)) % number;
    }

    mapping(uint256 => address) public prtPerAddress;

    function getAddrFromNONMPID (uint _winnerTokenNONMPID) internal view returns (address) {
        return prtPerAddress[_winnerTokenNONMPID];
    }

    uint public idx = 0;
    //call 10 times
    function sendMP() public payable onlyAccounts onlyOwner mintIsOpenModifier {
        if (xrand == 18) {
            xrand = createXRAND(17);
        }
        _counter_for_generatelucky_mp.increment();
        uint counter = _counter_for_generatelucky_mp.current();

        //you can not call at once 10000, call 10 times
        if (counter <= 10) {
            for (uint i = idx; i < 1000*counter; i++) {
                uint24 _winnerTokenNONMPID = uint24(PRTID + 1 + xrand + uint24(uint32((168888*i)/10000)));  //updatede here 
                address winneraddr = getAddrFromNONMPID(_winnerTokenNONMPID);
                if (winneraddr != address(0)) {
                     uint256 tokenID = getNextMPID();
                     //mint and transfer to winner
                     _mint(msg.sender, tokenID, 1, "");
                     safeTransferFrom(msg.sender, winneraddr, tokenID, 1, "");
                     emit MPWinnerTokenID(winneraddr,  tokenID);
                }
            }
            idx = 1000*counter;
         }
    }
    //sendMP end

    //NONMP mint start
    function _concatenate(string memory a, string memory b) private pure returns (string memory){
        return string(abi.encodePacked(a,' ',b));
    }

    modifier presalePRTisActive () {
        require(presalePRT, "Presale PRT is not open.");
        _;
    }
    //main function to mint NONMP
     function mintNONMP (address account, uint8 _amount_wanted_able_to_get, uint8 _name) external payable onlyForCaller(account) onlyAccounts presalePRTisActive nonReentrant {
        require(_amount_wanted_able_to_get > 0, "Amount needs to be greater than 0");
        require(msg.sender != address(0), "Sender is not exist");

        if (_name == 0) {
            mintNONMPForAIRDROP(account, _amount_wanted_able_to_get);
        } 
        if (_name == 1) {
            mintNONMPForInternalTeam(account, _amount_wanted_able_to_get);
        } 
        if (_name == 2) {
            mintNONMPForNomalUser(account, _amount_wanted_able_to_get);
        } 
        
     }


    function mintNONMPForAIRDROP(address acc, uint256 qty) internal {
        //added:1
        require(qty <= MAX_PRT_AMOUNT_PER_ACC_PER_TRANSACTION, "Max per transaction 35 tokens");
        //AIRDROP8888 - 180001-188888
        (uint256 initID, uint256 _qnt, uint256 _numIssued, uint8 _randval) = getNextNONMPID(qty, STARTINGIDFORAIRDROP, numIssuedForAIRDROP, MAX_SUPPLY_FOR_AIRDROP_TOKEN, EACH_RAND_SLOT_NUM_TOTAL_FOR_AIRDROP, intArrPRTAIRDROP); 
        //added:2
        require(_qnt <= MAX_PRT_AMOUNT_PER_ACC, "Max supply 100 tokens");
        require(userNONMPs[msg.sender] < MAX_PRT_AMOUNT_PER_ACC, "Limit is 100 tokens");
        
        uint256 _qnt_remain;
        if (userNONMPs[msg.sender] + _qnt >= MAX_PRT_AMOUNT_PER_ACC) {
            uint256 diff = uint256(userNONMPs[msg.sender] + _qnt - MAX_PRT_AMOUNT_PER_ACC);
            _qnt_remain  = uint256(_qnt - diff);
        } 
        require(userNONMPs[msg.sender] + _qnt  < MAX_PRT_AMOUNT_PER_ACC, _concatenate("The remain qty: ", Strings.toString(_qnt_remain)));

        //added:3
        uint weiBalanceWallet = msg.value;
        require(weiBalanceWallet >= PRICE_PRT_AIRDROP, "Insufficient funds"); 
        userBalances[msg.sender] = weiBalanceWallet;
        require(userBalances[msg.sender].sub(PRICE_PRT_AIRDROP * _qnt) >=0, "Insufficient funds");
        
        //added:4
        payable(owner()).transfer(PRICE_PRT_AIRDROP * _qnt);//Send money to owner of contract

        //added:5
        uint256[] memory ids = new uint256[](_qnt);
        for (uint i = 0; i < _qnt; i++) {
            ids[i] = initID+i;
            prtPerAddress[ids[i]] = msg.sender;
            //add here: logic to  toggle allowed if sold 1400000 
        }
        _mintBatch(msg.sender, ids, ids, "");
        emit DitributePRTs(msg.sender, ids); 

        //added:6 
        userNONMPs[msg.sender] = uint256(userNONMPs[msg.sender]) + ids.length;

        //update:
        numIssuedForAIRDROP = _numIssued;
        intArrPRTAIRDROP[_randval] = intArrPRTAIRDROP[_randval] + _qnt;
        emit mintNONMPIDEvent(acc, initID, _qnt);
    }

    function mintNONMPForInternalTeam(address acc, uint256 qty) internal {
        //added:1
        require(qty <= MAX_PRT_AMOUNT_PER_ACC_PER_TRANSACTION, "Max mint per transaction is 35 tokens");
        //INTERNAL TEAM - 160001-180000
        (uint256 initID, uint256 _qnt, uint256 _numIssued, uint8 _randval) = getNextNONMPID(qty, STARTINGIDFORINTERNALTEAM, numIssuedForInternalTeamIDs, MAX_SUPPLY_FOR_INTERNALTEAM_TOKEN, EACH_RAND_SLOT_NUM_TOTAL_FOR_INTERNALTEAM, intArrPRTInternalTeam); 
        //added:2
        require(_qnt <= MAX_PRT_AMOUNT_PER_ACC, "Max supply 100 tokens");
        require(userNONMPs[msg.sender] < MAX_PRT_AMOUNT_PER_ACC, "Limit is 100 tokens");
        
        uint256 _qnt_remain;
        if (userNONMPs[msg.sender] + _qnt >= MAX_PRT_AMOUNT_PER_ACC) {
            uint256 diff = uint256(userNONMPs[msg.sender] + _qnt - MAX_PRT_AMOUNT_PER_ACC);
            _qnt_remain  = uint256(_qnt - diff);
        } 
        require(userNONMPs[msg.sender] + _qnt  < MAX_PRT_AMOUNT_PER_ACC, _concatenate("The remain qty: ", Strings.toString(_qnt_remain)));

        //added:3
        uint weiBalanceWallet = msg.value;
        require(weiBalanceWallet >= PRICE_PRT_INTERNALTEAM, "Insufficient funds"); 
        userBalances[msg.sender] = weiBalanceWallet;
        require(userBalances[msg.sender].sub(PRICE_PRT_INTERNALTEAM * _qnt) >=0, "Insufficient funds");
        //added:4
        payable(owner()).transfer(PRICE_PRT_INTERNALTEAM * _qnt);//Send money to owner of contract

        //added:5
        uint256[] memory ids = new uint256[](_qnt);
        for (uint i = 0; i < _qnt; i++) {
            ids[i] = initID+i;
            prtPerAddress[ids[i]] = msg.sender;
            //add here: logic to  toggle allowed if sold 1400000 
        }
        _mintBatch(msg.sender, ids, ids, "");
        emit DitributePRTs(msg.sender, ids); 
        
        //added:6 
        userNONMPs[msg.sender] = uint256(userNONMPs[msg.sender]) + ids.length;


        //update:
        numIssuedForInternalTeamIDs = _numIssued;
        intArrPRTInternalTeam[_randval] = intArrPRTInternalTeam[_randval] + _qnt;
        emit mintNONMPIDEvent(acc, initID, _qnt);
    }
    
    function mintNONMPForNomalUser(address acc, uint256 qty) internal {
        //added:1
        require(qty <= MAX_PRT_AMOUNT_PER_ACC_PER_TRANSACTION, "Max mint per transaction is 35 tokens");
        //NORMAL 20001-160000
        (uint256 initID, uint256 _qnt, uint256 _numIssued, uint8 _randval) = getNextNONMPID(qty, STARTINGIDFORPRT, numIssuedForNormalUser, MAX_SUPPLY_FOR_PRT_TOKEN, EACH_RAND_SLOT_NUM_TOTAL_FOR_PRT, intArrPRT); 

        //added:2
        require(_qnt <= MAX_PRT_AMOUNT_PER_ACC, "Max supply 100 tokens");
        require(userNONMPs[msg.sender] < MAX_PRT_AMOUNT_PER_ACC, "Limit is 100 tokens");
        
        uint256 _qnt_remain;
        if (userNONMPs[msg.sender] + _qnt >= MAX_PRT_AMOUNT_PER_ACC) {
            uint256 diff = uint256(userNONMPs[msg.sender] + _qnt - MAX_PRT_AMOUNT_PER_ACC);
            _qnt_remain  = uint256(_qnt - diff);
        } 
        require(userNONMPs[msg.sender] + _qnt  < MAX_PRT_AMOUNT_PER_ACC, _concatenate("The remain qty: ", Strings.toString(_qnt_remain)));

        //added:3
        uint weiBalanceWallet = msg.value;
        require(weiBalanceWallet >= PRICE_PRT, "Insufficient funds"); 
        userBalances[msg.sender] = weiBalanceWallet;
        require(userBalances[msg.sender].sub(PRICE_PRT * _qnt) >=0, "Insufficient funds");

        //added:4
        payable(owner()).transfer(PRICE_PRT * _qnt);//Send money to owner of contract

        //added:5
        uint256[] memory ids = new uint256[](_qnt);
        for (uint i = 0; i < _qnt; i++) {
            ids[i] = initID+i;
            prtPerAddress[ids[i]] = msg.sender;
            //add here: logic to  toggle allowed if sold 1400000 
        }
        _mintBatch(msg.sender, ids, ids, "");
        emit DitributePRTs(msg.sender, ids); 

        //added:6 
        userNONMPs[msg.sender] = uint256(userNONMPs[msg.sender]) + ids.length;


        //update:
        numIssuedForNormalUser = _numIssued;
        intArrPRT[_randval] = intArrPRT[_randval] + _qnt;
        emit mintNONMPIDEvent(acc, initID, _qnt);
    }

    function getNextNONMPID(uint256 qty, uint256  initialNum, uint256 numIssued, uint256 max_supply_token, uint256 each_rand_slot_num_total, uint256[] memory intArray) public view returns(uint256, uint256, uint256, uint8){
       require(numIssued < max_supply_token, "all NONMP are issued.");
 
       uint8 randval = uint8(random(max_supply_token/each_rand_slot_num_total)); //0 to 15
       uint8 iCheck = 0;
       uint8 randvalChk = randval;

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
 
       uint256 mpid = (intArray[randval])+(uint16(randval)*each_rand_slot_num_total);

       if (intArray[randval]+qty > each_rand_slot_num_total) {
           qty = each_rand_slot_num_total - intArray[randval];
       }

       numIssued = qty + numIssued;
       return (mpid+initialNum, qty, numIssued, randval);
   }
   //NONMP mint end


    function withdraw () public payable onlyOwner {
        payable(msg.sender).transfer(address(this).balance);//This function allows the owner to withdraw from the contract

    }

}