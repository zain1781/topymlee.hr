import React, { useEffect, useState } from "react";
import { notifySuccess, notifyError } from "../utils/toastify";
import { jwtDecode } from "jwt-decode";
import Loader from "../tools/loader";
import { useNavigate } from "react-router-dom";

export default function PostJob() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const api = import.meta.env.VITE_API_URL;

  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null;

  /* -------------------- AUTH GUARD -------------------- */
  useEffect(() => {
    window.scrollTo(0, 0);

    if (!token || !["admin", "superadmin"].includes(user?.role)) {
      navigate("/login");
      return;
    }

    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const [form, setForm] = useState({
    title: "",
    company: "",
    experience: "",
    salary: "",
    location: "",
    type: "",
    applylink: "",
    description: "",
    userId: user?.id,
  });

  
  /* -------------------- HANDLE CHANGE -------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${api}jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to create job");

      notifySuccess("Job posted successfully");
      setForm({
        title: "",
        company: "",
        experience: "",
        salary: "",
        location: "",
        type: "",
        applylink: "",
        description: "",
        userId: user?.id,
      });
    } catch {
      notifyError("Error posting job");
    }
  };


  console.log("Form Data:", form);

  /* -------------------- LOADING -------------------- */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">
          Post a New Job
        </h1>
        <p className="text-sm text-gray-500">
          Fill in the details below to publish a job listing
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white border rounded-xl shadow-sm p-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Job Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Frontend Developer"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              required
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium mb-1">Company</label>
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="Company name"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              required
            />
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Experience (years)
            </label>
            <input
              type="number"
              name="experience"
              value={form.experience}
              onChange={handleChange}
              placeholder="e.g. 2"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              required
            />
          </div>

          {/* Salary */}
          <div>
            <label className="block text-sm font-medium mb-1">Salary</label>
            <input
              type="number"
              name="salary"
              value={form.salary}
              onChange={handleChange}
              placeholder="e.g. 120000"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Lahore, Remote"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              required
            />
          </div>

          {/* Job Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Job Type</label>
            <input
              type="text"
              name="type"
              value={form.type}
              onChange={handleChange}
              placeholder="Full-time, Part-time, Internship"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              required
            />
          </div>

          {/* Apply Link */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Apply Link
            </label>
            <input
              type="url"
              name="applylink"
              value={form.applylink}
              onChange={handleChange}
              placeholder="https://company.com/careers"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              required
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Job Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="5"
              placeholder="Describe responsibilities, requirements, and benefits..."
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none resize-none"
              required
            />
          </div>

          {/* Submit */}
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-8 py-2 rounded-lg transition"
            >
              Publish Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
