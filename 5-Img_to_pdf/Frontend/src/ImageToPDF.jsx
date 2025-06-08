import React, { useState, useRef } from "react";

export default function ImageToPDF() {
    const [images, setImages] = useState([]);
    const [layout, setLayout] = useState("vertical");
    const [pdfUrl, setPdfUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [downloaded, setDownloaded] = useState(false);
    const fileInputRef = useRef(null);
    console.log(console.log(import.meta.env.VITE_PYTHON_URL))

    function handleFileChange(e) {
        const files = Array.from(e.target.files);
        const newImages = files.filter(
            (file) =>
                !images.some((img) => img.name === file.name && img.size === file.size)
        );
        setImages((prev) => [...prev, ...newImages]);
        e.target.value = null; // reset input
        setDownloaded(false);  // Reset downloaded state so download enables again
        setPdfUrl(null);
    }


    function removeImage(index) {
        setImages((prev) => prev.filter((_, i) => i !== index));
        setDownloaded(false);
        setPdfUrl(null);
    }

    async function handleConvert() {
        if (images.length === 0) {
            alert("Please select images to convert");
            return;
        }

        setLoading(true);
        setPdfUrl(null);
        setDownloaded(false);

        const formData = new FormData();
        images.forEach((img) => formData.append("images", img));
        formData.append("layout", layout);

        try {
            const res = await fetch(`${import.meta.env.VITE_PYTHON_URL}/convert`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.json();
                alert("Error: " + (errorData.error || "Unknown error"));
                setLoading(false);
                return;
            }

            const data = await res.json();
            const downloadUrl = `${import.meta.env.VITE_PYTHON_URL}` + data.pdf_url;
            setPdfUrl(downloadUrl);
        } catch (err) {
            alert("Request failed: " + err.message);
        }

        setLoading(false);
    }

    // When user clicks download link, mark as downloaded to disable further upload/conversion
    function handleDownload() {
        setDownloaded(true);
    }

    return (
        <div className="container">
            <h2>Image to PDF Converter</h2>

            <label className="file-label">
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={downloaded}
                />
                {images.length === 0 && !downloaded ? (
                    <span className="file-label-text">Choose file</span>
                ) : (
                    <span className="file-label-text">Choose more files</span>
                )}
            </label>


            <div className="file-info">
                {images.length > 0 && (
                    <>
                        <b>Selected Images:</b>
                        <ul className="file-list">
                            {images.map((img, idx) => (
                                <li key={idx} className="file-item">
                                    <span>{img.name}</span>
                                    {!downloaded && (
                                        <button
                                            className="remove-btn"
                                            onClick={() => removeImage(idx)}
                                            title="Remove"
                                        >
                                            &times;
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </>
                )}
                <p className="info-text">Files will be deleted after download.</p>
            </div>

            <div className="layout-options">
                <label>
                    <input
                        type="radio"
                        name="layout"
                        value="vertical"
                        checked={layout === "vertical"}
                        onChange={() => setLayout("vertical")}
                        disabled={downloaded}
                    />
                    Vertical Layout
                </label>
                <label>
                    <input
                        type="radio"
                        name="layout"
                        value="horizontal"
                        checked={layout === "horizontal"}
                        onChange={() => setLayout("horizontal")}
                        disabled={downloaded}
                    />
                    Horizontal Layout
                </label>
            </div>

            {/* // Change the state logic for buttons: */}

            <button
                onClick={handleConvert}
                disabled={loading || images.length === 0}
                className="convert-btn"
            >
                {loading ? "Converting..." : "Convert to PDF"}
            </button>

            {pdfUrl && (
                <div className="download-container">
                    <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        onClick={() => setDownloaded(true)} // disable only download button
                        className={`download-link ${downloaded ? 'disabled' : ''}`}
                        style={{ pointerEvents: downloaded ? 'none' : 'auto', opacity: downloaded ? 0.6 : 1 }}
                    >
                        Download PDF
                    </a>
                </div>
            )}

        </div>
    );
}
