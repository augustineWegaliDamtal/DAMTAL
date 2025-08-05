import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SetPinClient = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const verifyPinSet = async (attempt = 1) => {
    try {
      const statusRes = await fetch(`/api/auth/status/${accountNumber}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache"
        }
      });

      const statusData = await statusRes.json();
      console.log(`🔄 PIN check attempt ${attempt}:`, statusData.pinSet);

      if (statusRes.ok && statusData.pinSet) {
        console.log("✅ PIN confirmed, navigating...");
        setSuccess("PIN verified. Redirecting...");
        setTimeout(() => {
          navigate("/clientHome");
        }, 1200); // Smooth UX delay
      } else if (attempt < 3) {
        setTimeout(() => verifyPinSet(attempt + 1), 1000);
      } else {
        throw new Error("PIN was not confirmed yet. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Error verifying PIN status.");
      setVerifying(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

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
      if (!res.ok || !data.success) throw new Error(data.message || "PIN setup failed");

      const now = Date.now();
      localStorage.setItem("accountNumber", accountNumber.trim());
      localStorage.setItem("pin", pin.trim());
      localStorage.setItem("pinStoredAt", now.toString());

      setSuccess("PIN set successfully. Verifying...");
      setVerifying(true);
      verifyPinSet();
    } catch (err) {
      localStorage.removeItem("accountNumber");
      localStorage.removeItem("pin");
      localStorage.removeItem("pinStoredAt");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4 text-center">Set Your PIN</h2>

        <input
          type="text"
          placeholder="Account Number (e.g. c-ab12)"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          className="border p-2 mb-3 w-full rounded"
          required
        />

        <input
          type="password"
          placeholder="Enter new PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="border p-2 mb-3 w-full rounded"
          required
          maxLength={4}
        />

        <button
          onClick={handleSubmit}
          disabled={loading || verifying}
          className="bg-blue-600 text-white py-2 rounded w-full hover:bg-blue-700"
        >
          {loading ? "Setting PIN..." : verifying ? "Verifying..." : "Set PIN"}
        </button>

        {success && <p className="text-green-500 mt-3 text-sm">{success}</p>}
        {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}
      </div>
    </div>
  );
};

export default SetPinClient;
