import { useState } from 'react';
import axios from 'axios';
import './index.css';

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [docxBlobUrl, setDocxBlobUrl] = useState(null);
  console.log(import.meta.env.VITE_API_URL)
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setDocxBlobUrl(null);
  };

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
    </div>
  );
}

export default App;
