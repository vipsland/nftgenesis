
 require('@nomiclabs/hardhat-etherscan')
 const hre = require('hardhat')
 
 
 async function main() {
   
   await hre.run('verify:verify', { 
     address: '0xc67269E99102279B1c8BA33435d0Ade2963deBb6', 
     constructorArguments: []
   })
 }

 main()
   .then(() => process.exit(0))
   .catch((error) => {
     console.error(error)
     process.exit(1)
   })
 