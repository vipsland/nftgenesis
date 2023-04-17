const { createAlchemyWeb3 } = require('@alch/alchemy-web3')
import { Network, Alchemy, Utils } from 'alchemy-sdk';
import { ethers } from "ethers";
const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')
const allowlist_airdrop = require('./allowlist_airdrop.js')
const allowlist_internal = require('./allowlist_internal.js')
import { config } from '../dapp.config'
import { errors } from './errors'
import Image from 'next/image'

const GOERLI_ALCHEMY_API_KEY = 'da4QudLrjNs6-NR8EurK-N0ikxP6ZTVR'
const ETHMAIN_ALCHEMY_API_KEY = 'k7Dy_53hGKxAHfb9_k7sEAWbvE2Z5Lgo'


let settings = {
  apiKeys: {
    goerli: GOERLI_ALCHEMY_API_KEY,
    ethmain: ETHMAIN_ALCHEMY_API_KEY
  },
  network: {
    goerli: Network.ETH_GOERLI,
    ethmain: Network.ETH_MAINNET
  },
  RPC_URL: {
    goerli: `https://eth-goerli.g.alchemy.com/v2/${GOERLI_ALCHEMY_API_KEY}`,
    ethmain: `https://eth-mainnet.g.alchemy.com/v2/${ETHMAIN_ALCHEMY_API_KEY}`
  },
  OPENSEA_URI: {
    goerli: `https://testnets.opensea.io/assets/goerli/${config?.contractAddress}`,
    ethmain: `https://opensea.io/assets/ethereum/${config?.contractAddress}`
  },
  txHashUri: {
    goerli: `https://goerli.etherscan.io/tx`,
    ethmain: `https://etherscan.io/tx`
  },
  IPFS_URI: {
    goerli: `https://ipfs.vipsland.com/nft/collections/genesis`,
    ethmain: `https://ipfs.vipsland.com/nft/collections/genesis`
  }



}
const ALCHEMY_API_KEY = settings?.apiKeys[config?.network];

/** @type import('hardhat/config').HardhatUserConfig */
const RPC_URL = settings?.RPC_URL[config?.network]
const NETWORK = config?.network
const OPENSEA_URI = settings?.OPENSEA_URI[config?.network]
const TXHASHURI = settings?.txHashUri[config?.network]
const IPFS_URI = settings?.IPFS_URI[config?.network]

const alchemy_settings = {
  apiKey: `${ALCHEMY_API_KEY}`,
  network: settings?.network[config?.network],
};

const alchemy = new Alchemy(alchemy_settings);
const web3 = createAlchemyWeb3(RPC_URL)
const contract = require('../artifacts/contracts/Vipsland.sol/Vipsland.json')
const VipslandContract = new web3.eth.Contract(contract.abi, config?.contractAddress)

// Calculate merkle root from the allowlist array airdrop
const leafNodes_air = allowlist_airdrop.map((addr) => keccak256(addr))
const merkleTree_air = new MerkleTree(leafNodes_air, keccak256, { sortPairs: true })
const root_air = merkleTree_air.getRoot()

// Calculate merkle root from the allowlist array internal team
const leafNodes_int = allowlist_internal.map((addr) => keccak256(addr))
const merkleTree_int = new MerkleTree(leafNodes_int, keccak256, { sortPairs: true })
const root_int = merkleTree_int.getRoot()

const NORMAL_ST = '4,5,6,7';
const INT_ST = '2,3,6,7';
const AIR_ST = '1,3,5,7';

async function delay(mls) {
  return new Promise(resolve => { setTimeout(() => resolve(), mls) })
}

const StatusError = ({ error, txHash }) => {
  let message = error?.message;
  if (error.message.includes("revert")) {
    // The transaction was reverted, extract the revert reason
    const code = error?.message?.replace("VM Exception while processing transaction: revert ", "");
    errors[code] ? message = errors[code] : message = '😞 VM Exception while processing transaction. Transaction is reverted.';
    message = `😞 Transaction reverted: ${message}.`
  } else {
    message = `😞 Smth went wrong. ${message}`
    console.error(error);
  }

  message = message + (txHash ? `. ${TXHASHURI}/${txHash}` : ``)

  return {
    success: false,
    status: message
  }

}

