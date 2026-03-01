import React, { useState , useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { notifySuccess, notifyError } from '../utils/toastify';

export default function Signup() {
const navigate = useNavigate();




    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        navigate('/user/dashboard', { replace: true });
      }
    }, [navigate]);
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
    location: '',
  });
  const [showPwd, setShowPwd] = useState(false);
  console.log("data",data);
  const api = import.meta.env.VITE_API_URL;
  console.log("api",api);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
const handelSubmit = async (e)  => {
    e.preventDefault();
  try {
    const response = await fetch(`${api}users/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    console.log("data",data);
    console.log("response",response);

    if (!response.ok) {
      const errorData = await response.json();
      notifyError(errorData.message || 'Signup failed');
    }

    const result = await response.json();
    notifySuccess('Signup successful:', result);
    // Handle successful signup (e.g., redirect to login or show a success message)
   
   } catch (error) {
   notifyError(error);
    // Handle error (e.g., show a notification or alert)
  }
  
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handelSubmit} className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Sign Up</h2>

        <div className="mb-4">
          <label className="block text-gray-600 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

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
  <div className="mb-4 relative">
      <label className="block text-gray-600 mb-1">Password</label>

      {/* input */}
      <input
        type={showPwd ? 'text' : 'password'}
        name="password"
        value={data.password}
        onChange={handleChange}
        placeholder="Enter your password"
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10" /* pr‑10 leaves space for the icon */
        minLength={6}
        required
      />

      {/* eye toggle */}
      <div
        type="button"
        onClick={() => setShowPwd(!showPwd)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 focus:outline-none"
        aria-label={showPwd ? 'Hide password' : 'Show password'}
      >
        {showPwd ? <FaEyeSlash /> : <FaEye />}
      </div>

      <span className="text-gray-500 text-sm">
        Password must be at least 6 characters
      </span>
    </div>
        <div className="mb-4">
          <label className="block text-gray-600 mb-1">Company</label>
          <input
            type="text"
            name="company"
            value={data.company}
            onChange={handleChange}
            placeholder="Enter your company name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-600 mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={data.location}
            onChange={handleChange}
            placeholder="Enter your location"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-200"
        >
          Create Account
        </button>
          <center>    
       <span className='sma'>Already Have a Account <NavLink className="text-orange-400" to="/login">Click Here</NavLink></span>
    
</center>
      </form>
   </div>
  );
}



