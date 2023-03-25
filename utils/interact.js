const { createAlchemyWeb3 } = require('@alch/alchemy-web3')
import { Network, Alchemy, Utils } from 'alchemy-sdk';
import getRevertReason from 'eth-revert-reason';
import { ethers } from "ethers";

const GOERLI_ALCHEMY_API_KEY = "gQs6zSH0_WBwObftQm0qFnAqFQdhKtfw"
const NETWORK = 'goerli'

const eth_goerli_settings = {
  apiKey: `${GOERLI_ALCHEMY_API_KEY}`,
  network: Network.ETH_GOERLI,

};
const alchemy = new Alchemy(eth_goerli_settings);

/** @type import('hardhat/config').HardhatUserConfig */
const GOERLI_RPC_URL = "https://eth-goerli.g.alchemy.com/v2/da4QudLrjNs6-NR8EurK-N0ikxP6ZTVR"

console.log({ GOERLI_RPC_URL })

const web3 = createAlchemyWeb3(GOERLI_RPC_URL)

import { config } from '../dapp.config'

console.log({ config })

const contract = require('../artifacts/contracts/Vipsland.sol/Vipsland.json')
const VipslandContract = new web3.eth.Contract(contract.abi, config.contractAddress)

const NORMAL_ST = '4,5,6,7';
const INT_ST = '2,3,6,7';
const AIR_ST = '1,3,5,7';

async function delay(mls) {
  return new Promise(resolve => { setTimeout(() => resolve(), mls) })
}


export const getTotalMintedNONMP = async (main_stage) => {
  const stage = Number(await VipslandContract.methods.presalePRT().call());
  if (main_stage === 4 && NORMAL_ST.indexOf(stage) > -1) {
    return await VipslandContract.methods.qntmintnonmpfornormaluser().call()
  }

  if (main_stage === 2 && INT_ST.indexOf(stage) > -1) {
    return await VipslandContract.methods.qntmintnonmpforinternalteam().call()
  }

  if (main_stage === 1 && AIR_ST.indexOf(stage) > -1) {
    return await VipslandContract.methods.qntmintnonmpforairdrop().call()
  }

  return 0;
}


export const getTotalMintedMP = async (main_stage) => {
  const stage = Number(await VipslandContract.methods.presalePRT().call());

  if (main_stage === 4 && NORMAL_ST.indexOf(stage) > -1) {
    return await VipslandContract.methods.qntmintmpfornormaluser().call()
  }

  if (main_stage === 2 && INT_ST.indexOf(stage) > -1) {
    return await VipslandContract.methods.qntmintmpforinternalteam().call()
  }

  if (main_stage === 1 && AIR_ST.indexOf(stage) > -1) {
    return await VipslandContract.methods.qntmintmpforairdrop().call()
  }

  return 0;
}


export const getMaxSupplyNONMP = async (main_stage) => {
  const stage = Number(await VipslandContract.methods.presalePRT().call());
  if (main_stage === 4 && NORMAL_ST.indexOf(stage) > -1) {
    return await VipslandContract.methods.MAX_SUPPLY_FOR_PRT_TOKEN().call()
  }

  if (main_stage === 2 && INT_ST.indexOf(stage) > -1) {
    return await VipslandContract.methods.MAX_SUPPLY_FOR_INTERNALTEAM_TOKEN().call()
  }

  if (main_stage === 1 && AIR_ST.indexOf(stage) > -1) {
    return await VipslandContract.methods.MAX_SUPPLY_FOR_AIRDROP_TOKEN().call()
  }

  return 0;
}

export const getMaxSupplyMP = async () => {

  return await VipslandContract.methods.MAX_SUPPLY_MP().call()
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

  if (main_stage === 4 && NORMAL_ST.indexOf(stage) > -1) {
    return await VipslandContract.methods.mintMPIsOpen().call()
  }

  if (main_stage === 2 && INT_ST.indexOf(stage) > -1) {
    return await VipslandContract.methods.mintInternalTeamMPIsOpen().call()
  }

  if (main_stage === 1 && AIR_ST.indexOf(stage) > -1) {
    return await VipslandContract.methods.mintAirdropMPIsOpen().call()
  }

  return false;
}


