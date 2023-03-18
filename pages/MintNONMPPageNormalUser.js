import { useState, useEffect } from 'react'
import { initOnboard } from '../utils/onboard'
import { useConnectWallet } from '@web3-onboard/react'
import { useWallets } from '@web3-onboard/react'
import {
  getTotalMintedNONMP,
  getMaxSupplyNONMP,
  getisMintNONMP,
  getPerAccountMintedNONMPs,
  getMaxNONMPAmountPerAcc,
  getMaxNONMPAmountPerAccPerTransaction,
  mintNONMP,
  getPriceNONMPETH,
  // getStageNONMP
} from '../utils/interact'

const MAIN_STAGE = 4;//normal user

export function MintNONMPPageNormalUser() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const connectedWallets = useWallets()

  // const [stageNONMP, setStageNONMP] = useState(0)

  const [maxSupplyNONMP, setMaxSupplyNONMP] = useState(0)

  const [perAccountMintedNONMP, setPerAccountMintedNONMPs] = useState(0)

  const [totalMintedNONMP, setTotalMintedNONMP] = useState(0)

  const [maxNONMPAmountPerAcc, setMaxNONMPAmountPerAcc] = useState(0)
  const [maxNONMPAmountPerAccPerTransaction, setMaxNONMPAmountPerAccPerTransaction] = useState(0)

  const [isMintNONMP, setisMintNONMP] = useState(false)

  const [priceNONMP, setPriceNONMP] = useState(0)
  const [prtAmount, setPRTAmount] = useState(1)
  const [isTXIsPending, setTXIsPending] = useState(false)

  const [onboard, setOnboard] = useState(null)

  const [status, setStatus] = useState(null)

  const remainingNONMP = Number(maxNONMPAmountPerAcc - perAccountMintedNONMP);

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
      setPerAccountMintedNONMPs(await getPerAccountMintedNONMPs(wallet))
    }
    if (wallet?.accounts[0]?.address) {
      init(wallet)
    }
  }, [wallet?.accounts[0]?.address])//when need connect wallet


  useEffect(() => {
    const init = async () => {
      setMaxSupplyNONMP(await getMaxSupplyNONMP(MAIN_STAGE))
      setTotalMintedNONMP(await getTotalMintedNONMP(MAIN_STAGE))
      setisMintNONMP(await getisMintNONMP(MAIN_STAGE))
      setPriceNONMP(await getPriceNONMPETH(MAIN_STAGE))
      // setStageNONMP(await getStageNONMP())
    }

    init();
  }, [])//when no need wallet pub key details with staeg

  useEffect(() => {
    const init = async () => {
      setMaxNONMPAmountPerAcc(await getMaxNONMPAmountPerAcc())
      setMaxNONMPAmountPerAccPerTransaction(await getMaxNONMPAmountPerAccPerTransaction())
    }

    init();
  }, [])//when no need wallet pub key details with  no staeg

  const incrementPRTAmount = () => {
    if (prtAmount < maxNONMPAmountPerAccPerTransaction && prtAmount < remainingNONMP) {
      setPRTAmount(prtAmount + 1)//
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

    const { success, status: message } = await mintNONMP({ prtAmount, wallet, main_stage: MAIN_STAGE })

    setStatus({
      success,
      message
    })

    setTXIsPending(false)
    setTotalMintedNONMP(await getTotalMintedNONMP(MAIN_STAGE))
    setPerAccountMintedNONMPs(await getPerAccountMintedNONMPs(wallet))
    setPRTAmount(1);
  }


  return (

    <div className="relative z-1 md:max-w-3xl w-full bg-gray-900/90 filter py-4 rounded-md px-2 pt-10 pb-10 pr-10 pl-10 flex flex-col items-center">
      <h1 className="font-default uppercase font-bold text-3xl md:text-4xl bg-gradient-to-br  bg-clip-text text-white mt-3 mb-3">
        {isMintNONMP ? `Mint Normal Pass` : null}
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

      {wallet && isMintNONMP ?
        <div className="flex flex-col md:flex-row md:space-x-14 w-full mt-10 md:mt-14">

          <div className="relative w-full">
            <div className="font-default z-10 absolute top-2 left-2 opacity-80 filter backdrop-blur-lg text-base px-4 py-2 bg-black border border-brand-black rounded-md flex items-center justify-center text-white font-semibold">
              <p>
                <span className="text-brand-blue">{totalMintedNONMP}</span>{' '}/{' '}{maxSupplyNONMP}
              </p>
            </div>


            {isMintNONMP ?
              <img src="/images/vlarge.gif" className="object-cover w-full sm:h-[280px] md:w-[250px] rounded-md" /> : null}

          </div>

          <div className="flex flex-col items-center w-full px-4 mt-16 md:mt-0">

            {wallet ? <div className="font-default flex items-center justify-between w-full">

              <button
                disabled={remainingNONMP === 0}
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
              </button>

              <p className="flex items-center justify-center flex-1 grow text-center font-bold text-brand-blue text-3xl md:text-4xl">
                {remainingNONMP === 0 ? 0 : prtAmount}
              </p>

              <button
                disabled={remainingNONMP === 0}
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

            </div>
              : null}


            <p className="text-sm text-white tracking-widest mt-3">

              {isMintNONMP && wallet ?
                <>
                  Remaining Normal Pass: {remainingNONMP}<br />
                  Total minted Normal Pass: {perAccountMintedNONMP}
                </>
                : null}
            </p>

            {isMintNONMP && wallet ? <div className="border-t border-b py-4 mt-16 w-full">
              <div className="w-full text-xl font-default flex items-center justify-between text-brand-yellow">
                <p>Total</p>

                <div className="flex items-center space-x-3">

                  <>
                    {Number.parseFloat(priceNONMP * prtAmount).toFixed(
                      3
                    )}{' '}
                    <p>
                      ETH
                    </p>
                  </>

                  <span className="text-gray-400">+ GAS</span>
                </div>
              </div>
            </div> : null}


            {/* Mint Button && Connect Wallet Button */}

            {isMintNONMP && wallet ? <button

              className={` ${isTXIsPending || remainingNONMP === 0
                ? 'bg-gray-900 cursor-not-allowed'
                : 'bg-green-600 '
                } w-full mt-3 bg-mt-4 right-4 transition duration-200 ease-in-out font-chalk shadow-lg hover:shadow-black active:shadow-none px-4 py-2 rounded-md text-sm text-white tracking-wide uppercase`}
              disabled={isTXIsPending || remainingNONMP === 0}
              onClick={mintNONMPHandler}
            >
              {isTXIsPending ? <span className='animate-pulse'>Wait, tx is pending...</span> : 'Mint Normal Pass'}
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

    </div>


  )
}
