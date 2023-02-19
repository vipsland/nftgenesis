/**
 *  This script will calculate the constructor arguments for PRT.sol and deploy it.
 *  After deploying, you can access the contract on etherscan.io with the deployed contract address.
 */

const hre = require('hardhat')
// const { MerkleTree } = require('merkletreejs')
// const keccak256 = require('keccak256')
// const whitelist = require('./whitelist.js')

// const BASE_URI = 'ipfs://Qmb5A1fFECM2iFHgUioii2khT814nCi6VU9aHXHHqNxHCK/'
// const proxyRegistryAddressGoerli = '0xC6CD41b08DC8f9124933d377431480c69F1e1C9f'
// const proxyRegistryAddressMainnet = '0xa5409ec958c83c3f309868babaca7c86dcb077c1'

async function main() {
  // Calculate merkle root from the whitelist array
  // const leafNodes = whitelist.map((addr) => keccak256(addr))
  // const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true })
  // const root = merkleTree.getRoot()
  // Deploying contracts with the account: 0x99fEDB8bB1A0d4aa63D825a8333B7275A04d5ed8

  const signers = await ethers.getSigners()
  const [deployer] = signers

  console.log('Deploying contracts with the account:', deployer.address)

  console.log('Account balance:', (await deployer.getBalance()).toString())


  //payment splitter
  const _team = [
    '0xEd1CB7ef54321835C53a59cC94a816BCF47fEE11', // miukki account gets 5% of the total revenue
    '0x1Fde442744D300b6405e10A6F63Bf491d94afDE1' // sam Account gets 15% of the total revenue
  ];
  const _teamShares = [5, 15]; // 2 PEOPLE IN THE TEAM

  const _notRevealedUri = "https://ipfs.vipsland.com/nft/collections/genesis/json/hidden.json";
  const _revealedUri = "https://ipfs.vipsland.com/nft/collections/genesis/json/";



  // Deploy the contract
  const PRTFactory = await hre.ethers.getContractFactory('Vipsland')
  const prtContract = await PRTFactory.deploy(
    // BASE_URI,
    // root,
    // proxyRegistryAddressGoerli
    _team,
    _teamShares,
    _notRevealedUri,
    _revealedUri
  )

  await prtContract.deployed()

  console.log('prtContract deployed to:', prtContract.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
