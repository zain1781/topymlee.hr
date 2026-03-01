import React, { useEffect, useState } from "react";
import Loader from "../tools/loader";
import BackButton from "../tools/BackButton";
import { notifyError, notifySuccess } from "../utils/toastify";
import { useParams } from "react-router-dom";

export default function ApplyforJob() {
  const { id } = useParams();
  const jobId = id;

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const apiUrl = import.meta.env.VITE_API_URL;

  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    coverLetter: "",
    resume: null,
  });

  /* ------------------ Effects ------------------ */
  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  /* ------------------ Handlers ------------------ */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobs((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setJobs((prev) => ({
      ...prev,
      resume: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!jobs.name || !jobs.email || !jobs.phone) {
      notifyError("Please fill all required fields");
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(jobs).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      formData.append("jobId", jobId);
      formData.append("userId", userId);

      const response = await fetch(`${apiUrl}applyjob/apply`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        notifyError(errorData.message || "Application failed");
        return;
      }

      await response.json();
      notifySuccess("Application submitted successfully");

      setJobs({
        name: "",
        email: "",
        phone: "",
        linkedin: "",
        coverLetter: "",
        resume: "",
      });
    } catch (error) {
      notifyError("Something went wrong. Please try again.");
      console.error("Error submitting application:", error);
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
    <section className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-white py-20 px-4">
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-xl p-10">
        
        <BackButton />

        <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-2">
          Apply for Job
        </h2>
        <p className="text-center text-gray-600 mb-10">
          Complete the form below to submit your application
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Full Name *" name="name" value={jobs.name} onChange={handleChange} />
            <Input label="Email Address *" type="email" name="email" value={jobs.email} onChange={handleChange} />
            <Input label="Phone Number *" name="phone" value={jobs.phone} onChange={handleChange} />
            <Input label="LinkedIn Profile" name="linkedin" value={jobs.linkedin} onChange={handleChange} />
          </div>

          {/* Cover Letter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cover Letter
            </label>
            <textarea
              name="coverLetter"
              value={jobs.coverLetter}
              onChange={handleChange}
              rows={5}
              placeholder="Tell us why you're a good fit for this role..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 focus:ring-2 focus:ring-orange-400 focus:outline-none resize-none"
            />
          </div>

          {/* Resume Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Resume
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:bg-orange-500 file:text-white file:font-semibold hover:file:bg-orange-600"
            />
            <p className="text-xs text-gray-500 mt-1">
              Accepted formats: PDF, DOCX
            </p>
          </div>

          {/* Submit */}
        <button
  type="submit"
  className="w-full mt-6 py-3 rounded-xl bg-orange-500 text-white text-lg font-semibold shadow-lg hover:bg-orange-600 transition"
>
  Submit Application
</button>

        </form>
      </div>
    </section>
  );
}

/* Reusable Input */
function Input({ label, ...props }) {
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
