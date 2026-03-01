import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Loader2 } from "lucide-react";
import BackButton from "../tools/BackButton";

export default function MyApplication() {
  const api = import.meta.env.VITE_API_URL;
  const upload = import.meta.env.VITE_UPLOADS_URL;
  const token = localStorage.getItem("token");

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ------------------ Auth Guard ------------------ */
  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const user = jwtDecode(token);
    if (!["user", "admin", "superadmin"].includes(user.role)) {
      window.location.href = "/login";
    }
  }, [token]);

  const user = token ? jwtDecode(token) : null;
  const userId = user?.id;

  /* ------------------ Fetch Applications ------------------ */
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(`${api}applyjob`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch applications");

        const result = await response.json();
        const userApps = result.filter(
          (app) => app?.userId === userId
        );

        setApplications(userApps);
      } catch (error) {
        console.error("Error fetching applications:", error);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchApplications();
  }, [api, token, userId]);

  /* ------------------ UI ------------------ */
  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4">
      <div className="max-w-6xl mx-auto">

        <BackButton />

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            My Applications
          </h1>
          <p className="text-gray-600">
            Track the status of jobs you’ve applied for
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin h-8 w-8 text-orange-500" />
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            You haven’t applied for any jobs yet.
          </div>
        ) : (
          <div className="overflow-x-auto bg-white/80 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-xl">
            <table className="min-w-full">
              <thead className="bg-gray-100 text-gray-700 text-sm">
                <tr>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Phone</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Applied On</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>

              <tbody className="text-sm text-gray-700">
                {applications.map((app) => (
                  <tr
                    key={app._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 font-medium">{app.name}</td>
                    <td className="px-6 py-4">{app.email}</td>
                    <td className="px-6 py-4">{app.phone}</td>

                    <td className="px-6 py-4">
                      <StatusBadge status={app.status} />
                    </td>

                    <td className="px-6 py-4">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 flex gap-4">
                      <a
                        href={`${upload}${app.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-500 font-medium hover:underline"
                      >
                        Resume
                      </a>
                      <button
                        onClick={() => alert(app.coverLetter)}
                        className="text-gray-600 hover:text-gray-900 font-medium"
                      >
                        Cover Letter
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------------ Status Badge ------------------ */
function StatusBadge({ status }) {
  const styles = {
    applied: "bg-blue-100 text-blue-700",
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}
