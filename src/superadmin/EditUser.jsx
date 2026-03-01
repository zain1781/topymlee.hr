import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BackButton from "../tools/BackButton";
import { notifyError, notifySuccess } from "../utils/toastify";

export default function EditUser() {
  const { id } = useParams();
  const api = import.meta.env.VITE_API_URL;
  const [data, setData] = useState({
    name: "",
    email: "",
    company: "",
    location: "",
    subscription: "",
    role: "",
    cvqty: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${api}users/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Network response was not ok");
        const result = await response.json();
        setData(result);
        console.log("Fetched data:", result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [api, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if(data.qty > 999){
    notifyError("CV Quantity cannot exceed 999");
    return;
  }
  try {
    const response = await fetch(`${api}users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Network response was not ok");

    // const result = await response.json(); // uncomment if needed
    notifySuccess("User updated successfully");
  } catch (error) {
    console.error("Error updating user:", error);
    notifyError("Failed to update user");
  }
};


  return (
          <>
          <BackButton className="m-10" />

    <div className="max-w-xl mx-auto p-6">

      <div className="bg-white shadow-md rounded-2xl p-6 border">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Edit User
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
  {/* Name */}
  <div>
    <label className="block text-gray-700 font-medium mb-1">Name</label>
    <input
      type="text"
      name="name"
      value={data.name || ""}
      onChange={handleChange}
      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
    />
  </div>

  {/* Email */}
  <div>
    <label className="block text-gray-700 font-medium mb-1">Email</label>
    <input
      type="email"
      name="email"
      value={data.email || ""}
      onChange={handleChange}
      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
    />
  </div>

  {/* Company */}
  <div>
    <label className="block text-gray-700 font-medium mb-1">Company</label>
    <input
      type="text"
      name="company"
      value={data.company || ""}
      onChange={handleChange}
      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
    />
  </div>

  {/* Location */}
  <div>
    <label className="block text-gray-700 font-medium mb-1">Location</label>
    <input
      type="text"
      name="location"
      value={data.location || ""}
      onChange={handleChange}
      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
    />
  </div>

  {/* Subscription */}
 

  <div>
    <label className="block text-gray-700 font-medium mb-1">Subscription</label>
    <select
      name="subscription"
      value={data.subscription || ""}
      onChange={handleChange}
      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
    >
      <option value="">Select Subscription</option>
      <option value="free">Free</option>
      <option value="basic">Basic</option>
      <option value="pro">Pro</option>
      <option value="enterprise">Enterprise</option>
    </select>
  </div>

  {/* Role */}
  <div>
    <label className="block text-gray-700 font-medium mb-1">Role</label>
    <select
      name="role"
      value={data.role || ""}
      onChange={handleChange}
      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
    >
      <option value="">Select Role</option>
      <option value="user">User</option>
      <option value="admin">Admin</option>
      <option value="superadmin">Super Admin</option>
    </select>
  </div>

  {/* CV Qty */}
  <div>
    <label className="block text-gray-700 font-medium mb-1">CV Qty</label>
    <input
      type="number"
      name="cvqty"
      value={data.cvqty || 0}
      onChange={handleChange}
      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
    />
  </div>

  {/* Submit button */}
  <button
    type="submit"
    className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
  >
    Save Changes
  </button>
</form>

      </div>
    </div>
          </>
  );
}
