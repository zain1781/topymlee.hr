import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function BackButton({ label = "Back", className = "" }) {
  const navigate = useNavigate();

  return (
    <span
      type="button"
      onClick={() => navigate(-1)}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl 
        bg-gray-100 text-gray-700 text-sm font-medium bttn
        shadow-sm hover:shadow-md hover:bg-gray-200
        active:scale-95 transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-orange-400
        ${className}`}
    >
      <FaArrowLeft className="text-xs" />
      {label}
    </span>
  );
}
