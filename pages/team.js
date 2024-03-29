import { useState, useEffect } from 'react'
import MintNONMPPageInternal from './MintNONMPPageInternal'
import Link from 'next/link'
import Loader from './Loader'

import {
  getisMintNONMP,
  getisMintMP,
} from '../utils/interact'

const MAIN_STAGE = 2;//internal

export default function Team() {

  const [isMintNONMP, setisMintNONMP] = useState(undefined)
  const [isMintMP, setisMintMP] = useState(undefined)

  useEffect(() => {
    const init = async () => {
      setisMintNONMP(await getisMintNONMP(MAIN_STAGE))
      setisMintMP(await getisMintMP(MAIN_STAGE))
    }

    init();
  }, [])//when no need wallet pub key details with stage

  return (
    <>
      <div className="min-h-screen h-full w-full overflow-hidden flex flex-col items-center justify-center bg-brand-background ">
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center h-full w-full px-2 md:px-10">
            {(isMintMP === false && isMintNONMP === true) ? <MintNONMPPageInternal /> : (isMintMP === true || isMintNONMP === false) ?
              <div>
                <h1 className="text-center font-default uppercase font-bold text-3xl md:text-4xl bg-gradient-to-br  bg-clip-text text-black mt-3 mb-3">
                  {'TEAM IS NOT AVAILABLE NOW'}
                </h1>
                <div className="text-black font-bold text-center">Visit <a href="https://vipsland.com/">vipsland.com</a> for more information</div>
                <div className='pt-3 text-center'>
                  <Link href="/mint-info"><span className=" text-brand-pink font-bold cursor-pointer">Click here to check Mint Info</span></Link>
                </div>

              </div>
              : <Loader />}
          </div>
        </div>
      </div>

    </>
  )
}
