"use client";
import { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";

export default function ProjectFiles({ projectId }) {
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // 🧩 Fetch existing files
  useEffect(() => {
    const fetchFiles = async () => {
      const res = await fetch(`/api/project-files?projectId=${projectId}`);
      const data = await res.json();
      setUploadedFiles(data);
    };
    fetchFiles();
  }, [projectId]);

  // 📁 Handle file selection
  const handleFileUpload = (e) => {
    setFiles(Array.from(e.target.files));
  };

  // ❌ Remove file before upload
  const removeFile = (file) => {
    setFiles(files.filter((f) => f.name !== file.name));
  };

  // 🚀 Upload files
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("projectId", projectId);
    files.forEach((file) => formData.append("files", file));

    const res = await fetch("/api/project-files", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    if (res.ok) {
      alert("Files uploaded successfully!");
      setFiles([]);
      setUploadedFiles((prev) => [...prev, ...data.files]);
    } else {
      alert(data.error || "Upload failed");
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white dark:bg-gray-800">
      <h2 className="text-lg font-semibold">📁 Project Files</h2>

      {/* Selected Files */}
      <div className="space-y-2">
        {files.map((file, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded"
          >
            {file.name}
            <button onClick={() => removeFile(file)} className="text-red-500">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Upload Button */}
      <label className="flex items-center gap-2 cursor-pointer px-3 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700">
        <Upload size={16} />
        Upload File
        <input
          type="file"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>

      {files.length > 0 && (
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Upload Selected Files
        </button>
      )}

      {/* Uploaded Files */}
      <div className="mt-6">
        <h3 className="font-medium mb-2">📄 Uploaded Files</h3>
        <div className="space-y-2">
          {uploadedFiles.map((file, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded"
            >
              <a
                href={file.url}
                target="_blank"
                className="text-blue-600 underline"
              >
                {file.name}
              </a>
              <span className="text-sm text-gray-500">
                {new Date(file.uploadedAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
