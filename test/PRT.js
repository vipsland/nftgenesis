const { expect } = require("chai");
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


describe("PRT contract", function () {
  async function deployPRTFixture() {
    const PRT = await ethers.getContractFactory("PRT");
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();

    const hardhatPRT = await PRT.deploy();

    await hardhatPRT.deployed();

    return { PRT, hardhatPRT, owner, addr1, addr2 };
  }

  let i = 1;

  beforeEach(async () => {

  });


  describe("Deployment", function () {
    it(`${i++} Should set the right owner`, async function () {

      const PRT = await ethers.getContractFactory("PRT");
      const [owner, addr1, addr2] = await ethers.getSigners();
  
      const hardhatPRT = await PRT.deploy();
  
      await hardhatPRT.deployed();

      expect(await hardhatPRT.owner()).to.equal(owner.address);
    });
  });

  describe("Transactions", function () {
    it(`${i++} Should transfer tokens between accounts`, async function () {
      const PRT = await ethers.getContractFactory("PRT");
      const [owner, addr1, addr2] = await ethers.getSigners();
  
      const hardhatPRT = await PRT.deploy();
  
      await hardhatPRT.deployed();
  
      await hardhatPRT.connect(owner).withdraw();

      const res = await hardhatPRT.balanceOf();
      
      expect(res.value.toNumber()).to.equal(0);

    });

  });


  describe("Toggles", function () {
   
    it(`${i++} togglePreSalePRT`, async function () {

      const PRT = await ethers.getContractFactory("PRT");
      const [owner, addr1, addr2] = await ethers.getSigners();
  
      const hardhatPRT = await PRT.deploy();
  
      await hardhatPRT.deployed();

      await hardhatPRT.connect(owner).togglePreSalePRT();

      const isActive = await hardhatPRT.presalePRT();

      expect(isActive).to.equal(true);
    });
    

    it(`${i++} togglePresalepPRTDone`, async function () {

      const PRT = await ethers.getContractFactory("PRT");
      const [owner, addr1, addr2] = await ethers.getSigners();
  
      const hardhatPRT = await PRT.deploy();
  
      await hardhatPRT.deployed();

      await hardhatPRT.connect(owner).togglePreSalePRT();

      const isActive = await hardhatPRT.presalePRT();

      expect(isActive).to.equal(true);
    });
       
  });

  describe("sendMP", function () {

    it(`${i++} connect(owner).sendMP(), presalepPRTDone: false`, async function () {

      const PRT = await ethers.getContractFactory("PRT");
      const [owner, addr1, addr2] = await ethers.getSigners();
  
      const hardhatPRT = await PRT.deploy();
  
      await hardhatPRT.deployed();

      await expect(hardhatPRT.connect(owner).sendMP()).to.be.revertedWith("Sale PRT is Not Done");

    });


    it(`${i++} sendMP, presalepPRTDone: true, only Owner can call`, async function () {

      const PRT = await ethers.getContractFactory("PRT");
      const [owner, addr1, addr2] = await ethers.getSigners();
  
      const hardhatPRT = await PRT.deploy();
  
      await hardhatPRT.deployed();

      await hardhatPRT.connect(owner).togglePresalepPRTDone();

      const isActive = await hardhatPRT.presalepPRTDone();

      expect(isActive).to.equal(true);

      await expect(hardhatPRT.connect(addr1).sendMP()
    ).to.be.revertedWith("Ownable: caller is not the owner");

    });
    
  
    it(`${i++} sendMP, presalepPRTDone: true, test increment from 0 to 10000, iterate the list \"in chunks\" 1000 each `, async () => {

      const provider = waffle.provider;

      const PRT = await ethers.getContractFactory("PRT");
      const [owner, addr1, addr2] = await ethers.getSigners();
      const balance0ETHOwner = await provider.getBalance(owner.address);
      
      console.log({balance0ETHOwner, address: owner.address});

      const hardhatPRT = await PRT.deploy();
  
      await hardhatPRT.deployed();

      const contractBalance = await provider.getBalance(hardhatPRT.address);
      console.log({contractBalance});
      
      await hardhatPRT.connect(owner).togglePresalepPRTDone();
      await delay(1000);

      const presalepPRTDone = await hardhatPRT.presalepPRTDone();

      console.log({presalepPRTDone});

      expect(presalepPRTDone).to.equal(true);


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
          ]).it(`expected: %d, %d, %d`, async (expectedCnt, expectedF, expectedL) => {
      
            const gasEstimated = await hardhatPRT.estimateGas.sendMP();
            // expect(gasEstimated).to.equal(4505532);
            const tx = await hardhatPRT.connect(owner).sendMP({gasLimit: gasEstimated});//value: ethers.utils.parseEther("1.0"), gasLimit: 35000000
            let receipt = await tx.wait();
            let r = receipt.events?.filter((x) => {return x.event == "RTWinnerTokenID"});
            r =  r.map(i => {
              const winnerTokenPRTID = i.args.winnerTokenPRTID.toNumber();

              return ({index: i.args.index.toNumber(), winnerTokenPRTID, counter: i.args.counter.toNumber()  });
            });

            const [f] = r;
            const [l] = r.slice(-1);
      
            console.log(`received:`, f.counter, f.index, l.index);
      
            expect(JSON.stringify({f:f.index, l: l.index})).to.equal(`{"f":${expectedF},"l":${expectedL}}`);
            expect(f.counter).to.equal(expectedCnt);
      
      
      
          });
          

    });
   

    
  });


  describe("buyPRT", function () {

    it(`${i++} MAX_SUPPLY_PRT test`, async function () {

      const PRT = await ethers.getContractFactory("PRT");
      const [owner, addr1, addr2] = await ethers.getSigners();
  
      const hardhatPRT = await PRT.deploy();
  
      await hardhatPRT.deployed();

      const max_supply = await hardhatPRT.MAX_SUPPLY_PRT();

      expect(max_supply.toString()).to.equal('160000');

    });

    it(`${i++} connect(owner).buyPRT(), presalePRT: false`, async function () {

      const PRT = await ethers.getContractFactory("PRT");
      const [owner, addr1, addr2] = await ethers.getSigners();
  
      const hardhatPRT = await PRT.deploy();
  
      await hardhatPRT.deployed();

      await expect(hardhatPRT.connect(owner).buyPRT(addr1.address, 0)
    ).to.be.revertedWith("Presale PRT is not open.");

    });

    it(`${i++} connect(owner).buyPRT(), presalePRT: true`, async function () {

      const PRT = await ethers.getContractFactory("PRT");
      const [owner, addr1, addr2] = await ethers.getSigners();
  
      const hardhatPRT = await PRT.deploy();
  
      await hardhatPRT.deployed();

      await hardhatPRT.connect(owner).togglePreSalePRT();

      const isActive = await hardhatPRT.presalePRT();

      expect(isActive).to.equal(true);

      await expect(hardhatPRT.connect(owner).buyPRT(addr1.address, 0)
    ).to.be.revertedWith("Only allowed for caller");
      await expect(hardhatPRT.connect(owner).buyPRT(owner.address, 0)
    ).to.be.revertedWith("Owner of contract can not buy PRT");
    });

    it(`${i++} connect(addr1).buyPRT(), presalePRT: true, MAX_BUYABLE_AMOUNT = 0`, async function () {

      const PRT = await ethers.getContractFactory("PRT");
      const [owner, addr1, addr2] = await ethers.getSigners();
  
      const hardhatPRT = await PRT.deploy();
  
      await hardhatPRT.deployed();

      await hardhatPRT.connect(owner).togglePreSalePRT();

      const isActive = await hardhatPRT.presalePRT();

      expect(isActive).to.equal(true);

      await expect(hardhatPRT.connect(addr1).buyPRT(addr1.address, 0)
    ).to.be.revertedWith("Amount buyable needs to be greater than 0");
    });


    it(`${i++} connect(addr1).buyPRT(), presalePRT: true, MAX_BUYABLE_AMOUNT > 100`, async function () {

      const PRT = await ethers.getContractFactory("PRT");
      const [owner, addr1, addr2] = await ethers.getSigners();
  
      const hardhatPRT = await PRT.deploy();
  
      await hardhatPRT.deployed();

      await hardhatPRT.connect(owner).togglePreSalePRT();

      const isActive = await hardhatPRT.presalePRT();

      expect(isActive).to.equal(true);

      const balance = await addr1.getBalance();
      expect(balance >= 100000000000000000).to.equal(true);

      await expect(hardhatPRT.connect(addr1).buyPRT(addr1.address, 101, { value: ethers.utils.parseUnits('1', 'ether')} )
    ).to.be.revertedWith("You can't mint so much tokens");
    
    });

    it(`${i++} connect(addr1).buyPRT(), presalePRT: true, weiBalanceWallet = 0 ether `, async function () {

      const PRT = await ethers.getContractFactory("PRT");
      const [owner, addr1, addr2] = await ethers.getSigners();
  
      const hardhatPRT = await PRT.deploy();
  
      await hardhatPRT.deployed();

      await hardhatPRT.connect(owner).togglePreSalePRT();

      const isActive = await hardhatPRT.presalePRT();

      expect(isActive).to.equal(true);

      await expect(hardhatPRT.connect(addr1).buyPRT(addr1.address, 100)
    ).to.be.revertedWith("Min 0.01 ether");

    });


    it(`${i++} connect(addr1).buyPRT(), presalePRT: true, weiBalanceWallet > 0.1 ether, _presaleClaimedAmount <= 100, TransferFromToContract is emitted, DitributePRTs is emitted, total distribution 30 tokens per account`, async function () {

      const PRT = await ethers.getContractFactory("PRT");
      const [owner, addr1, addr2] = await ethers.getSigners();
  
      const hardhatPRT = await PRT.deploy();
  
      await hardhatPRT.deployed();

      await hardhatPRT.connect(owner).togglePreSalePRT();

      const isActive = await hardhatPRT.presalePRT();

      expect(isActive).to.equal(true);

      const balance = await addr1.getBalance();
      expect(balance >= 100000000000000000).to.equal(true);

      //ethers.utils.parseEther("1.0")
      await expect(hardhatPRT.connect(addr1).buyPRT(addr1.address, 10, { value: ethers.utils.parseUnits('1', 'ether')}))
      .to.emit(hardhatPRT, "TransferFromToContract")
      .withArgs(addr1.address, "100000000000000000");

      await expect(hardhatPRT.connect(addr1).buyPRT(addr1.address, 10, { value: ethers.utils.parseUnits('1', 'ether')}))
      .to.emit(hardhatPRT, "DitributePRTs");

      const tx = await hardhatPRT.connect(addr1).buyPRT(addr1.address, 10, { value: ethers.utils.parseUnits('1', 'ether')});
      let receipt = await tx.wait();
      let [r] = receipt.events?.filter((x) => {return x.event == "DitributePRTs"});
      expect(r.args.from).to.equal(addr1.address);
      console.log(r.args.list);
      const [firstPRTIndex] = r.args.list;
      const latestPRTIndex = r.args.list[r.args.list.length-1]
      expect(firstPRTIndex).to.equal(20001);
      expect(latestPRTIndex).to.equal(20030);
      expect(r.args.list.length).to.equal(30);

      const _tokenPRTID_index = await hardhatPRT._tokenPRTID_index();

      expect(_tokenPRTID_index).to.equal(30);

    });

    it(`${i++} connect(addr1).buyPRT(), presalePRT: true, weiBalanceWallet > 0.1 ether, test 2 accounts`, async function () {

      const PRT = await ethers.getContractFactory("PRT");
      const [owner, addr1, addr2] = await ethers.getSigners();
  
      const hardhatPRT = await PRT.deploy();
  
      await hardhatPRT.deployed();

      await hardhatPRT.connect(owner).togglePreSalePRT();

      const isActive = await hardhatPRT.presalePRT();

      expect(isActive).to.equal(true);

      const balance = await addr1.getBalance();

      expect(isActive).to.equal(balance >= '100000000000000000');

      //ACCOUNT:addr1 ethers.utils.parseEther("1.0"), 2 enrty
            let _tokenPRTID_index;

            await hardhatPRT.connect(addr1).buyPRT(addr1.address, 55, { value: ethers.utils.parseUnits('1', 'ether')});
            
            _tokenPRTID_index = await hardhatPRT._tokenPRTID_index();

            expect(_tokenPRTID_index).to.equal(55);

            await hardhatPRT.connect(addr1).buyPRT(addr1.address, 65, { value: ethers.utils.parseUnits('1', 'ether') });

            _tokenPRTID_index = await hardhatPRT._tokenPRTID_index();

            expect(_tokenPRTID_index).to.equal(100);//not more than 100 per account


      //ACCOUNT:addr1 ethers.utils.parseEther("1.0"), 3 enrty
            await hardhatPRT.connect(addr2).buyPRT(addr2.address, 35, { value: ethers.utils.parseUnits('1', 'ether')});
                
            _tokenPRTID_index = await hardhatPRT._tokenPRTID_index();

            expect(_tokenPRTID_index).to.equal(135);//100+35

            await hardhatPRT.connect(addr2).buyPRT(addr2.address, 25, { value: ethers.utils.parseUnits('1', 'ether') });

            _tokenPRTID_index = await hardhatPRT._tokenPRTID_index();

            expect(_tokenPRTID_index).to.equal(160);//100+35+25      

            await hardhatPRT.connect(addr2).buyPRT(addr2.address, 65, { value: ethers.utils.parseUnits('1', 'ether') });

            _tokenPRTID_index = await hardhatPRT._tokenPRTID_index();

            expect(_tokenPRTID_index).to.equal(200);//100+35+25+65, not more than 100 per account       

    
    });

    //we run this test for all accounts
    it(`${i++} connect all accounts - 1600,  call .buyPRT() 3 times, presalePRT: true, weiBalanceWallet > 0.1 ether, account exceded 100 tokens`, async function () {

      const PRT = await ethers.getContractFactory("PRT");
      const accounts = await ethers.getSigners();
      
      const [owner, ...acts] = accounts;
  
      const hardhatPRT = await PRT.deploy();
  
      await hardhatPRT.deployed();

      await hardhatPRT.connect(owner).togglePreSalePRT();

      const isActive = await hardhatPRT.presalePRT();

      expect(isActive).to.equal(true);

      //we exclude owner of contract. because owner of contract can not buy PRT
      //try first 5 accounts ...acts.splice(0,5)
      forEach([...acts.splice(0,5)].map((acc, index) => {return [acc, index]})).it(`signerWithAddress`, async (acc, index) => {
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


    });



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