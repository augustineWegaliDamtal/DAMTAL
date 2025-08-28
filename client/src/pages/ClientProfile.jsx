// src/pages/ClientProfile.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUserSuccess } from "../redux/user/userSlice";

// Local helper: automatically attaches Authorization header from localStorage
const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  // Normalize unauthorized handling so we can catch and redirect
  if (res.status === 401 || res.status === 403) {
    const err = new Error("Unauthorized");
    err.status = res.status;
    throw err;
  }

  return res;
};

export default function ClientProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [phone, setPhone] = useState("");
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const forceLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("accountNumber");
      localStorage.removeItem("pin");
      localStorage.removeItem("pinStoredAt");
    } catch {}
    dispatch(logoutUserSuccess());
    navigate("/clientLogin", { replace: true });
  };

  // Safely read phone from different possible API shapes
  const extractPhone = (data) =>
    data?.phone ?? data?.data?.phone ?? data?.client?.phone ?? "";

  // Fetch profile data on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      forceLogout();
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await apiFetch("/api/client/me/profile");
        const data = await res.json();

        if (res.ok) {
          setPhone(extractPhone(data));
        } else {
          setMessage(data?.message || "Failed to load profile");
        }
      } catch (err) {
        if (err?.status === 401 || err?.status === 403) {
          setMessage("Session expired. Please log in again.");
          forceLogout();
        } else {
          setMessage("Error fetching profile");
        }
      }
    };

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    // Best-effort server logout (optional); don't block client cleanup
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch {}
    forceLogout();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
     const body = {};
if (phone.trim()) {
  body.phone = phone.trim();
}

const _current = currentPin.trim();
const _next = newPin.trim();
if (_next) {
  body.newPin = _next;
  if (_current) {
    body.currentPin = _current;
  }
}


      const res = await apiFetch("/api/client/me", {
        method: "PATCH",
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Profile updated successfully");
        setCurrentPin("");
        setNewPin("");
        // Optionally re-fetch profile to confirm changes
        // (Uncomment if your backend returns minimal data)
        // const refreshed = await apiFetch("/api/client/me");
        // const refreshedData = await refreshed.json();
        // setPhone(extractPhone(refreshedData));
      } else {
        setMessage(data?.message || "Update failed");
      }
    } catch (err) {
      if (err?.status === 401 || err?.status === 403) {
        setMessage("Session expired. Please log in again.");
        forceLogout();
      } else {
        setMessage("Error updating profile");
      }
    } finally {
      setLoading(false);
    }
  };

  return (

   <div className="bg-amber-400 h-screen ">
             <div style={{ backgroundImage: 'url(/bg3.png)' }}
             className=" bg-cover bg-no-repeat mx-auto  max-h-screen flex flex-col  p-8 mt-9 rounded shadow-xl w-full max-w-sm">

      <h1 className="text-xl font-bold mb-4">
        Welcome, {currentUser?.accountNumber || "Client"}
      </h1>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block font-medium">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border p-2 w-full rounded border-gray-300 outline-0"
            placeholder="+233XXXXXXXXX"
          />
        </div>

        <div>
          <label className="block font-medium">Current PIN</label>
          <input
            type="password"
            value={currentPin}
            onChange={(e) => setCurrentPin(e.target.value)}
            className="border p-2 w-full rounded border-gray-300 outline-0"
            placeholder="Enter current PIN to change"
            maxLength={4}
          />
        </div>

        <div>
          <label className="block font-medium">New PIN</label>
          <input
            type="password"
            value={newPin}
            onChange={(e) => setNewPin(e.target.value)}
            className="border p-2 w-full rounded border-gray-300 outline-0"
            placeholder="Leave blank to keep existing"
            maxLength={4}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-800 text-white px-4 py-2 rounded w-full disabled:opacity-60 border-gray-300"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>

      {message && (
        <p
          className={`mt-3 text-sm ${
            message.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      <hr className="my-4" />

      <button onClick={handleLogout} className="w-full text-red-600 underline">
        Logout
      </button>
    </div>
   </div>
  );
}

