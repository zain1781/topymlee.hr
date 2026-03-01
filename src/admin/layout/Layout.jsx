import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Nav from "../static/Nav"
import Login from "../../auth/Login";
export default function Layout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        jwtDecode(token); // Just checking if token is valid
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Invalid Token:", error);
        setIsAuthenticated(false);
      }
    }
  }, []);

  return isAuthenticated ? <Nav /> : <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
}
