const { createAlchemyWeb3 } = require('@alch/alchemy-web3')

// const { MerkleTree } = require('merkletreejs')
// const keccak256 = require('keccak256')
// const whitelist = require('../scripts/whitelist.js')

const {apiKey, PK, etherscanApiKey} = require('../secrets.json')

const eth_goerli_settings = {
  apiKey: "da4QudLrjNs6-NR8EurK-N0ikxP6ZTVR",
};


/** @type import('hardhat/config').HardhatUserConfig */
const GOERLI_RPC_URL = `https://eth-goerli.alchemyapi.io/v2/${eth_goerli_settings.apiKey}`


const web3 = createAlchemyWeb3(GOERLI_RPC_URL)
import { config } from '../dapp.config'

const contract = require('../artifacts/contracts/PRT.sol/PRT.json')
const prtContract = new web3.eth.Contract(contract.abi, config.contractAddress)

// // Calculate merkle root from the whitelist array
// const leafNodes = whitelist.map((addr) => keccak256(addr))
// const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true })
// const root = merkleTree.getRoot()

export const getTotalPRT = async () => {
  const totalPRT = await prtContract.methods.getTotalPRT().call()
  console.log({totalPRT})
  return totalPRT
}

export const getMaxSupply = async () => {
  const MAX_SUPPLY_PRT = await prtContract.methods.MAX_SUPPLY_PRT().call()
  console.log({MAX_SUPPLY_PRT})
  return MAX_SUPPLY_PRT
}


export const isPreSaleState = async () => {
  const preSalePRT = await prtContract.methods.presalePRT().call()
  console.log({preSalePRT})
  return preSalePRT
}

export const getPrice = async () => {
  const price = await prtContract.methods.PRICE_PRT().call()
  console.log(`getPrice`,{price})
  return price
}

export const buyPRT = async (prtAmount) => {
  if (!window.ethereum.selectedAddress) {
    return {
      success: false,
      status: 'To be able to mint, you need to connect your wallet'
    }
  }

  // const leaf = keccak256(window.ethereum.selectedAddress)
  // const proof = merkleTree.getHexProof(leaf)

  // Verify Merkle Proof
  // const isValid = merkleTree.verify(proof, leaf, root)

  // if (!isValid) {
  //   return {
  //     success: false,
  //     status: 'Invalid Merkle Proof - You are not on the whitelist'
  //   }
  // }

  const nonce = await web3.eth.getTransactionCount(
    window.ethereum.selectedAddress,
    'latest'
  )

  // Set up our Ethereum transaction
  // function buyPRT (address account, uint8 _amount_wanted_able_to_get)
  const tx = {
    to: config.contractAddress,
    from: window.ethereum.selectedAddress,
    value: parseInt(
      web3.utils.toWei(String(config.price * prtAmount), 'ether')
    ).toString(16), // hex
    data: prtContract.methods
      .buyPRT(window.ethereum.selectedAddress, prtAmount)
      .encodeABI(),
    nonce: nonce.toString(16)
  }

  try {
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [tx]
    })

    return {
      success: true,
      status: (
        <a href={`https://rinkeby.etherscan.io/tx/${txHash}`} target="_blank">
          <p>✅ Check out your transaction on Etherscan:</p>
          <p>{`https://rinkeby.etherscan.io/tx/${txHash}`}</p>
        </a>
      )
    }
  } catch (error) {
    return {
      success: false,
      status: '😞 Smth went wrong:' + error.message
    }
  }
}

export const mintNFT = async (prtAmount) => {
  if (!window.ethereum.selectedAddress) {
    return {
      success: false,
      status: 'To be able to mint, you need to connect your wallet'
    }
  }

  const nonce = await web3.eth.getTransactionCount(
    window.ethereum.selectedAddress,
    'latest'
  )

  //complete

  // Set up our Ethereum transaction
  // const tx = {
  //   to: config.contractAddress,
  //   from: window.ethereum.selectedAddress,
  //   value: parseInt(
  //     web3.utils.toWei(String(config.price * prtAmount), 'ether')
  //   ).toString(16), // hex
  //   data: prtContract.methods.publicSaleMint(prtAmount).encodeABI(),
  //   nonce: nonce.toString(16)
  // }

  // try {
  //   const txHash = await window.ethereum.request({
  //     method: 'eth_sendTransaction',
  //     params: [tx]
  //   })

  //   return {
  //     success: true,
  //     status: (
  //       <a href={`https://rinkeby.etherscan.io/tx/${txHash}`} target="_blank">
  //         <p>✅ Check out your transaction on Etherscan:</p>
  //         <p>{`https://rinkeby.etherscan.io/tx/${txHash}`}</p>
  //       </a>
  //     )
  //   }
  // } catch (error) {
  //   return {
  //     success: false,
  //     status: '😞 Smth went wrong:' + error.message
  //   }
  // }
}
