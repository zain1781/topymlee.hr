import React, { useState, useEffect } from "react";
import Loader from "../../tools/loader";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function SuperAdmin() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(0);
  const [admin, setAdmin] = useState(0);
  const [jobs, setJobs] = useState(0);
  const [cvs, setCvs] = useState([]);

  const api = import.meta.env.VITE_API_URL;
  const uploads = import.meta.env.VITE_UPLOADS_URL;

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchJobs();
    fetchCVs();
  }, []);

  const fetchJobs = async () => {
    const res = await fetch(`${api}jobs`);
    const data = await res.json();
    setJobs(data.length);
  };

  const fetchUsers = async () => {
    const res = await fetch(`${api}users`);
    const data = await res.json();
    setUser(data.length);
    setAdmin(data.filter((u) => u.role === "admin").length);
  };

  const fetchCVs = async () => {
    const res = await fetch(`${api}cv`);
    const data = await res.json();
    setCvs(data);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader />
      </div>
    );
  }

  const chartData = [
    { name: "Users", value: user },
    { name: "Admins", value: admin },
    { name: "Jobs", value: jobs },
  ];

  const COLORS = ["#4F46E5", "#10B981", "#F59E0B"];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Super Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of platform activity & performance
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Users" value={user} accent="bg-indigo-500" />
        <StatCard title="Admins" value={admin} accent="bg-emerald-500" />
        <StatCard title="Active Jobs" value={jobs} accent="bg-amber-500" />
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Platform Distribution
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  outerRadius={100}
                  label
                >
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent CVs */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Applications
          </h2>

          {cvs.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-10">
              No applications submitted yet
            </p>
          ) : (
            <ul className="space-y-4 max-h-72 overflow-auto pr-2">
              {cvs.map((cv, index) => (
                <li
                  key={cv._id}
                  className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 hover:bg-gray-100 transition"
                >
                  <span className="text-sm text-gray-700 truncate">
                    {index + 1}. {cv.email}
                  </span>
              <a
  href={`${uploads}${cv.resume}`}
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center justify-center px-5 py-2.5 
             bg-indigo-600 text-white text-sm font-semibold 
             rounded-md shadow-sm 
             hover:bg-indigo-700 focus:outline-none focus:ring-2 
             focus:ring-indigo-500 focus:ring-offset-2 
             transition-all duration-200"
  title="View CV"
>
  View CV
</a>


                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, accent }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 relative overflow-hidden hover:shadow-md transition">
      <div className={`absolute left-0 top-0 h-full w-1 ${accent}`} />
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-semibold text-gray-800 mt-2">{value}</p>
    </div>
  );
}
