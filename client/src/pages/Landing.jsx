import React from 'react'
import { Link } from 'react-router-dom'

const Landing = () => {
  return (
      <div style={{backgroundImage:'url(/Copilot.png) ',backgroundSize: 'cover',backgroundPosition: 'center', }} 
      className=' bg-center h-screen sm:bg-contain md:bg-[position:top_30%]  mt-9 pt-15 bg-no-repeat'>
     <div  className='flex justify-between mt-3'>
     <div >
      <h1 className='text-white font-bold text-150 flex md:text-4xl p-2'> Welcome to Pro-Damtal Susu 
      mobilization app</h1>
     <h1 className='text-blue-900 font-bold text-100 slow-bounce p-2'> <span className=' bg-neutral-100  border-transparent md:text-xl '>  Feel    free    to explore           </span></h1>

     </div>
          <Link to='/check'><button className='hover:bg-slate-800 text-white font-bold w-35 h-15 p-4 m-3 bg-blue-800 slow-bounce'>Login</button></Link>

    
     </div>
    </div>
  )
}

export default Landing
