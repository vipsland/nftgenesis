
 require('@nomiclabs/hardhat-etherscan')
 const hre = require('hardhat')
 
 
 async function main() {
   
   await hre.run('verify:verify', { 
     address: '0x779380EdbdbfaDB16678056a4948291F5fBd88F1', 
     constructorArguments: []
   })
 }

 main()
   .then(() => process.exit(0))
   .catch((error) => {
     console.error(error)
     process.exit(1)
   })
 