const getRevertReason = async ({ txHash }) => {

  try {
    let reason = `Transaction ${txHash} had a problem. Please check etherscan.io`;

    const txReceipt = await web3.eth.getTransactionReceipt(txHash);

    const status = txReceipt?.status;

    if (status === false && txReceipt?.logs[0]?.data) {
      reason = web3.utils.hexToUtf8(txReceipt?.logs[0]?.data);
      reason = `Transaction ${txHash} reverted with reason: ${reason}. Please check etherscan.io`;
    }


    return StatusError({ error: { message: reason }, txHash })


  } catch (error) {

    return StatusError({ error, txHash })

  }


}


const StatusSuccess = ({ txHash, minted_amount, token_ids = [] }) => {

  return (
    <div>
      <span>Unlock the exclusive NFT collection on OpenSea by helping us promote VIPSLAND GENESIS NFTs! </span>
      <span>Encourage the community to secure all 140,000 Normal Passes for a grand reveal upon sellout. </span>
      <span>Spread the word across platforms and be part of the excitement. Thank you!</span><br /><br />
      <span>✅ Success, check your transaction:</span><br />
      <span> <a href={`${TXHASHURI}/${txHash}`} rel="noreferrer" target="_blank">{`${TXHASHURI}/${txHash}`}</a ></span><br />
      {minted_amount ? <><span> You have {minted_amount} Normal Pass(es).</span><br /></> : null}
      {
        token_ids.length > 0 ? <span>Token(s) minted in this transaction: {token_ids.map(t => `#${t}`).join(', ')}

          <span className="grid grid-cols-3 gap-4 place-items-start mt-10">
            {token_ids.map((tokenId) => {
              return <span key={tokenId}><a href={`${OPENSEA_URI}/${tokenId}`} target={`_blank`}><img width="100" src={`https://ipfs.vipsland.com/nft/collections/genesis/${tokenId}.gif`} className="object-cover w-full sm:h-[280px] md:w-[250px] rounded-md" /></a></span>
            })}

          </span>


        </span> : null
      }

    </div>


  )
}

export const getTotalMintedNONMP = async (main_stage) => {
  const stage = Number(await VipslandContract.methods.presalePRT().call());
  const { qntmintnonmp } = await VipslandContract.methods.statetoken().call() || {}

  if (main_stage === 4 && NORMAL_ST.indexOf(stage) > -1) {
    return qntmintnonmp?.normaluser
  }

  if (main_stage === 2 && INT_ST.indexOf(stage) > -1) {
    return qntmintnonmp?.internalteam
  }

  if (main_stage === 1 && AIR_ST.indexOf(stage) > -1) {
    return qntmintnonmp?.airdrop

  }

  return 0;
}

export const getTotalMintedMP = async (main_stage) => {
  const stage = Number(await VipslandContract.methods.presalePRT().call());
  const { qntmintmp } = await VipslandContract.methods.statetoken().call() || {}

  if (main_stage === 4 && NORMAL_ST.indexOf(stage) > -1) {
    return qntmintmp?.normaluser
  }

  if (main_stage === 2 && INT_ST.indexOf(stage) > -1) {
    return qntmintmp?.internalteam
  }

  if (main_stage === 1 && AIR_ST.indexOf(stage) > -1) {
    return qntmintmp?.airdrop
  }

  return 0;
}


export const getMaxSupplyNONMP = async (main_stage) => {
  const stage = Number(await VipslandContract.methods.presalePRT().call());
  const { MAX_SUPPLY_FOR_PRT } = await VipslandContract.methods.prtSettings().call() || {}

  if (main_stage === 4 && NORMAL_ST.indexOf(stage) > -1) {
    return MAX_SUPPLY_FOR_PRT?.normaluser
  }

  if (main_stage === 2 && INT_ST.indexOf(stage) > -1) {
    return MAX_SUPPLY_FOR_PRT?.internalteam
  }

  if (main_stage === 1 && AIR_ST.indexOf(stage) > -1) {
    return MAX_SUPPLY_FOR_PRT?.airdrop
  }

  return 0;
}

