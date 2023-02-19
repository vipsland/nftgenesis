
require('@nomiclabs/hardhat-etherscan')
const hre = require('hardhat')



//payment splitter
// address[] private _team = [
//   0xEd1CB7ef54321835C53a59cC94a816BCF47fEE11, // miukki account gets 5% of the total revenue
//   0x1Fde442744D300b6405e10A6F63Bf491d94afDE1 // sam Account gets 15% of the total revenue
// ];
// uint[] private _teamShares = [5, 15]; // 2 PEOPLE IN THE TEAM



async function main() {

  await hre.run('verify:verify', {
    address: '0x131435E6fB258Ab1ED27250adC77a58fF846B56D',//latest
    constructorArguments: []
  })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
