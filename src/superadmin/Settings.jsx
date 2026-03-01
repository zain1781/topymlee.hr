import React, { useState, useEffect } from "react";
import Loader from "../tools/loader";
import { notifySuccess, notifyError } from "../utils/toastify";
import { jwtDecode } from "jwt-decode";
import { NavLink } from "react-router-dom";

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("");

  const api = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    window.scrollTo(0, 0);

    if (token) {
      const user = jwtDecode(token);
      setRole(user?.role || "");
    }

    fetchUsers();
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${api}users`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const result = await res.json();
      setUsers(result);
    } catch (err) {
      notifyError("Failed to load users");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${api}users/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Delete failed");
      notifySuccess("User deleted successfully");
      fetchUsers();
    } catch (err) {
      notifyError("Error deleting user");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader />
      </div>
    );
  }

  if (role !== "superadmin") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-red-50 text-red-600 px-6 py-4 rounded-lg text-sm font-medium">
          🚫 You do not have permission to access this page
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          User Management
        </h1>
        <p className="text-sm text-gray-500">
          Manage platform users and permissions
        </p>
      </div>

      {/* Table Card */}
      <div className="bg-white shadow-sm rounded-xl overflow-hidden border">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">User ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Company</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-400">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr
                    key={user._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {user._id.slice(0, 8)}…
                    </td>
                    <td className="px-6 py-4">{user.name}</td>
                    <td className="px-6 py-4">
                      {user.email.slice(0, 18)}…
                    </td>
                    <td className="px-6 py-4">{user.company || "-"}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <NavLink
                        to={`/admin/update-user/${user._id}`}
                        className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200"
                      >
                        Edit
                      </NavLink>

                      <span
                        onClick={() => handleDelete(user._id)}
                        className="bttn inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200"
                      >
                        Delete
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
