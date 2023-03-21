require('dotenv').config();
const ethers = require('ethers');

// Get Alchemy API Key
const SEPOLIA_API_KEY = process.env.SEPOLIA_API_KEY;

// Define an Alchemy Provider
const provider = new ethers.providers.AlchemyProvider('goerli', SEPOLIA_API_KEY)

const contract = require("./artifacts/contracts/AwesomeNFTBatch.sol/AwesomeNFTBatch.json");

console.log(JSON.stringify(contract.abi));


// Create a signer
const privateKey = process.env.PRIVATE_KEY
const signer = new ethers.Wallet(privateKey, provider)

// Get contract ABI and address
const abi = contract.abi
const contractAddress = '0x779380EdbdbfaDB16678056a4948291F5fBd88F1'

// Create a contract instance
const awesomeNFTBatch = new ethers.Contract(contractAddress, abi, signer)


// Get the NFT Metadata IPFS URL
const tokenID = 0;


// Call mintNFT function
const mintNFT = async () => {
    let nftTxn = await awesomeNFTBatch.mintByOwner(71)
    const result = await nftTxn.wait()
    console.log(`NFT Minted! Check it out at: https://goerli.etherscan.io/tx/${nftTxn.hash}`)
    console.log(`? res `, { result, hash })
    return { hash: nftTxn.hash }

}


let index = 0;
// Array.from(Array(10).keys())

const mint = () => {
    mintNFT()
        .then(() => {
            index++;
            if (index === 9) {
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

