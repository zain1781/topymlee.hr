import React, { useState } from 'react';

import * as pdfjsLib from 'pdfjs-dist/webpack';
import { faEye, faTrash, faCheck,faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { notifyError, notifySuccess } from "../utils/toastify"
import { useEffect } from 'react';
import Loader from "../tools/loader"
import { jwtDecode } from 'jwt-decode';
const url = import.meta.env.VITE_API_RESUME;
export default function ResumeAnalysis() {
  const api = import.meta.env.VITE_API_URL;
  const [loadings, setLoadings] = useState(true);
  useEffect(()=>{
        window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setLoadings(false);
    }, 300);
    return () => clearTimeout(timer); // cleanup
  },
  []);

  const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login';
    }
    const user = jwtDecode(token);
    if (user.role !== 'admin' && user.role !== 'superadmin') {
        window.location.href = '/login';
    }
 
    const qty = user?.qty;
    const usercompany = user?.company
   
    console.log('User CV Quantity:', qty);
    const FileViewer = ({ fileURL, onClose }) => {
        if (!fileURL) return null;
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-4 rounded-lg shadow-lg w-3/4 h-3/4 relative">
                    <span className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-md btnn" onClick={onClose}>Close</span>
                    <iframe id='files' src={fileURL} className="w-full h-full border border-gray-300" />
                </div>
            </div>
        );
    };

    const [files, setFiles] = useState([]);
    const [summaries, setSummaries] = useState([]);
    const [loading, setLoading] = useState({});
    const [summaryResults, setSummaryResults] = useState({});
    const [fileURL, setFileURL] = useState(null);
    const [selectedSummary, setSelectedSummary] = useState('');
    const [emails, setEmails] = useState([]);
    const [datafile, setDatafile] = useState(
      {}
    );

