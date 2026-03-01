import React, { useEffect, useState } from "react";
import { FaUpload, FaEye } from "react-icons/fa";
import { notifyError, notifySuccess } from "../utils/toastify";
import { jwtDecode } from "jwt-decode";

export default function UploadResume() {
  const api = import.meta.env.VITE_API_URL;
  const uploadUrl = import.meta.env.VITE_UPLOADS_URL;
  const token = localStorage.getItem("token");

  const [file, setFile] = useState(null);
  const [existingResume, setExistingResume] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ------------------ Auth Guard ------------------ */
  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
    }
  }, [token]);

  const user = token ? jwtDecode(token) : null;
  const userId = user?.id;
  const email = user?.email;

  /* ------------------ Fetch Existing Resume ------------------ */
  useEffect(() => {
    const fetchCV = async () => {
      try {
        const response = await fetch(`${api}cv/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) return;

        const data = await response.json();
        if (data?.resume) {
          setExistingResume(data.resume);
        }
      } catch (err) {
        console.error("Error fetching resume:", err);
      }
    };

    if (userId) fetchCV();
  }, [api, token, userId]);

  /* ------------------ Handlers ------------------ */
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      notifyError("Please select a resume file");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("email", email);
      formData.append("resume", file);

      const response = await fetch(`${api}cv/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error();

      notifySuccess("Resume uploaded successfully");
      setExistingResume(file.name);
      setFile(null);
    } catch {
      notifyError("Failed to upload resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ UI ------------------ */
  return (
    <section className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white flex items-center justify-center px-4 py-16">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white/80 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-xl p-10 space-y-6"
      >
        <h2 className="text-3xl font-extrabold text-gray-900 text-center">
          Upload Resume
        </h2>
        <p className="text-center text-gray-600">
          Upload or replace your resume for job applications
        </p>

        {/* Existing Resume */}
        {existingResume && (
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <FaEye className="text-blue-500" />
            <a
              href={`${uploadUrl}${existingResume}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-medium hover:underline"
            >
              View current resume
            </a>
          </div>
        )}

        {/* Upload Area */}
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-8 cursor-pointer hover:border-blue-400 transition text-center">
          <FaUpload className="text-blue-500 text-4xl mb-3" />
          <span className="text-gray-700 font-medium">
            {file ? file.name : "Click to upload your resume"}
          </span>
          <span className="text-xs text-gray-500 mt-1">
            PDF, DOC, DOCX (Max 5MB)
          </span>
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.doc,.docx"
          />
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? "Uploading..." : existingResume ? "Replace Resume" : "Upload Resume"}
        </button>
      </form>
    </section>
  );
}
