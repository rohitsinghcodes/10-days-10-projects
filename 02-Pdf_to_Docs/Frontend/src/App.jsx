import { useState } from 'react';
import axios from 'axios';
import './index.css';
import { useEffect } from 'react';



function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [docxBlobUrl, setDocxBlobUrl] = useState(null);
  console.log(import.meta.env.VITE_API_URL)
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setDocxBlobUrl(null);
  };

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, []);

  const handleUpload = async () => {
    if (!file) return alert('📂 Please select a PDF file.');

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/convert`, formData, {
        responseType: 'blob',
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      const url = URL.createObjectURL(blob);
      setDocxBlobUrl(url);
    } catch (err) {
      console.error(err);
      alert('❌ Conversion failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>📄 PDF ➡️ DOCX Converter</h1>
      <p className="subtitle">Quickly convert your PDF files to editable Word documents.</p>

      <div className="card">
        {/* Hidden file input */}
        <input
          id="file-upload"
          className="file-input"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />
        {/* Styled label */}
        <label htmlFor="file-upload">
          {file ? `📄 Selected: ${file.name}` : '📂 Choose PDF file'}
        </label>

        <button className="convert-btn" onClick={handleUpload} disabled={loading}>
          {loading ? '🔄 Converting...' : '⚡ Convert Now'}
        </button>

        {docxBlobUrl && (
          <a href={docxBlobUrl} download="converted.docx" className="download-btn">
            ⬇️ Download DOCX
          </a>
        )}

      </div>
      <footer className="bottom-right-footer">
        <p>
          Made by{" "}
          <a
            href="https://rohitsinghcodes-portfolio.onrender.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Rohit Singh
          </a>
        </p>
        <div className="social-icons">
          <a href="https://github.com/rohitsinghcodes" target="_blank" aria-label="GitHub">
            <i data-lucide="github"></i>
          </a>
          <a href="https://linkedin.com/in/rohitsinghcodes" target="_blank" aria-label="LinkedIn">
            <i data-lucide="linkedin"></i>
          </a>
          <a href="https://x.com/rohitsinghcodes" target="_blank" aria-label="X/Twitter">
            <i data-lucide="twitter"></i>
          </a>
          <a href="https://instagram.com/rohitsinghcodes" target="_blank" aria-label="Instagram">
            <i data-lucide="instagram"></i>
          </a>
          <a
            href="https://facebook.com/rohitsinghcodes"
            target="_blank"
            rel="noopener noreferrer"
            title="Facebook"
            className="hover:scale-110 transition-transform"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <rect width="24" height="24" rx="6" fill="#ffffff" />
              <path
                fill="#000000"
                d="M15.117 8.042h-1.451c-.29 0-.462.232-.462.54v1.379h1.896l-.251 1.935h-1.645V18h-2.033v-6.104H9.739v-1.935h1.432v-1.43c0-1.31.72-2.104 2.416-2.104h1.53v1.615z"
              />
            </svg>
          </a>

        </div>
      </footer>

    </div>
  );
}

export default App;