export const getMaxNONMPAmountPerAcc = async (stage) => {
  if (stage === 4 && NORMAL_ST.indexOf(stage) > -1) {
    return await VipslandContract.methods.MAX_PRT_AMOUNT_PER_ACC().call();
  }

  if (stage === 2 && INT_ST.indexOf(stage) > -1) {
    return await VipslandContract.methods.MAX_PRT_AMOUNT_PER_ACC_INTERNAL().call();
  }

  if (stage === 1 && AIR_ST.indexOf(stage) > -1) {
    return await VipslandContract.methods.MAX_PRT_AMOUNT_PER_ACC_AIRDROP().call();
  }
}

export const getMaxNONMPAmountPerAccPerTransaction = async (stage) => {

  if (stage === 4 && NORMAL_ST.indexOf(stage) > -1) {
    return await VipslandContract.methods.MAX_PRT_AMOUNT_PER_ACC_PER_TRANSACTION().call();
  }

  if (stage === 2 && INT_ST.indexOf(stage) > -1) {
    return await VipslandContract.methods.MAX_PRT_AMOUNT_PER_ACC_PER_TRANSACTION_INTERNAL().call();
  }

  if (stage === 1 && AIR_ST.indexOf(stage) > -1) {
    return await VipslandContract.methods.MAX_PRT_AMOUNT_PER_ACC_PER_TRANSACTION_AIRDROP().call();
  }

}


export const getPriceNONMPETH = async (main_stage) => {
  const stage = Number(await VipslandContract.methods.presalePRT().call());


  if (main_stage === 4 && NORMAL_ST.indexOf(stage) > -1) {

    const priceWei = await VipslandContract.methods.PRICE_PRT().call();
    const priceEth = web3.utils.fromWei(`${priceWei}`, 'ether');

    return priceEth;
  }

  if (main_stage === 2 && INT_ST.indexOf(stage) > -1) {
    const priceWei = await VipslandContract.methods.PRICE_PRT_INTERNALTEAM().call();
    const priceEth = web3.utils.fromWei(`${priceWei}`, 'ether');

    return priceEth;
  }

  if (main_stage === 1 && AIR_ST.indexOf(stage) > -1) {
    const priceWei = await VipslandContract.methods.PRICE_PRT_AIRDROP().call();
    const priceEth = web3.utils.fromWei(`${priceWei}`, 'ether');

    return priceEth;

  }

  return 0;
}

export const getPriceNONMPWEI = async (main_stage) => {
  const stage = Number(await VipslandContract.methods.presalePRT().call());

  if (main_stage === 4 && NORMAL_ST.indexOf(stage) > -1) return await VipslandContract.methods.PRICE_PRT().call()
  if (main_stage === 2 && INT_ST.indexOf(stage) > -1) return await VipslandContract.methods.PRICE_PRT_INTERNALTEAM().call()
  if (main_stage === 1 && AIR_ST.indexOf(stage) > -1) return await VipslandContract.methods.PRICE_PRT_AIRDROP().call()

  return 0;
}

export const getPerAccountMintedNONMPs = async (wallet) => {
  if (!wallet?.accounts[0]?.address) {
    return 0
  }

  return await VipslandContract.methods.userNONMPs(wallet?.accounts[0]?.address).call();
}


