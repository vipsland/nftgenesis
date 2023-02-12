
require('@nomiclabs/hardhat-etherscan')
const hre = require('hardhat')


async function main() {

  await hre.run('verify:verify', {
    address: '0xCcc16204d8E631f6ef7f40D25DbE3fd985e3e175',//latest
    constructorArguments: []
  })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
