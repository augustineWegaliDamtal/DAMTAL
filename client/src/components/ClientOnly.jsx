// src/components/ClientOnly.jsx
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export default function ClientOnly() {
  const { currentUser, loginType } = useSelector((state) => state.user)

  return currentUser && loginType === 'client'
    ? <Outlet />
    : <Navigate to="/clientLogin" replace />
}
