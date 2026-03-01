import React from "react";
import Lottie from "lottie-react";
import animationData from "../../assets/lottie/Recruiter Hiring.json";

export default function Cvs() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-yellow-50 to-white py-24">
      
      {/* Decorative blur */}
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-yellow-200/30 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 lg:px-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Animation */}
          <div className="relative">
            <div className="rounded-2xl bg-white/70 backdrop-blur-xl shadow-xl p-8 border border-gray-100">
              <Lottie animationData={animationData} loop />
            </div>
          </div>

          {/* Content */}
          <div>
            <span className="inline-block mb-4 px-4 py-1 text-sm font-semibold text-yellow-600 bg-yellow-100 rounded-full">
              Resume Intelligence
            </span>

            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
              Simplify Resume Screening with{" "}
              <span className="text-yellow-500">Topymlee</span>
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-xl">
              Let AI handle the heavy lifting. Instantly{" "}
              <strong>summarize</strong>,{" "}
              <strong>categorize</strong>, and{" "}
              <strong>rank resumes</strong> so your HR team can focus on hiring
              the right talent — faster and smarter.
            </p>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {[
                "Smart Resume Summaries",
                "Accurate Skill Categorization",
                "AI Ranking by Job Match",
                "Bulk CV Processing",
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition"
                >
                  <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                  <span className="text-gray-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-4">
              <span className="px-8 bttn py-3 rounded-xl bg-yellow-500 text-white text-lg font-semibold shadow-lg hover:bg-yellow-600 transition">
                Get Started
              </span>
              <span className="px-8 bttn py-3 rounded-xl border border-gray-300 text-gray-700 text-lg font-semibold hover:bg-gray-100 transition">
                Learn More
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
