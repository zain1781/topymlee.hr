import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt, FaSearch, FaBriefcase } from "react-icons/fa";
import Loader from "../tools/loader";
import { notifyError, notifySuccess } from "../utils/toastify";
import { jwtDecode } from "jwt-decode";

const JobPost = () => {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null;
  const userId = user?.id;

  /* -------------------- AUTH -------------------- */
  useEffect(() => {
    if (!token || !["admin", "superadmin"].includes(user?.role)) {
      navigate("/login");
    }
  }, []);

  /* -------------------- FETCH -------------------- */
  const fetchJobs = async () => {
    try {
      const res = await fetch(`${apiUrl}jobs`);
      const result = await res.json();
      const userJobs = result.filter((job) => job?.userId === userId);
      setJobs(userJobs);
      setFiltered(userJobs);
    } catch {
      notifyError("Failed to fetch jobs");
    }
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      await fetchJobs();
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  /* -------------------- DELETE -------------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      const res = await fetch(`${apiUrl}jobs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      notifySuccess("Job deleted successfully");
      fetchJobs();
    } catch {
      notifyError("Failed to delete job");
    }
  };

  /* -------------------- SEARCH -------------------- */
  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      jobs.filter(
        (job) =>
          job?.title?.toLowerCase().includes(q) ||
          job?.company?.toLowerCase().includes(q) ||
          job?.location?.toLowerCase().includes(q)
      )
    );
  }, [search, jobs]);

  const formatSalary = (salary) =>
    salary && !isNaN(salary) ? `$${Number(salary).toLocaleString()}` : "N/A";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-50 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Job Posts</h1>
            <p className="text-sm text-gray-500">
              Manage, edit and remove your job listings
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-80">
            <FaSearch className="absolute right-3 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, company, location..."
              className="w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-2xl shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">#</th>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Company</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Experience</th>
              <th className="px-6 py-4">Salary</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length ? (
              filtered.map((job, index) => (
                <tr
                  key={job._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {job.title}
                  </td>
                  <td className="px-6 py-4">{job.company}</td>
                  <td className="px-6 py-4">{job.location}</td>
                  <td className="px-6 py-4">
                    {job.experience ? `${job.experience} yrs` : "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    {formatSalary(job.salary)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 text-xs rounded-full bg-orange-100 text-orange-700 font-medium">
                      {job.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex gap-2">
                      <NavLink
                        to={`/admin/update/job/${job._id}`}
                        className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition"
                        title="Edit Job"
                      >
                        <FaEdit />
                      </NavLink>
                      <span
                        onClick={() => handleDelete(job._id)}
                        className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition"
                        title="Delete Job"
                      >
                        <FaTrashAlt />
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <FaBriefcase className="text-3xl" />
                    <p className="text-sm">No jobs found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobPost;
