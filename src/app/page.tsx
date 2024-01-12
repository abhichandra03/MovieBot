import Image from 'next/image'
import bg from "./assests/bg.png"

export default function Home() {
  return (
    <main className="flex min-h-screen min-w-full flex-col items-center justify-between px-24">
      <div className='absolute -z-10 min-h-screen min-w-full'>
        <Image src={bg} layout='fill' objectFit='cover' quality={100} alt='' className='opacity-50'/>
      </div>
      </main>
  )
}
