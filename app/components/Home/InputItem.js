import Image from 'next/image'
import React from 'react'

function InputItem({type}) {
  return (
    <div className='bg-slate-200 p-3 rounded-lg mt-3 
    flex items-center gap-4'>
        <Image src={type=='source'?'/source.png':'/source.png'}width={15} height={15}/>
        <input type='text'
        placeholder={type=='source'?'Pickup Location':'Dropoff location' }
        className='bg-trasparent w-full outline-none '/>

    </div>
  )
}

export default InputItem