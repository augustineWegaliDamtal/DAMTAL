import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

const ClientStatusEntry = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const navigate = useNavigate();

  const verifyPinSet = async (attempt = 1) => {
    try {
      const res = await fetch(`/api/auth/status/${accountNumber}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache"
        }
      });

      // if backend responds with a 404 or non-OK status
      if (!res.ok) {
        throw new Error("Account number does not exist");
      }

      const data = await res.json();
      console.log(`🔍 Checking PIN status (Attempt ${attempt})`, data);

      if (!data.exists) {
        // explicit check in case backend sends exists:false
        setError("Account number does not exist");
        setChecking(false);
        return;
      }

      if (data.pinSet) {
        navigate("/clientLogin");
      } else if (attempt < 3) {
        // retry logic
        setTimeout(() => verifyPinSet(attempt + 1), 1000);
      } else {
        navigate("/setPin");
      }
    } catch (err) {
      setError(err.message || "Could not find client");
      setChecking(false);
    }
  };

  const handleCheck = () => {
    setError("");
    setChecking(true);
    verifyPinSet();
  };

  return (
    <div className="bg-amber-300 mt-9">
      <BackButton />
      <div className="min-h-screen mx-auto flex   justify-center bg-amber-300">
        <div
          style={{ backgroundImage: 'url(/bg3.png)' }}
          className="bg-cover bg-no-repeat h-fit flex flex-col bg-amber-300 p-20 rounded shadow-xl w-full max-w-sm"
        >
          <h2 className="text-lg font-bold  text-center">
            Welcome Client
          </h2>

          <input
            type="text"
            placeholder="Enter account number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="border p-2 mb-3 w-full rounded"
            required
          />

          <button
            onClick={handleCheck}
            disabled={checking || accountNumber.trim() === ""}
            className="bg-blue-600 text-white py-2 rounded w-full hover:bg-blue-700"
          >
            {checking ? "Checking..." : "Continue"}
          </button>

          {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default ClientStatusEntry;
