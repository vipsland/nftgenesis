import { useState, useEffect } from 'react'
import { initOnboard } from '../utils/onboard'
import { useConnectWallet } from '@web3-onboard/react'
import { useWallets } from '@web3-onboard/react'
import {
  getMaxSupplyMP,
  getMPs,
  getisMintMP
} from '../utils/interact'

const MAIN_STAGE = 4;//normal user

export default function MintMPPageNormalUser() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const connectedWallets = useWallets()

  const [maxSupplyMP, setMaxSupplyMP] = useState(0)

  const [listMPs, setMPs] = useState([])
  console.log(listMPs)

  const [isMintMP, setisMintMP] = useState(false)

  const [isTXIsPending, setTXIsPending] = useState(false)

  const [onboard, setOnboard] = useState(null)

  const [status, setStatus] = useState(null)

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
      setMPs(await getMPs(wallet, MAIN_STAGE))//test winner
    }
    if (wallet?.accounts[0]?.address) {
      init(wallet)
    }
  }, [wallet?.accounts[0]?.address])//when need connect wallet


  useEffect(() => {
    const init = async () => {
      setMaxSupplyMP(await getMaxSupplyMP())
      setisMintMP(await getisMintMP(MAIN_STAGE))

    }

    init();
  }, [])//when no need wallet pub key details with stage


  const checkMPHandler = async () => {
    setStatus(null)
    setTXIsPending(true)

    // const { success, status: message } = await checkMPForWalletAddress(wallet)

    // setStatus({
    //   success,
    //   message
    // })

    setTXIsPending(false)
  }

  return (

    <div className="relative z-1 md:max-w-3xl w-full bg-gray-900/90 filter py-4 rounded-md px-2 pt-10 pb-10 pr-10 pl-10 flex flex-col items-center">
      <h1 className="font-default uppercase font-bold text-3xl md:text-4xl bg-gradient-to-br  bg-clip-text text-white mt-3 mb-3">
        {isMintMP ? 'Check your lucky MP' : null}
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

      <div className="border-t border-gray-800 flex flex-col items-center mt-10 py-2 w-full">

        {wallet && isMintMP && listMPs?.length === 0 ? <span className="text-brand-yellow font-default">Sorry! You did not win MP NFT.</span> : null}
        {wallet && isMintMP && listMPs?.length > 0 ? <span className="text-brand-yellow font-default">Congratulations! You are a winner. Your MP Tokens: {listMPs?.join(',')}</span> : null}


        {wallet && isMintMP && listMPs?.length > 0 ?

          <>


            <div className="grid grid-cols-3 gap-4 place-items-start mt-10">
              <div><img width="100" src={`https://ipfs.vipsland.com/nft/collections/genesis/${'50007'}.gif`} className="object-cover w-full sm:h-[280px] md:w-[250px] rounded-md" /></div>
              <div><img src={`https://ipfs.vipsland.com/nft/collections/genesis/${'50007'}.gif`} className="object-cover w-full sm:h-[280px] md:w-[250px] rounded-md" /></div>
              <div><img src={`https://ipfs.vipsland.com/nft/collections/genesis/${'50007'}.gif`} className="object-cover w-full sm:h-[280px] md:w-[250px] rounded-md" /></div>
              <div><img src={`https://ipfs.vipsland.com/nft/collections/genesis/${'50007'}.gif`} className="object-cover w-full sm:h-[280px] md:w-[250px] rounded-md" /></div>
            </div>


          </>
          : null}



      </div>



      {/* Status */}
      {status && (
        <div
          className={`border ${status.success ? 'border-green-500' : 'border-brand-pink-400 '
            } rounded-md text-start h-full px-4 py-4 w-full mx-auto mt-8 md:mt-4"`}
        >
          <p className="flex flex-col space-y-2 text-white text-sm md:text-base break-words ...">
            {status.message}
          </p>
        </div>
      )}


    </div>
  )
}