export const getMaxSupplyMP = async () => {
  const { MAX_SUPPLY_MP } = await VipslandContract.methods.prtSettings().call() || {};

  return MAX_SUPPLY_MP;
}

export const getisMintNONMP = async (main_stage) => {
  const stage = Number(await VipslandContract.methods.presalePRT().call());
  if (main_stage === 4) {
    return NORMAL_ST.indexOf(stage) > -1;
  }

  if (main_stage === 2) {
    return INT_ST.indexOf(stage) > -1
  }

  if (main_stage === 1) {
    return AIR_ST.indexOf(stage) > -1
  }

  return false;
}

export const getStageNONMP = async () => {
  return Number(await VipslandContract.methods.presalePRT().call());
}


export const getisMintMP = async (main_stage) => {
  const stage = Number(await VipslandContract.methods.presalePRT().call());
  const { mintMPIsOpen } = await VipslandContract.methods.statetoken().call() || {}

  if (main_stage === 4 && NORMAL_ST.indexOf(stage) > -1) {
    return Boolean(mintMPIsOpen?.normaluser);
  }

  if (main_stage === 2 && INT_ST.indexOf(stage) > -1) {
    return Boolean(mintMPIsOpen?.internalteam);
  }

  if (main_stage === 1 && AIR_ST.indexOf(stage) > -1) {
    return Boolean(mintMPIsOpen?.airdrop);
  }

  return false;
}


export const getMaxNONMPAmountPerAcc = async (stage) => {
  const { limitsmint } = await VipslandContract.methods.prtSettings().call() || {};

  if (stage === 4 && NORMAL_ST.indexOf(stage) > -1) {//normal
    return limitsmint?.normaluser;
  }

  if (stage === 2 && INT_ST.indexOf(stage) > -1) {//internal
    return limitsmint?.internalteam;
  }

  if (stage === 1 && AIR_ST.indexOf(stage) > -1) {//airdrop
    return limitsmint?.airdrop;
  }
}

export const getMaxNONMPAmountPerAccPerTransaction = async (stage) => {
  const { limitspertx } = await VipslandContract.methods.prtSettings().call() || {};

  if (stage === 4 && NORMAL_ST.indexOf(stage) > -1) {
    return limitspertx?.normaluser
  }

  if (stage === 2 && INT_ST.indexOf(stage) > -1) {
    return limitspertx?.internalteam
  }

  if (stage === 1 && AIR_ST.indexOf(stage) > -1) {
    return limitspertx?.airdrop
  }

}


export const getPriceNONMPETH = async (main_stage) => {
  const stage = Number(await VipslandContract.methods.presalePRT().call());
  const { PRICE } = await VipslandContract.methods.prtSettings().call() || {};

  if (main_stage === 4 && NORMAL_ST.indexOf(stage) > -1) {

    const priceWei = PRICE?.normaluser;
    const priceEth = web3.utils.fromWei(`${priceWei}`, 'ether');

    return priceEth;
  }

  if (main_stage === 2 && INT_ST.indexOf(stage) > -1) {
    const priceWei = PRICE?.internalteam;
    const priceEth = web3.utils.fromWei(`${priceWei}`, 'ether');

    return priceEth;
  }

  if (main_stage === 1 && AIR_ST.indexOf(stage) > -1) {
    const priceWei = PRICE?.airdrop;
    const priceEth = web3.utils.fromWei(`${priceWei}`, 'ether');

    return priceEth;

  }

  return 0;
}

export const getPriceNONMPWEI = async (main_stage) => {
  const stage = Number(await VipslandContract.methods.presalePRT().call());
  const { PRICE } = await VipslandContract.methods.prtSettings().call() || {};


  if (main_stage === 4 && NORMAL_ST.indexOf(stage) > -1) return Number(PRICE?.normaluser)
  if (main_stage === 2 && INT_ST.indexOf(stage) > -1) return Number(PRICE?.internalteam)
  if (main_stage === 1 && AIR_ST.indexOf(stage) > -1) return Number(PRICE?.airdrop)

  return 0;
}

