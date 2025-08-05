import React from 'react'
import { Link } from 'react-router-dom'

const Landing = () => {
  return (
      <div style={{backgroundImage:'url(/bank1-Pica.png) ' }} className='bg-cover bg-center h-screen md:bg-contain md:bg-[position:top_30%] p-4 pt-0 bg-no-repeat'>
     <div className='flex justify-between mt-3'>
     <div>
      <h1 className='text-slate-700 font-bold text-3xl '> Welcome to <span className='text-blue-900'>Pro-Damtal Susu </span>mobilization app</h1>
     <h1 className='text-blue-900 font-bold text-3xl animate-bounce '>Feel free <span className=' bg-neutral-100  border-transparent'>         to explore           </span></h1>
     </div>

      <Link to='/check'><button className='bg-slate-800 text-white font-bold w-35 h-15 p-4 m-3 hover:bg-blue-800'>Login</button></Link>
     </div>
    </div>
  )
}

export default Landing
