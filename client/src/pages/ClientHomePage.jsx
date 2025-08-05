import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const ClientDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { token, isExpired, logout } = useAuth();

  // Redirect to login if no token
  if (!token) {
    navigate('/clientLogin');
    return null;
  }

  // 🔁 Reusable fetch function
  const fetchDashboardData = async () => {
    if (isExpired) {
      console.warn('⏳ Session expired');
      logout();
      return;
    }

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const [profileRes, notesRes] = await Promise.all([
        fetch('/api/client/me/dashboard', { method: 'GET', headers }),
        fetch('/api/client/me/notifications', { method: 'GET', headers }),
      ]);

      const profileData = await profileRes.json();
      const notesData = await notesRes.json();

      setProfile(profileData);
      setNotes(notesData);
    } catch (err) {
      console.error('❌ Failed to load dashboard:', err);
      setTimeout(() => {
        alert('Session expired or failed to fetch dashboard data.');
        logout();
      }, 1200);
    } finally {
      setLoading(false);
    }
  };

  // 📦 Initial fetch on mount
  useEffect(() => {
    fetchDashboardData();
  }, [token, isExpired, logout]);

  const format = (val) => (typeof val === 'number' ? val.toFixed(2) : '0.00');

  // 🕒 Loading state
  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-white">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div
      style={{ backgroundImage: 'url(/Pica.png)' }}
      className="bg-slate-100 bg-cover bg-no-repeat text-white w-full min-h-screen flex  flex-col pt-9 "
    >
      {/* 📌 Sticky Financial Summary */}
      <div className="sticky top-0 z-40 bg-gradient-to-bl from-yellow-500 to-yellow-200 shadow-md px-6 py-4">
        <h1 className="text-2xl font-bold mb-2 text-black bg-gradient-to-r from-yellow-500 to-yellow-200 w-fit">
          Welcome, {profile.name} 👋🏾
        </h1>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-black border border-green-500 p-4 rounded">
            <strong>Current Balance:</strong> ₵{format(profile.balance)}
          </div>
          <div className="bg-black border border-red-500 p-4 w-40 rounded">
            <strong>Total Withdrawals:</strong> ₵{format(profile.totalWithdrawals)}
          </div>
          <div className="bg-black border border-blue-500 p-4 rounded">
             <strong>Nested Balance:</strong> ₵{format(profile.nestedBalance)}
          </div>
        </div>
      </div>

      {/* 📜 Scrollable Notifications */}
      <div className="flex-1 overflow-y-auto px-6 py-6 w-full">
        <h2 className="text-lg font-semibold mb-2 text-black">Recent Notifications</h2>
        {notes.length > 0 ? (
          <ul className="space-y-2 mb-8">
            {notes.map((note) => (
              <li
                key={note._id}
                className={`bg-black border p-3 rounded ${
                  note.isRead ? 'border-white' : 'border-green-500'
                }`}
              >
                <p className="text-white">{note.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(note.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400 mb-8">No notifications yet.</p>
        )}
      </div>

      {/* 📌 Sticky Susu Info */}
      <div className="sticky bottom-0 z-30 bg-gradient-to-t from-yellow-500 to-yellow-200 border-t border-white p-4 text-black">
        <h3 className="text-lg font-bold mb-1">What is Susu?</h3>
        <p className="text-sm mb-2">
          Susu helps you save small amounts consistently for long-term growth. Learn how your
          dashboard empowers your financial journey.
        </p>
        <a
          href="/client/learn"
          className="inline-block mt-2 text-sm text-white hover:underline"
        >
          Learn More →
        </a>
      </div>
    </div>
  );
};

export default ClientDashboard;