export const getListNONMPsAndMPs = async (wallet, main_stage) => {

  const defaultValue = { ownedNftsNONMP: [], ownedNftsMP: [] }

  if (!wallet?.accounts[0]?.address) {
    return defaultValue
  }

  const isMintMP = await getisMintMP(main_stage)

  if (!isMintMP) {
    return defaultValue
  }

  const _MAX_SUPPLY_MP = await getMaxSupplyMP()
  console.log({ _MAX_SUPPLY_MP })

  const { ownedNfts = [] } = await alchemy.nft.getNftsForOwner(wallet?.accounts[0]?.address, { contractAddresses: [config.contractAddress] }) || {};
  const resp = ownedNfts.reduce((acc, t) => {

    if (Number(t.tokenId) <= _MAX_SUPPLY_MP) {
      acc.ownedNftsMP = [].concat(acc.ownedNftsMP, t)
    } else {
      acc.ownedNftsNONMP = [].concat(acc.ownedNftsNONMP, t)
    }
    return acc

  }, defaultValue)


  // console.log({ resp })
  //ownedNftsNONMP, ownedNftsMP
  // Access the Alchemy NFT API
  // const res = await alchemy.nft.getNftsForOwner(wallet?.accounts[0]?.address).then(console.log);

  console.log({ resp })
  return resp;

}


// async function checkStatusTx(txHash) {
//   let isPending = true;

//   return new Promise(async (resolve, reject) => {
//     while (isPending) {
//       await delay(1000)


//       const res = await alchemy.core.getTransaction(txHash)
//       const { blockHash, blockNumber, transactionIndex } = res ?? {}
//       isPending = blockHash === null && blockNumber === null && transactionIndex === null
//       console.log(`delay`, { res });
//     }


//     if (!isPending) {
//       const receipt = await alchemy.core.getTransactionReceipt(txHash)
//       resolve(receipt)
//     }

//   });
// }

export const mintNONMP = async ({ prtAmount, wallet, main_stage }) => {

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
    "latest"
  );


  console.log(`debug String(priceEth * prtAmount)`, String(priceEth * prtAmount));

  const tx = {
    to: config.contractAddress,
    from: wallet?.accounts[0]?.address,
    value: parseInt(
      web3.utils.toWei(`${priceEth * prtAmount}`, 'ether')
    ).toString(16), // hex
    // value: Utils.parseEther(`${priceEth * prtAmount}`),
    data: VipslandContract.methods
      .mintNONMP(wallet?.accounts[0]?.address, prtAmount, main_stage)
      .encodeABI(),
    nonce: nonce.toString(16),
    gasLimit: "21000",

  }


  let isReverted = false, txHash;
  try {
    txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [tx]
    })
    console.log({ txHash })

    const res = await alchemy.transact
      .waitForTransaction(
        `${txHash}`
      )
    console.log('waitForTransaction!!!', res)

    // const receipt = await alchemy.core.getTransactionReceipt(txHash)

    // Listen to all new pending transactions
    alchemy.ws.on(
      {
        method: "alchemy_pendingTransactions",
        fromAddress: `${wallet?.accounts[0]?.address}`
      },
      (res) => console.log(`alchemy_pendingTransactions`, { res })
    );

    const isSuccess = res?.status === 1

    if (!isSuccess) {
      const reason = await getRevertReason(txHash, NETWORK, res?.blockNumber)
      return {
        success: false,
        status: '😞 Transaction is reverted:' + reason + (txHash ? `. https://sepolia.etherscan.io/tx/${txHash}` : '')
      }
    }

    // Get all the NFTs owned by an address
    const nfts = alchemy.nft.getNftsForOwner(`${wallet?.accounts[0]?.address}`);
    console.log(`alchemy.nft.getNftsForOwner`, { nfts })

    // Get the latest block
    const latestBlock = alchemy.core.getBlockNumber();
    console.log(`alchemy.core.getBlockNumber`, { latestBlock })

    // Get all outbound transfers for a provided address
    alchemy.core
      .getTokenBalances(`${wallet?.accounts[0]?.address}`)
      .then((res) => console.log('alchemy.core.getTokenBalances', { res }));


    let minted_amount, token_ids;

    if (res?.logs?.length > 0) {

      const parced_logs = res?.logs.map(log => {
        const { data, topics } = log
        const iface = new ethers.utils.Interface(contract.abi)
        const parced = iface.parseLog({ data, topics });
        return parced
      });

      console.log({ parced_logs });

      const [transferBatch_log] = parced_logs?.filter(i => i?.name === 'TransferBatch') || [];
      if (transferBatch_log?.args?.ids?.length > 0) {
        token_ids = transferBatch_log?.args?.ids.map(id => Number(id)).join(',')
      }

      const [ditributePRTs_log] = parced_logs?.filter(i => i?.name === 'DitributePRTs') || [];
      if (ditributePRTs_log?.args?.minted_amount) {
        minted_amount = Number(ditributePRTs_log?.args?.minted_amount)
      }

      const [remain_message_needs] = parced_logs?.filter(i => i?.name === 'RemainMessageNeeds') || [];
      if (remain_message_needs?.args?._qnt) {
        minted_amount = Number(remain_message_needs?.args?._qnt);
      }

      console.log({ token_ids, minted_amount })

    }


    return {
      success: true,
      status: (
        <a href={`https://sepolia.etherscan.io/tx/${txHash}`} rel="noreferrer" target="_blank">
          <span>✅ Success, check out your transaction on Etherscan:</span><br />
          <span>{`https://sepolia.etherscan.io/tx/${txHash}`}</span><br />
          {minted_amount ? <><span>Total minted NONMP: {minted_amount}</span><br /></> : null}
          {token_ids ? <span>Tokens minted per this transaction: {token_ids}</span> : null}
        </a>
      )
    }



  } catch (error) {
    return {
      success: false,
      status: ('😞 Smth went wrong: ') + error?.message + (txHash ? `. https://sepolia.etherscan.io/tx/${txHash}` : '')
    }
  }
}