export const getPerAccountMintedNONMPs = async (wallet) => {
  if (!wallet?.accounts[0]?.address) {
    return 0
  }

  return await VipslandContract.methods.userNONMPs(wallet?.accounts[0]?.address).call();
}


export const getListNONMPsAndMPs = async (wallet) => {

  const defaultValue = { ownedNftsNONMP: [], ownedNftsMP: [] }

  if (!wallet?.accounts[0]?.address) {
    return defaultValue
  }

  const _MAX_SUPPLY_MP = await getMaxSupplyMP()

  const { ownedNfts = [] } = await alchemy.nft.getNftsForOwner(wallet?.accounts[0]?.address, { contractAddresses: [config?.contractAddress] }) || {};
  const resp = ownedNfts.reduce((acc, t) => {

    if (Number(t.tokenId) <= _MAX_SUPPLY_MP) {
      acc.ownedNftsMP = [].concat(acc.ownedNftsMP, t)
    } else {
      acc.ownedNftsNONMP = [].concat(acc.ownedNftsNONMP, t)
    }
    return acc

  }, defaultValue)


  // Access the Alchemy NFT API
  // const res = await alchemy.nft.getNftsForOwner(wallet?.accounts[0]?.address).then(console.log);

  return resp;

}

export const mintNONMPForInternal = async ({ prtAmount, wallet, main_stage }) => {

  const priceWei = await getPriceNONMPWEI(main_stage);
  const priceEth = web3.utils.fromWei(`${priceWei}`, 'ether');


  if (!window.ethereum.selectedAddress) {
    return {
      success: false,
      status: 'To be able to buy, you need to connect your wallet.'
    }
  }

  if (window.ethereum.selectedAddress !== wallet?.accounts[0]?.address) {
    return {
      success: false,
      status: 'Select correct account in metamask.'
    }
  }

  const leaf_int = keccak256(window.ethereum.selectedAddress)
  const proof_int = merkleTree_int.getHexProof(leaf_int)

  // Verify Merkle Proof
  const isValid_int = merkleTree_int.verify(proof_int, leaf_int, root_int)

  if (!isValid_int) {
    return {
      success: false,
      status: 'You are not on the allow list'
    }
  }

  const nonce = await web3.eth.getTransactionCount(
    wallet?.accounts[0]?.address,
    "latest"
  );


  const tx = {
    to: config?.contractAddress,
    from: wallet?.accounts[0]?.address,
    value: parseInt(
      web3.utils.toWei(`${priceEth * prtAmount}`, 'ether')
    ).toString(16), // hex
    data: VipslandContract.methods
      .mintNONMPForInternalTeam(wallet?.accounts[0]?.address, prtAmount, proof_int)
      .encodeABI(),
    nonce: nonce.toString(16),
    gasLimit: "21000",

  }


  let txHash;
  try {
    txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [tx]
    })

    const res = await alchemy.transact.waitForTransaction(`${txHash}`)

    // Listen to all new pending transactions
    alchemy.ws.on(
      {
        method: "alchemy_pendingTransactions",
        fromAddress: `${wallet?.accounts[0]?.address}`
      },
      (res) => {
        // console.log({ alchemy_pendingTransactions: res })
      }
    );

    const isSuccess = res?.status === 1

    if (!isSuccess) {
      return await getRevertReason({ txHash });
    }

    // Get all the NFTs owned by an address
    const nfts = alchemy.nft.getNftsForOwner(`${wallet?.accounts[0]?.address}`);

    // Get the latest block
    const latestBlock = alchemy.core.getBlockNumber();

    // Get all outbound transfers for a provided address
    alchemy.core
      .getTokenBalances(`${wallet?.accounts[0]?.address}`)
      .then((res) => {

        // console.log({ getTokenBalances: res })

      });


    let minted_amount = 0, token_ids = [];

    if (res?.logs?.length > 0) {

      const parced_logs = res?.logs.map(log => {
        const { data, topics } = log
        const iface = new ethers.utils.Interface(contract.abi)
        const parced = iface.parseLog({ data, topics });
        return parced
      });


      const [transferBatch_log] = parced_logs?.filter(i => i?.name === 'TransferBatch') || [];
      if (transferBatch_log?.args?.ids?.length > 0) {
        token_ids = transferBatch_log?.args?.ids.map(id => Number(id)) || []
      }

      const [ditributePRTs_log] = parced_logs?.filter(i => i?.name === 'DitributePRTs') || [];
      if (ditributePRTs_log?.args?.minted_amount) {
        minted_amount = Number(ditributePRTs_log?.args?.minted_amount)
      }

      const [remain_message_needs] = parced_logs?.filter(i => i?.name === 'RemainMessageNeeds') || [];
      if (remain_message_needs?.args?._qnt) {
        minted_amount = Number(remain_message_needs?.args?._qnt);
      }


    }


    const params = { txHash, minted_amount, token_ids }

    return {
      success: true,
      status: <StatusSuccess {...params} />
    }



  } catch (error) {
    return StatusError({ error })
  }
}


