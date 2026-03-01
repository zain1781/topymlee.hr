import React, { useEffect, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/webpack";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import Loader from "../tools/loader";

const API_URL = import.meta.env.VITE_API_SUMMERIZED;

export default function SummarizedResume() {
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [previewURL, setPreviewURL] = useState(null);
  const [activeSummary, setActiveSummary] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  /* ---------------- FILE HANDLING ---------------- */
  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
    setSummaries([]);
    setActiveSummary("");
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setSummaries((prev) => prev.filter((_, i) => i !== index));
  };

  /* ---------------- PDF VIEWER ---------------- */
  const openPDF = (file) => {
    setPreviewURL(URL.createObjectURL(file));
    setActiveSummary("");
  };

  /* ---------------- EXTRACT TEXT ---------------- */
  const extractTextFromPDF = async (file) => {
    const data = new Uint8Array(await file.arrayBuffer());
    const pdf = await pdfjsLib.getDocument({ data }).promise;
    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item) => item.str).join(" ") + " ";
    }

    return text.replace(/\s+/g, " ").trim();
  };

  /* ---------------- SUMMARIZE ---------------- */
  const summarizeFile = async (file, index) => {
    const text = await extractTextFromPDF(file);

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();

    setSummaries((prev) => {
      const updated = [...prev];
      updated[index] = data.summary;
      return updated;
    });

    setActiveSummary(data.summary);
    setPreviewURL(null);
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">
          Resume Summarization
        </h1>
        <p className="text-sm text-gray-500">
          Upload resumes and generate AI-powered summaries instantly
        </p>
      </div>

      {/* Upload Card */}
      <div className="bg-white border rounded-xl shadow-sm p-6 mb-8">
        <label className="block text-sm font-medium mb-2">Upload PDF</label>
        <div className="relative border-2 border-dashed rounded-lg p-8 text-center hover:border-orange-400 transition cursor-pointer">
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <FontAwesomeIcon
            icon={faFilePdf}
            className="text-4xl text-gray-400 mb-2"
          />
          <p className="text-gray-600 text-sm">
            Click to upload PDF resumes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Files Table */}
        <div className="md:col-span-2 bg-white border rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">File</th>
                <th className="px-4 py-3 text-center">View</th>
                <th className="px-4 py-3 text-center">Remove</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {files.length ? (
                files.map((file, index) => (
                  <tr
                    key={index}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-medium">
                      {file.name}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        onClick={() => openPDF(file)}
                        className="p-2 bttn rounded-md bg-green-100 text-green-700 hover:bg-green-200"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        onClick={() => removeFile(index)}
                        className="p-2 bttn rounded-md bg-red-100 text-red-700 hover:bg-red-200"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        onClick={() => summarizeFile(file, index)}
                        className="px-4 bttn py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600"
                      >
                        Summarize
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="py-10 text-center text-gray-400"
                  >
                    No files uploaded
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Preview / Summary */}
        <div className="bg-white border rounded-xl shadow-sm p-5">
          {previewURL ? (
            <>
              <h3 className="font-semibold mb-3">PDF Preview</h3>
              <iframe
                src={previewURL}
                className="w-full h-80 border rounded"
              />
            </>
          ) : activeSummary ? (
            <>
              <h3 className="font-semibold mb-3">AI Summary</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {activeSummary}
              </p>
            </>
          ) : (
            <p className="text-gray-400 text-sm">
              Select a file to preview or summarize
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
