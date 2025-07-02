import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <div className='p-2.5'>
      <ul className='flex justify-between '>
        <Link to='/admin'><li><img className='w-8 h-8' src='/home.png'/></li></Link>
        <Link to='/signin'><li>Signin</li></Link>
        <Link to='/about'><li>About</li></Link>
        <Link to='/agent'><li>AgentsHomePage</li></Link>
        <Link to='/profile'><li>Profile</li></Link>
      </ul>
    </div>
  )
}

export default Header
