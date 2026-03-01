import React, { useEffect, useState } from "react";
import Loader from "../tools/loader";
import { notifyError, notifySuccess } from "../utils/toastify";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const api = import.meta.env.VITE_API_URL;

  /* ---------------- FETCH MESSAGES ---------------- */
  const fetchMessages = async () => {
    try {
      const res = await fetch(`${api}messages`);
      if (!res.ok) throw new Error("Failed to fetch messages");
      const result = await res.json();
      setMessages(result);
    } catch (err) {
      notifyError("Unable to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  /* ---------------- OPEN MESSAGE ---------------- */
  const handleOpen = (msg) => {
    notifySuccess(`Message from ${msg.name}`);
    alert(
      `From: ${msg.name} <${msg.email}>\n\nMessage:\n${msg.message}`
    );
  };

  /* ---------------- DELETE MESSAGE ---------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message permanently?")) return;

    try {
      const res = await fetch(`${api}messages/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      setMessages((prev) => prev.filter((m) => m._id !== id));
      notifySuccess("Message deleted");
    } catch {
      notifyError("Failed to delete message");
    }
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Inbox Messages
        </h1>
        <p className="text-sm text-gray-500">
          View and manage contact messages
        </p>
      </div>

      {/* Card */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        {messages.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            No messages found
          </div>
        ) : (
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Sender</th>
                <th className="px-6 py-3">Message</th>
                <th className="px-6 py-3">Received</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {messages.map((msg, index) => (
                <tr
                  key={msg._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium">
                    {index + 1}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-orange-600 text-white flex items-center justify-center font-semibold">
                        {msg.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="font-medium">{msg.name}</p>
                        <p className="text-xs text-gray-500">
                          {msg.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 max-w-sm">
                    <p className="font-medium text-gray-800 line-clamp-1">
                      {msg.message}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {msg.message}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-gray-500">
                    {new Date(msg.createdAt).toLocaleString()}
                  </td>

                  <td className="px-6 py-4 text-right space-x-2">
                    <span
                      onClick={() => handleOpen(msg)}
                      className="bttn px-3 py-1.5 text-sm rounded-md border hover:bg-gray-100"
                    >
                      Open
                    </span>
                    <span
                      onClick={() => handleDelete(msg._id)}
                      className="bttn px-3 py-1.5 text-sm rounded-md text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 text-sm text-gray-600">
          Showing {messages.length} message
          {messages.length !== 1 && "s"}
        </div>
      </div>
    </div>
  );
}
