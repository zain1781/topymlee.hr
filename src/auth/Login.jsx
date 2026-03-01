import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { notifySuccess, notifyError } from '../utils/toastify';

export default function Login() {
  const [data, setData] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const navigate = useNavigate();
  const api = import.meta.env.VITE_API_URL;

  // ✅ Check token once when component mounts
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     navigate('/user/dashboard', { replace: true });
  //   }
  // }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${api}users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Login failed');

      const result = await res.json();
      notifySuccess('Login successful');

      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      setData({ email: '', password: '' });

      if (result.user.role === 'user') {
        navigate('/user/dashboard');
      } else if (['admin', 'superadmin'].includes(result.user.role)) {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }

    } catch (err) {
      notifyError(`Login error: ${err.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Login</h2>

        <div className="mb-4">
          <label className="block text-gray-600 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-6 relative">
          <label className="block text-gray-600 mb-1">Password</label>
          <input
            type={showPwd ? "text" : "password"}
            name="password"
            value={data.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <span
            type="button"
            onClick={() => setShowPwd(!showPwd)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
          >
            {showPwd ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-200"
        >
          Login
        </button>

        <center>
          <span className='sma'>
            Forget Password <NavLink className="text-orange-400" to='/reset-password'>Click Here</NavLink>
          </span><br />
          <span className='sma'>
            Don't Have an Account? <NavLink to='/signup' className="text-orange-400">Click Here</NavLink>
          </span>
        </center>
      </form>
    </div>
  );
}
