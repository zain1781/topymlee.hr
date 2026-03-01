import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import animationData from "../../assets/lottie/Hire Me.json";
import Loader from "../../tools/loader";

export default function Working() {
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

  const steps = [
    {
      title: "Build or Upload Resume",
      description:
        "Create a professional resume using our smart builder or upload an existing CV in seconds.",
    },
    {
      title: "AI Enhancement",
      description:
        "Our AI instantly summarizes, categorizes, and enriches resumes with actionable insights.",
    },
    {
      title: "Job Posting & Matching",
      description:
        "Companies post jobs and automatically receive the most relevant candidates.",
    },
    {
      title: "Smart Notifications",
      description:
        "Top candidates are notified via email, accelerating hiring decisions.",
    },
    {
      title: "Analytics & Secure Storage",
      description:
        "Track performance and store all data securely with enterprise-grade protection.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-orange-50 to-white py-24">
      
      {/* Decorative blur */}
      <div className="absolute -top-24 right-0 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 lg:px-20 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block mb-4 px-4 py-1 text-sm font-semibold text-orange-600 bg-orange-100 rounded-full">
            Simple Process
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            How <span className="text-orange-500">Topymlee</span> Works
          </h2>
          <p className="text-lg text-gray-600">
            From resume creation to hiring decisions — everything is designed to
            be fast, intelligent, and effortless.
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Steps */}
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex gap-5 p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-gray-100 shadow-sm hover:shadow-md transition"
              >
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-orange-500 text-white font-bold text-lg">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Animation */}
          <div className="relative">
            <div className="rounded-2xl bg-white/70 backdrop-blur-xl shadow-xl p-8 border border-gray-100">
              <Lottie animationData={animationData} loop className="w-full h-auto" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
