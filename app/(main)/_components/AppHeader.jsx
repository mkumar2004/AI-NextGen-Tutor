import React from 'react'
import Image from 'next/image'
import { UserButton } from '@stackframe/stack'
function AppHeader() {
  return (
    <div className='flex justify-between p-3 shadow-sm ' >
     <Image
  src="/homeicon.svg"
  alt="homeicon"
  width={0}
  height={0}
  sizes="100vw"
  className="w-50 h-auto"
/>

      <UserButton/>
    </div>

  )
}

export default AppHeader