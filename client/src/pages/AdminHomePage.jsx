import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminHomePage = () => {
  const [clientId, setClientId] = useState('');
  const [clientDetails, setClientDetails] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // 🧼 Clear message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`/api/client/${clientId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errorMsg = await res.text();
        console.error("Lookup failed:", errorMsg);
        setMessage('❌ Client not found or unauthorized.');
        return;
      }

      const data = await res.json();
      setClientDetails(data);
      setMessage('');
    } catch (err) {
      console.error("Client fetch error:", err);
      setMessage('⚠️ Server error while fetching client.');
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || isNaN(depositAmount)) {
      setMessage('🚫 Enter a valid deposit amount.');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      console.log("📤 Sending deposit to accountNumber:", clientDetails.accountNumber);

      const res = await fetch('/api/transact/makeDeposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          accountNumber: clientDetails.accountNumber,
          amount: Number(depositAmount)
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ Deposit successful! New balance: ₵${data.newBalance}`);
        setDepositAmount('');
        setClientDetails(prev => ({
          ...prev,
          balance: data.newBalance // ⬅️ sync with server-calculated value
        }));
      } else {
        setMessage(`❌ ${data.message || "Deposit failed."}`);
      }
    } catch (err) {
      console.error("Deposit failed:", err);
      setMessage('⚠️ Network or server error during deposit.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
   <div style={{ backgroundImage: 'url(/bg3.png)' }} className=" bg-cover bg-no-repeat bg-black  min-h-screen  ">
   <h1 className=''>Deposit form</h1>
     <div className='bg-black rounded-md h-fit w-fit mx-auto  mt-10'>
     
      <h2 className='text-xl font-bold mb-4 text-center text-white pt-2'>💰 Smart Deposit</h2>
     
<div className='p-6 bg-black  shadow-md rounded-md w-full max-w-md mx-auto  '>
      {message && (
        <p className='mb-3 px-3 py-2 rounded text-sm text-gray-700 bg-gray-100 border border-gray-300'>
          {message}
        </p>
      )}

      <input
        placeholder='Enter Client ID'
        className='border p-2 w-full mb-2 rounded outline-0 bg-white border-gray-300 rounded-lg'
        value={clientId}
        onChange={e => setClientId(e.target.value)}
      />
      <button
        className='bg-blue-600 text-white w-full p-2 rounded hover:bg-blue-700'
        onClick={handleSearch}
      >
        Search Client
      </button>

      {clientDetails && (
        <div className='mt-4 p-3 border text-slate-800 rounded bg-amber-300 bg-white border-gray-300'>
          <h3 className='font-semibold mb-1'>{clientDetails.name}</h3>
          <p>ID: {clientDetails.clientId}</p>
          <p>Balance: ₵{clientDetails.balance}</p>
          <p>Phone: {clientDetails.phone}</p>
          {clientDetails.accountNumber && <p>Account: {clientDetails.accountNumber}</p>}
        </div>
      )}

      {clientDetails && (
        <div className='mt-4'>
          <input
            type='number'
            placeholder='Deposit Amount'
            className='border p-2 w-full mb-2 rounded border-gray-300 bg-white outline-0 rounded-lg'
            value={depositAmount}
            onChange={e => setDepositAmount(e.target.value)}
          />
          <button
            className='bg-green-600 text-white w-full p-2 rounded hover:bg-green-700 font-semibold'
            onClick={handleDeposit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Confirm Deposit'}
          </button>
        </div>
      )}

      <div className='mt-6 flex justify-between'>
        <Link to='/allTransaction' className='text-blue-700 underline text-sm font-bold'>
          View All Transactions
        </Link>
        <Link to='/withdrawal' className='text-red-700 underline text-sm font-bold'>
          Withdrawal
        </Link>
      </div>
    </div>
   </div>
   </div>
  );
};

export default AdminHomePage;
