import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

// Public Pages
import AboutUs from "./components/navs/AboutUs";
import ContactUs from "./components/navs/ContactUs";
import Working from "./components/navs/Working";
import Main from "./components/ui/Main";
import Cvs from "./components/ui/Cvs";
import Explore from "./components/ui/Explore";
import Jobs from "./components/navs/Jobs";
import Pricing from "./components/navs/Pricing";


//error Page
import Not from "./error/Not";
// Auth Pages
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import ResetPass from "./auth/ResetPass";

// User Pages
import ApplyforJob from "./users/ApplyforJob";
import UserDashboard from "./users/UserDashboard";

// Admin Pages
import Dashboard from "./admin/Dashboard";
import AdminLayout from "./admin/layout/Layout";
import ResumeAnalysis from "./admin/ResumeAnalysis";
import Summerizedresume from "./admin/Summerizedresume";

// Shared Components
import Header from "./static/Header";
import Footer from "./static/Footer";
import ProtectedRoute from "./auth/ProtectedRoute";

// Toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PostJob from "./admin/PostJob";
import Applicants from "./admin/Applicants";
import JobsPost from "./admin/JobsPost";
import Settings from "./superadmin/Settings";
import InfoJobs from "./admin/InfoJobs";
import CreateResume from "./users/CreateResume";
import UploadResume from "./users/UploadResume";
import Myapplication from "./users/Myapplication";
import Users from "./superadmin/Users";
import EditUser from "./superadmin/EditUser";
import { jwtDecode } from "jwt-decode";
import Messages from "./superadmin/Messages";
import TopymleeInfo from "./Payments/TopymleeInfo";
import EditProfile from "./users/EditProfile";
import Resetp from "./auth/Resetp";
function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

const token = localStorage.getItem("token");
const user = token ? jwtDecode(token) : null;


const role = user?.role;



  return (
    <>
      {/* Header (not for admin) */}
      {!isAdminRoute && <Header />}

      {/* Routes */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Main />} />
        <Route path="/home" element={<Main />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/working" element={<Working />} />
        <Route path="/pricing" element={<Pricing />} />
        {/* Auth Routes */}
        <Route path="/auth" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPass />} />
        <Route path="/reset-password/:token" element={<Resetp />} />
        <Route path="/payment-info" element={<TopymleeInfo />} />

        <Route path="*" element={<Not />} />
        {/* User Routes */}
       {token || role === "user" ||  role === "admin" || role === "superadmin" ?  (
  <>
    <Route path="/user/apply/job/:id" element={<ApplyforJob />} />
    <Route path="/user/dashboard" element={<UserDashboard />} />
    <Route path="/user" element={<UserDashboard />} />
    <Route path="/user/create-resume" element={<CreateResume />} />
    <Route path="/user/upload-resume" element={<UploadResume />} />
    <Route path="/user/my-application" element={<Myapplication />} />
    <Route path="/user/edit-profile" element={<EditProfile />} />
  </>
) :  (
  <Route path="/user/*" element={<Login />} />
)}

       
        {/* Admin Routes (Protected) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRoles={["admin", "superadmin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="resume-analysis" element={<ResumeAnalysis />} />
          <Route path="job-posts" element={<PostJob/>} />
          <Route path="setting" element={<Settings />} />
          <Route path="applicants" element={<Applicants />} />
                  <Route path="update/job/:id" element={<InfoJobs />} />

          <Route path="messages" element={<Messages />} />
          <Route path="jobs" element={<JobsPost />} />

          <Route path="users" element={<Users />} />
          <Route path="update-user/:id" element={<EditUser />} />

          <Route path="summerized-resume" element={<Summerizedresume />} />
        </Route>
      </Routes>

      {/* Footer & Bottom Content (not for admin) */}
      {!isAdminRoute && (
        <>
          <Explore />
          <Cvs />
          <Footer />
        </>
      )}

      {/* Toast Notification */}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
        theme="colored"
        toastClassName="!w-[350px] !text-base !rounded-lg !shadow-md !p-4 !bg-orange-500"
        bodyClassName="text-white"
        closeButton={false}
      />
    </>
  );
}

export default App;
