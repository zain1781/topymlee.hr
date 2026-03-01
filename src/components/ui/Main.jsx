import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import animationData from "../../assets/lottie/Talent Search.json";
import Loader from "../../tools/loader";
import { WineOff } from "lucide-react";

export default function Main() {
  const [loading, setLoading] = useState(true);

useEffect(() => {
  window.scrollTo(0, 0); // ✅ lowercase w

  const timer = setTimeout(() => setLoading(false), 400);

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
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-orange-50 to-white">
      {/* Background decoration */}
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-orange-200/30 blur-3xl"></div>

      <div className="container mx-auto px-6 py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          
          {/* Left Content */}
          <div>
            <span className="inline-block mb-4 px-4 py-1 text-sm font-medium text-orange-600 bg-orange-100 rounded-full">
              AI-Powered Hiring Platform
            </span>

            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
              Elevate Your HR with{" "}
              <span className="text-orange-500">Topymlee</span>
            </h1>

            <p className="text-lg text-gray-600 mb-8 max-w-xl">
              Transform recruitment with intelligent automation. From resume
              screening to final hiring — <strong>Topymlee</strong> delivers
              speed, accuracy, and confidence to modern HR teams.
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {[
                "Automated Resume Screening",
                "AI Candidate Matching",
                "Smart Job Posting",
                "End-to-End Hiring Flow",
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition"
                >
                  <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                  <span className="text-gray-700 font-medium">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <span className="bttn px-8 py-3 rounded-xl bg-orange-500 text-white font-semibold shadow-lg hover:bg-orange-600 transition">
                Get Started
              </span>
              <span className="bttn px-8 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition">
                Request Demo
              </span>
            </div>
          </div>

          {/* Right Animation */}
          <div className="relative">
            <div className="rounded-2xl bg-white/70 backdrop-blur-xl shadow-xl p-8 border border-gray-100">
              <Lottie animationData={animationData} loop />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
