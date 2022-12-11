
 require('@nomiclabs/hardhat-etherscan')
 const hre = require('hardhat')
 
 
 async function main() {
   
   await hre.run('verify:verify', { 
     address: '0x93D95018A9Da4995E68fA14f3e21379C65166461', 
     constructorArguments: []
   })
 }

 main()
   .then(() => process.exit(0))
   .catch((error) => {
     console.error(error)
     process.exit(1)
   })
 