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
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    //main nft start
    string public name = "VIPSLAND GENESIS";
    string public symbol = "VPSL";

    //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/extensions/ERC1155Supply.sol
    function totalSupplyCustom(uint256 id) public view returns (uint256) {
        return totalSupply(id);
    }

    //added to test add to main contract
    function existsCustom(uint256 id) public view returns (bool) {
        return exists(id);
    }

    //manually mint and transfer start
    function mintByOwner(uint256 tokenId) public onlyOwner onlyOnceCanBeMinted(tokenId) {
        _mint(msg.sender, tokenId, 1, "");
    }

    function safeTransferFromByOwner(uint256 tokenId, address addr) public onlyOwner tokenExist(tokenId) {
        safeTransferFrom(msg.sender, addr, tokenId, 1, "");
    }

    modifier onlyOnceCanBeMinted(uint256 tokenId) {
        //for security
        require(totalSupply(tokenId) == 0, "Only once can be minted");
        _;
    }

    modifier tokenExist(uint256 tokenId) {
        //for security
        require(exists(tokenId), "Token is not exist");
        _;
    }
    //manually mint and transfer end

    //reveal start
    string public notRevealedUri = "https://ipfs.vipsland.com/nft/collections/genesis/json/hidden.json";
    bool public revealed = false;
    mapping(uint256 => string) private _uris;

    function toggleReveal() public onlyOwner {
        revealed = !revealed;
    }

    function uri(uint256) public view override returns (string memory) {
        if (revealed == false) {
            return notRevealedUri;
        }
        return (string(abi.encodePacked("https://ipfs.vipsland.com/nft/collections/genesis/json/", "{id}", ".json")));
    }

    //reveal end
    //main nft end

    //MP
    uint256 public constant PRTID = 20000;
    uint256 public constant MAX_SUPPLY_MP = 20000;
    uint256 public constant NUM_TOTAL_FOR_MP = 200;
    uint256 public constant NUM_TOTAL = 1000;
    uint256 public xrand = 18;
    Counters.Counter public _counter_for_generatelucky_mp;
    Counters.Counter public _counter_for_generatelucky_mp_internalteam;
    Counters.Counter public _counter_for_generatelucky_mp_airdrop;
    uint64 public numIssuedForMP = 4;
    uint16[] public intArr;

    //NONMP
    mapping(uint256 => address) public prtPerAddress;
    mapping(address => uint256) public userNONMPs; //each address can get 100/17=~6

    function getAddrFromNONMPID(uint256 _winnerTokenNONMPID) internal view returns (address) {
        if (exists(_winnerTokenNONMPID) && balanceOf(prtPerAddress[_winnerTokenNONMPID], _winnerTokenNONMPID) > 0) {
            return prtPerAddress[_winnerTokenNONMPID];
        }

        return address(0);
    }

    uint256 public constant MAX_PRT_AMOUNT_PER_ACC = 100;
    uint256 public constant MAX_PRT_AMOUNT_PER_ACC_PER_TRANSACTION = 35;

    //NONMP NORMAL 20001-160000
    uint256 public PRICE_PRT = 0.123 ether;

    function setPRICE_PRT(uint256 price) public onlyOwner {
        PRICE_PRT = price;
    }

    uint256 public constant MAX_SUPPLY_FOR_PRT_TOKEN = 140000;
    uint256 public constant EACH_RAND_SLOT_NUM_TOTAL_FOR_PRT = 10000;
    uint256 public numIssuedForNormalUser = 0;
    uint256 public constant STARTINGIDFORPRT = 20001;
    uint256[] public intArrPRT;

    //NONMP INTERNAL TEAM - 160001-180000
    uint256 public PRICE_PRT_INTERNALTEAM = 0 ether;

    function setPRICE_PRT_INTERNALTEAM(uint256 price) public onlyOwner {
        PRICE_PRT_INTERNALTEAM = price;
    }

    uint256 public constant MAX_SUPPLY_FOR_INTERNALTEAM_TOKEN = 20000;
    uint256 public constant EACH_RAND_SLOT_NUM_TOTAL_FOR_INTERNALTEAM = 1000;
    uint256 public numIssuedForInternalTeamIDs = 0;
    uint256 public constant STARTINGIDFORINTERNALTEAM = 160001;
    uint256[] public intArrPRTInternalTeam;

    //NONMP AIRDROP8888 - 180001-188888
    uint256 public PRICE_PRT_AIRDROP = 0 ether;

    function setPRICE_PRT_AIRDROP(uint256 price) public onlyOwner {
        PRICE_PRT_AIRDROP = price;
    }

    uint256 public constant MAX_SUPPLY_FOR_AIRDROP_TOKEN = 8888;
    uint256 public constant EACH_RAND_SLOT_NUM_TOTAL_FOR_AIRDROP = 1111;
    uint256 public numIssuedForAIRDROP = 0;
    uint256 public constant STARTINGIDFORAIRDROP = 180001;
    uint256[] public intArrPRTAIRDROP;

    //toggle start
    uint256 public presalePRT = 0;
    bool public mintMPIsOpen = false;
    bool public mintInternalTeamMPIsOpen = false;
    bool public mintAirdropMPIsOpen = false;

    function setPreSalePRT(uint256 num) public onlyOwner onlyAllowedNum(num) {
        presalePRT = num;
    }

    function toggleMintMPIsOpen() public onlyOwner {
        mintMPIsOpen = !mintMPIsOpen; //only owner can toggle presale
    }

    function toggleMintInternalTeamMPIsOpen() public onlyOwner {
        mintInternalTeamMPIsOpen = !mintInternalTeamMPIsOpen; //only owner can toggle presale
    }

    function toggleMintAirdropMPIsOpen() public onlyOwner {
        mintAirdropMPIsOpen = !mintAirdropMPIsOpen; //only owner can toggle presale
    }

    //toggle end

    // events start
    event DitributePRTs(address indexed acc, uint256 minted_amount, uint256 last_minted_NONMPID);
    event WinnersMP(address indexed acc, uint256 winnerTokenPRTID);
    event SelectedNONMPIDTokens(uint256 _winnerTokenNONMPID, uint256 max_nonmpid_minus_xrand);
    event MPAllDone(bool sendMPAllDone);
    event mintNONMPIDEvent(address indexed acc, uint256 initID, uint256 _qnt);

    // events end

    constructor()
        ERC1155(notRevealedUri)
        ReentrancyGuard() //A modifier that can prevent reentrancy during certain functions
    {
        //for mp
        intArr = new uint16[](MAX_SUPPLY_MP / NUM_TOTAL);
        intArr[0] = 3;

        //for normal user
        intArrPRT = new uint256[](MAX_SUPPLY_FOR_PRT_TOKEN / EACH_RAND_SLOT_NUM_TOTAL_FOR_PRT);

        //for internal team
        intArrPRTInternalTeam = new uint256[](MAX_SUPPLY_FOR_INTERNALTEAM_TOKEN / EACH_RAND_SLOT_NUM_TOTAL_FOR_INTERNALTEAM);

        //for airdrop
        intArrPRTAIRDROP = new uint256[](MAX_SUPPLY_FOR_AIRDROP_TOKEN / EACH_RAND_SLOT_NUM_TOTAL_FOR_AIRDROP);
    }

    //modifier start
    modifier onlyAccounts() {
        require(msg.sender == tx.origin, "Not allowed origin");
        _;
    }

    modifier onlyForCaller(address _account) {
        require(msg.sender == _account, "Only allowed for caller");
        _;
    }

    modifier onlyAllowedNum(uint256 num) {
        require(num >= 0 && num <= 3);
        _;
    }

    modifier mintMPIsOpenModifier() {
        require(mintMPIsOpen, "Mint is not open");
        _;
    }

    modifier mintAirdropMPIsOpenModifier() {
        require(mintAirdropMPIsOpen, "Mint is not open for airdrop");
        _;
    }

    modifier mintInternalTeamMPIsOpenModifier() {
        require(mintInternalTeamMPIsOpen, "Mint is not open for internal team");
        _;
    }

    //modifier end

    //sendMP start, mint MP start
    function random(uint256 number) public view returns (uint256) {
        //return uint(keccak256(abi.encodePacked(block.timestamp,block.difficulty,
        //msg.sender))) % number;
        return uint256(blockhash(block.number - 1)) % number;
    }

    function getNextMPID() internal returns (uint256) {
        require(numIssuedForMP < MAX_SUPPLY_MP, "all MPs issued.");
        //gold supply = ID 1-200, silver supply = 201-2000, bronze = 2001-20000
        //uint8 randnum = uint8(random(255)); //0 to 254

        uint8 randval = uint8(random(MAX_SUPPLY_MP / NUM_TOTAL_FOR_MP)); //0 to 199

        /** chk and reassign available IDs left from randomization */
        uint8 iCheck = 0;
        //uint8 randvalChk = randval;

        while (iCheck != (MAX_SUPPLY_MP / NUM_TOTAL_FOR_MP)) {
            if (intArr[randval] == NUM_TOTAL_FOR_MP) {
                if (randval == ((MAX_SUPPLY_MP / NUM_TOTAL_FOR_MP) - 1)) {
                    randval = 0;
                } else {
                    randval++;
                }
            } else {
                break;
            }
            iCheck++;
        }
        /** end chk and reassign IDs */
        uint256 mpid;

        if (intArr[randval] < 100) {
            //intArr[0] = 3; should be placed on top of global variable declaration
            mpid = (intArr[randval] * 2) + (uint16(randval) * NUM_TOTAL_FOR_MP);
        } else {
            if (randval == 0 && intArr[randval] == (MAX_SUPPLY_MP / NUM_TOTAL_FOR_MP)) {
                intArr[randval] = 102;
            }
            mpid = (intArr[randval] - 100) * 2 + 1 + (uint16(randval) * NUM_TOTAL_FOR_MP);
        }

        intArr[randval] = intArr[randval] + 1;
        numIssuedForMP++;
        return mpid;
    }

    function createXRAND(uint256 number) internal view returns (uint256) {
        //number = 17, 0 - 16 <- this is what we want
        return uint256(blockhash(block.number - 1)) % number;
    }

    uint256 public idx = 0;
    uint256 public idxInternalTeam = 0;
    uint256 public idxAirdrop = 0;
    //sendMPLastID up to 10000, and stop executing sendMP()
    //uint public sendMPLastID = 0;

    //once sendMPAllDoneForNormalUsers is true only can you call sendMPInternalTeamOrAirdrop()
    bool public sendMPAllDoneForNormalUsers = false;
    bool public sendMPAllDoneForAirdrop = false;
    bool public sendMPAllDoneForInternalTeam = false;

    uint256 lastWinnerTokenIDNormalUserDiff = 0;
    uint256 lastWinnerTokenIDAirdropDiff = 0;

    uint8 moreOrLess = 0;

    //call 10 times
    function sendMPNormalUsers() public payable onlyAccounts onlyOwner mintMPIsOpenModifier {
        require(sendMPAllDoneForNormalUsers == false, "All MPs are issued for normal user");
        if (xrand == 18) {
            xrand = createXRAND(17);
        }
        _counter_for_generatelucky_mp.increment();
        uint256 counter = _counter_for_generatelucky_mp.current();
        uint24 _prevwinnerTokenNONMPID;
        for (uint256 i = idx; i < 1000 * counter; i++) {
            uint24 _winnerTokenNONMPID = uint24(PRTID + 1 + xrand + uint24(uint32((168888 * i) / 10000))); //updatede here
            uint256 max_nonmpid = PRTID + MAX_SUPPLY_FOR_PRT_TOKEN;
            uint24 _nextwinnerTokenNONMPID = uint24(PRTID + 1 + xrand + uint24(uint32((168888 * i + 1) / 10000)));

            sendMPAllDoneForNormalUsers = (_nextwinnerTokenNONMPID > max_nonmpid) || (_winnerTokenNONMPID > max_nonmpid);
            emit MPAllDone(sendMPAllDoneForNormalUsers);

            if (sendMPAllDoneForNormalUsers) {

                lastWinnerTokenIDNormalUserDiff = uint256(_nextwinnerTokenNONMPID);

                uint24 lastDiff = 0;
                if (lastWinnerTokenIDNormalUserDiff >= uint24(140000 + PRTID + 1 + xrand)) {
                    lastDiff = uint24(lastWinnerTokenIDNormalUserDiff) - uint24(140000 + PRTID + 1 + xrand);
                    moreOrLess = 1;
                } else {
                    lastDiff = uint24(140000 + PRTID + 1 + xrand) - uint24(lastWinnerTokenIDNormalUserDiff);
                    moreOrLess = 0;
                }
                if (moreOrLess == 1) {
                    lastWinnerTokenIDAirdropDiff = uint256(140000 + lastDiff + PRTID + 1 + xrand + uint24(uint32((168888 * 1000 * 19) + 1) / 10000));
                } else {
                    lastWinnerTokenIDAirdropDiff = uint256(140000 - lastDiff + PRTID + 1 + xrand + uint24(uint32((168888 * 1000 * 19) + 1) / 10000));
                } 

                break;
            }

            emit SelectedNONMPIDTokens(_winnerTokenNONMPID, (max_nonmpid - xrand));

            address winneraddr = getAddrFromNONMPID(_winnerTokenNONMPID);

            if (winneraddr != address(0)) {
                uint256 tokenID = getNextMPID();
                _mint(msg.sender, tokenID, 1, ""); //minted one MP
                safeTransferFrom(msg.sender, winneraddr, tokenID, 1, "");
                emit WinnersMP(winneraddr, tokenID);
            }

            _prevwinnerTokenNONMPID = _winnerTokenNONMPID;

            emit MPAllDone(sendMPAllDoneForNormalUsers);

        }

        //update idx
        idx = 1000 * counter;
    }

    function sendMPInternalTeam() public payable onlyAccounts onlyOwner mintInternalTeamMPIsOpenModifier {
        require(sendMPAllDoneForNormalUsers == true, "All MPs are not yet issued for normal user");
        require(sendMPAllDoneForInternalTeam == false, "All MPs are issued for internal team");

        _counter_for_generatelucky_mp_internalteam.increment();
        uint256 counter = _counter_for_generatelucky_mp_internalteam.current();

        uint24 lastDiff = 0;

        if (lastWinnerTokenIDNormalUserDiff >= uint24(140000 + PRTID + 1 + xrand)) {
            lastDiff = uint24(lastWinnerTokenIDNormalUserDiff) - uint24(140000 + PRTID + 1 + xrand);
            moreOrLess = 1;
        } else {
            lastDiff = uint24(140000 + PRTID + 1 + xrand) - uint24(lastWinnerTokenIDNormalUserDiff);
            moreOrLess = 0;
        }

        for (uint256 i = idxInternalTeam; i < 1000 * counter; i++) {
            uint24 _winnerTokenNONMPID = 0;
            if (moreOrLess == 1) {
                _winnerTokenNONMPID = uint24(140000 + lastDiff + PRTID + 1 + xrand + uint24(uint32((168888 * i) / 10000))); //updatede
            } else {
                _winnerTokenNONMPID = uint24(140000 - lastDiff + PRTID + 1 + xrand + uint24(uint32((168888 * i) / 10000))); //updatede
            }

            uint256 max_nonmpid = PRTID + MAX_SUPPLY_FOR_PRT_TOKEN + MAX_SUPPLY_FOR_INTERNALTEAM_TOKEN;

            uint24 _nextwinnerTokenNONMPID = 0;
            if (moreOrLess == 1) {
                _nextwinnerTokenNONMPID = uint24(140000 + lastDiff + PRTID + 1 + xrand + uint24(uint32((168888 * i + 1) / 10000)));
            } else {
                _nextwinnerTokenNONMPID = uint24(140000 - lastDiff + PRTID + 1 + xrand + uint24(uint32((168888 * i + 1) / 10000)));
            }

            sendMPAllDoneForInternalTeam = (_nextwinnerTokenNONMPID > max_nonmpid) || (_winnerTokenNONMPID > max_nonmpid);

            emit MPAllDone(sendMPAllDoneForInternalTeam);

            if (sendMPAllDoneForInternalTeam) {
                console.log("_winnerTokenNONMPID2", _winnerTokenNONMPID);
                console.log("xrand", xrand);
                console.log("max_nonmpid", max_nonmpid);
                break;
            }
            emit SelectedNONMPIDTokens(_winnerTokenNONMPID, (max_nonmpid - xrand));

            address winneraddr = getAddrFromNONMPID(_winnerTokenNONMPID);
            if (winneraddr != address(0)) {
                uint256 tokenID = getNextMPID();
                _mint(msg.sender, tokenID, 1, "");
                safeTransferFrom(msg.sender, winneraddr, tokenID, 1, "");
                emit WinnersMP(winneraddr, tokenID);
            }

            emit MPAllDone(sendMPAllDoneForInternalTeam);

        }

        idxInternalTeam = 1000 * counter;
    }

    function sendMPAirdrop() public payable onlyAccounts onlyOwner mintAirdropMPIsOpenModifier {
        require(sendMPAllDoneForNormalUsers == true, "All send MPs are not yet issued");
        require(sendMPAllDoneForAirdrop == false, "All sendAirdrop MPs are issued");

        _counter_for_generatelucky_mp_airdrop.increment();
        uint256 counter = _counter_for_generatelucky_mp_airdrop.current();

        uint24 lastDiff = 0;

        if (lastWinnerTokenIDNormalUserDiff >= uint24(140000 + PRTID + 1 + xrand)) {
            lastDiff = uint24(lastWinnerTokenIDNormalUserDiff) - uint24(140000 + PRTID + 1 + xrand);
            moreOrLess = 1;
        } else {
            lastDiff = uint24(140000 + PRTID + 1 + xrand) - uint24(lastWinnerTokenIDNormalUserDiff);
            moreOrLess = 0;
        }

        for (uint256 i = idxAirdrop; i < 1000 * counter; i++) {
            uint24 _nextwinnerTokenNONMPID = 0;
            uint24 _winnerTokenNONMPID = 0;
            if (moreOrLess == 1) {
                _winnerTokenNONMPID = uint24(160000 + lastDiff + PRTID + 1 + xrand + uint24(uint32((168888 * i) / 10000))); //updatede here
            } else {
                _winnerTokenNONMPID = uint24(160000 - lastDiff + PRTID + 1 + xrand + uint24(uint32((168888 * i) / 10000))); //updatede here
            }
            uint256 max_nonmpid = PRTID + MAX_SUPPLY_FOR_PRT_TOKEN + MAX_SUPPLY_FOR_INTERNALTEAM_TOKEN + MAX_SUPPLY_FOR_AIRDROP_TOKEN;
            if (moreOrLess == 1) {
                _nextwinnerTokenNONMPID = uint24(160000 + lastDiff + PRTID + 1 + xrand + uint24(uint32((168888 * i + 1) / 10000)));
            } else {
                _nextwinnerTokenNONMPID = uint24(160000 - lastDiff + PRTID + 1 + xrand + uint24(uint32((168888 * i + 1) / 10000)));
            }

            sendMPAllDoneForAirdrop = (_nextwinnerTokenNONMPID > max_nonmpid) || (_winnerTokenNONMPID > max_nonmpid);

            emit MPAllDone(sendMPAllDoneForAirdrop);

            if (sendMPAllDoneForAirdrop) {
                console.log("_winnerTokenNONMPID4", _winnerTokenNONMPID);
                console.log("xrand", xrand);
                console.log("max_nonmpid", max_nonmpid);
                break;
            }

            emit SelectedNONMPIDTokens(_winnerTokenNONMPID, (max_nonmpid - xrand));

            address winneraddr = getAddrFromNONMPID(_winnerTokenNONMPID);
            if (winneraddr != address(0)) {
                uint256 tokenID = getNextMPID();
                _mint(msg.sender, tokenID, 1, "");
                safeTransferFrom(msg.sender, winneraddr, tokenID, 1, "");
                emit WinnersMP(winneraddr, tokenID);
            }

            emit MPAllDone(sendMPAllDoneForAirdrop);

        }

        idxAirdrop = 1000 * counter;
    }

    //sendMP end

    //NONMP mint start
    function _concatenate(string memory a, string memory b) private pure returns (string memory) {
        return string(abi.encodePacked(a, "", b));
    }

    modifier presalePRTisActive() {
        require(presalePRT > 0, "Presale PRT is not active");
        _;
    }

    //main function to mint NONMP
    function mintNONMP(address account, uint8 _amount_wanted_able_to_get) external payable onlyForCaller(account) onlyAccounts presalePRTisActive nonReentrant {
        require(_amount_wanted_able_to_get > 0, "Amount needs to be greater than 0");
        require(msg.sender != address(0), "Sender is not exist");

        if (presalePRT == 3) {
            mintNONMPForAIRDROP(account, _amount_wanted_able_to_get);
        } else if (presalePRT == 2) {
            mintNONMPForInternalTeam(account, _amount_wanted_able_to_get);
        } else if (presalePRT == 1) {
            mintNONMPForNomalUser(account, _amount_wanted_able_to_get);
        }
    }

    function mintNONMPForAIRDROP(address acc, uint256 qty) internal {
        //added:1
        require(qty <= MAX_PRT_AMOUNT_PER_ACC_PER_TRANSACTION, "Max mint per transaction is 35 tokens");
        //AIRDROP8888 - 180001-188888
        (uint256 initID, uint256 _qnt, uint256 _numIssued, uint8 _randval) = getNextNONMPID(
            qty,
            STARTINGIDFORAIRDROP,
            numIssuedForAIRDROP,
            MAX_SUPPLY_FOR_AIRDROP_TOKEN,
            EACH_RAND_SLOT_NUM_TOTAL_FOR_AIRDROP,
            intArrPRTAIRDROP
        );
        //added:2
        require(_qnt <= MAX_PRT_AMOUNT_PER_ACC, "Max supply 100 tokens");
        require(userNONMPs[msg.sender] < MAX_PRT_AMOUNT_PER_ACC, "Limit is 100 tokens");

        uint256 _qnt_remain;
        if (userNONMPs[msg.sender] + _qnt > MAX_PRT_AMOUNT_PER_ACC) {
            uint256 diff = uint256(userNONMPs[msg.sender] + _qnt - MAX_PRT_AMOUNT_PER_ACC);
            _qnt_remain = uint256(_qnt - diff);
        }
        require(userNONMPs[msg.sender] + _qnt <= MAX_PRT_AMOUNT_PER_ACC, _concatenate("The remain qty: ", Strings.toString(_qnt_remain)));

        //added:3
        uint256 weiBalanceWallet = msg.value;
        require(weiBalanceWallet >= PRICE_PRT_AIRDROP, "Insufficient funds");
        require(weiBalanceWallet >= PRICE_PRT_AIRDROP * _qnt, "Insufficient funds");

        //added:4
        payable(owner()).transfer(PRICE_PRT_AIRDROP * _qnt); //Send money to owner of contract

        //added:5
        uint256[] memory ids = new uint256[](_qnt);
        for (uint256 i = 0; i < _qnt; i++) {
            ids[i] = initID + i;
        }
        uint256[] memory amounts = new uint256[](_qnt);
        for (uint256 i = 0; i < _qnt; i++) {
            amounts[i] = 1;
        }

        _mintBatch(msg.sender, ids, amounts, "");
        for (uint256 i = 0; i < _qnt; i++) {
            prtPerAddress[ids[i]] = msg.sender;
        }

        //added:6
        userNONMPs[msg.sender] = uint256(userNONMPs[msg.sender]) + ids.length;

        //added:7
        //update:
        numIssuedForAIRDROP = _numIssued;
        intArrPRTAIRDROP[_randval] = intArrPRTAIRDROP[_randval] + _qnt;

        //added:8
        //toggle MP mint is open if sold MAX_SUPPLY_FOR_PRT_TOKEN (only for normal user)
        uint256 max_nonmpid = PRTID + MAX_SUPPLY_FOR_PRT_TOKEN + MAX_SUPPLY_FOR_INTERNALTEAM_TOKEN + MAX_SUPPLY_FOR_AIRDROP_TOKEN;
        if (ids[_qnt - 1] >= max_nonmpid) {
            mintAirdropMPIsOpen = true;
        }
        //added:9
        emit DitributePRTs(msg.sender, userNONMPs[msg.sender], ids[_qnt - 1]);
    }

    function mintNONMPForInternalTeam(address acc, uint256 qty) internal {
        //added:1
        require(qty <= MAX_PRT_AMOUNT_PER_ACC_PER_TRANSACTION, "Max mint per transaction is 35 tokens");
        //INTERNAL TEAM - 160001-180000
        (uint256 initID, uint256 _qnt, uint256 _numIssued, uint8 _randval) = getNextNONMPID(
            qty,
            STARTINGIDFORINTERNALTEAM,
            numIssuedForInternalTeamIDs,
            MAX_SUPPLY_FOR_INTERNALTEAM_TOKEN,
            EACH_RAND_SLOT_NUM_TOTAL_FOR_INTERNALTEAM,
            intArrPRTInternalTeam
        );
        //added:2
        require(_qnt <= MAX_PRT_AMOUNT_PER_ACC, "Max supply 100 tokens");
        require(userNONMPs[msg.sender] < MAX_PRT_AMOUNT_PER_ACC, "Limit is 100 tokens");

        uint256 _qnt_remain;
        if (userNONMPs[msg.sender] + _qnt >= MAX_PRT_AMOUNT_PER_ACC) {
            uint256 diff = uint256(userNONMPs[msg.sender] + _qnt - MAX_PRT_AMOUNT_PER_ACC);
            _qnt_remain = uint256(_qnt - diff);
        }
        require(userNONMPs[msg.sender] + _qnt <= MAX_PRT_AMOUNT_PER_ACC, _concatenate("The remain qty: ", Strings.toString(_qnt_remain)));

        //added:3
        uint256 weiBalanceWallet = msg.value;
        require(weiBalanceWallet >= PRICE_PRT_INTERNALTEAM, "Insufficient funds");
        require(weiBalanceWallet >= PRICE_PRT_INTERNALTEAM * _qnt, "Insufficient funds");

        //added:4
        payable(owner()).transfer(PRICE_PRT_INTERNALTEAM * _qnt); //Send money to owner of contract

        //added:5
        uint256[] memory ids = new uint256[](_qnt);
        for (uint256 i = 0; i < _qnt; i++) {
            ids[i] = initID + i;
        }
        uint256[] memory amounts = new uint256[](_qnt);
        for (uint256 i = 0; i < _qnt; i++) {
            amounts[i] = 1;
        }

        _mintBatch(msg.sender, ids, amounts, "");
        for (uint256 i = 0; i < _qnt; i++) {
            prtPerAddress[ids[i]] = msg.sender;
        }

        //added:6
        userNONMPs[msg.sender] = uint256(userNONMPs[msg.sender]) + ids.length;

        //added:7
        //update:
        numIssuedForInternalTeamIDs = _numIssued;
        intArrPRTInternalTeam[_randval] = intArrPRTInternalTeam[_randval] + _qnt;

        //added:8 //sam
        //toggle MP mint is open if sold MAX_SUPPLY_FOR_PRT_TOKEN (only for normal user)
        uint256 max_nonmpid = PRTID + MAX_SUPPLY_FOR_PRT_TOKEN + MAX_SUPPLY_FOR_INTERNALTEAM_TOKEN;
        if (ids[_qnt - 1] >= max_nonmpid) {
            mintInternalTeamMPIsOpen = true;
        }

        //added:9
        emit DitributePRTs(msg.sender, userNONMPs[msg.sender], ids[_qnt - 1]);
    }

    function mintNONMPForNomalUser(address acc, uint256 qty) internal {
        //added:1
        require(qty <= MAX_PRT_AMOUNT_PER_ACC_PER_TRANSACTION, "Max mint per transaction is 35 tokens");
        //NORMAL 20001-160000
        (uint256 initID, uint256 _qnt, uint256 _numIssued, uint8 _randval) = getNextNONMPID(
            qty,
            STARTINGIDFORPRT,
            numIssuedForNormalUser,
            MAX_SUPPLY_FOR_PRT_TOKEN,
            EACH_RAND_SLOT_NUM_TOTAL_FOR_PRT,
            intArrPRT
        );

        //added:2
        require(_qnt <= MAX_PRT_AMOUNT_PER_ACC, "Max supply 100 tokens");
        require(userNONMPs[msg.sender] < MAX_PRT_AMOUNT_PER_ACC, "Limit is 100 tokens");

        uint256 _qnt_remain;
        if (userNONMPs[msg.sender] + _qnt > MAX_PRT_AMOUNT_PER_ACC) {
            uint256 diff = uint256(userNONMPs[msg.sender] + _qnt - MAX_PRT_AMOUNT_PER_ACC);
            _qnt_remain = uint256(_qnt - diff);
        }
        require(userNONMPs[msg.sender] + _qnt <= MAX_PRT_AMOUNT_PER_ACC, _concatenate("The remain qty: ", Strings.toString(_qnt_remain)));

        //added:3
        uint256 weiBalanceWallet = msg.value;
        require(weiBalanceWallet >= PRICE_PRT, "Insufficient funds"); //minimum for one token

        uint256 _PRICE_PRT = PRICE_PRT;
        if (_qnt >= 5 && _qnt < 10) {
            _PRICE_PRT = (PRICE_PRT * 4) / 5;
        } else if (_qnt >= 10) {
            _PRICE_PRT = PRICE_PRT / 2;
        }

        require(weiBalanceWallet >= _PRICE_PRT * _qnt, "Insufficient funds");

        //added:4
        payable(owner()).transfer(_PRICE_PRT * _qnt); //Send money to owner of contract, fix: testTransfer event

        //added:5
        uint256[] memory ids = new uint256[](_qnt);
        for (uint256 i = 0; i < _qnt; i++) {
            ids[i] = initID + i;
        }
        uint256[] memory amounts = new uint256[](_qnt);
        for (uint256 i = 0; i < _qnt; i++) {
            amounts[i] = 1;
        }
        _mintBatch(msg.sender, ids, amounts, "");
        for (uint256 i = 0; i < _qnt; i++) {
            prtPerAddress[ids[i]] = msg.sender;
        }

        //added:6
        userNONMPs[msg.sender] = uint256(userNONMPs[msg.sender]) + ids.length;

        //added:7
        //update:
        numIssuedForNormalUser = _numIssued;
        intArrPRT[_randval] = intArrPRT[_randval] + _qnt;

        //added:8
        //toggle MP mint is open if sold MAX_SUPPLY_FOR_PRT_TOKEN (only for normal user)
        uint256 max_nonmpid = PRTID + MAX_SUPPLY_FOR_PRT_TOKEN;
        if (ids[_qnt - 1] >= max_nonmpid) {
            mintMPIsOpen = true;
        }
        //added:9
        emit DitributePRTs(msg.sender, userNONMPs[msg.sender], ids[_qnt - 1]);
    }

    function getNextNONMPID(
        uint256 qty,
        uint256 initialNum,
        uint256 numIssued,
        uint256 max_supply_token,
        uint256 each_rand_slot_num_total,
        uint256[] memory intArray
    )
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint8
        )
    {
        require(numIssued < max_supply_token, "all NONMP are issued.");

        uint8 randval = uint8(random(max_supply_token / each_rand_slot_num_total)); //0 to 15
        uint8 iCheck = 0;
        //uint8 randvalChk = randval;

        while (iCheck != (max_supply_token / each_rand_slot_num_total)) {
            if (intArray[randval] == each_rand_slot_num_total) {
                if (randval == ((max_supply_token / each_rand_slot_num_total) - 1)) {
                    randval = 0;
                } else {
                    randval++;
                }
            } else {
                break;
            }
            iCheck++;
        }

        uint256 mpid = (intArray[randval]) + (uint16(randval) * each_rand_slot_num_total);

        if (intArray[randval] + qty > each_rand_slot_num_total) {
            qty = each_rand_slot_num_total - intArray[randval];
        }

        numIssued = qty + numIssued;
        return (mpid + initialNum, qty, numIssued, randval);
    }

    //NONMP mint end

    //withdraw logic start
    function balanceOfAccount() public payable onlyOwner returns (uint256) {
        return msg.value;
    }

    //fix: test in goerli
    function contractBalance() public view onlyOwner returns (uint256) {
        return address(this).balance; //This function allows the owner to withdraw from the contract
    }

    //fix: test in goerli
    function withdraw() public payable onlyOwner {
        payable(msg.sender).transfer(address(this).balance); //This function allows the owner to withdraw from the contract
    }
    //withdraw logic end
}
