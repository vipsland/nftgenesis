
 require('@nomiclabs/hardhat-etherscan')
 const hre = require('hardhat')
 
 
 async function main() {
   
   await hre.run('verify:verify', { 
     address: '0x42fb8bd5509be95aa4e9a0f1fde36250f4e21fb9', 
     constructorArguments: []
   })
 }

 main()
   .then(() => process.exit(0))
   .catch((error) => {
     console.error(error)
     process.exit(1)
   })
 