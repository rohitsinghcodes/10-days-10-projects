import React, { useState, useRef } from "react";
import axios from "axios";

export default function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [copy, setCopy] = useState("Copy");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null); // For resetting file input

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setImageURL("");
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/upload`, formData);
      setImageURL(res.data.url);
      setFile(null);
      setPreview("");
      setCopy("Copy");
      fileInputRef.current.value = ""; // Reset input
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(imageURL);
    // alert("Image URL copied to clipboard!"); // ✅ Alert
    setCopy("Copied!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-300 via-purple-300 to-red-300 flex items-center justify-center p-6">
      <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-3xl shadow-2xl p-8 max-w-lg w-full">
        <h1 className="text-5xl font-extrabold text-center mb-8 p-4 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-purple-600 tracking-widest shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl">
          Image Uploader  🚀
        </h1>

        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center justify-center border-4 border-dashed border-indigo-400 rounded-xl h-48 mb-6 text-indigo-600 hover:border-indigo-600 transition-colors"
        >
          {!preview ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 4v8m0 0l4-4m-4 4l-4-4"
                />
              </svg>
              <span className="text-lg font-medium">Click to upload an image</span>
              <span className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</span>
            </>
          ) : (
            <img
              src={preview}
              alt="preview"
              className="object-contain h-full rounded-xl"
            />
          )}
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </label>

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className={`w-full py-3 rounded-full text-white font-semibold text-lg transition
            ${file && !loading ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-300 cursor-not-allowed"}
          `}
        >
          {loading ? "Uploading..." : "Upload Image"}
        </button>

        {imageURL && (
          <div className="mt-8 p-4 border border-indigo-300 rounded-lg bg-indigo-50 shadow-inner">
            <label className="block mb-2 font-semibold text-indigo-700 text-lg">
              Image URL:
            </label>
            <div className="flex">
              <input
                type="text"
                readOnly
                value={imageURL}
                className="flex-1 px-4 py-2 rounded-l-lg border border-indigo-400 focus:outline-indigo-500"
              />
              <button
                onClick={copyToClipboard}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 rounded-r-lg font-semibold transition"
              >
                {copy}
              </button>
            </div>
            <img
              src={imageURL}
              alt="Uploaded"
              className="mt-6 w-full rounded-lg shadow-md object-contain max-h-96 mx-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
}
