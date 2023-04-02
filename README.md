# Docus

https://hardhat.org/hardhat-runner/docs/guides/compile-contracts

# Deploy

npx hardhat run --network goerli ./scripts/deploy.js

# Console Debug Hardhat

npx hardhat console --network goerli

```

https://github.com/NomicFoundation/hardhat/issues/851
https://hardhat.org/hardhat-runner/docs/advanced/hardhat-runtime-environment
https://docs.ethers.io/v5/
```

# Verify

```
# for remix abi endcoded for sontructor can use https://abi.hashex.org/

npx hardhat run  ./scripts/verifyContract.js --network goerli
https://hardhat.org/hardhat-runner/docs/guides/verifying

#verified latest code
https://goerli.etherscan.io/address/0x2fb7Ac8fe35C3B42fDeFe47d605ef7b21242210a#code


npx hardhat verify --network goerli --constructor-args arguments.js 0x81ccA6cE5169C6BC4858587F1852238D32c8cA54

```

# Hadrhad

```
###Try running some of the following tasks:
npx hardhat node
npx hardhat help

```

# Test

```

yarn
npx hardhat compile

#check accounts
npx hardhat accounts

# with coveage
npx hardhat coverage --network hardhat
open coverage/index.html

#with clean /output
yarn clean && npx hardhat test --network hardhat

npx hardhat test --network hardhat
#one file
npx hardhat test --network hardhat ./test/Vipsland.js

#with write log from console to file
npx hardhat test --network hardhat ./test/Vipsland.js &> output.txt     
```

# Faucet

## Metamask goerli how to faucet

https://faucets.chain.link/goerli

## Metamask Goerli how to faucet

https://goerlifaucet.com/

# Remix cli

```
http://remix.ethereum.org/

https://www.npmjs.com/package/@remix-project/remixd

npx remixd -s . --remix-ide https://remix.ethereum.org

```

# How to use it.each with hardhat provided in example

```
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

```

# Fullstack Client

```bash


  yarn install            # Download packages
  yarn dev            # Run the dev server
```

## Tech Stack

**Client:** React, TailwindCSS, web3.js

**Server:** Alchemy, NextJS, Hardhat

# Ganache CLI

```
HD Wallet
==================
Mnemonic:      ***
Base HD Path:  m/44'/60'/0'/0/{account_index}


npx ganache-cli --deterministic --mnemonic ""


```

## Reveal NFTs

https://www.youtube.com/watch?v=19SSvs32m8I

## Test Mint Batch

```

#1
npx hardhat test --network hardhat ./test/PRT_only_sendMP_and_save_logs.js

#2
get array of 10k generated ids

#3
node mint-nft.js

#4 or mint batch
node mint-nft-batch.js
```

## Lint and Prettier

```

#prettier
yarn prettier:solidity

#lint
npx solhint -f table contracts/Vipsland.sol

```

## Switcher

```
function setPreSalePRT(uint8 num) public onlyOwner onlyAllowedNum(num) {
    //1. nonmp is open {4,5,6,7}
    //2. we want generated lucky NONMP and fetch winners and distribute MP token . we open mintMPIsOpen = true , and call sendMPForNOrmalUsers

    //000 = 0 //presale prt is not active.
    //111 = 7 //open for everyone.
    //
    //        1 = airdrop
    //      1 0 = internal team
    //    1 0 0 = normal user
    // e.g.
    // 1 = airdrop
    // 2 = internal team
    // 3 = air + int
    // 4 = norm usr   // when them all sold
    // 5 = norm + air
    // 6 = norm + int
    // 7 = everybody
    // internal team + normal = binary 1 1 0 = 4 + 2 = 6
    // airdrop + internal team = binary 1 1 = 2 + 1 = 3
    // normal user + airdrop = binary 1 0 1 = 4 + 1 = 5
    // internal team + normal = binary 1 1 0 = 4 + 2 = 6
    // binary 1 0 0 = dec 4 = normal user
    // decimal 0 - 7
```
