import React, { useState, useEffect } from "react";
import Loader from "../../tools/loader";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { jwtDecode } from "jwt-decode";
import { Briefcase, Users, FileText } from "lucide-react";

export default function Admin() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState(0);
  const [userJobs, setUserJobs] = useState(0);
  const [cvs, setCvs] = useState([]);
  const [totals, setTotals] = useState(0);

  const api = import.meta.env.VITE_API_URL;

  // 🔐 Auth
  const token = localStorage.getItem("token");
  if (!token) window.location.href = "/login";

  const user = jwtDecode(token);
  if (user.role !== "admin" && user.role !== "superadmin")
    window.location.href = "/login";

  const id = user.id;

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
    fetchJobs();
    fetchCvs();
    setTimeout(() => setLoading(false), 500);
  }, []);

  // 📦 Jobs + Applicants
  const fetchData = async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        fetch(`${api}jobs`),
        fetch(`${api}applyjob`),
      ]);

      const jobsData = await jobsRes.json();
      const appsData = await appsRes.json();

      const myJobs = jobsData.filter((j) => j?.userId === id);
      const myJobIds = new Set(myJobs.map((j) => j._id));

      const myApplicants = appsData.filter((a) =>
        myJobIds.has(a.jobId)
      );

      setTotals(myApplicants.length);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchJobs = async () => {
    const res = await fetch(`${api}jobs`);
    const data = await res.json();
    setJobs(data.length);
    setUserJobs(data.filter((j) => j?.userId === id).length);
  };

  const fetchCvs = async () => {
    const res = await fetch(`${api}cv`);
    const data = await res.json();
    setCvs(data);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  // 📊 Chart Data
  const chartData = [
    { name: "Your Jobs", value: userJobs },
    { name: "All Jobs", value: jobs },
    { name: "Applicants", value: totals },
    { name: "CVs", value: cvs.length },
  ];

  const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Jobs, applicants & CV overview
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="p-6 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<Briefcase />}
            title="All Jobs"
            value={jobs}
            color="indigo"
          />
          <StatCard
            icon={<Briefcase />}
            title="Your Jobs"
            value={userJobs}
            color="green"
          />
          <StatCard
            icon={<Users />}
            title="Applicants"
            value={totals}
            color="amber"
          />
          <StatCard
            icon={<FileText />}
            title="Uploaded CVs"
            value={cvs.length}
            color="red"
            buttonText="Contact for CVs"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">
              Distribution Overview
            </h3>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    outerRadius={110}
                    label
                  >
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">
              Jobs vs Applicants
            </h3>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: "Jobs", value: jobs },
                    { name: "Applicants", value: totals },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="value"
                    fill="#6366F1"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* 🔹 Stat Card */
function StatCard({ icon, title, value, color, buttonText }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-5">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>

      {buttonText && (
        <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition text-sm">
          {buttonText}
        </button>
      )}
    </div>
  );
}
