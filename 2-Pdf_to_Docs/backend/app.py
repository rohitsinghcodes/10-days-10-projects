from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from pdf2docx import Converter
import os
import uuid

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Make sure temp directory exists
TEMP_DIR = "./temp_files"
os.makedirs(TEMP_DIR, exist_ok=True)

@app.route('/')
def home():
    return '✅ PDF to DOCX converter backend is running!'

@app.route('/convert', methods=['POST'])
def convert_pdf_to_docx():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Generate unique filenames
    pdf_id = str(uuid.uuid4())
    pdf_path = os.path.join(TEMP_DIR, f"{pdf_id}.pdf")
    docx_path = os.path.join(TEMP_DIR, f"{pdf_id}.docx")

    # Save PDF
    file.save(pdf_path)

    try:
        # Convert PDF to DOCX
        cv = Converter(pdf_path)
        cv.convert(docx_path, start=0, end=None)
        cv.close()

        # Send DOCX file back to client
        return send_file(docx_path, as_attachment=True, download_name='converted.docx')
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        # Clean up temp files
        try:
            if os.path.exists(pdf_path):
                os.remove(pdf_path)
            if os.path.exists(docx_path):
                os.remove(docx_path)
        except Exception as cleanup_error:
            print(f"Cleanup error: {cleanup_error}")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
