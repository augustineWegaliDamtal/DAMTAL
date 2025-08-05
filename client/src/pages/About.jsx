import React from 'react'

const About = () => {
  return (
     <div style={{backgroundImage:'url(/qoute.png) ',   backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
    width: '100%',
    maxWidth: '400px',
    height: 'auto',
    aspectRatio: '1 / 1', // Keeps it square
    margin: '0 auto', }} className='bg-cover bg-center bg-amber-400 h-screen p-4 '>
      About
    </div>
  )
}

export default About
