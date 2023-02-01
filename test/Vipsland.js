const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const chai = require("chai");
const { ethers, waffle } = require("hardhat");
const { solidity } = require("ethereum-waffle");
const { BigNumber } = require("ethers");
const forEach = require('mocha-each');
chai.use(solidity);
const fs = require("fs");


async function delay(mls) {
  return new Promise(resolve => {setTimeout(() => resolve(),mls)})
}


describe("Vipslad contract deploy", function () {
  async function deployVipslandFixture() {
    const Vipslad = await ethers.getContractFactory("Vipsland");
    const [owner, ...rest] = await ethers.getSigners();

    const hardhatVipslad = await Vipslad.deploy();

    return { Vipslad, hardhatVipslad, owner, addrs: [...rest],  };
  }

  let i = 1;

  beforeEach(async () => {

  });


  describe("Deployment", function () {
    it(`${i++} Should set the right owner`, async function () {

      const { hardhatVipslad, owner, addrs } = await loadFixture(deployVipslandFixture);
  
      await hardhatVipslad.deployed();

      expect(await hardhatVipslad.owner()).to.equal(owner.address);
    
  
      });
  });

  describe("withdraw", function () {
    it(`${i++} Should transfer tokens between accounts`, async function () {
 
      const { hardhatVipslad, owner, addrs } = await loadFixture(deployVipslandFixture);
  
      await hardhatVipslad.deployed();

      await hardhatVipslad.connect(owner).withdraw();

      const res = await hardhatVipslad.balanceOfAccount();
      
      expect(res.value.toNumber()).to.equal(0);

    });

  });


  describe("setPreSalePRT", function () {
   
    it(`${i++} setPreSalePRT 0,1,2,3`, async function () {

      const { hardhatVipslad, owner, addrs } = await loadFixture(deployVipslandFixture);
  
      await hardhatVipslad.deployed();

      let num;
      await hardhatVipslad.connect(owner).setPreSalePRT(0);
      num = await hardhatVipslad.presalePRT();
      expect(num).to.equal(0);

      await hardhatVipslad.connect(owner).setPreSalePRT(1);
      num = await hardhatVipslad.presalePRT();
      expect(num).to.equal(1);

      await hardhatVipslad.connect(owner).setPreSalePRT(2);
      num = await hardhatVipslad.presalePRT();
      expect(num).to.equal(2);

      await hardhatVipslad.connect(owner).setPreSalePRT(3);
      num = await hardhatVipslad.presalePRT();
      expect(num).to.equal(3);

    });
    
       
  });

  describe("toggleMintMPIsOpen", function () {
   
    it(`${i++} toggleMintMPIsOpen from false to true`, async function () {

      const { hardhatVipslad, owner, addrs } = await loadFixture(deployVipslandFixture);
  
      await hardhatVipslad.deployed();

      let _mintMPIsOpen;
      await hardhatVipslad.connect(owner).toggleMintMPIsOpen();
      _mintMPIsOpen = await hardhatVipslad.mintMPIsOpen();
      expect(_mintMPIsOpen).to.equal(true);

      await hardhatVipslad.connect(owner).toggleMintMPIsOpen();
      _mintMPIsOpen = await hardhatVipslad.mintMPIsOpen();
      expect(_mintMPIsOpen).to.equal(false);

    });
    
       
  });

  describe("setPRICE_PRT ", function () {
   
    it(`${i++} setPRICE_PRT_AIRDROP 0.01`, async function () {

      const { hardhatVipslad, owner, addrs } = await loadFixture(deployVipslandFixture);
      const [acc] = addrs

      await hardhatVipslad.deployed();

      const value_initial = await hardhatVipslad.PRICE_PRT_AIRDROP();
      expect(value_initial).to.equal(0);

      await hardhatVipslad.connect(owner).setPRICE_PRT_AIRDROP(ethers.utils.parseEther("0.1"));

      const value_updated = await hardhatVipslad.PRICE_PRT_AIRDROP();
      expect(value_updated).to.equal(Number(ethers.utils.parseEther("0.1")).toString());

      await expect(hardhatVipslad.connect(acc).setPRICE_PRT_AIRDROP(ethers.utils.parseEther("0.01"))
      ).to.be.revertedWith("Ownable: caller is not the owner");


    });

    it(`${i++} setPRICE_PRT_INTERNALTEAM 0.01`, async function () {

      const { hardhatVipslad, owner, addrs } = await loadFixture(deployVipslandFixture);
      const [acc] = addrs

      await hardhatVipslad.deployed();

      const value_initial = await hardhatVipslad.PRICE_PRT_INTERNALTEAM();
      expect(value_initial).to.equal(0);

      await hardhatVipslad.connect(owner).setPRICE_PRT_INTERNALTEAM(ethers.utils.parseEther("0.1"));

      const value_updated = await hardhatVipslad.PRICE_PRT_INTERNALTEAM();
      expect(value_updated).to.equal(Number(ethers.utils.parseEther("0.1")).toString());

      await expect(hardhatVipslad.connect(acc).setPRICE_PRT_INTERNALTEAM(ethers.utils.parseEther("0.01"))
      ).to.be.revertedWith("Ownable: caller is not the owner");


    });

    it(`${i++} setPRICE_PRT 0.01`, async function () {

      const { hardhatVipslad, owner, addrs } = await loadFixture(deployVipslandFixture);
      const [acc] = addrs
  
      await hardhatVipslad.deployed();

      const PRICE_PRT_initial = await hardhatVipslad.PRICE_PRT();
      expect(PRICE_PRT_initial).to.equal(Number(ethers.utils.parseEther("0.123")).toString());

      await hardhatVipslad.connect(owner).setPRICE_PRT(ethers.utils.parseEther("0.01"));

      const PRICE_PRT_updated = await hardhatVipslad.PRICE_PRT();
      expect(PRICE_PRT_updated).to.equal(Number(ethers.utils.parseEther("0.01")).toString());

      //only for owner
      await expect(hardhatVipslad.connect(acc).setPRICE_PRT(ethers.utils.parseEther("0.01"))
      ).to.be.revertedWith("Ownable: caller is not the owner");

    });
    
       
  });


  describe("manually mint and transfer ", function () {

    it(`${i++} mintByOwner, existsCustom, onlyOnceCanBeMinted, safeTransferFromByOwner, tokenExist, totalSupplyCustom`, async function () {

      const { hardhatVipslad, owner, addrs } = await loadFixture(deployVipslandFixture);
      const [acc] = addrs;
      const tokenId = 1;
      const tokenIdNotMinted = 2;
  
      await hardhatVipslad.deployed();

      const notexist = await hardhatVipslad.existsCustom(tokenId);
      expect(notexist).to.equal(false);

      const supply_zero = await hardhatVipslad.totalSupplyCustom(tokenId);
      expect(supply_zero).to.equal(0);

      await hardhatVipslad.connect(owner).mintByOwner(tokenId);

      const exist = await hardhatVipslad.existsCustom(tokenId);
      expect(exist).to.equal(true);

      const supply = await hardhatVipslad.totalSupplyCustom(tokenId);
      expect(supply).to.equal(1);


      await expect(hardhatVipslad.connect(acc).mintByOwner(tokenId)
      ).to.be.revertedWith("Ownable: caller is not the owner");

      await expect(hardhatVipslad.connect(owner).mintByOwner(tokenId)
      ).to.be.revertedWith("Only once can be minted");


      await expect(hardhatVipslad.connect(owner).safeTransferFromByOwner(tokenIdNotMinted, owner.address)
      ).to.be.revertedWith("Token is not exist");

      await hardhatVipslad.connect(owner).safeTransferFromByOwner(tokenId, acc.address);

      await expect(hardhatVipslad.connect(acc).safeTransferFromByOwner(tokenId, owner.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
      
    });
    

  });

  describe("reveal logic ", function () {

    it(`${i++} toggleReveal(), uri()`, async function () {

      const { hardhatVipslad, owner, addrs } = await loadFixture(deployVipslandFixture);
      const [acc] = addrs;
      const tokenId = 1;
  
      await hardhatVipslad.deployed();

      const result = await hardhatVipslad.revealed();
      expect(result).to.equal(false);
      await hardhatVipslad.connect(owner).uri(tokenId);

      await hardhatVipslad.connect(owner).toggleReveal();

      const result_updated = await hardhatVipslad.revealed();
      expect(result_updated).to.equal(true);
      await hardhatVipslad.connect(owner).uri(tokenId);

      await expect(hardhatVipslad.connect(acc).toggleReveal()
      ).to.be.revertedWith("Ownable: caller is not the owner");
      
    });
    

  });

  
  describe("mintNONMP ", function () {

    it(`${i++} mintNONMP() for stage 1,  mintNONMPForNomalUser()`, async function () {

      const { hardhatVipslad, owner, addrs } = await loadFixture(deployVipslandFixture);
      const [acc] = addrs;
  
      await hardhatVipslad.deployed();

      await expect(hardhatVipslad.connect(owner).mintNONMP(acc.address, 0)
      ).to.be.revertedWith("Only allowed for caller");

      await expect(hardhatVipslad.connect(owner).mintNONMP(owner.address, 0)
      ).to.be.revertedWith("Presale PRT is not active");

      await hardhatVipslad.connect(owner).setPreSalePRT(1);
      const num = await hardhatVipslad.presalePRT();
      expect(num).to.equal(1);

      await expect(hardhatVipslad.connect(owner).mintNONMP(owner.address, 0)
      ).to.be.revertedWith("Amount needs to be greater than 0");

      await expect(hardhatVipslad.connect(owner).mintNONMP(owner.address, 36, { value: ethers.utils.parseUnits('5', 'ether')})
      ).to.be.revertedWith("Max mint per transaction is 35 tokens");
      
      await expect(hardhatVipslad.connect(owner).mintNONMP(owner.address, 35, { value: ethers.utils.parseUnits('0.001', 'ether')})
      ).to.be.reverted;//insufficient funds

      
      //default price must be keep as setup
      let PRICE_PRT_initial = await hardhatVipslad.PRICE_PRT();
      expect(PRICE_PRT_initial).to.equal(Number(ethers.utils.parseEther("0.123")).toString());
      await hardhatVipslad.connect(owner).mintNONMP(owner.address, 35, { value: ethers.utils.parseUnits(`${(0.123*1/2)*35}`, 'ether')})//test price calculation
      await hardhatVipslad.connect(owner).mintNONMP(owner.address, 5, { value: ethers.utils.parseUnits(`${(0.123*4/5)*5}`, 'ether')})//test price calculation
      await hardhatVipslad.connect(owner).mintNONMP(owner.address, 30, { value: ethers.utils.parseUnits('5', 'ether')})
      //default price must be keep as setup
      PRICE_PRT_initial = await hardhatVipslad.PRICE_PRT();
      expect(PRICE_PRT_initial).to.equal(Number(ethers.utils.parseEther("0.123")).toString());


      let _qnt_minter_by_user;
      _qnt_minter_by_user = await hardhatVipslad.userNONMPs(owner.address);
      expect(_qnt_minter_by_user).to.equal(70);

      await expect(hardhatVipslad.connect(owner).mintNONMP(owner.address, 35, { value: ethers.utils.parseUnits('5', 'ether')})
      ).to.be.revertedWith("The remain qty: 30");

      const tx = await hardhatVipslad.connect(owner).mintNONMP(owner.address, 30, { value: ethers.utils.parseUnits('5', 'ether')})
      
      //event DitributePRTs(address indexed acc, uint256 minted_amount, uint256 last_minted_NONMPID);
      let receipt = await tx.wait();
      let [r] = receipt.events?.filter((x) => {return x.event == "DitributePRTs"});
      expect(r.args.acc).to.equal(owner.address);
      expect(r.args.minted_amount).to.equal(100);
      const PRTID = await hardhatVipslad.PRTID();
      const MAX_SUPPLY_FOR_PRT_TOKEN = await hardhatVipslad.MAX_SUPPLY_FOR_PRT_TOKEN();
     
      const max_nonmpid = Number(PRTID)+Number(MAX_SUPPLY_FOR_PRT_TOKEN);
      expect(max_nonmpid).to.equal(160000);
     
      expect(r.args.last_minted_NONMPID < max_nonmpid).to.be.true;

      const _mintMPIsOpen = await hardhatVipslad.mintMPIsOpen();
      expect(_mintMPIsOpen).to.equal(false);

      //userNONMPs
      _qnt_minter_by_user = await hardhatVipslad.userNONMPs(owner.address);
      expect(_qnt_minter_by_user).to.equal(100);
      //mint max batch end start

      await expect(hardhatVipslad.connect(owner).mintNONMP(owner.address, 9, { value: ethers.utils.parseUnits('5', 'ether')})
      ).to.be.revertedWith("Limit is 100 tokens");



    });

    it(`${i++} mintNONMP() for stage 1,  test price and withdrawal to owner account`, async function () {

      const { hardhatVipslad, owner, addrs } = await loadFixture(deployVipslandFixture);
      const [acc] = addrs;
  
      await hardhatVipslad.deployed();
      await hardhatVipslad.connect(owner).setPreSalePRT(1);

      const res_before = await hardhatVipslad.connect(owner).contractBalance();
      expect(res_before).to.equal(0);
      console.log('res_before:::', ethers.utils.formatEther(res_before));

      const PRICE_PRT_initial = await hardhatVipslad.PRICE_PRT();
      expect(ethers.utils.formatEther(PRICE_PRT_initial)).to.equal('0.123');

      const pull_money = 10;
      await hardhatVipslad.connect(acc).mintNONMP(acc.address, 35, { value: ethers.utils.parseUnits(`${pull_money}`, 'ether')});

      const res_after = await hardhatVipslad.connect(owner).contractBalance();//fix: remove and check how to do it  without function
      console.log('res_after:::', pull_money-ethers.utils.formatEther(res_after));

      expect(ethers.utils.formatEther(res_after)>=`${35*(0.123/2)}`).to.be.true;

    });


    it(`${i++} mintNONMP() for stage 2,  mintNONMPForInternalTeam()`, async function () {

      const { hardhatVipslad, owner, addrs } = await loadFixture(deployVipslandFixture);
      const [acc] = addrs;
  
      await hardhatVipslad.deployed();

      await expect(hardhatVipslad.connect(owner).mintNONMP(acc.address, 0)
      ).to.be.revertedWith("Only allowed for caller");

      await expect(hardhatVipslad.connect(owner).mintNONMP(owner.address, 0)
      ).to.be.revertedWith("Presale PRT is not active");

      await hardhatVipslad.connect(owner).setPreSalePRT(2);
      const num = await hardhatVipslad.presalePRT();
      expect(num).to.equal(2);

      await expect(hardhatVipslad.connect(owner).mintNONMP(owner.address, 0)
      ).to.be.revertedWith("Amount needs to be greater than 0");

      await expect(hardhatVipslad.connect(owner).mintNONMP(owner.address, 36, { value: ethers.utils.parseUnits('5', 'ether')})
      ).to.be.revertedWith("Max mint per transaction is 35 tokens");
      
      await expect(hardhatVipslad.connect(owner).mintNONMP(owner.address, 35, { value: ethers.utils.parseUnits('0', 'ether')})
      ).to.be.not.reverted;//insufficient funds

      
      let PRICE_PRT_INTERNALTEAM_initial = await hardhatVipslad.PRICE_PRT_INTERNALTEAM();
      expect(PRICE_PRT_INTERNALTEAM_initial).to.equal(Number(ethers.utils.parseEther("0")).toString());

      await hardhatVipslad.connect(owner).mintNONMP(owner.address, 35, { value: ethers.utils.parseUnits('0', 'ether')})
      await hardhatVipslad.connect(owner).mintNONMP(owner.address, 5, { value: ethers.utils.parseUnits('0', 'ether')})

      let _qnt_minter_by_user;
      _qnt_minter_by_user = await hardhatVipslad.userNONMPs(owner.address);
      expect(_qnt_minter_by_user).to.equal(75);

      await expect(hardhatVipslad.connect(owner).mintNONMP(owner.address, 30, { value: ethers.utils.parseUnits('0', 'ether')})
      ).to.be.revertedWith("The remain qty: 25");


      const tx = await hardhatVipslad.connect(owner).mintNONMP(owner.address, 25, { value: ethers.utils.parseUnits('0', 'ether')})

      //event DitributePRTs(address indexed acc, uint256 minted_amount, uint256 last_minted_NONMPID);
      let receipt = await tx.wait();
      let [r] = receipt.events?.filter((x) => {return x.event == "DitributePRTs"});
      expect(r.args.acc).to.equal(owner.address);
      expect(r.args.minted_amount).to.equal(100);
      const PRTID = await hardhatVipslad.PRTID();
      const MAX_SUPPLY_FOR_PRT_TOKEN = await hardhatVipslad.MAX_SUPPLY_FOR_PRT_TOKEN();
      const MAX_SUPPLY_FOR_INTERNALTEAM_TOKEN = await hardhatVipslad.MAX_SUPPLY_FOR_INTERNALTEAM_TOKEN();
      
      const max_nonmpid = Number(PRTID)+Number(MAX_SUPPLY_FOR_PRT_TOKEN)+Number(MAX_SUPPLY_FOR_INTERNALTEAM_TOKEN);
      expect(max_nonmpid).to.equal(180000);

      expect(r.args.last_minted_NONMPID < max_nonmpid).to.be.true;

      const _mintInternalTeamMPIsOpen = await hardhatVipslad.mintInternalTeamMPIsOpen();
      expect(_mintInternalTeamMPIsOpen).to.equal(false);

      //userNONMPs
      _qnt_minter_by_user = await hardhatVipslad.userNONMPs(owner.address);
      expect(_qnt_minter_by_user).to.equal(100);

      await expect(hardhatVipslad.connect(owner).mintNONMP(owner.address, 9, { value: ethers.utils.parseUnits('5', 'ether')})
      ).to.be.revertedWith("Limit is 100 tokens");

    });

    it(`${i++} mintNONMP() for stage 3,  mintNONMPForAIRDROP()`, async function () {

      const { hardhatVipslad, owner, addrs } = await loadFixture(deployVipslandFixture);
      const [acc] = addrs;
  
      await hardhatVipslad.deployed();

      await expect(hardhatVipslad.connect(owner).mintNONMP(acc.address, 0)
      ).to.be.revertedWith("Only allowed for caller");

      await expect(hardhatVipslad.connect(owner).mintNONMP(owner.address, 0)
      ).to.be.revertedWith("Presale PRT is not active");

      await hardhatVipslad.connect(owner).setPreSalePRT(3);
      const num = await hardhatVipslad.presalePRT();
      expect(num).to.equal(3);

      await expect(hardhatVipslad.connect(owner).mintNONMP(owner.address, 0)
      ).to.be.revertedWith("Amount needs to be greater than 0");

      await expect(hardhatVipslad.connect(owner).mintNONMP(owner.address, 36, { value: ethers.utils.parseUnits('5', 'ether')})
      ).to.be.revertedWith("Max mint per transaction is 35 tokens");
      
      await expect(hardhatVipslad.connect(owner).mintNONMP(owner.address, 35, { value: ethers.utils.parseUnits('0', 'ether')})
      ).to.be.not.reverted;//insufficient funds

      
      let PRICE_PRT_AIRDROP_initial = await hardhatVipslad.PRICE_PRT_AIRDROP()
      expect(PRICE_PRT_AIRDROP_initial).to.equal(Number(ethers.utils.parseEther("0")).toString());

      await hardhatVipslad.connect(owner).mintNONMP(owner.address, 35, { value: ethers.utils.parseUnits('0', 'ether')})
      await hardhatVipslad.connect(owner).mintNONMP(owner.address, 5, { value: ethers.utils.parseUnits('0', 'ether')})

      let _qnt_minter_by_user;
      _qnt_minter_by_user = await hardhatVipslad.userNONMPs(owner.address);//fix:userNONMPs ..not suitable for all stages, userNONMPs(owner.address) total 100 for allstages or for each
      expect(_qnt_minter_by_user).to.equal(75);

      await expect(hardhatVipslad.connect(owner).mintNONMP(owner.address, 30, { value: ethers.utils.parseUnits('0', 'ether')})
      ).to.be.revertedWith("The remain qty: 25");


      const tx = await hardhatVipslad.connect(owner).mintNONMP(owner.address, 25, { value: ethers.utils.parseUnits('0', 'ether')})

      //event DitributePRTs(address indexed acc, uint256 minted_amount, uint256 last_minted_NONMPID);
      let receipt = await tx.wait();
      let [r] = receipt.events?.filter((x) => {return x.event == "DitributePRTs"});
      expect(r.args.acc).to.equal(owner.address);
      expect(r.args.minted_amount).to.equal(100);
      const PRTID = await hardhatVipslad.PRTID();
      const MAX_SUPPLY_FOR_PRT_TOKEN = await hardhatVipslad.MAX_SUPPLY_FOR_PRT_TOKEN();
      const MAX_SUPPLY_FOR_INTERNALTEAM_TOKEN = await hardhatVipslad.MAX_SUPPLY_FOR_INTERNALTEAM_TOKEN();
      const MAX_SUPPLY_FOR_AIRDROP_TOKEN = await hardhatVipslad.MAX_SUPPLY_FOR_AIRDROP_TOKEN();
      
      const max_nonmpid = Number(PRTID)+Number(MAX_SUPPLY_FOR_PRT_TOKEN)+Number(MAX_SUPPLY_FOR_INTERNALTEAM_TOKEN)+Number(MAX_SUPPLY_FOR_AIRDROP_TOKEN); 
      expect(max_nonmpid).to.equal(188888);

      expect(r.args.last_minted_NONMPID < max_nonmpid).to.be.true;

      const _mintAirdropMPIsOpen = await hardhatVipslad.mintAirdropMPIsOpen();
      expect(_mintAirdropMPIsOpen).to.equal(false);

      //userNONMPs
      _qnt_minter_by_user = await hardhatVipslad.userNONMPs(owner.address);//fix:userNONMPs for all stages?
      expect(_qnt_minter_by_user).to.equal(100);

      await expect(hardhatVipslad.connect(owner).mintNONMP(owner.address, 9, { value: ethers.utils.parseUnits('5', 'ether')})
      ).to.be.revertedWith("Limit is 100 tokens");

    });


  }) 


  describe("sendMP", function () {

    it(`${i++} sendMPNormalUsers() `, async function () {

      const { hardhatVipslad, owner, addrs } = await loadFixture(deployVipslandFixture);
      const [acc] = addrs;
  
      await hardhatVipslad.deployed();

      await expect(hardhatVipslad.connect(owner).sendMPNormalUsers()).to.be.revertedWith("Mint is not open");

      await hardhatVipslad.connect(owner).toggleMintMPIsOpen();
      const _mintMPIsOpen = await hardhatVipslad.mintMPIsOpen();
      expect(_mintMPIsOpen).to.equal(true);

      for (let i = 1; i < 10; i++) {//fix: it is run 9 times istead of 10.
        console.log(`${i} sendMPNormalUsers`)
        await expect(hardhatVipslad.connect(owner).sendMPNormalUsers()
        ).to.be.not.reverted
        }

      await expect(hardhatVipslad.connect(owner).sendMPNormalUsers()
      ).to.be.revertedWith('All MPs are issued for normal user');

    });



  });



});



    // it(`${i++}uld emit Transfer events`, async function () {
    //   const { hardhatVipslad, owner, addr1, addr2 } = await loadFixture(
    //     deployVipslandFixture
    //   );

    //   // Transfer 50 tokens from owner to addr1
    //   await expect(hardhatVipslad.transfer(addr1.address, 50))
    //     .to.emit(hardhatVipslad, "Transfer")
    //     .withArgs(owner.address, addr1.address, 50);

    //   // Transfer 50 tokens from addr1 to addr2
    //   // We use .connect(signer) to send a transaction from another account
    //   await expect(hardhatVipslad.connect(addr1).transfer(addr2.address, 50))
    //     .to.emit(hardhatVipslad, "Transfer")
    //     .withArgs(addr1.address, addr2.address, 50);
    // });

    // it(`${i++}uld fail if sender doesn't have enough tokens`, async function () {
    //   const { hardhatVipslad, owner, addr1 } = await loadFixture(
    //     deployVipslandFixture
    //   );
    //   const initialOwnerBalance = await hardhatVipslad.balanceOf(owner.address);

    //   // Try to send 1 token from addr1 (0 tokens) to owner (1000 tokens).
    //   // `require` will evaluate false and revert the transaction.
    //   await expect(
    //     hardhatVipslad.connect(addr1).transfer(owner.address, 1)
    //   ).to.be.revertedWith("Not enough tokens");

    //   // Owner balance shouldn't have changed.
    //   expect(await hardhatVipslad.balanceOf(owner.address)).to.equal(
    //     initialOwnerBalance
    //   );
    // });