export const mintNONMPForAIRDROP = async ({ prtAmount, wallet, main_stage }) => {

  const priceWei = await getPriceNONMPWEI(main_stage);
  const priceEth = web3.utils.fromWei(`${priceWei}`, 'ether');


  if (!window.ethereum.selectedAddress) {
    return {
      success: false,
      status: 'To be able to buy, you need to connect your wallet.'
    }
  }

  if (window.ethereum.selectedAddress !== wallet?.accounts[0]?.address) {
    return {
      success: false,
      status: 'Select correct account in metamask.'
    }
  }

  const leaf_air = keccak256(window.ethereum.selectedAddress)
  const proof_air = merkleTree_air.getHexProof(leaf_air)

  // Verify Merkle Proof
  const isValid_air = merkleTree_air.verify(proof_air, leaf_air, root_air)

  if (!isValid_air) {
    return {
      success: false,
      status: 'You are not on the allow list'
    }
  }

  const nonce = await web3.eth.getTransactionCount(
    wallet?.accounts[0]?.address,
    'latest'
  );



  const tx = {
    to: config?.contractAddress,
    from: wallet?.accounts[0]?.address,
    value: parseInt(
      web3.utils.toWei(`${priceEth * prtAmount}`, 'ether')
    ).toString(16),
    data: VipslandContract.methods
      .mintNONMPForAIRDROP(wallet?.accounts[0]?.address, prtAmount, proof_air)
      .encodeABI(),
    nonce: nonce.toString(16),
    gasLimit: "21000",
  }


  let txHash;
  try {
    txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [tx]
    })

    const res = await alchemy.transact
      .waitForTransaction(
        `${txHash}`
      )

    // Listen to all new pending transactions
    alchemy.ws.on(
      {
        method: "alchemy_pendingTransactions",
        fromAddress: `${wallet?.accounts[0]?.address}`
      },
      (res) => {
        // console.log({ pendingTransactions: res })
      }
    );

    const isSuccess = res?.status === 1

    if (!isSuccess) {
      return await getRevertReason({ txHash });
    }

    // Get all the NFTs owned by an address
    const nfts = alchemy.nft.getNftsForOwner(`${wallet?.accounts[0]?.address}`);

    // Get the latest block
    const latestBlock = alchemy.core.getBlockNumber();

    // Get all outbound transfers for a provided address
    alchemy.core
      .getTokenBalances(`${wallet?.accounts[0]?.address}`)
      .then((res) => {

        // console.log({ getTokenBalances: res })

      });


    let minted_amount = 0, token_ids = [];

    if (res?.logs?.length > 0) {

      const parced_logs = res?.logs.map(log => {
        const { data, topics } = log
        const iface = new ethers.utils.Interface(contract.abi)
        const parced = iface.parseLog({ data, topics });
        return parced
      });


      const [transferBatch_log] = parced_logs?.filter(i => i?.name === 'TransferBatch') || [];
      if (transferBatch_log?.args?.ids?.length > 0) {
        token_ids = transferBatch_log?.args?.ids.map(id => Number(id)) || []
      }

      const [ditributePRTs_log] = parced_logs?.filter(i => i?.name === 'DitributePRTs') || [];
      if (ditributePRTs_log?.args?.minted_amount) {
        minted_amount = Number(ditributePRTs_log?.args?.minted_amount)
      }

      const [remain_message_needs] = parced_logs?.filter(i => i?.name === 'RemainMessageNeeds') || [];
      if (remain_message_needs?.args?._qnt) {
        minted_amount = Number(remain_message_needs?.args?._qnt);
      }


    }

    const params = { txHash, minted_amount, token_ids }

    return {
      success: true,
      status: <StatusSuccess {...params} />
    }


  } catch (error) {
    return StatusError({ error })
  }
}


