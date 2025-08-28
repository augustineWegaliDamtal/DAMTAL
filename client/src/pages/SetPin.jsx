import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

const SetPinClient = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    // ✅ Validate PIN format first
    if (!/^\d{4}$/.test(pin.trim())) {
      setError("PIN must be exactly 4 digits");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/setPin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountNumber: accountNumber.trim(),
          pin: pin.trim()
        })
      });

      const data = await res.json();
      console.log("🔹 Set PIN response:", data);

      if (!res.ok || !data.success) {
        throw new Error(data.message || "PIN setup failed");
      }

      // ✅ Store only minimal info
      localStorage.setItem("accountNumber", accountNumber.trim());

      // ✅ Show green success message & navigate
      setSuccess("PIN set successfully! Redirecting...");
      setError("");
      setTimeout(() => {
     navigate("/clientHome");   
      }, 1000);

    } catch (err) {
      setError(err.message || "Something went wrong");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-9 bg-amber-300">
    <BackButton/>
      <div
        style={{ backgroundImage: 'url(/login.png)' }}
        className="bg-white p-6 rounded shadow-xl w-full max-w-sm bg-cover mx-auto"
      >
        <h2 className="text-slate-700 font-bold mb-4 text-center text-xl">
          Set Your PIN
        </h2>

        <input
          type="text"
          placeholder="Account Number (e.g. c-ab12)"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          className="border border-gray-300 p-2 mb-3 w-full rounded outline-0 bg-gray-300"
          required
        />

        <input
          type="password"
          placeholder="Enter new PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="border border-gray-300 p-2 mb-3 w-full rounded outline-0 bg-gray-300"
          required
          maxLength={4}
        />

        <button
          onClick={handleSubmit}
          disabled={!accountNumber || !pin || loading}
          className={`py-2 rounded w-full text-white ${
            loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Setting PIN..." : "Set PIN"}
        </button>

        <Link className="block text-center mt-4 text-sm" to="/clientLogin">
          Already have a PIN?{" "}
          <span className="hover:underline font-bold text-blue-600">
            Login
          </span>
        </Link>

        {success && <p className="text-green-500 mt-3 text-sm">{success}</p>}
        {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}
      </div>
    </div>
  );
};

export default SetPinClient;
