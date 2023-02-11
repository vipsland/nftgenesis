
require('@nomiclabs/hardhat-etherscan')
const hre = require('hardhat')


async function main() {

  await hre.run('verify:verify', {
    address: '0xdb399eD28d51ccB61eB8F97E925eaCD3D176DD45',//latest
    constructorArguments: []
  })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
