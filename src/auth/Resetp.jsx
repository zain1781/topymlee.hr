import React, { useState } from 'react';
import { notifyError, notifySuccess } from '../utils/toastify';
import { useNavigate, useParams } from 'react-router-dom';

export default function ResetP() {
  const navigate  = useNavigate()
  const { token } = useParams();
  const [data, setData] = useState({
    password: '',
    confirmPassword: '',
    token,
  });

  const api = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔹 Check if passwords match
    if (data.password !== data.confirmPassword) {
      notifyError("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch(`${api}users/newpass`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: data.token, password: data.password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        notifyError("Error: " + (errorData.message || "Request failed"));
        return;
      }

      const responseData = await res.json();
      console.log("Success:", responseData);
      notifySuccess("Password reset successfully!");
      setData({
         password: '',
    confirmPassword: '',
    token,
      })
      navigate("/login")

    } catch (error) {
      console.error("Error:", error);
      notifyError("Something went wrong: " + error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Create New Password</h2>

        <div className="mb-4">
          <label className="block text-gray-600 mb-1">New Password</label>
          <input
            type="password"
            name="password"
            value={data.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 mb-1">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={data.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-200"
        >
          Confirm Password
        </button>
      </form>
    </div>
  );
}
