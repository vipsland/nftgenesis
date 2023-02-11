/**
 *  This script will calculate the constructor arguments for Vipsland.sol and deploy it.
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


  // Deploy the contract
  const vipslandFactory = await hre.ethers.getContractFactory('Vipsland')
  const vipslandContract = await vipslandFactory.deploy(
    // BASE_URI,
    // root,
    // proxyRegistryAddressGoerli
  )

  await vipslandContract.deployed()

  console.log('vipslandContract deployed to:', vipslandContract.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
