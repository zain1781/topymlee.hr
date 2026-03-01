import { useState, useEffect } from "react";
import Lottie from "lottie-react";
import animationData from "../../assets/lottie/searching for profile.json";
import Loader from "../../tools/loader";
import { NavLink } from "react-router-dom";

export default function AboutUs() {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader />
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-orange-50 to-white py-24">
      
      {/* Decorative blur */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 lg:px-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Content */}
          <div>
            <span className="inline-block mb-4 px-4 py-1 text-sm font-semibold text-orange-600 bg-orange-100 rounded-full">
              Who We Are
            </span>

            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
              About <span className="text-orange-500">Topymlee</span>
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed mb-6 max-w-xl">
              At <strong>Topymlee</strong>, we’re transforming recruitment with
              intelligent automation. Our AI-driven platform{" "}
              <strong>summarizes</strong>, <strong>categorizes</strong>, and{" "}
              <strong>ranks resumes</strong> — eliminating manual screening and
              accelerating hiring decisions.
            </p>

            <p className="text-lg text-gray-600 leading-relaxed mb-10 max-w-xl">
              From fast-growing startups to global enterprises, Topymlee empowers
              HR teams to hire smarter, faster, and more confidently.
            </p>

            {/* CTA */}
            {!token && (
              <NavLink
                to="/login"
                className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-orange-500 text-white text-lg font-semibold shadow-lg hover:bg-orange-600 transition"
              >
                Get Started
              </NavLink>
            )}
          </div>

          {/* Animation */}
          <div className="relative">
            <div className="rounded-2xl bg-white/70 backdrop-blur-xl shadow-xl p-8 border border-gray-100">
              <Lottie
                animationData={animationData}
                loop
                className="w-full h-auto max-w-md mx-auto"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
