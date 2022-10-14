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
    it.only(`${i++} connect all accounts - 1600,  call .buyPRT() 3 times, presalePRT: true, weiBalanceWallet > 0.1 ether, account exceded 100 tokens`, async function () {

      const PRT = await ethers.getContractFactory("PRT");
      const accounts = await ethers.getSigners();
      
      const [owner, ...acts] = accounts;
  
      const hardhatPRT = await PRT.deploy();
  
      await hardhatPRT.deployed();

      await hardhatPRT.connect(owner).togglePreSalePRT();

      const isActive = await hardhatPRT.presalePRT();

      expect(isActive).to.equal(true);


      var file = fs.createWriteStream('./output/PRTs.json');
      file.on('error', function(err) { console.log(err) });

      //we exclude owner of contract. because owner of contract can not buy PRT
      //try first 5 accounts ...acts.splice(0,5)
      forEach([...acts].map((acc, index) => {return [acc, index]})).it.only(`signerWithAddress`, async (acc, index) => {
        const idx = index+1;
        const balance = await acc.getBalance();
        expect(balance >= '100000000000000000').to.equal(true);
        console.log(`account ${idx}`, acc.address);
        if (idx > 1601) {

            //test presale PRT is done√
            await expect(hardhatPRT.connect(acc).buyPRT(acc.address, 55, { value: ethers.utils.parseUnits('1', 'ether') })
            ).to.be.revertedWith("Presale PRT is done.");

            const ispresalepPRTDone = await hardhatPRT.presalepPRTDone();
            expect(ispresalepPRTDone).to.equal(true);
    
        } else {

            //account ${index} we execute 3 times total buyPRT()
            await hardhatPRT.connect(acc).buyPRT(acc.address, 55, { value: ethers.utils.parseUnits('1', 'ether')});
            const tx = await hardhatPRT.connect(acc).buyPRT(acc.address, 55, { value: ethers.utils.parseUnits('1', 'ether') });
  
            //check list distributed PRT per account
            let receipt = await tx.wait();
            let [r] = receipt.events?.filter((x) => {return x.event == "DitributePRTs"});
            expect(r.args.from).to.equal(acc.address);
  
            //EmitPresalepPRTDone if index==1599
            let [env] = receipt.events?.filter((x) => {return x.event == "EmitPresalepPRTDone"});
            expect(env.args.msg).to.equal(idx == 1600 ? `Presale PRT is done.` : `Presale PRT is not done yet.`);
            console.log(`EmitPresalepPRTDone event emit`, env.args.msg)
  
            //PRT distributed per account
            console.log(`PRTs for ${acc.address}:`,r.args.list.join(','));

            //writeStream
            file.write(`${JSON.stringify([acc.address, r.args.list.join(',')])},\r\n`);
            
            //length equal 100            
            expect(r.args.list.length).to.equal(100);//we distribute per account 100
        
  
            //revert with error is account exceded 100
            await expect(hardhatPRT.connect(acc).buyPRT(acc.address, 55, { value: ethers.utils.parseUnits('1', 'ether') })
            ).to.be.revertedWith("You have exceeded 100 raffle tickets limit");
  
  
            //check contractBalance is increase for each account PRICE_PRT * 100
            const provider = waffle.provider;
            const contractBalance = await provider.getBalance(hardhatPRT.address);
            console.log({contractBalance});
            expect(Number(contractBalance).toString()).to.equal(100*(idx)*10000000000000000+'');

        }

      });


      //file.end();

    });



  });


});

