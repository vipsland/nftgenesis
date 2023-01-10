const { expect } = require("chai");
const chai = require("chai");
const { ethers, waffle } = require("hardhat");
const { solidity } = require("ethereum-waffle");
const { BigNumber } = require("ethers");
const forEach = require('mocha-each');
const { advanceBlock } = require("@nomicfoundation/hardhat-network-helpers/dist/src/helpers/time");
chai.use(solidity);
const fs = require("fs");


async function delay(mls) {
  return new Promise(resolve => {setTimeout(() => resolve(),mls)})
}


describe("PRT contract", function () {
  async function deployPRTFixture() {
    const PRT = await ethers.getContractFactory("PRT");
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();

    const hardhatPRT = await PRT.deploy();

    await hardhatPRT.deployed();

    return { PRT, hardhatPRT, owner, addr1, addr2 };
  }

  let i = 1;


  describe("buyPRT", function () {

    //we run this test for all accounts
    it.only(`${i++} testForNomalUser`, async function () {

      const PRT = await ethers.getContractFactory("PRT");
      const accounts = await ethers.getSigners();
      
      const [owner, ...acts] = accounts;
  
      const hardhatPRT = await PRT.deploy();
  
      await hardhatPRT.deployed();

      await hardhatPRT.connect(owner).togglePreSalePRT();

      const isActive = await hardhatPRT.presalePRT();

      expect(isActive).to.equal(true);


      var file = fs.createWriteStream('./output/testForInternalTeamPRT.txt', {flags: 'a'});

      forEach([...acts].map((acc, index) => {return [acc, index]})).it.only(`signerWithAddress`, async (acc, index) => {
        const idx = index+1;
        const balance = await acc.getBalance();
        console.log(`account ${idx}`, acc.address, {balance});

         //account ${index} we execute 3 times total buyPRT()
         const rand_amount = Math.floor(Math.random()*100)+1 
         const tx = await hardhatPRT.connect(acc).testForInternalTeam(acc.address, rand_amount);
         //check list distributed PRT per account
         let receipt = await tx.wait();
        
        //event TestGetNextNONMPIDEvent(address acc, uint256 initID, uint256 _qnt);
         let [r] = receipt.events?.filter((x) => {return x.event == "TestGetNextNONMPIDEvent"});
         expect(r.args.acc).to.equal(acc.address);


         //writeStream
         file.write(`${JSON.stringify([acc.address, r.args.initID.toNumber(), r.args._qnt.toNumber()])},\r\n`, (err) => {
             if (err) {
                 console.log('Error:', err.message);
             }else{
                 console.log('Done Written');
             }
         });


         //check contractBalance is increase for each account PRICE_PRT * 100
         const provider = waffle.provider;
         const contractBalance = await provider.getBalance(hardhatPRT.address);
         console.log({contractBalance});


      });

      file.on('finish', () => {
        console.log('wrote all data to file');
      });
      file.on('error', function(err) { console.log(`ERR`,{err}) });

      // file.end();

    });



  });


});

