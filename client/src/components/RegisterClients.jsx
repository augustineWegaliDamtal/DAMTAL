import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const RegisterClients = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: 'female',
    address: ''
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
 const token = localStorage.getItem('token');
  console.log("📦 Token being sent:", token);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
         },
        body: JSON.stringify({ ...formData, role: 'client' }),
        
      });

      const data = await res.json();

      // 🔍 Log response for debugging
      console.log('📡 Status:', res.status);
      console.log('📦 Payload:', data);

      if (res.status >= 200 && res.status < 300) {
        setSuccess(`Client registered! Account Number: ${data.accountNumber || 'N/A'}`);
        setFormData({
          name: '',
          phone: '',
          gender: 'female',
          address: ''
        });
      } else {
        setError(data.message || 'Something went wrong during registration');
      }

    } catch (err) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundImage: 'url(/bg3.png)' }} className="bg-slate-100 bg-cover bg-no-repeat  max-h-screen flex flex-col">
     <div className='min-h-screen flex flex-col items-center pt-15'>
       <h1 className='font-bold uppercase text-gray-700 text-center p-2 rounded-sm text-xl  '>Client Registration</h1>
      
      <div className='mt-4 w-full max-w-sm bg-gradient-to-br from-yellow-400 to-yellow-200  p-4 rounded-lg shadow-2xl '>
        <form onSubmit={handleFormSubmit} className='flex flex-col gap-4'>
          <input
            type='text'
            placeholder='Client Name'
            onChange={handleFormChange}
            name='name'
            value={formData.name}
            required
            className='border rounded-lg p-2 bg-white border-gray-300 outline-none text-black'
          />
          <input
            type='text'
            placeholder='Phone'
            onChange={handleFormChange}
            name='phone'
            value={formData.phone}
            required
            className='border rounded-lg p-2 bg-white border-gray-300 outline-none text-black' 
          />
          <input
            type='text'
            placeholder='Address'
            onChange={handleFormChange}
            name='address'
            value={formData.address}
            required
            className='border rounded-lg p-2 bg-white border-gray-300 outline-none text-black'
          />
          <input
            type='text'
            placeholder='Gender'
            onChange={handleFormChange}
            name='gender'
            value={formData.gender}
            className='border rounded-lg p-2 bg-white border-gray-300 outline-none text-black'
          />

          <button
            disabled={loading}
            className='font-semibold bg-black text-white hover:bg-gradient-to-t from-yellow-100 to-cyan-400 p-2 rounded transition'
          >
            {loading ? '...loading' : 'Register'}
          </button>

          {success && (
            <p className='text-green-700 text-sm'>
              {success}
            </p>
          )}
          {error && (
            <p className='text-red-500 text-sm'>
              {error}
            </p>
          )}
        </form>
      </div>
     </div>
     </div>
    
  );
};

export default RegisterClients;
