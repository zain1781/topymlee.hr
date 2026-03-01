import React from "react";
import { FaRobot, FaBriefcase, FaRankingStar } from "react-icons/fa6";

export default function Explore() {
  const features = [
    {
      title: "AI Resume Screening",
      description:
        "Automatically analyze thousands of resumes using AI to identify top candidates with precision.",
      icon: <FaRobot />,
      color: "blue",
    },
    {
      title: "Job Posting & Hiring",
      description:
        "Publish jobs, track applicants, and manage hiring workflows from one unified dashboard.",
      icon: <FaBriefcase />,
      color: "green",
    },
    {
      title: "Candidate Ranking",
      description:
        "Rank applicants intelligently based on skills, experience, and job relevance.",
      icon: <FaRankingStar />,
      color: "yellow",
    },
    {
      title: "Automated HR Workflow",
      description:
        "Reduce manual effort by automating repetitive HR tasks and approvals.",
      icon: <FaRankingStar />,
      color: "purple",
    },
  ];

  const colorMap = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-24">
      
      {/* Decorative blur */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 lg:px-20 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="inline-block mb-4 px-4 py-1 text-sm font-semibold text-orange-600 bg-orange-100 rounded-full">
            Platform Capabilities
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Explore What <span className="text-orange-500">Topymlee</span> Can Do
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to modernize recruitment — powered by AI and
            designed for high-performing HR teams.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 flex items-center justify-center rounded-xl mb-6 ${colorMap[feature.color]}`}
              >
                <span className="text-2xl">{feature.icon}</span>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
