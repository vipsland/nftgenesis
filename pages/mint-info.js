import { useState, useEffect } from 'react'
import MintMPPageNormalUser from './MintMPPageNormalUser'

import {
    getisMintNONMP,
    getisMintMP,
} from '../utils/interact'

const MAIN_STAGE = 4;//normal user

export default function Mint() {

    const [isMintNONMP, setisMintNONMP] = useState(false)
    const [isMintMP, setisMintMP] = useState(false)

    useEffect(() => {
        const init = async () => {
            setisMintNONMP(await getisMintNONMP(MAIN_STAGE))
            setisMintMP(await getisMintMP(MAIN_STAGE))
        }

        init();
    }, [])//when no need wallet pub key details with stage


    return (
        <div className="min-h-screen h-full w-full overflow-hidden flex flex-col items-center justify-center bg-brand-background ">
            <div className="relative w-full h-full flex flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center h-full w-full px-2 md:px-10">
                    {isMintMP ? <MintMPPageNormalUser /> : null}
                </div>
            </div>
        </div>
    )
}
