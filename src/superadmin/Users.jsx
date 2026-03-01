import React, { useEffect, useState } from "react";
import Loader from "../tools/loader";
import { notifySuccess, notifyError } from "../utils/toastify";
import { jwtDecode } from "jwt-decode";
import { NavLink, useNavigate } from "react-router-dom";
import useUserStore from "../store/userstore";

export default function Users() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const { fetchUser , deleteUser ,user } = useUserStore();



  /* ---------------- AUTH & INIT ---------------- */
  useEffect(() => {
    window.scrollTo(0, 0);

    if (!token) {
      navigate("/login");
      return;
    }

    const decoded = jwtDecode(token);
    setRole(decoded?.role || "");

    fetchUsers();

    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  /* ---------------- FETCH USERS ---------------- */
  const fetchUsers = async () => {
    try {
      await  fetchUser();
    } catch {
      notifyError("Failed to load users");
    }
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;

    try {
     
        await  deleteUser(id);
    await  fetchUsers();
      notifySuccess("User deleted successfully");
    } catch {
      notifyError("Error deleting user");
    }
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader />
      </div>
    );
  }

  /* ---------------- PERMISSION ---------------- */
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
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          User Management
        </h1>
        <p className="text-sm text-gray-500">
          Manage all registered platform users
        </p>
      </div>

      {/* Table Card */}
      <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase text-gray-600">
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
            {user.length ? (
              user.map((u, index) => (
                <tr
                  key={u._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {u._id.slice(0, 8)}…
                  </td>
                  <td className="px-6 py-4">{u.name}</td>
                  <td className="px-6 py-4">
                    {u.email.slice(0, 18)}…
                  </td>
                  <td className="px-6 py-4">
                    {u.company || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <NavLink
                      to={`/admin/update-user/${u._id}`}
                      className="inline-flex px-3 py-1.5 rounded-md text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200"
                    >
                      Edit
                    </NavLink>
                    <span
                      onClick={() => handleDelete(u._id)}
                      className="bttn inline-flex px-3 py-1.5 rounded-md text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200"
                    >
                      Delete
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="py-10 text-center text-gray-400"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 text-sm text-gray-600">
          Showing {user.length} user
          {user.length !== 1 && "s"}
        </div>
      </div>
    </div>
  );
}
