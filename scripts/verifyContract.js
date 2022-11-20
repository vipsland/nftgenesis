/**
 *  This script will calculate the constructor arguments for the `verify` function and call it.
 *  You can use this script to verify the contract on etherscan.io.
 */

 require('@nomiclabs/hardhat-etherscan')
 const hre = require('hardhat')
 const proxyRegistryAddressGoerli = '0xC6CD41b08DC8f9124933d377431480c69F1e1C9f'

 
 async function main() {
   
   await hre.run('verify:verify', { 
     address: '0x1c8d42eE1ca0E5536bD3dCF8ED443217FC88d588', // you can also verify with remix plugin
     constructorArguments: [proxyRegistryAddressGoerli]
   })
 }
 //latest https://goerli.etherscan.io/address/0x74a29C3E63459F3B7CC64a48E515EFB144313021#code
 // We recommend this pattern to be able to use async/await everywhere
 // and properly handle errors.
 main()
   .then(() => process.exit(0))
   .catch((error) => {
     console.error(error)
     process.exit(1)
   })
 