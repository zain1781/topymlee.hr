import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FiMapPin, FiBriefcase, FiDollarSign, FiClock } from "react-icons/fi";
import { FaSearch } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import Loader from "../../tools/loader";

export default function Jobs() {
  const api = import.meta.env.VITE_API_URL;

  const [jobData, setJobData] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchJobs = async () => {
      try {
        const response = await fetch(`${api}jobs/`);
        if (!response.ok) throw new Error("Failed to fetch jobs");
        const data = await response.json();
        setJobData(data);
        setFilteredJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setTimeout(() => setLoading(false), 300);
      }
    };

    fetchJobs();
  }, [api]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader />
      </div>
    );
  }

  if (!jobData || jobData.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500 text-lg">
          No jobs available at the moment.
        </p>
      </div>
    );
  }

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (!term.trim()) {
      setFilteredJobs(jobData);
      return;
    }

    const filtered = jobData.filter((job) =>
      [job.title, job.company, job.location]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );

    setFilteredJobs(filtered);
  };

  return (
    <>
      {/* ✅ SEO Helmet */}
      <Helmet>
        <title>Latest Jobs in Pakistan | Apply Online</title>
        <meta
          name="description"
          content="Browse the latest job opportunities in Pakistan. Search by title, company, location, salary, and apply online."
        />
        <meta
          name="keywords"
          content="jobs in pakistan, latest jobs, apply jobs online, IT jobs, software jobs"
        />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:title" content="Latest Jobs in Pakistan" />
        <meta
          property="og:description"
          content="Find and apply for the best job opportunities across Pakistan."
        />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Latest Jobs in Pakistan" />
        <meta
          name="twitter:description"
          content="Search and apply for jobs that match your skills."
        />
      </Helmet>

      <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                Available Jobs
              </h1>
              <p className="text-gray-600">
                Find opportunities that match your skills and goals
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-80">
              <FaSearch className="absolute right-4 top-3.5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search by title, company, location"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-400 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Jobs Grid */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <div
                key={job._id || job.id}
                className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 group-hover:text-orange-500 transition">
                    {job.title}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {job.company || "Unknown Company"}
                  </p>
                </div>

                <p className="text-sm text-gray-600 mb-5 line-clamp-3">
                  {job.description}
                </p>

                <ul className="space-y-2 text-sm text-gray-700 mb-6">
                  <JobItem icon={<FiMapPin />} label="Location" value={job.location} />
                  <JobItem icon={<FiBriefcase />} label="Experience" value={job.experience ? `${job.experience} yr` : null} />
                  <JobItem icon={<FiDollarSign />} label="Salary" value={job.salary ? `${Number(job.salary).toLocaleString()} PKR` : null} />
                  <JobItem icon={<FiClock />} label="Type" value={job.type} />
                </ul>

                <div className="flex gap-3 mt-auto">
                  {job.saveLink && (
                    <a
                      href={job.saveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 rounded-xl bg-orange-500 text-white text-sm font-semibold py-2.5 text-center hover:bg-orange-600 transition"
                    >
                      Apply Now
                    </a>
                  )}
                  <NavLink
                    to={`/user/apply/job/${job._id}`}
                    className="flex-1 rounded-xl border border-orange-500 text-orange-500 text-sm font-semibold py-2.5 text-center hover:bg-orange-50 transition"
                  >
                    Direct Apply
                  </NavLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* Reusable Job Detail Item */
function JobItem({ icon, label, value }) {
  return (
    <li className="flex items-center gap-2">
      <span className="text-orange-500">{icon}</span>
      <span>
        <strong>{label}:</strong> {value || "Not specified"}
      </span>
    </li>
  );
}
