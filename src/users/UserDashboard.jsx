import React from "react";
import {
  FaUserEdit,
  FaUpload,
  FaClipboardList,
  FaFileAlt,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

export default function UserDashboard() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white px-4 py-16">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            User Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your profile, resume, and job applications in one place
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          <DashboardCard
            title="Edit Profile"
            subtitle="Update your personal information"
            link="/user/edit-profile"
            icon={<FaUserEdit />}
            color="orange"
          />

          <DashboardCard
            title="Upload Resume"
            subtitle="Upload or replace your CV"
            link="/user/upload-resume"
            icon={<FaUpload />}
            color="blue"
          />

          <DashboardCard
            title="My Applications"
            subtitle="Track your applied jobs and status"
            link="/user/my-application"
            icon={<FaClipboardList />}
            color="green"
          />

          <DashboardCard
            title="Create Resume"
            subtitle="Build a professional resume online"
            link="/user/create-resume"
            icon={<FaFileAlt />}
            color="purple"
          />
        </div>
      </div>
    </section>
  );
}

/* ------------------ Dashboard Card ------------------ */
function DashboardCard({ title, subtitle, link, icon, color }) {
  const colorMap = {
    orange: {
      bg: "bg-orange-100",
      text: "text-orange-600",
      ring: "hover:ring-orange-200",
    },
    blue: {
      bg: "bg-blue-100",
      text: "text-blue-600",
      ring: "hover:ring-blue-200",
    },
    green: {
      bg: "bg-green-100",
      text: "text-green-600",
      ring: "hover:ring-green-200",
    },
    purple: {
      bg: "bg-purple-100",
      text: "text-purple-600",
      ring: "hover:ring-purple-200",
    },
  };

  const styles = colorMap[color];

  return (
    <NavLink to={link}>
      <div
        className={`group h-full bg-white border border-gray-100 rounded-2xl p-6 shadow-sm 
        hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ring-1 ring-transparent ${styles.ring}`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 flex items-center justify-center rounded-xl ${styles.bg} ${styles.text} text-xl`}
          >
            {icon}
          </div>

          <div className="flex-1">
            <h3
              className={`text-xl font-semibold mb-1 ${styles.text} group-hover:underline`}
            >
              {title}
            </h3>
            <p className="text-gray-500 text-sm">{subtitle}</p>
          </div>
        </div>
      </div>
    </NavLink>
  );
}
