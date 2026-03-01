import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { notifyError, notifySuccess } from "../utils/toastify";
import BackButton from "../tools/BackButton";
import { NavLink } from "react-router-dom";
import Loader from "../tools/loader";

export default function EditProfile() {
  const [data, setData] = useState({
    name: "",
    email: "",
    location: "",
    subscription: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");
  const api = import.meta.env.VITE_API_URL;

  /* ------------------ Auth Guard ------------------ */
  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
    }
  }, [token]);

  const user = token ? jwtDecode(token) : null;
  const id = user?.id;

  /* ------------------ Fetch Profile ------------------ */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${api}users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const result = await res.json();
        setData(result);
      } catch (err) {
        notifyError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProfile();
  }, [api, id, token]);

  /* ------------------ Handlers ------------------ */
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`${api}users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error();
      notifySuccess("Profile updated successfully");
    } catch {
      notifyError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  /* ------------------ Loading ------------------ */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader />
      </div>
    );
  }

  /* ------------------ UI ------------------ */
  return (
    <section className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-white py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-xl p-10">
        
        <BackButton />

        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          Account Settings
        </h1>
        <p className="text-gray-600 mb-10">
          Manage your personal information and account details
        </p>

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Name */}
          <Field
            label="Full Name"
            name="name"
            value={data.name}
            onChange={handleChange}
          />

          {/* Email */}
          <Field
            label="Email Address"
            type="email"
            name="email"
            value={data.email}
            onChange={handleChange}
          />

          {/* Location */}
          <Field
            label="Location"
            name="location"
            value={data.location}
            onChange={handleChange}
          />

          {/* Subscription */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subscription
            </label>
            <input
              value={data.subscription || "Free"}
              readOnly
              className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6">
            <NavLink
              to="/reset-password"
              className="text-sm text-orange-500 hover:underline"
            >
              Forgot account password?
            </NavLink>

            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 rounded-xl bg-orange-500 text-white font-semibold shadow-lg hover:bg-orange-600 disabled:opacity-50 transition"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

/* ------------------ Reusable Field ------------------ */
function Field({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        {...props}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 focus:ring-2 focus:ring-orange-400 focus:outline-none"
      />
    </div>
  );
}
