import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ClientDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const pinStoredAt = parseInt(localStorage.getItem("pinStoredAt"));
      const isSessionExpired = !pinStoredAt || Date.now() - pinStoredAt > 30 * 60 * 1000;

      if (isSessionExpired) {
        // 🔒 Expired session
        localStorage.removeItem("accountNumber");
        localStorage.removeItem("pin");
        localStorage.removeItem("pinStoredAt");
        console.warn("⏳ Session expired. Redirecting to login...");
        return navigate("/clientLogin");
      }

      try {
        const accountNumber = localStorage.getItem("accountNumber")?.trim() || '';
        const pin = localStorage.getItem("pin")?.trim() || '';

        const headers = {
          "accountnumber": accountNumber,
          "pin": pin,
          "Content-Type": "application/json",
          "Cache-Control": "no-cache"
        };

        const [profileRes, notesRes] = await Promise.all([
          fetch("/api/client/me/dashboard", { method: "GET", headers }),
          fetch("/api/client/me/notifications", { method: "GET", headers })
        ]);

        const profileData = await profileRes.json();
        const notesData = await notesRes.json();

        setProfile(profileData);
        setNotes(notesData);
      } catch (err) {
        console.error("❌ Failed to load dashboard:", err);
        setTimeout(() => {
          alert("Session expired or failed to fetch dashboard data.");
          navigate("/clientLogin");
        }, 1200);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const format = (val) => typeof val === "number" ? val.toFixed(2) : "0.00";

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-white">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen text-white px-6 py-8">
      <h1 className="text-2xl font-bold mb-2 text-black">Welcome, {profile.name} 👋🏾</h1>
      <p className="text-sm mb-6">Current Balance: ₵{format(profile.balance)}</p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-black border border-green-500 p-4 rounded">
          <strong>Total Deposits:</strong> ₵{format(profile.totalDeposits)}
        </div>
        <div className="bg-black border border-red-500 p-4 rounded">
          <strong>Total Withdrawals:</strong> ₵{format(profile.totalWithdrawals)}
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-2">Recent Notifications</h2>
      {notes.length > 0 ? (
        <ul className="space-y-2 mb-8">
          {notes.map((note) => (
            <li
              key={note._id}
              className={`bg-black border p-3 rounded ${
                note.isRead ? "border-white" : "border-green-500"
              }`}
            >
              <p>{note.message}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(note.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-400 mb-8">No notifications yet.</p>
      )}

      <div className="bg-black border border-white p-4 rounded">
        <h3 className="text-lg font-bold mb-1">What is Susu?</h3>
        <p className="text-sm text-gray-300 mb-2">
          Susu helps you save small amounts consistently for long-term growth. Learn how your dashboard empowers your financial journey.
        </p>
        <a
          href="/client/learn"
          className="inline-block mt-2 text-sm text-green-400 hover:underline"
        >
          Learn More →
        </a>
      </div>
    </div>
  );
};

export default ClientDashboard;
