import { useState, useEffect } from 'react'
import MintNONMPPageInternal from './MintNONMPPageInternal'

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

  console.log({ isMintMP, isMintNONMP })
  return (
    <div className="min-h-screen h-full w-full overflow-hidden flex flex-col items-center justify-center bg-brand-background ">
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center h-full w-full px-2 md:px-10">
          {(isMintMP === false && isMintNONMP === true) ? <MintNONMPPageInternal /> : (isMintMP === true || isMintNONMP === false) ?
            <div>
              <h1 className="font-default uppercase font-bold text-3xl md:text-4xl bg-gradient-to-br  bg-clip-text text-white mt-3 mb-3">
                {'TEAM IS NOT AVAILABLE NOW.'}
              </h1>
              <div className="text-white">Visit <a href="https://vipsland.com/">vipsland.com</a> for more information.</div>
            </div>
            : <div className="text-white">Loading...</div>}
        </div>
      </div>
    </div>
  )
}
