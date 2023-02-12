import { useState, useEffect } from 'react'
import { initOnboard } from '../utils/onboard'
import { useConnectWallet } from '@web3-onboard/react'
import { useSetChain, useWallets } from '@web3-onboard/react'
import { config } from '../dapp.config'
import {
  getTotalMintedNONMP,
  getTotalMintedMP,
  getMaxSupplyNONMP,
  getMaxSupplyMP,
  getisMintNONMP,
  getStageNONMP,
  getisMintMP,
  getPerAccountNONMPs,
  getMaxNONMPAmount,
  isWinner,
  mintNONMP,
  getPriceNONMPETH
} from '../utils/interact'

import { ethers } from 'ethers'

export default function Mint() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const [{ chains, connectedChain, settingChain }, setChain] = useSetChain()
  const connectedWallets = useWallets()


  const [maxSupplyNONMP, setMaxSupplyNONMP] = useState(0)
  const [maxSupplyMP, setMaxSupplyMP] = useState(0)


  const [perAccountNONMP, setPerAccountNONMP] = useState(0)
  const [isAccountWinner, setIsWinner] = useState(false)

  const [totalMintedNONMP, setTotalMintedNONMP] = useState(0)
  const [totalMintedMP, setTotalMintedMP] = useState(0)

  const [maxNONMPAmount, setMaxNONMPAmount] = useState(0)
  const [isMintNONMP, setisMintNONMP] = useState(false)
  const [stageNONMP, setStageNONMP] = useState(false)
  const [isMintMP, setisMintMP] = useState(false)


  const [priceNONMP, setPriceNONMP] = useState(0)
  const [prtAmount, setPRTAmount] = useState(1)
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


  // await window.ethereum.request({
  //   method: "wallet_requestPermissions",
  //   params: [
  //     {
  //       eth_accounts: {}
  //     }
  //   ]
  // });

  useEffect(() => {
    const metadataForAccount = async (wallet) => {
      setPerAccountNONMP(await getPerAccountNONMPs(wallet))
      setIsWinner(await isWinner(wallet))
    }
    if (wallet?.accounts[0]?.address) {

      metadataForAccount(wallet)

    }
  }, [wallet?.accounts[0]?.address])


  useEffect(() => {
    const init = async () => {
      setMaxSupplyNONMP(await getMaxSupplyNONMP())
      setMaxSupplyMP(await getMaxSupplyMP())
      setTotalMintedNONMP(await getTotalMintedNONMP())
      setTotalMintedMP(await getTotalMintedMP())
      setisMintNONMP(await getisMintNONMP())
      setStageNONMP(await getStageNONMP())


      setisMintMP(await getisMintMP())
      setPriceNONMP(await getPriceNONMPETH())
      setMaxNONMPAmount(await getMaxNONMPAmount())
    }

    init()
  }, [wallet?.accounts[0]?.address])

  const incrementPRTAmount = () => {
    if (prtAmount < maxNONMPAmount) {
      setPRTAmount(prtAmount + 1)
    }
  }

  const decrementPRTAmount = () => {
    if (prtAmount > 1) {
      setPRTAmount(prtAmount - 1)
    }
  }

  const mintNONMPHandler = async () => {
    setStatus(null)
    setTXIsPending(true)

    const { success, status } = await mintNONMP(prtAmount, wallet)

    setStatus({
      success,
      message: status
    })

    setTXIsPending(false)
    setTotalMintedNONMP(await getTotalMintedNONMP())
    setPerAccountNONMP(await getPerAccountNONMPs(wallet))
  }

  const checkYourMP = async () => {
    setStatus(null)
    setTXIsPending(true)

    const { success, status } = await mintNFT(wallet)

    setStatus({
      success,
      message: status
    })

    setTXIsPending(false)
    setTotalMintedMP(await getTotalMintedMP())
  }


  return (

    <div className="min-h-screen h-full w-full overflow-hidden flex flex-col items-center justify-center bg-brand-background ">
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <img
          src="/images/blur.jpeg"
          className="animate-pulse-slow absolute inset-auto block w-full min-h-screen object-cover"
        />

        <div className="flex flex-col items-center justify-center h-full w-full px-2 md:px-10">
          <div className="relative z-1 md:max-w-3xl w-full bg-gray-900/90 filter backdrop-blur-sm py-4 rounded-md px-2 md:px-10 flex flex-col items-center">
            <h1 className="font-coiny uppercase font-bold text-3xl md:text-4xl bg-gradient-to-br  from-brand-green to-brand-blue bg-clip-text text-transparent mt-3">
              {isMintNONMP ? `MINT NONMP, stage ${stageNONMP}` : isMintMP ? 'Mint MP' : 'NO ACTIVE STAGE'}
            </h1>
            <h3 className="text-sm text-pink-200 tracking-widest">
              {wallet?.accounts[0]?.address
                ? wallet?.accounts[0]?.address.slice(0, 8) +
                '...' +
                wallet?.accounts[0]?.address.slice(-4)
                : ''}
            </h3>
            <button
              className="mt-4 right-4 bg-indigo-600 transition duration-200 ease-in-out font-chalk shadow-lg hover:shadow-black active:shadow-none px-4 py-2 rounded-md text-sm text-white tracking-wide uppercase"
              onClick={() => (wallet ? disconnect({
                label: wallet.label
              }) : connect())}
            >
              {connecting ? 'connecting' : wallet ? 'disconnect wallet' : 'connect wallet'}
            </button>

            <div className="border-t border-gray-800 flex flex-col items-center mt-10 py-2 w-full">{wallet && isMintMP && !isAccountWinner ? <span className="text-brand-yellow font-coiny">Sorry! You did not win NFT.</span> : null}</div>



            {wallet && (isMintNONMP || isMintMP) ?
              <div className="flex flex-col md:flex-row md:space-x-14 w-full mt-10 md:mt-14">

                <div className="relative w-full">
                  {isMintNONMP ? <div className="font-coiny z-10 absolute top-2 left-2 opacity-80 filter backdrop-blur-lg text-base px-4 py-2 bg-black border border-brand-purple rounded-md flex items-center justify-center text-white font-semibold">
                    <p>
                      <span className="text-brand-pink">{totalMintedNONMP}</span>{' '}/{' '}{maxSupplyNONMP}
                    </p>
                  </div> : null}

                  {isMintMP && isAccountWinner ? <div className="font-coiny z-10 absolute top-2 left-2 opacity-80 filter backdrop-blur-lg text-base px-4 py-2 bg-black border border-brand-purple rounded-md flex items-center justify-center text-white font-semibold">
                    <p>
                      <span className="text-brand-pink">{totalMintedMP}</span>{' '}/{' '}{maxSupplyMP}
                    </p>
                  </div> : null}

                  {isAccountWinner || isMintNONMP ?
                    <img src="/images/13.png" className="object-cover w-full sm:h-[280px] md:w-[250px] rounded-md" /> : null}

                </div>

                <div className="flex flex-col items-center w-full px-4 mt-16 md:mt-0">

                  {wallet ? <div className="font-coiny flex items-center justify-between w-full">
                    {isMintMP ? null : <button
                      disabled={isMintMP}
                      className="w-14 h-10 md:w-16 md:h-12 flex items-center justify-center text-brand-background hover:shadow-lg bg-gray-300 font-bold rounded-md"
                      onClick={incrementPRTAmount}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 md:h-8 md:w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </button>}

                    <p className="flex items-center justify-center flex-1 grow text-center font-bold text-brand-pink text-3xl md:text-4xl">
                      {isMintMP ? null : prtAmount}
                    </p>

                    {isMintMP ? null : <button
                      disabled={isMintMP}
                      className="w-14 h-10 md:w-16 md:h-12 flex items-center justify-center text-brand-background hover:shadow-lg bg-gray-300 font-bold rounded-md"
                      onClick={decrementPRTAmount}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 md:h-8 md:w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18 12H6"
                        />
                      </svg>
                    </button>
                    }

                  </div>
                    : null}


                  <p className="text-sm text-pink-200 tracking-widest mt-3">

                    {wallet && isMintMP ? <>
                      {isAccountWinner ?
                        <>
                          Congratulation! You won NFT, please mint. You can mint only <span className="text-brand-yellow font-coiny">1 NFT</span>.
                        </> :
                        null
                      }
                    </>
                      : null}

                    {isMintNONMP && wallet ?
                      <>
                        Remaining NONMP: {Number(maxNONMPAmount - perAccountNONMP)}
                      </>
                      : null}
                  </p>

                  {wallet && isMintNONMP ? <div className="border-t border-b py-4 mt-16 w-full">
                    <div className="w-full text-xl font-coiny flex items-center justify-between text-brand-yellow">
                      <p>Total</p>

                      <div className="flex items-center space-x-3">

                        <>
                          {Number.parseFloat(priceNONMP * prtAmount).toFixed(
                            2
                          )}{' '}
                          <p>
                            ETH
                          </p>
                        </>

                        <span className="text-gray-400">+ GAS</span>
                      </div>
                    </div>
                  </div> : null}

                  {wallet && isMintMP && isAccountWinner ? <div className="border-t border-b py-4 mt-16 w-full">
                    <div className="w-full text-xl font-coiny flex items-center justify-between text-brand-yellow">
                      <p>Total</p>

                      <div className="flex items-center space-x-3">

                        <p>0 ETH</p>

                        <span className="text-gray-400">+ GAS</span>
                      </div>
                    </div>
                  </div> : null}


                  {/* Mint Button && Connect Wallet Button */}

                  {wallet && isMintNONMP ? <button
                    className={` ${isTXIsPending
                      ? 'bg-gray-900 cursor-not-allowed'
                      : 'bg-gradient-to-br from-brand-purple to-brand-pink shadow-lg hover:shadow-pink-400/50'
                      } font-coiny mt-12 w-full px-6 py-3 rounded-md text-2xl text-white  mx-4 tracking-wide uppercase`}
                    disabled={isTXIsPending}
                    onClick={mintNONMPHandler}
                  >
                    {isTXIsPending ? <span className='animate-pulse'>Wait, tx is pending...</span> : 'Mint NONMP'}
                  </button> : null}

                  {wallet && isMintMP ? <button
                    className={`${isTXIsPending
                      ? 'bg-gray-900 cursor-not-allowed'
                      : 'bg-gradient-to-br from-brand-purple to-brand-pink shadow-lg hover:shadow-pink-400/50'
                      } font-coiny mt-12 w-full px-6 py-3 rounded-md text-2xl text-white  mx-4 tracking-wide uppercase`}
                    disabled={isTXIsPending}
                    onClick={checkYourMP}
                  >
                    {isTXIsPending ? <span className='animate-pulse'>Wait, processing...</span> : 'Check your MP'}
                  </button> : null}


                </div>
              </div>
              : null}

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

            {/* Contract Address */}
            <div className="border-t border-gray-800 flex flex-col items-center mt-10 py-2 w-full">
              <h3 className="font-coiny text-2xl text-brand-pink uppercase mt-6">
                Contract Address
              </h3>
              <a
                href={`https://goerli.etherscan.io/address/${config.contractAddress}#readContract`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 mt-4"
              >
                <span className="break-all ...">{config.contractAddress}</span>
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
