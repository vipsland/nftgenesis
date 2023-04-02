import { useState, useEffect } from 'react'
import MintInfoPage from './MintInfoPage'
import Footer from './Footer'

// import {
//     getisMintNONMP,
//     getisMintMP,
// } from '../utils/interact'

const MAIN_STAGE = 4;//normal user

export default function MintInfo() {

    // const [isMintMP, setisMintMP] = useState(undefined)

    useEffect(() => {
        const init = async () => {
            // setisMintMP(await getisMintMP(MAIN_STAGE))
        }

        init();
    }, [])//when no need wallet pub key details with stage


    return (
        <>
            <div className="min-h-screen h-full w-full overflow-hidden flex flex-col items-center justify-center bg-brand-background ">
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                    <div className="flex flex-col items-center justify-center h-full w-full px-2 md:px-10">
                        <MintInfoPage />
                    </div>
                </div>
            </div>
            <Footer />

        </>
    )
}
