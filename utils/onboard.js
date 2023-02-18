import { init, useConnectWallet } from '@web3-onboard/react'
import injectedModule from '@web3-onboard/injected-wallets'
import { Network, Alchemy } from 'alchemy-sdk';
// import { TASK_COMPILE_SOLIDITY_COMPILE } from 'hardhat/builtin-tasks/task-names';
const GOERLI_API_KEY = 'da4QudLrjNs6-NR8EurK-N0ikxP6ZTVR';

// const ETHMAIN_API_KEY = process.env.ETHMAIN_API_KEY;


const eth_goerli_settings = {
  apiKey: `${GOERLI_API_KEY}`,
  network: Network.ETH_GOERLI,
};

// const eth_mainnet_settings = {
//   apiKey: `${ETHMAIN_API_KEY}`,
//   network: Network.ETH_MAINNET,
// };


/** @type import('hardhat/config').HardhatUserConfig */
// old rpc url https://eth-goerli.alchemyapi.io/v2/
const GOERLI_RPC_URL = `https://eth-goerli.g.alchemy.com/v2/${eth_goerli_settings.apiKey}`
// const MAINNET_RPC_URL = `https://eth-mainnet.g.alchemy.com/v2/${eth_mainnet_settings.apiKey}`

const injected = injectedModule()

const initOnboard = init({
  wallets: [injected],
  chains: [
    // {
    //   id: '0x1',
    //   token: 'ETH',
    //   label: 'Ethereum Mainnet',
    //   rpcUrl: MAINNET_RPC_URL
    // },
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
    //   id: '0x1337',
    //   token: 'gETH',
    //   label: 'Ethereum Ganache Testnet',
    //   rpcUrl: GANACHE_RPC_URL
    // },

    // {
    //   id: '0x89',
    //   token: 'MATIC',
    //   label: 'Matic Mainnet',
    //   rpcUrl: 'https://matic-mainnet.chainstacklabs.com'
    // }
  ],

})

export { initOnboard }
