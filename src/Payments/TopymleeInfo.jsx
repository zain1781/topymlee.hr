import React, { useEffect, useState } from "react";
import {
  FaPaypal,
  FaCcStripe,
  FaCcVisa,
  FaCcMastercard,
  FaEnvelope,
  FaInfoCircle,
} from "react-icons/fa";
import Loader from "../tools/loader";

export default function TopymleeInfo() {
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
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-orange-50 to-white py-20">
      
      {/* Decorative blur */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl"></div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-xl p-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          
          {/* Left: Product Info */}
          <div className="flex items-start gap-5 max-w-2xl">
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-orange-100 to-orange-200">
              <FaInfoCircle className="text-orange-600 w-7 h-7" />
            </div>

            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
                Topymlee
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Topymlee is an <strong>AI-powered HR platform</strong> designed
                to modernize recruitment. Instantly analyze resumes, summarize
                applications, rank candidates, and make smarter hiring decisions
                — all from one intelligent dashboard.
              </p>
            </div>
          </div>

          {/* Right: Status + Actions */}
          <div className="text-center lg:text-right">
            
            {/* Beta Badge */}
            <span className="inline-block mb-3 px-5 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-md">
              🚀 Beta Version
            </span>
            <p className="text-gray-500 text-sm mb-5">
              Currently free with limited features
            </p>

            {/* Contact Button */}
            <button
              onClick={() =>
                (window.location.href = "mailto:developer@example.com")
              }
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold shadow-lg hover:bg-orange-600 transition transform hover:scale-105"
            >
              <FaEnvelope className="w-4 h-4" />
              Contact Developers
            </button>

            {/* Payment Trust Icons */}
            <div className="flex justify-center lg:justify-end gap-6 mt-6 text-3xl text-gray-500">
              <FaPaypal className="hover:text-orange-500 transition transform hover:scale-110" />
              <FaCcStripe className="hover:text-indigo-500 transition transform hover:scale-110" />
              <FaCcVisa className="hover:text-blue-600 transition transform hover:scale-110" />
              <FaCcMastercard className="hover:text-red-600 transition transform hover:scale-110" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
