import { useState, useEffect } from 'react'
import { initOnboard } from '../utils/onboard'
import { useConnectWallet } from '@web3-onboard/react'
import { useWallets } from '@web3-onboard/react'
import {
  getListNONMPsAndMPs,
} from '../utils/interact'


import { config } from '../dapp.config'

const contractAddress = config?.contractAddress

export default function MintInfoPage() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const connectedWallets = useWallets()

  const [listNONMPsAndMPs, setListNONMPsAndMPs] = useState({ ownedNftsNONMP: [], ownedNftsMP: [] })

  const [onboard, setOnboard] = useState(null)


  useEffect(() => {
    setOnboard(initOnboard)
  }, [])

  useEffect(() => {
    if (!connectedWallets.length) return

    const connectedWalletsLabelArray = connectedWallets.map(
      ({ label }) => label
    )
    window.localStorage.setItem(
      'connectedWallets',
      JSON.stringify(connectedWalletsLabelArray)
    )
  }, [connectedWallets])

  useEffect(() => {
    if (!onboard) return

    const previouslyConnectedWallets = JSON.parse(
      window.localStorage.getItem('connectedWallets')
    )

    if (previouslyConnectedWallets?.length) {
      async function setWalletFromLocalStorage() {
        await connect({
          autoSelect: {
            label: previouslyConnectedWallets[0],
            disableModals: true
          }
        })
      }

      setWalletFromLocalStorage()
    }
  }, [onboard, connect])


  useEffect(() => {
    const init = async (wallet) => {
      setListNONMPsAndMPs(await getListNONMPsAndMPs(wallet))//test winner
    }
    if (wallet?.accounts[0]?.address) {
      init(wallet)
    }
  }, [wallet?.accounts[0]?.address])//when need connect wallet



  return (

    <div className="relative z-1 md:max-w-3xl w-full bg-gray-900/90 filter py-4 rounded-md px-2 pt-10 pb-10 pr-10 pl-10 flex flex-col items-center">
      <h1 className="font-default uppercase font-bold text-3xl md:text-4xl bg-gradient-to-br  bg-clip-text text-white mt-3 mb-3">
        {wallet?.accounts[0]?.address ? 'Check your membership pass' : null}
        {!wallet?.accounts[0]?.address ? 'Check info' : null}
      </h1>
      <h3 className="text-sm text-white tracking-widest">
        {wallet?.accounts[0]?.address
          ? wallet?.accounts[0]?.address.slice(0, 8) +
          '...' +
          wallet?.accounts[0]?.address.slice(-4)
          : ''}
      </h3>
      <button
        className="mt-4 right-4 bg-blue-600 transition duration-200 ease-in-out font-chalk shadow-lg hover:shadow-black active:shadow-none px-4 py-2 rounded-md text-sm text-white tracking-wide uppercase"
        onClick={() => (wallet ? disconnect({
          label: wallet.label
        }) : connect())}
      >
        {connecting ? 'connecting' : wallet ? 'disconnect wallet' : 'connect wallet'}
      </button>

      {wallet?.accounts[0]?.address ? <div>

        {listNONMPsAndMPs?.ownedNftsNONMP.length > 0 ? <div className="border-t border-gray-800 flex flex-col items-center mt-10 py-2 pt-10 w-full">

          {wallet?.accounts[0]?.address && listNONMPsAndMPs?.ownedNftsMP?.length === 0 ? <span className="text-brand-yellow font-default">Sorry! You did not win MP NFT.</span> : null}
          {wallet?.accounts[0]?.address && listNONMPsAndMPs?.ownedNftsMP?.length > 0 ? <span className="text-brand-yellow font-default">Congratulations! You are a winner. Your Membership Pass(es): {listNONMPsAndMPs?.ownedNftsMP.map(({ tokenId }) => tokenId)?.join(', ')}. Check <a href={`https://testnets.opensea.io/assets/goerli/${contractAddress}`} target={`_blank`}>OpenSea</a>. </span> : null}
          {wallet?.accounts[0]?.address && listNONMPsAndMPs?.ownedNftsMP?.length > 0 ?

            <div>


              {/* <a href={`https://testnets.opensea.io/assets/goerli/${getContractAddress}/${id}.gif`}></a> */}

              <div className="grid grid-cols-3 gap-4 place-items-start mt-10">
                {listNONMPsAndMPs?.ownedNftsMP.map(({ tokenId }) => {
                  return <div key={tokenId}><a href={`https://testnets.opensea.io/assets/goerli/${contractAddress}/${tokenId}`} target={`_blank`}><img width="100" src={`https://ipfs.vipsland.com/nft/collections/genesis/${tokenId}.gif`} className="object-cover w-full sm:h-[280px] md:w-[250px] rounded-md" /></a></div>
                })}

              </div>


            </div>
            : null}



        </div>

          : null}


        <div className="border-t border-gray-800 flex flex-col items-center mt-10 pt-10 py-2 w-full">

          {wallet && listNONMPsAndMPs?.ownedNftsNONMP.length > 0 ? <span className="text-white font-default">These are your Normal Pass(es): {listNONMPsAndMPs?.ownedNftsNONMP?.map(({ tokenId }) => tokenId).join(', ')}. Check <a href={`https://testnets.opensea.io/assets/goerli/${contractAddress}`} target={`_blank`}>OpenSea</a>. </span> :
            <span className="text-white font-default">
              No Membership Pass Bought Yet.
            </span>}


          {wallet && listNONMPsAndMPs?.ownedNftsNONMP.length > 0 ?

            <div>

              {/* <a href={`https://testnets.opensea.io/assets/goerli/${getContractAddress}/${id}.gif`}></a> */}

              <div className="grid grid-cols-3 gap-4 place-items-start mt-10">
                {listNONMPsAndMPs?.ownedNftsNONMP?.map(({ tokenId }) => {
                  return <div key={tokenId}><a href={`https://testnets.opensea.io/assets/goerli/${contractAddress}/${tokenId}`} target={`_blank`}><img width="100" src={`https://ipfs.vipsland.com/nft/collections/genesis/${tokenId}.gif`} className="object-cover w-full sm:h-[280px] md:w-[250px] rounded-md" /></a></div>
                })}

              </div>


            </div>
            : null}



        </div>
      </div> : null}




    </div>
  )
}