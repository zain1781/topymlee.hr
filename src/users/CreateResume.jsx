import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import Loader from "../tools/loader";
import { notifyError } from "../utils/toastify";


export default function CVForm() {
  const [loading, setLoading] = useState(false);



  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    title: "",
    location: "",
    phone: "",
    email: "",
    github: "",
    linkedin: "",
    summary: "",
    experience: "",
    projects: "",
    technicalSkills: "",
    softSkills: "",
    hobbies: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


const generatePDF = () => {
  if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.location || !form.title|| !form.summary||  !form.experience|| !form.technicalSkills|| !form.softSkills || !form.hobbies) {
    notifyError("Please fill in all required fields (First Name, Last Name, Email, Phone).");
    return;
  }

  const doc = new jsPDF({ unit: "pt", format: "a4" });

  // ===== STYLES =====
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Sidebar width
  const sidebarWidth = 160;
  let y = 60;

  // ===== SIDEBAR BACKGROUND =====
  doc.setFillColor(240, 240, 240); // light gray
  doc.rect(0, 0, sidebarWidth, pageHeight, "F");

  // ===== NAME & TITLE =====
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(30, 30, 30);
  doc.text(`${form.firstName} ${form.lastName}`, sidebarWidth + 30, 60);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(form.title || "Full Stack Developer & AI Engineer", sidebarWidth + 30, 80);

  // ===== CONTACT INFO IN SIDEBAR =====
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);

  let sidebarY = 120;
  const addContact = (label, value) => {
    if (value) {
      doc.text(`${label}:`, 20, sidebarY);
      doc.setFont("helvetica", "bold");
      doc.text(value, 60, sidebarY);
      doc.setFont("helvetica", "normal");
      sidebarY += 20;
    }
  };

  addContact("Location", form.location);
  addContact("Phone", form.phone);
  addContact("Email", form.email);
  addContact("Github", form.github);
  addContact("Linkedin", form.linkedin);

  // ===== HELPER FUNCTION FOR MAIN CONTENT =====
  const addSection = (title, content, isList = false) => {
    if (!content) return;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(30, 30, 30);
    doc.text(title.toUpperCase(), sidebarWidth + 30, y);
    y += 6;

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.7);
    doc.line(sidebarWidth + 30, y, pageWidth - 40, y);
    y += 16;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(70, 70, 70);

    const items = isList ? content.split("\n") : [content];
    items.forEach((item) => {
      const lines = doc.splitTextToSize("• " + item.trim(), pageWidth - sidebarWidth - 70);
      doc.text(lines, sidebarWidth + 50, y);
      y += lines.length * 14;
    });

    y += 18;
  };

  // ===== MAIN CONTENT SECTIONS =====
  y = 140; // reset Y for right column
  addSection("Summary", form.summary);
  addSection("Experience", form.experience, true);
  addSection("Projects", form.projects, true);
  addSection("Technical Skills", form.technicalSkills, true);
  addSection("Soft Skills", form.softSkills, true);
  addSection("Hobbies", form.hobbies, true);

  // ===== FOOTER =====
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text("CV generated with Topymlee", sidebarWidth + 30, pageHeight - 40);

  doc.save("cv.pdf");
  setForm({
    firstName: "",
    lastName: "",
    title: "",
    location: "",
    phone: "",

    email: "",
    github: "",
    linkedin: "",
    summary: "",
    experience: "",
    projects: "",
    technicalSkills: "",
    softSkills: "",
    hobbies: "",
  })
};



 
if (loading) {
    return <Loader />;
  }


  return (
<div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">
  <div className="bg-white shadow-2xl p-10 rounded-2xl w-full max-w-3xl">
    <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-8">
      Resume Form
    </h2>

    <div className="grid gap-5">
      {/* Personal Info */}
      <div className="grid grid-cols-2 gap-4">
        <input
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          required
          maxLength={20}
        />
        <input
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          required
          maxLength={20}
        />
      </div>

      <input
        name="title"
        placeholder="Title (e.g. Full Stack Developer)"
        value={form.title}
        onChange={handleChange}
        className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        required
        maxLength={40}
      />
      <input
        name="location"
        placeholder="Location (e.g. Lahore, Pakistan)"
        value={form.location}
        onChange={handleChange}
        className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        required
        maxLength={40}
      />
      <input
        name="phone"
        placeholder="Phone"
        value={form.phone}
        onChange={handleChange}
        className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        required
        maxLength={15}
      />
      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        required
        maxLength={50}
      />
      <input
        name="github"
        placeholder="GitHub URL"
        value={form.github}
        onChange={handleChange}
        className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        maxLength={60}
      />
      <input
        name="linkedin"
        placeholder="LinkedIn URL"
        value={form.linkedin}
        onChange={handleChange}
        className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        maxLength={60}
      />

      {/* Textareas */}
      <textarea
        name="summary"
        placeholder="Summary"
        value={form.summary}
        onChange={handleChange}
        rows="3"
        className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        maxLength={300}
      />
      <textarea
        name="experience"
        placeholder="Experience"
        value={form.experience}
        onChange={handleChange}
        rows="3"
        className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        maxLength={400}
      />
      <textarea
        name="projects"
        placeholder="Projects"
        value={form.projects}
        onChange={handleChange}
        rows="3"
        className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        maxLength={400}
      />
      <textarea
        name="technicalSkills"
        placeholder="Technical Skills"
        value={form.technicalSkills}
        onChange={handleChange}
        rows="3"
        className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        maxLength={250}
      />
      <textarea
        name="softSkills"
        placeholder="Soft Skills"
        value={form.softSkills}
        onChange={handleChange}
        rows="2"
        className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        maxLength={200}
      />
      <textarea
        name="hobbies"
        placeholder="Hobbies"
        value={form.hobbies}
        onChange={handleChange}
        rows="2"
        className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        maxLength={150}
      />

      {/* Button */}
   <button
  onClick={() => {
    setLoading(true);   // show loader
    setTimeout(() => {
      generatePDF();    // generate after delay
      setLoading(false); // hide loader
    }, 1000);
  }}
  className="bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
>
  Generate Resume
</button>

    </div>
  </div>
</div>

  );
}
