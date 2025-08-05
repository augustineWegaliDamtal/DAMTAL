import { useState } from 'react';
import {useSelector} from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom';
const RegisterAgents = () => {
 const [formData, setFormData] = useState({
  accountNumber:'',
  username: '',
  email: '',
  phone: '',
  password: '',
  role: 'client',
  gender: 'female',
  address: ''
})
const [success, setSuccess] = useState(false);
const [error,setError] = useState(false);
const [loading,setLoading] = useState(false);
  const {currentUser} = useSelector((state)=>state.user)
  if (currentUser?.role !== 'admin') {
    return <Navigate to="/agent" />;
  }
  const handleFormChange = (e)=>{
    setFormData({...formData,[e.target.name]:e.target.value})
  }
  console.log(formData)
  const handleFormSubmit = async(e)=>{
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/register',{
        method:'POST',
        credentials: 'include',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(formData), 
      
      })
      const data = await res.json()
   if (!res.ok || data.success === false) {
  setError(data.message || 'Registration failed');
  setLoading(false);
  return;
}

setError(false);
setLoading(false);
setSuccess(true);


    } catch (error) {
     setError(error.message)
    setLoading(false)
    }
  }
  return (
     <div style={{ backgroundImage: 'url(/bg3.png)' }} className=" bg-cover bg-no-repeat bg-amber-300  min-h-screen  ">
     
        <div className='flex flex-col items-center pt-10 '>
         <h1 className='font-bold uppercase text-gray-700 rounded-sm  p-2 text-center w-100 mt-2  text-xl'> REGISTRATION</h1>
                <div className='mt-4 w-full max-w-sm bg-gradient-to-br from-yellow-400 to-yellow-200  p-4 rounded-lg shadow-2xl mx-auto'>
        <form onSubmit={handleFormSubmit} className='flex flex-col gap-4 p-2'>
        <input type="text" name="accountNumber" placeholder="Enter account number" onChange={handleFormChange}
         className='border bg-white rounded-lg p-2 border-gray-300 outline-0 '/>
            <input type='text' placeholder='Agent Name' onChange={handleFormChange} name='username' className='border rounded-lg p-2 bg-white border-gray-300 outline-0 '></input>
            <input type='text' placeholder='email' onChange={handleFormChange} name='email' className='border bg-white rounded-lg p-2 border-gray-300 outline-0 '></input>
            <input type='text' placeholder='phone' onChange={handleFormChange} name='phone' className='border rounded-lg bg-white  p-2 border-gray-300 outline-0 '></input>
            <input type='text' placeholder='address' onChange={handleFormChange} name='address' className='border rounded-lg bg-white  p-2 border-gray-300 outline-0 '></input>
            <input type='text' placeholder='Gender' onChange={handleFormChange} name='gender' className='border rounded-lg bg-white p-2 border-gray-300 outline-0 '></input>
            <input type='password' placeholder='Password' onChange={handleFormChange} name='password' className='border rounded-lg bg-white  p-2 border-gray-300 outline-0 '></input>
            <select onChange={handleFormChange} name='role' required className="p-2 bg-white rounded border outline-0 border-gray-300">
  <option  value="">Select role</option>
  <option value="agent">Agent</option>
  <option value="admin">Admin</option>
</select>
{loading && (
  <div className="flex justify-center items-center">
    <svg className="animate-spin h-6 w-6 text-blue-500" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
    <span className="ml-2 text-sm text-blue-600">Submitting...</span>
  </div>
)}

<button disabled={loading} className='font-semibold bg-black text-white hover:bg-gradient-to-t from-bg-yellow-100 to-cyan-400 p-2 '>{loading?'...loading':'Register'}</button>
{success && <p className="text-green-500">User registered successfully!</p>}
{error && <div className='text-red-500'>{error}</div>}
        </form>
      </div>
        </div>
    </div>
  )
}

export default RegisterAgents
