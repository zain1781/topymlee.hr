import { useEffect, useState } from "react";
import Loader from "../../tools/loader";
import { notifyError, notifySuccess } from "../../utils/toastify";

export default function ContactUs() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`${api}messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        notifyError(data.message || "Failed to send message");
        return;
      }

      notifySuccess("Message sent successfully!");

      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      notifyError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader />
      </div>
    );
  }

  return (
    <section className="relative bg-gradient-to-br from-white via-yellow-50 to-white py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto rounded-2xl bg-white shadow-2xl border border-gray-100 p-10">

          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">
              Get in Touch with{" "}
              <span className="text-yellow-500">Topymlee</span>
            </h2>
            <p className="mt-3 text-gray-600 max-w-xl mx-auto">
              Questions, feedback, or business inquiries?  
              Fill out the form and our team will respond shortly.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3
                           focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400
                           transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3
                           focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400
                           transition"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                name="message"
                rows="5"
                value={form.message}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 resize-none
                           focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400
                           transition"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={submitting}
              className={`w-full rounded-xl py-4 text-lg font-semibold text-white transition
                ${submitting
                  ? "bg-yellow-300 cursor-not-allowed"
                  : "bg-yellow-500 hover:bg-yellow-600 active:scale-[0.98]"
                }`}
            >
              {submitting ? "Sending..." : "Send Message"}
            </button>

          </form>
        </div>
      </div>
    </section>
  );
}
