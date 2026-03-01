import { Link, Outlet, useNavigate, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { FaRegUserCircle } from "react-icons/fa";

import img from "../../assets/logo.png";
import {
  FaTachometerAlt,
  FaFileAlt,
  FaBriefcase,
  FaCogs,
  FaUserTie,
  FaEnvelope,
  FaUsers,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [role, setRole] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  /* ------------------ Auth ------------------ */
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const decoded = jwtDecode(token);
      setRole(decoded.role || "");
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const menu = [
    { to: "/admin/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { to: "/admin/resume-analysis", label: "Resume Analysis", icon: <FaFileAlt /> },
    { to: "/admin/job-posts", label: "Job Posts", icon: <FaBriefcase /> },
    { to: "/admin/summerized-resume", label: "Summarized Resume", icon: <FaFileAlt /> },
    { to: "/admin/applicants", label: "Applicants", icon: <FaUserTie /> },
    { to: "/admin/jobs", label: "Jobs", icon: <FaBars /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ---------------- Sidebar ---------------- */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } bg-white border-r border-gray-200 fixed inset-y-0 z-30 transition-all duration-300 overflow-hidden`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b">
          <img src={img} alt="Logo" className="w-9 h-9 rounded-full" />
          <span className="font-bold text-gray-900 text-lg">Admin Panel</span>
        </div>

        {/* Menu */}
        <nav className="px-4 py-4 space-y-1">
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition
                ${
                  isActive
                    ? "bg-orange-100 text-orange-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}

          {/* Superadmin */}
          {role === "superadmin" && (
            <>
              <NavLink
                to="/admin/setting"
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-100"
              >
                <FaCogs />
                System Settings
              </NavLink>

              <NavLink
                to="/admin/messages"
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-100"
              >
                <FaEnvelope />
                Messages
              </NavLink>

              <NavLink
                to="/admin/users"
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-100"
              >
                <FaUsers />
                Users
              </NavLink>
            </>
          )}

          {/* Logout */}
          <span
            onClick={handleLogout}
            className="bttn mt-6 flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 w-full"
          >
            <FaSignOutAlt />
            Logout
          </span>
        </nav>
      </aside>

      {/* ---------------- Main ---------------- */}
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-white border-b px-6 py-4 flex justify-between items-center">
          <span
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className=" bttn p-2 rounded-lg hover:bg-gray-100"
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </span>

          <div className="flex items-center gap-4 relative">
            <span className="text-sm text-gray-500">
              Role: <strong className="text-orange-600">{role}</strong>
            </span>

            <span
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className=" bttn w-9 h-9 rounded-full bg-orange-100 text-orange-700 font-semibold"
            >
<center>              <FaRegUserCircle className="mt-2"/>
</center>              
            </span>

            {dropdownOpen && (
              <div className="absolute right-0 top-12 bg-white border rounded-xl shadow-md w-40">
                <span
                  onClick={handleLogout}
                  className="bttn flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 w-full"
                >
                  <FaSignOutAlt />
                  Logout
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="p-6 min-h-screen bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