export const mintNONMPForNormalUser = async ({ prtAmount, wallet, main_stage }) => {

  const priceWei = await getPriceNONMPWEI(main_stage);
  const priceEth = web3.utils.fromWei(`${priceWei}`, 'ether');

  if (!window.ethereum.selectedAddress) {
    return {
      success: false,
      status: 'To be able to buy, you need to connect your wallet.'
    }
  }

  if (window.ethereum.selectedAddress !== wallet?.accounts[0]?.address) {
    return {
      success: false,
      status: 'Select correct account in metamask.'
    }
  }

  const nonce = await web3.eth.getTransactionCount(
    wallet?.accounts[0]?.address,
    'latest'
  );


  let _priceEth = priceEth

  if (prtAmount >= 5 && prtAmount <= 10) {
    _priceEth = (priceEth * 4) / 5;
  } else if (prtAmount > 10) {
    _priceEth = (priceEth * 3) / 5;
  }

  let _value = _priceEth * prtAmount

  const tx = {
    to: config?.contractAddress,
    from: wallet?.accounts[0]?.address,
    value: parseInt(
      web3.utils.toWei(`${_value}`, 'ether')
    ).toString(16), // hex
    // value: Utils.parseEther(`${priceEth * prtAmount}`),
    data: VipslandContract.methods
      .mintNONMPForNormalUser(wallet?.accounts[0]?.address, prtAmount)
      .encodeABI(),
    nonce: nonce.toString(16),
    gasLimit: "21000",

  }

  let txHash;
  try {
    txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [tx]
    })

    const res = await alchemy.transact
      .waitForTransaction(
        `${txHash}`
      )

    // Listen to all new pending transactions
    alchemy.ws.on(
      {
        method: "alchemy_pendingTransactions",
        fromAddress: `${wallet?.accounts[0]?.address}`
      },
      (res) => {

        // console.log({ pendingTransactions: res })

      }
    );

    const isSuccess = res?.status === 1

    if (!isSuccess) {
      return await getRevertReason({ txHash });
    }

    // Get all the NFTs owned by an address
    const nfts = await alchemy.nft.getNftsForOwner(`${wallet?.accounts[0]?.address}`);

    // Get the latest block
    const latestBlock = alchemy.core.getBlockNumber();

    // Get all outbound transfers for a provided address
    alchemy.core
      .getTokenBalances(`${wallet?.accounts[0]?.address}`)
      .then((res) => {

        // console.log({ getTokenBalances: res })

      });


    let minted_amount = 0, token_ids = [];

    if (res?.logs?.length > 0) {

      const parced_logs = res?.logs.map(log => {
        const { data, topics } = log
        const iface = new ethers.utils.Interface(contract.abi)
        const parced = iface.parseLog({ data, topics });
        return parced
      });


      const [transferBatch_log] = parced_logs?.filter(i => i?.name === 'TransferBatch') || [];
      if (transferBatch_log?.args?.ids?.length > 0) {
        token_ids = transferBatch_log?.args?.ids.map(id => Number(id)) || []
      }

      const [ditributePRTs_log] = parced_logs?.filter(i => i?.name === 'DitributePRTs') || [];
      if (ditributePRTs_log?.args?.minted_amount) {
        minted_amount = Number(ditributePRTs_log?.args?.minted_amount)
      }

      const [remain_message_needs] = parced_logs?.filter(i => i?.name === 'RemainMessageNeeds') || [];
      if (remain_message_needs?.args?._qnt) {
        minted_amount = Number(remain_message_needs?.args?._qnt);
      }


    }


    const params = { txHash, minted_amount, token_ids }

    return {
      success: true,
      status: <StatusSuccess {...params} />
    }

  } catch (error) {
    return StatusError({ error })
  }
}


