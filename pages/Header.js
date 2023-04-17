import Image from 'next/image'

export default function Header() {

  return (


    <>
      <a href="https://vipsland.com/" target="_blank" rel="noreferrer">
        <Image src="/images/vipsland.webp" alt="" width={250} height={41} />
      </a>

      <p className="text-sm mt-1" >
        <a href="https://vipsland.com/intro" target="_blank" rel="noreferrer" className="lowercase font-default font-bold text-brand-blue">
          <code>intro</code>
        </a>
      </p>
    </>




  )
}
