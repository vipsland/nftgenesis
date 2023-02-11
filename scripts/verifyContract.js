
require('@nomiclabs/hardhat-etherscan')
const hre = require('hardhat')


async function main() {

  await hre.run('verify:verify', {
    address: '0xf42BeF3F51f0d0A5EaD42FBaeE7C4FB385A80733',//latest
    constructorArguments: []
  })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