//   let isReverted = false;
//   let txHash = '';
//   try {
//     txHash = await window.ethereum.request({
//       method: 'eth_sendTransaction',
//       params: [tx]
//     })
//     console.log({ txHash })
//     const receipt = await checkStatusTx(txHash)
//     console.log({ receipt });


//     isReverted = receipt.status === 0
//     if (isReverted) {
//       const reason = await getRevertReason(txHash, 'sepolia', receipt?.blockNumber)
//       console.log({ reason })
//       return {
//         success: false,
//         status: '😞 Transaction is reverted:' + reason + (txHash ? `. https://sepolia.etherscan.io/tx/${txHash}` : '')
//       }
//     }

//     let minterLogOutput = {}

//     if (receipt?.logs?.length > 0) {

//       const parced_logs = receipt?.logs.map(log => {
//         const { data, topics } = log
//         const iface = new ethers.utils.Interface(contract.abi)
//         const parced = iface.parseLog({ data, topics });
//         return parced
//       });

//       const arr = parced_logs?.filter(i => i?.name === 'Minter')
//       const [log] = arr
//       minterLogOutput.tokenID = log?.args?.tokenID?.toString()
//       minterLogOutput.price = log?.args?.price?.toString()

//       // alchemy.core.getLogs({
//       //   address: config.contractAddress,
//       //   topics: [
//       //     ...log.topics
//       //   ],
//       //   blockHash: log.blockHash,
//       // }).then((res) => console.log(`log?`, res));

//     }


//     return {
//       success: true,
//       status: (
//         <a href={`https://sepolia.etherscan.io/tx/${txHash}`} rel="noreferrer" target="_blank">
//           <span>✅ Success, check out your transaction on Etherscan:</span><br />
//           <span>{`https://sepolia.etherscan.io/tx/${txHash}`}</span><br />
//           <span>Minted NFT ID: {minterLogOutput?.tokenID}, price of NFT: {minterLogOutput?.price}</span>
//         </a>
//       )
//     }



//   } catch (error) {
//     return {
//       success: false,
//       status: (isReverted ? '😞 Transaction is reverted: ' : '😞 Smth went wrong: ') + error.message + (txHash ? `. https://sepolia.etherscan.io/tx/${txHash}` : '')
//     }
//   }
// }


