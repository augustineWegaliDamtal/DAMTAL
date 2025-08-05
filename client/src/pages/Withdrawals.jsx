import { useState } from 'react';

const WithdrawFundsForm = () => {
  const [formData, setFormData] = useState({
    accountNumber: '',
    amount: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // 🔐 Get Authorization header from localStorage
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token
      ? {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const headers = getAuthHeaders();
    if (!headers) {
      setMessage('🚫 No token found. Please log in.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/transact/adminWithdraw', {
        method: 'POST',
        headers,
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ Withdrawal successful! New balance: ₵${data.newBalance}`);
        setFormData({ accountNumber: '', amount: '' });
      } else {
        setMessage(`❌ ${data.message || 'Error processing withdrawal'}`);
      }
    } catch (err) {
      console.error('Withdrawal error:', err);
      setMessage('⚠️ Network or server error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded shadow-md max-w-xl mx-auto">
      <h2 className="text-lg font-bold mb-4 text-gray-800">💸 Withdraw Funds</h2>

      {message && <p className="mb-4 text-sm text-gray-600">{message}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Client Account Number"
          value={formData.accountNumber}
          onChange={(e) =>
            setFormData((f) => ({ ...f, accountNumber: e.target.value }))
          }
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={formData.amount}
          onChange={(e) =>
            setFormData((f) => ({ ...f, amount: e.target.value }))
          }
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="col-span-2 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Submit Withdrawal'}
        </button>
      </form>
    </div>
  );
};

export default WithdrawFundsForm;
