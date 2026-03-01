import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { notifyError , notifySuccess } from '../utils/toastify';
export default function ResetPass() {
  const [data, setData] = useState({
    email: '',
  });

  const api =  import.meta.env.VITE_API_URL;
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
    const res = await fetch(`${api}users/reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      notifyError("Error: " + (errorData.message || "Request failed"));
      return;
    }

    const responseData = await res.json();
    console.log("Success:", responseData);
    notifySuccess("Password reset email sent!");
    setData({
      email:"",
    })
  } catch (error) {
    console.error("Error:", error);
    notifyError("Something went wrong: " + error.message);
  }
};


  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Reset Password</h2>

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

     

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-200"
        >
          Reset
        </button>

        <center>
          <span className='sma'>Remembered your password? <NavLink className="text-orange-400" to="/login">Login Here</NavLink></span>
        </center>
  
      </form>
    </div>
  );
}
