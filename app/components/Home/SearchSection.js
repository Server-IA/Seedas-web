import React from 'react'
import InputItem from './InputItem'

function SearchSection() {
  return (
    <div className='p-2 md:-6 border-[2px] rounded-xl'>
        <p className='text-[20px] font-bold'>necesitas trasporte</p>
        <InputItem type='source'/>
        <InputItem type='destination'/>
        <button className='p-4 bg-black w-full mt-5 text-white rounded-lg'>Buscar</button>
    </div>
  )
}

export default SearchSection