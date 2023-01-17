require('dotenv').config();
const ethers = require('ethers');

// Get Alchemy API Key
const API_KEY = process.env.API_KEY;

// Define an Alchemy Provider
const provider = new ethers.providers.AlchemyProvider('goerli', API_KEY)

const contract = require("./artifacts/contracts/AwesomeNFTBatch.sol/AwesomeNFTBatch.json");

console.log(JSON.stringify(contract.abi));


// Create a signer
const privateKey = process.env.PRIVATE_KEY
const signer = new ethers.Wallet(privateKey, provider)

// Get contract ABI and address
const abi = contract.abi
const contractAddress = '0x38a140c905df5a5df117b65ce792d75d78b6ff98' //https://testnets.opensea.io/collection/vipsland-genesis-ooardjhdya

// Create a contract instance
const awesomeNFTBatch = new ethers.Contract(contractAddress, abi, signer)


let arr = [...Array(188888).keys()].map(i => i+1)

const TARGET_ID = 40000
const index  = arr.indexOf(36576) 

arr = arr.splice(index)
// console.log({arr})

const SIZE = 35
const counts = Array.apply(null, {length: SIZE}).map(Function.call, () => 1);
const chunkSize = SIZE;

const totalChunks = []
for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    totalChunks.push(chunk)
}
console.log({totalChunks})



// Call mintNFTBatch function
const mintNFTBatch = async (chunk, counts) => {
    let nftTxn = await awesomeNFTBatch.mintNFTBatch(chunk, counts)
    await nftTxn.wait()
    console.log(`NFT Minted! Check it out at: https://goerli.etherscan.io/tx/${nftTxn.hash}`)
    return {hash: nftTxn.hash}
}

// const [first] = totalChunks
// console.log({first})
async function forLoop () {
    console.log('Start')
    for (let index = 0; index < totalChunks.length; index++) {

        do {
            const chunk = totalChunks[index]
            try {
                const [id] = chunk
                if (id === TARGET_ID) {
                    process.exit(1);
                }

                const res = await mintNFTBatch(chunk, counts)
                console.log(`success`, {index, chunk, hash: res.hash})
                if(index === totalChunks.length -1 ) {
                    console.log(`done latest`, {index, chunk, hash: res.hash})
                    process.exit(0)
                } 
                break;
            } catch (error) {
                console.error(`error`,{error, index, chunk});
                //process.exit(1);
        
            }
        } while (true)
      }
    console.log('End')
}


forLoop()

// totalChunks.forEach((chunk, i) => {

//     mintNFTBatch(chunk, counts)
//     .then(({hash}) => {
//         console.log(`success`, {i, chunk, hash})
//         if(i === 499) {
//             process.exit(0)
//         } 
//     })
//     .catch((error) => {
//         console.error(`error`,{error, i, chunk});
//         process.exit(1);
//     });


// })

