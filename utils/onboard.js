import { init, useConnectWallet } from '@web3-onboard/react'
import injectedModule from '@web3-onboard/injected-wallets'
// const {apiKey, PK, etherscanApiKey} = require('../secrets.json')
import { Network, Alchemy } from 'alchemy-sdk';
// import { TASK_COMPILE_SOLIDITY_COMPILE } from 'hardhat/builtin-tasks/task-names';

const eth_goerli_settings = {
    apiKey: "da4QudLrjNs6-NR8EurK-N0ikxP6ZTVR",
    network: Network.ETH_GOERLI,
};

const eth_mainnet_settings = {
  apiKey: "k7Dy_53hGKxAHfb9_k7sEAWbvE2Z5Lgo",
  network: Network.ETH_MAINNET,
};


/** @type import('hardhat/config').HardhatUserConfig */
const GOERLI_RPC_URL = `https://eth-goerli.alchemyapi.io/v2/${eth_goerli_settings.apiKey}`
const MAINNET_RPC_URL = `https://eth-mainnet.g.alchemy.com/v2/${eth_mainnet_settings.apiKey}`

const injected = injectedModule()

const initOnboard = init({
  wallets: [injected],
  chains: [
    {
      id: '0x1',
      token: 'ETH',
      label: 'Ethereum Mainnet',
      rpcUrl: MAINNET_RPC_URL
    },
    // {
    //   id: '0x3',
    //   token: 'tROP',
    //   label: 'Ethereum Ropsten Testnet',
    //   rpcUrl: 'https://ropsten.infura.io/v3/ababf9851fd845d0a167825f97eeb12b'
    // },
    {
      id: '0x5',
      token: 'gETH',
      label: 'Ethereum Goerli Testnet',
      rpcUrl: GOERLI_RPC_URL
    },

    // {
    //   id: '0x89',
    //   token: 'MATIC',
    //   label: 'Matic Mainnet',
    //   rpcUrl: 'https://matic-mainnet.chainstacklabs.com'
    // }
  ],
  
})

export { initOnboard }
