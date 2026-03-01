import { useEffect, useState } from "react";
import Loader from "../../tools/loader";
import { NavLink } from "react-router-dom";

export default function Pricing() {
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

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block mb-4 px-4 py-1 text-sm font-semibold text-orange-600 bg-orange-100 rounded-full">
            Simple Pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Choose the Right <span className="text-orange-500">Plan</span>
          </h2>
          <p className="text-lg text-gray-600">
            Whether you’re testing the platform or hiring at scale, Topymlee has
            a plan that fits your needs.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
          
          {/* Starter Plan */}
          <div className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-lg transition">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Starter Plan
            </h3>
            <p className="text-gray-600 mb-6">
              Perfect for individuals & testing the platform
            </p>

            <div className="mb-6">
              <span className="text-5xl font-extrabold text-gray-900">
                Free
              </span>
            </div>

            <ul className="space-y-3 mb-8 text-gray-700">
              <PricingItem text="Summarize up to 10 resumes" />
              <PricingItem text="Basic resume categorization" />
              <PricingItem text="Limited AI support" />
              <PricingItem text="Good quality summarization" />
            </ul>

            <NavLink
              to="/payment-info"
              className="block w-full text-center rounded-xl bg-gray-900 px-6 py-3 text-white font-semibold hover:bg-gray-800 transition"
            >
              Get Started Free
            </NavLink>
          </div>

          {/* Pro Plan */}
          <div className="relative bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-8 shadow-2xl text-white">
            
            {/* Badge */}
            <span className="absolute -top-4 right-6 bg-black/80 text-white px-4 py-1 text-xs font-semibold rounded-full">
              Best Value
            </span>

            <h3 className="text-2xl font-bold mb-2">Pro Plan</h3>
            <p className="text-white/90 mb-6">
              Built for recruiters & serious job seekers
            </p>

            <div className="mb-6 flex items-end gap-3">
              <span className="text-5xl font-extrabold text-black">$10</span>
              <span className="text-xl line-through text-white/70">$100</span>
              <span className="text-lg text-white/80">/ month</span>
            </div>

            <ul className="space-y-3 mb-8">
              <PricingItem light text="250+ resume uploads" />
              <PricingItem light text="Excellent AI summarization" />
              <PricingItem light text="Email candidate recommendations" />
              <PricingItem light text="Job posting tools" />
              <PricingItem light text="Hiring worksheets & templates" />
              <PricingItem light text="Priority support" />
            </ul>

            <NavLink
              to="/payment-info"
              className="block w-full text-center rounded-xl bg-white text-gray-900 px-6 py-3 font-semibold hover:bg-gray-100 transition"
            >
              Upgrade to Pro
            </NavLink>
          </div>

        </div>
      </div>
    </section>
  );
}

/* Reusable Pricing Item */
function PricingItem({ text, light }) {
  return (
    <li className="flex items-center gap-3">
      <CheckIcon className={light ? "text-white" : "text-orange-500"} />
      <span className={light ? "text-white" : "text-gray-700"}>{text}</span>
    </li>
  );
}

/* Check Icon */
function CheckIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`h-5 w-5 shrink-0 ${className}`}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}
