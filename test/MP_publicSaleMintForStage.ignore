const { expect } = require("chai");
const chai = require("chai");
const { ethers, waffle } = require("hardhat");
const { solidity } = require("ethereum-waffle");
const { BigNumber } = require("ethers");
const forEach = require('mocha-each');
const { advanceBlock } = require("@nomicfoundation/hardhat-network-helpers/dist/src/helpers/time");
chai.use(solidity);
const fs = require("fs");
const { doesNotMatch } = require("assert");


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


  describe("publicSaleMintForStage", function () {

    //we run this test for all accounts
    it.only(`${i++} test publicSaleMintForStage`, async function (done) {

      const PRT = await ethers.getContractFactory("PRT");
      const accounts = await ethers.getSigners();
      
      const [owner, ...acts] = accounts;
  
      const hardhatPRT = await PRT.deploy();
  
      await hardhatPRT.deployed();

      await hardhatPRT.connect(owner).togglePreSalePRT();

      const isActive = await hardhatPRT.presalePRT();

      expect(isActive).to.equal(true);


      var file = fs.createWriteStream('./output/publicSaleMintForStage.txt', {flags: 'a'});

      forEach([...acts].map((acc, index) => {return [acc, index]})).it.only(`signerWithAddress`, async (acc, index) => {
        const idx = index+1;
        const balance = await acc.getBalance();
        console.log(`account ${idx}`, acc.address, {balance});

         //account ${index} we execute 3 times total buyPRT()
         const rand_amount = Math.floor(Math.random()*100)+1 
         const tx = await hardhatPRT.connect(acc).publicSaleMintForStage({ value: ethers.utils.parseUnits('1', 'ether') });
         //check list distributed MP per account
         let receipt = await tx.wait();
        
         //event Minter(address indexed from, uint256 tokenID, uint256 counterTokenID); 
         let [r] = receipt.events?.filter((x) => {return x.event == "Minter"});
         expect(r.args.from).to.equal(acc.address);


         //writeStream
         file.write(`${JSON.stringify([r.args.from, r.args.tokenID.toNumber(), r.args.counterTokenID.toNumber()])},\r\n`, (err) => {
             if (err) {
                 console.log('Error:', err.message);
             }else{
                 console.log('Done Written');
             }
         });


      });

      file.on('finish', () => {
        console.log('wrote all data to file');
      });
      file.on('error', function(err) { console.log(`ERR`,{err}) });

      file.end();
      done()

    });



  });


});

