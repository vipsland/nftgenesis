
require('@nomiclabs/hardhat-etherscan')
const hre = require('hardhat')


async function main() {

  await hre.run('verify:verify', {
    address: '0x060d13D347c3C000d6a2d09B92d9D8199822D38F',//latest
    constructorArguments: []
  })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
