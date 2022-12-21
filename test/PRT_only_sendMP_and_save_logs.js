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
 
  let i = 1;

  describe("sendM and save lotery PRT to ./output/PRTs_lotery.json", function () {
  
    it.only(`${i++} sendMP, presalepPRTDone: true, test increment from 0 to 10000, iterate the list \"in chunks\" 1000 each `, async () => {

      const provider = waffle.provider;

      const PRT = await ethers.getContractFactory("PRT");
      const [owner, addr1, addr2] = await ethers.getSigners();
      const balance0ETHOwner = await provider.getBalance(owner.address);
      
      console.log({balance0ETHOwner, address: owner.address});

      const hardhatPRT = await PRT.deploy();
  
      await hardhatPRT.deployed();

      const contractBalance = await provider.getBalance(hardhatPRT.address);
      console.log({contractBalance});
      
      await hardhatPRT.connect(owner).togglePreSalePRT();
      await delay(1000);

      const presalePRT = await hardhatPRT.presalePRT();

      console.log({presalePRT});

      expect(presalePRT).to.equal(true);

      await hardhatPRT.connect(owner).toggleMintIsOpen();
      await delay(1000);

      const mintIsOpen = await hardhatPRT.mintIsOpen();

      console.log({mintIsOpen});
      expect(mintIsOpen).to.equal(true);
      let tokens = ``;
      

          var file = fs.createWriteStream('./output/PRTs_lotery.txt', {flags: 'a'});

          //call 10 times, as we can not call this function only once
          forEach([
            [1, 0, 999 ],
            [2, 1000, 1999 ],
            [3, 2000, 2999 ],
            [4, 3000, 3999 ],
            [5, 4000, 4999 ],
            [6, 5000, 5999 ],
            [7, 6000, 6999 ],
            [8, 7000, 7999 ],
            [9, 8000, 8999 ],
            [10, 9000, 9999 ]
          ]).it.only(`expected: %d, %d, %d`, async (expectedCnt, expectedF, expectedL) => {
      
            const gasEstimated = await hardhatPRT.estimateGas.sendMP();
            // expect(gasEstimated).to.equal(4505532);
            const tx = await hardhatPRT.connect(owner).sendMP({gasLimit: gasEstimated});//value: ethers.utils.parseEther("1.0"), gasLimit: 35000000
            let receipt = await tx.wait();
            let r = receipt.events?.filter((x) => {return x.event == "RTWinnerTokenID"});
            r =  r.map(i => {
              const winnerTokenPRTID = i.args.winnerTokenPRTID.toNumber();
              //writeStream
              console.log({winnerTokenPRTID})
              file.write(`"${JSON.stringify(winnerTokenPRTID)}",`, (err) => {
                  if (err) {
                      console.log('Error:', err.message);
                  }else{
                      console.log('Done Written');
                  }
              });
             
                              tokens = `${tokens},${winnerTokenPRTID}`
              return ({index: i.args.index.toNumber(), winnerTokenPRTID, counter: i.args.counter.toNumber()  });
            });

            const [f] = r;
            const [l] = r.slice(-1);
      
            console.log(`received:`, f.counter, f.index, l.index);
      
            expect(JSON.stringify({f:f.index, l: l.index})).to.equal(`{"f":${expectedF},"l":${expectedL}}`);
            expect(f.counter).to.equal(expectedCnt);
      
      
      
          });

          file.on('finish', () => {
            console.log('wrote all data to file');
          });
          file.on('error', function(err) { console.log(`ERR`,{err}) });

          // file.end();
          

    })
   

    
  });




});



    // it(`${i++}uld emit Transfer events`, async function () {
    //   const { hardhatPRT, owner, addr1, addr2 } = await loadFixture(
    //     deployPRTFixture
    //   );

    //   // Transfer 50 tokens from owner to addr1
    //   await expect(hardhatPRT.transfer(addr1.address, 50))
    //     .to.emit(hardhatPRT, "Transfer")
    //     .withArgs(owner.address, addr1.address, 50);

    //   // Transfer 50 tokens from addr1 to addr2
    //   // We use .connect(signer) to send a transaction from another account
    //   await expect(hardhatPRT.connect(addr1).transfer(addr2.address, 50))
    //     .to.emit(hardhatPRT, "Transfer")
    //     .withArgs(addr1.address, addr2.address, 50);
    // });

    // it(`${i++}uld fail if sender doesn't have enough tokens`, async function () {
    //   const { hardhatPRT, owner, addr1 } = await loadFixture(
    //     deployPRTFixture
    //   );
    //   const initialOwnerBalance = await hardhatPRT.balanceOf(owner.address);

    //   // Try to send 1 token from addr1 (0 tokens) to owner (1000 tokens).
    //   // `require` will evaluate false and revert the transaction.
    //   await expect(
    //     hardhatPRT.connect(addr1).transfer(owner.address, 1)
    //   ).to.be.revertedWith("Not enough tokens");

    //   // Owner balance shouldn't have changed.
    //   expect(await hardhatPRT.balanceOf(owner.address)).to.equal(
    //     initialOwnerBalance
    //   );
    // });