const handleFileChange = (e) => {
  const newFiles = [...e.target.files];
  
  if (newFiles.length === 0) {
    notifyError('No files selected for summarization');
    return;
  }
  if (newFiles.length > qty) {
    notifyError(`You can upload up to ${qty} files only`);
    return;
  }

  setFiles(newFiles);
};

    const handleRemoveFile = (index) => {
        const updatedFiles = [...files];
        updatedFiles.splice(index, 1);
        setFiles(updatedFiles);

        setSummaries(prevSummaries => prevSummaries.filter((_, i) => i !== index));
        setLoading(prevLoading => {
            const newLoading = { ...prevLoading };
            delete newLoading[index];
            return newLoading;
        });
        setSummaryResults(prevResults => {
            const newResults = { ...prevResults };
            delete newResults[index];
            return newResults;
        });
    };

    const stopwords = ['a', 'an', 'the', 'and', 'or', 'but', 'so', 'if', 'when', 'at', 'by', 'for', 'in', 'of', 'on', 'to', 'with'];

    function removeStopwords(text) {
        return text
            .split(' ')
            .filter(word => !stopwords.includes(word.toLowerCase()))
            .join(' ');
    }

    function limitWords(text, wordLimit) {
        return text.split(' ').slice(0, wordLimit).join(' ') + '...';
    }

    function summarizeText(text, wordLimit) {
        const cleanedText = removeStopwords(text);
        return limitWords(cleanedText, wordLimit);
    }

    const extractTextFromPDF = async (file) => {
        const data = new Uint8Array(await file.arrayBuffer());
        const pdf = await pdfjsLib.getDocument({ data }).promise;
        let extractedText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const strings = content.items.map(item => item.str);
            extractedText += strings.join(' ') + ' ';
        }

        const summarizedText = summarizeText(extractedText, 140);
        return summarizedText;
    };

    const openPDF = (file) => {
        const url = URL.createObjectURL(file);
        setFileURL(url);
    };

    const handleScore = async (index) => {
        setLoading(prevLoading => ({ ...prevLoading, [index]: true }));

        const summaryText = summaries[index];

        try {
            const response = await fetch(`${url}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    summary: summaryText,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setSummaryResults(prevResults => ({
                ...prevResults,
                [index]: { category: data.predicted_category, accuracy: data.accuracy * 100 },
            }));
        } catch (error) {
            console.error('Error:', error);
            setSummaryResults(prevResults => ({
                ...prevResults,
                [index]: { category: 'Error fetching data', accuracy: 0 },
            }));
        } finally {
            setLoading(prevLoading => ({ ...prevLoading, [index]: false }));
        }
    };
const extractEmails = (textArray) => {
  const regex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emails = [];

  textArray.forEach(text => {
    if (typeof text === "string") {
      const matches = text.match(regex);
      if (matches) emails.push(...matches);
    }
  });

  return emails;
};


// Example usage

// Output: ["support@topymlee.com", "hello@coderills.com"]

    const summarizeAllFiles = async () => {
     
        setLoading({});
        
     



        const summariesPromises = files.map((file, index) => extractTextFromPDF(file).then(summary => ({
            index,
            summary
        })));

        try {
            const summariesArray = await Promise.all(summariesPromises);
            const newSummaries = [];
            summariesArray.forEach(({ index, summary }) => {
                newSummaries[index] = summary;
            });

            
   
            
           if (newSummaries.length > 0) {
                setSummaries(newSummaries);
                console.log('Summaries:', newSummaries);
                   const resumeTexts = newSummaries;

const emails = extractEmails(resumeTexts);
                setEmails(emails);
                console.log('Extracted Emails:', emails);
                notifySuccess('All resumes summarized successfully');
            }
            if (newSummaries.length === 0) {
                notifyError('No resumes to summarize');
            }
        } catch (error) {
            console.error('Error summarizing files:', error);
            notifyError('Error summarizing files');
        } 
   

        useEffect(()=>{
          scoreAllFiles();
          
          

        }
      ,[])


    };

    const scoreAllFiles = async () => {



       for (const [index] of summaries.entries()) {
            handleScore(index);
        }
    };

    const summaryCounts = Object.values(summaryResults).reduce((counts, result) => {
        const category = result.category || 'Unknown';
        counts[category] = (counts[category] || 0) + 1;
        return counts;
    }, {});

    const filteredFiles = selectedSummary 
        ? files.filter((_, index) => summaryResults[index]?.category === selectedSummary)
        : files;

    const sortedFiles = [...filteredFiles].sort((a, b) => {
        const indexA = files.indexOf(a);
        const indexB = files.indexOf(b);
        const accuracyA = summaryResults[indexA]?.accuracy || 0;
        const accuracyB = summaryResults[indexB]?.accuracy || 0;
        return accuracyB - accuracyA;
    });





const submiteemail = async () => {
  
  
  
  try {
    if (!Object.keys(datafile).length) {
      alert("Please select at least one status");
      return;
    }

    const response = await fetch(`${api}send/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datafile),
    });

    if (!response.ok) throw new Error("Failed to send data");

    notifySuccess("Email + Status sent successfully");

    // ✅ just reload with timeout
    setTimeout(() => {
      window.location.reload();
    }, 1000);

  } catch (error) {
    console.error("Error sending email+status:", error);
    notifyError("Failed to send email+status");
  }
};




 
return (
  <>
    {loadings ? (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    ) : (
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* HEADER */}
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                Resume Analysis & Ranking
              </h1>
              <p className="text-sm text-gray-500">
                Upload resumes, classify candidates, and manage hiring decisions
              </p>
            </div>
            <span className="text-sm bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
              Upload Limit: {qty}
            </span>
          </div>

          {/* FILTER + UPLOAD */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* FILTER */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Filter by Category
              </label>
              <select
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400"
                onChange={(e) => setSelectedSummary(e.target.value)}
              >
                <option value="">All Categories</option>
                {Object.keys(summaryCounts).map((item, i) => (
                  <option key={i} value={item}>
                    {item} ({summaryCounts[item]})
                  </option>
                ))}
              </select>
            </div>

            {/* UPLOAD */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <label className="text-sm font-medium text-gray-700 block mb-3">
                Upload Resumes (PDF)
              </label>
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-orange-400 transition"
              >
                <FontAwesomeIcon
                  icon={faCloudUploadAlt}
                  className="text-4xl text-orange-500 mb-3"
                />
                <p className="text-sm text-gray-600">
                  Click to upload 
                </p>
              </label>
              <input
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* ACTION span */}
          <div className="flex justify-end">
            <span
              onClick={summarizeAllFiles}
              className=" bttn px-6 py-3 bg-orange-500 text-white font-medium rounded-lg shadow hover:bg-orange-600 transition"
            >
              Summarize All Resumes
            </span>
          </div>
            <div className="flex justify-end">
            <span
              onClick={scoreAllFiles}
              className="bttn px-6 py-3 bg-green-500 text-white font-medium rounded-lg shadow hover:bg-green-600 transition"
            >
              Score All Resumes
            </span>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
            {sortedFiles.length > 0 ? (
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="p-4 text-left">#</th>
                    <th className="p-4 text-left">File</th>
                    <th className="p-4">View</th>
                    <th className="p-4">Delete</th>
                    <th className="p-4 text-left">Result</th>
                    <th className="p-4 text-left">Email</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Select</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedFiles.map((file, index) => {
                    const i = files.indexOf(file);
                    return (
                      <tr
                        key={index}
                        className="border-t hover:bg-orange-50 transition"
                      >
                        <td className="p-4">{index + 1}</td>
                        <td className="p-4 font-medium">{file.name}</td>

                        <td className="p-4 text-center">
                          <span
                            onClick={() => openPDF(file)}
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </span>
                        </td>

                        <td className="p-4 text-center">
                          <span
                            onClick={() => handleRemoveFile(i)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </span>
                        </td>

                        <td className="p-4">
                          {summaryResults[i]?.category ? (
                            <div>
                              <span className="font-medium">
                                {summaryResults[i].category}
                              </span>
                              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                {summaryResults[i]?.accuracy?.toFixed(1)}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400">Pending</span>
                          )}
                        </td>

                        <td className="p-4 text-orange-600">
                          {emails[i] || "Not found"}
                        </td>

                        <td className="p-4 text-center">
                          {loading[i] ? (
                            <span className="text-orange-500 text-xs">
                              Processing...
                            </span>
                          ) : (
                            <span className="text-green-600 text-xs">Done</span>
                          )}
                        </td>

                        <td className="p-4 text-center">
                          <select
                            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400"
                            defaultValue=""
                            onChange={(e) =>
                              setDatafile((prev) => ({
                                ...prev,
                                [i]: {
                                  email: emails[i],
                                  status: e.target.value,
                                  company: usercompany,
                                },
                              }))
                            }
                          >
                            <option value="" disabled>
                              Select
                            </option>
                            <option value="interview">Interview</option>
                            <option value="maybe">Maybe</option>
                            <option value="reject">Reject</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p className="p-6 text-center text-gray-400">
                No resumes uploaded
              </p>
            )}
          </div>

          {/* SEND span */}
          {Object.keys(datafile).length > 0 && (
            <div className="fixed bottom-6 right-6">
              <span
                onClick={submiteemail}
                className="bg-orange-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-orange-600 transition"
              >
                Send Selected Results
              </span>
            </div>
          )}

          {fileURL && (
            <FileViewer fileURL={fileURL} onClose={() => setFileURL(null)} />
          )}
        </div>
      </div>
    )}
  </>
);
}