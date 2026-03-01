import React from 'react'
import Admin from './boards/Admin'
import SuperAdmin from './boards/SuperAdmin'
import { jwtDecode } from 'jwt-decode'
import Loader from '../tools/loader'

export default function Dashboard() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
  }
  const user = jwtDecode(token);
  if (user.role === "admin") {
    return <Admin />;
  }
  if (user.role === "superadmin") {
    return <SuperAdmin />;
  }
  window.location.href = "/login";

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader />    
    </div>
  )
}