import React, { useEffect, useState } from "react";
import Loader from "../tools/loader";
import { NavLink } from "react-router-dom";
import { FaEye, FaTrash, FaUsers } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

export default function Applicants() {
  const [applicants, setApplicants] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL;
  const uploadsUrl = import.meta.env.VITE_UPLOADS_URL;

  /* -------------------- AUTH -------------------- */
  const token = localStorage.getItem("token");
  if (!token) window.location.href = "/login";

  const user = jwtDecode(token);
  if (!["admin", "superadmin"].includes(user.role)) {
    window.location.href = "/login";
  }
  const userId = user.id;

  /* -------------------- FETCH -------------------- */
  const fetchData = async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        fetch(`${apiUrl}jobs`),
        fetch(`${apiUrl}applyjob`),
      ]);

      const [jobsData, appsData] = await Promise.all([
        jobsRes.json(),
        appsRes.json(),
      ]);

      const ownedJobs = jobsData.filter(
        (job) => job && job._id && job.userId === userId
      );
      setJobs(ownedJobs);

      const ownedJobIds = new Set(ownedJobs.map((j) => j._id));
      const filteredApps = appsData.filter(
        (app) => app && ownedJobIds.has(app.jobId)
      );

      setApplicants(filteredApps);
    } catch (error) {
      console.error("Error fetching applicants:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, []);

  /* -------------------- DELETE -------------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this applicant?"))
      return;

    try {
      const response = await fetch(`${apiUrl}applyjob/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error();
      setApplicants((prev) => prev.filter((app) => app._id !== id));
    } catch (error) {
      console.error("Error deleting applicant:", error);
    }
  };

  /* -------------------- STATUS BADGE -------------------- */
  const getStatusClass = (status) => {
    const styles = {
      applied: "bg-blue-100 text-blue-700",
      interviewed: "bg-yellow-100 text-yellow-700",
      hired: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  /* -------------------- SEARCH -------------------- */
  const filteredApplicants = applicants.filter(
    (a) =>
      a.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.phone?.includes(search)
  );

  /* -------------------- LOADING -------------------- */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader />
      </div>
    );
  }

  /* -------------------- EMPTY -------------------- */
  if (applicants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-500">
        <FaUsers className="text-5xl mb-4" />
        <h2 className="text-xl font-semibold">No Applicants Found</h2>
        <p className="text-sm mt-1">
          Applicants will appear here once someone applies
        </p>
      </div>
    );
  }

  /* -------------------- UI -------------------- */
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-50 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Applicant Submissions
            </h1>
            <p className="text-sm text-gray-500">
              Total Applicants: {applicants.length}
            </p>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search by name or phone..."
            className="w-full sm:w-72 px-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Job</th>
              <th className="px-6 py-4">Resume</th>
              <th className="px-6 py-4">Cover Letter</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Applied</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredApplicants.map((applicant) => (
              <tr
                key={applicant._id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 font-medium">
                  {applicant.name}
                </td>

                <td className="px-6 py-4">
                  <NavLink
                    to={`${applicant.jobId}`}
                    className="text-orange-600 hover:underline"
                  >
                    {applicant.jobId.slice(0, 8)}...
                  </NavLink>
                </td>

                <td className="px-6 py-4">
                  <a
                    href={`${uploadsUrl}${applicant.resume}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-100 text-orange-700 hover:bg-orange-200 transition"
                  >
                    <FaEye />
                    View
                  </a>
                </td>

                <td className="px-6 py-4 text-gray-500">
                  {applicant.coverLetter
                    ? applicant.coverLetter.slice(0, 25) + "..."
                    : "N/A"}
                </td>

                <td className="px-6 py-4">{applicant.phone}</td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                      applicant.status
                    )}`}
                  >
                    {applicant.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  {new Date(applicant.appliedAt).toLocaleDateString()}
                </td>

                <td className="px-6 py-4 text-right">
                  <span
                    onClick={() => handleDelete(applicant._id)}
                    className="p-2  text-red-700 transition"
                    title="Delete Applicant"
                  >
                    <FaTrash />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
