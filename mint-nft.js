require('dotenv').config();
const ethers = require('ethers');

// Get Alchemy API Key
const API_KEY = process.env.API_KEY;

// Define an Alchemy Provider
const provider = new ethers.providers.AlchemyProvider('goerli', API_KEY)

const contract = require("./artifacts/contracts/AwesomeNFT.sol/AwesomeNFT.json");

console.log(JSON.stringify(contract.abi));


// Create a signer
const privateKey = process.env.PRIVATE_KEY
const signer = new ethers.Wallet(privateKey, provider)

// Get contract ABI and address
const abi = contract.abi
const contractAddress = '0x42fb8bd5509be95aa4e9a0f1fde36250f4e21fb9'

// Create a contract instance
const awesomeNFT = new ethers.Contract(contractAddress, abi, signer)


// Get the NFT Metadata IPFS URL
const tokenID = 0;


// Call mintNFT function
const mintNFT = async () => {
    let nftTxn = await awesomeNFT.callMint()
    await nftTxn.wait()
    const counterTokenID = await awesomeNFT.counterTokenID()
    console.log(`NFT Minted! Check it out at: https://goerli.etherscan.io/tx/${nftTxn.hash}, counterTokenID: ${counterTokenID}`)
    return {hash: nftTxn.hash, counterTokenID}
}


let index = 0 ;
// Array.from(Array(10).keys())

const mint = () => {
    mintNFT()
    .then(() => {
        index++;
        if(index === 9) {
            process.exit(0)
        } else {
            mint()
        }
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

}

mint()

