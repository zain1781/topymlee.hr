import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import img from "../assets/logo.png";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  /* ------------------ Load User ------------------ */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, []);

  /* ------------------ Logout ------------------ */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/auth");
  };

  const navLinks = [
    { to: "/jobs", label: "Jobs" },
    { to: "/pricing", label: "Pricing" },
    { to: "/about", label: "About" },
    { to: "/working", label: "How It Works" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2">
            <img
              src={img}
              alt="Topymlee"
              className="w-10 h-10 rounded-full shadow-md"
            />
            <span className="font-extrabold text-gray-900 text-lg hidden sm:block">
              Topymlee
            </span>
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
        {navLinks.map((link) => (
  <NavLink key={link.to} to={link.to}>
    {({ isActive }) => (
      <span
        className={`relative text-sm font-semibold transition
          ${isActive ? "text-orange-500" : "text-gray-700 hover:text-orange-400"}
        `}
      >
        {link.label}
        <span
          className={`absolute left-0 -bottom-1 h-0.5 bg-orange-400 transition-all
            ${isActive ? "w-full" : "w-0"}
          `}
        />
      </span>
    )}
  </NavLink>
))}

          </nav>

          {/* User / Auth */}
          <div className="hidden lg:flex items-center">
            {user ? (
              <div className="relative">
                <span
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className=" bttn w-9 h-9 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center hover:scale-105 transition"
                >
                  {(user?.name || "U")[0].toUpperCase()}
                </span>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border p-2">
                    <NavLink
                      to="/user/dashboard"
                      className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Dashboard
                    </NavLink>
                    <span
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                to="/auth"
                className="px-6 py-2 rounded-full bg-orange-500 text-white font-semibold shadow-md hover:bg-orange-600 transition"
              >
                <FaUserAlt />
              </NavLink>
            )}
          </div>

          {/* Mobile Menu span */}
          <span
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className=" bttn lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </span>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 space-y-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                {link.label}
              </NavLink>
            ))}

            {user ? (
              <>
                <NavLink
                  to="/user/dashboard"
                  className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Dashboard
                </NavLink>
                <span
                  onClick={handleLogout}
                  className="bttn w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </span>
              </>
            ) : (
              <NavLink
                to="/auth"
                className="block text-center px-6 py-2 rounded-full bg-orange-500 text-white font-semibold"
              >
                Login / Signup
              </NavLink>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
