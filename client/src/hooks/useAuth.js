import { useCallback, useMemo } from "react";

export const useAuth = () => {
  const token = localStorage.getItem("token");
  const pinStoredAt = parseInt(localStorage.getItem("pinStoredAt"));
  const accountNumber = localStorage.getItem("accountNumber");
  const pin = localStorage.getItem("pin");

  const sessionDuration = 30 * 60 * 1000; // 30 minutes
  const isExpired = !pinStoredAt || Date.now() - pinStoredAt > sessionDuration;

  const logout = useCallback(() => {
    localStorage.clear();
    window.location.href = "/clientLogin";
  }, []);

  const user = useMemo(() => {
    return {
      accountNumber,
      pin, // Optional, remove if you only rely on token
      token
    };
  }, [accountNumber, pin, token]);

  return { token, user, isExpired, logout };
};
