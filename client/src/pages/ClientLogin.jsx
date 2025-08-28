import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../redux/user/userSlice";
import BackButton from "../components/BackButton";

// 🔹 Reusable helper for protected requests
export const apiFetch = (url, options = {}) => {
  const token = localStorage.getItem("token");
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
};

const ClientLogin = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/clientLogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountNumber: accountNumber.trim(),
          pin: pin.trim(),
        }),
      });

      const data = await res.json();
      console.log("🧠 Response:", data);

      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Invalid credentials");
      }

      // ✅ Store token and metadata
      const now = Date.now();
      localStorage.setItem("token", data.token);
      localStorage.setItem("accountNumber", accountNumber.trim());
      localStorage.setItem("pin", pin.trim()); // ⚠ For security, consider removing PIN storage in prod
      localStorage.setItem("pinStoredAt", now.toString());

      // ✅ Update Redux
      dispatch(
        loginSuccess({
          currentUser: {
            accountNumber: accountNumber.trim(),
            role: "client",
          },
          loginType: "client",
        })
      );

      // Redirect after short delay
      setTimeout(() => {
        navigate("/clientHome");
      }, 800);
    } catch (err) {
      const fallback = err.message || "Login failed";
      if (!fallback.toLowerCase().includes("successful")) {
        setError(fallback);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col mt-9 bg-gray-200 min-h-screen ">
    <BackButton/>
      <form
        style={{ backgroundImage: "url(/bg3.png)" }}
        onSubmit={handleLogin}
        className="bg-cover bg-no-repeat max-h-screen mx-auto flex flex-col bg-amber-300 p-6 rounded shadow-xl w-full max-w-sm"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">Client Login</h2>

        <input
          type="text"
          placeholder="Account Number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          className="border p-2 mb-3 w-full rounded outline-blue-500 border-gray-300"
          required
        />

        <input
          type="password"
          placeholder="4-digit PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="border p-2 mb-3 w-full rounded border-gray-300 outline-blue-400"
          required
          maxLength={4}
        />

        <button
          type="submit"
          disabled={loading}
          className={`py-2 rounded w-full ${
            loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          } text-white`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}
      </form>
    </div>
  );
};

export default ClientLogin;
