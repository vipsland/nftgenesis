import { init, useConnectWallet } from '@web3-onboard/react'
import injectedModule from '@web3-onboard/injected-wallets'
import { config } from '../dapp.config'

const GOERLI_ALCHEMY_API_KEY = 'da4QudLrjNs6-NR8EurK-N0ikxP6ZTVR'
const ETHMAIN_ALCHEMY_API_KEY = 'k7Dy_53hGKxAHfb9_k7sEAWbvE2Z5Lgo'
const IPFS_URI = 'https://ipfs.vipsland.com/nft/collections/genesis'

let settings = {
  apiKeys: {
    goerli: GOERLI_ALCHEMY_API_KEY,
    ethmain: ETHMAIN_ALCHEMY_API_KEY
  },
  RPC_URL: {
    goerli: `https://eth-goerli.g.alchemy.com/v2/${GOERLI_ALCHEMY_API_KEY}`,
    ethmain: `https://eth-mainnet.g.alchemy.com/v2/${ETHMAIN_ALCHEMY_API_KEY}`
  },

}

let chains = []
if (config?.network === 'goerli') {
  chains = [...chains, ...[
    {
      id: '0x5',
      token: 'gETH',
      label: 'Ethereum Goerli Testnet',
      rpcUrl: settings?.RPC_URL.goerli
    }]]
}


if (config?.network === 'ethmain') {
  chains = [...chains, ...[
    {
      id: '0x1',
      token: 'ETH',
      label: 'Ethereum Mainnet',
      rpcUrl: settings?.RPC_URL.ethmain
    }

  ]]
}


const injected = injectedModule()

const initOnboard = init({
  wallets: [injected],
  chains,

  appMetadata: {
    name: 'VIPSLAND',
    icon: `${IPFS_URI}/moolahlisa.svg`,
    logo: `${IPFS_URI}/moolahlisa.svg`,
    description: 'BLOCKCHAIN PFP NFT'
  }


})

export { initOnboard }
