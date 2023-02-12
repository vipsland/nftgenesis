
require('@nomiclabs/hardhat-etherscan')
const hre = require('hardhat')


async function main() {

  await hre.run('verify:verify', {
    address: '0xCbD4b15695D9361c8B09708e1e8B9Af707379FEc',//latest
    constructorArguments: []
  })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
