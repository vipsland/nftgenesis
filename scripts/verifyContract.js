
require('@nomiclabs/hardhat-etherscan')
const hre = require('hardhat')


//payment splitter
const _team = [
  '0x1090C62B584c1c9a56E3D8AFd70cf9F2ECee17CC', // miukki account gets 5% of the total revenue
  '0x06f10E01E97718730179F53Bc6f8ff6625ACB2f1' // sam Account gets 15% of the total revenue
];

const _teamShares = [5, 15]; // 2 PEOPLE IN THE TEAM


const _notRevealedUri = "https://ipfs.vipsland.com/nft/collections/genesis/json/hidden.json";
const _revealedUri = "https://ipfs.vipsland.com/nft/collections/genesis/json/";

async function main() {

  await hre.run('verify:verify', {
    address: '0x2ea8659d8143357e89828F4C8c0C51d423c259C4',//latest
    constructorArguments: [_team, _teamShares, _notRevealedUri, _revealedUri]
  })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
