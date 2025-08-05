import React, { useEffect } from 'react'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { resetError, signinFailure, signinStart, signinSuccess } from '../redux/user/userSlice.js'
import { Link, useNavigate } from 'react-router-dom'

const Signin = () => {
   const [formData,setFormData] = useState({})
   const {error,loading,currentUser} = useSelector((state)=>state.user)
    const dispatch = useDispatch();
    const navigate = useNavigate();
useEffect(() => {
  if (!currentUser) return;

  if (currentUser.role === 'admin') {
    navigate('/admin');
  } else if (currentUser.role === 'agent') {
    navigate('/agent');
  }
}, [currentUser, navigate]);


    const handleFormData = (e)=>{
      setFormData({...formData,[e.target.name]:e.target.value})
    }
    console.log(formData)

   const handleFormSubmit = async (e) => {
  e.preventDefault();
  try {
    dispatch(signinStart());
    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
      credentials: 'include' 
    });

    const data = await res.json();
    if (!res.ok) {
      
      dispatch(signinFailure(data.message || 'Login failed'));
      return;
    }
 localStorage.setItem('token', data.token);


    dispatch(signinSuccess(data)); // Redirect now handled by useEffect
  } catch (error) {
    dispatch(signinFailure(error.message));
    dispatch(resetError());
  }
};

 
    return (
      
      <div style={{backgroundImage:'url(/sig.png) ' }} className='bg-cover bg-center h-screen p-4 mt-8'>
      <h1 className='text-white text-center font-bold p-4 uppercase text-shadow-black'>SignIn</h1>
      <div className=' flex flex-col gap-6 mx-auto max-w-sm bg-grad border border-white p-2 rounded-lg'>
       <form onSubmit={handleFormSubmit} className='flex flex-col gap-6 '>
          <input type='text' className='border-b border-gray-300 p-2 rounded-lg outline-0 text-white '  required placeholder='email' name='email' onChange={handleFormData} />
          <input type='password' className='border-b border-gray-300 p-2 rounded-lg outline-0 text-white' required placeholder='password' name='password' onChange={handleFormData} />
          <button disabled={loading} className='bg-black rounded-sm text-white p-2 hover:bg-gradient-to-tl from-blue-300 to-gray-500'>{loading?'...loading':'Signin'}</button>
          {error && <div className='text-red-500 bg-black'>{error}</div>}
       </form>
       </div>
      </div>
    )
}

export default Signin
