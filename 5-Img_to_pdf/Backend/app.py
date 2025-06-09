import os
import uuid
from io import BytesIO
from flask import Flask, request, send_file, jsonify, Response
from flask_cors import CORS
from PIL import Image
from reportlab.lib.pagesizes import A4, landscape, portrait
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from reportlab.lib import colors

app = Flask(__name__)
CORS(app)

# Folder to store PDFs temporarily
UPLOAD_FOLDER = 'static'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Optional: Clear old PDFs on startup
def clear_old_pdfs():
    for filename in os.listdir(UPLOAD_FOLDER):
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        if os.path.isfile(file_path):
            try:
                os.remove(file_path)
                print(f"Deleted old file on startup: {filename}")
            except Exception as e:
                print(f"Error deleting {filename} on startup: {e}")

clear_old_pdfs()

def create_pdf_with_layout(images, layout='vertical'):
    buffer = BytesIO()

    if layout == 'horizontal':
        page_size = landscape(A4)
    else:
        page_size = portrait(A4)

    c = canvas.Canvas(buffer, pagesize=page_size)
    width, height = page_size
    margin = 40

    for img in images:
        # Fill background white
        c.setFillColor(colors.white)
        c.rect(0, 0, width, height, fill=1)

        # Calculate available width and height minus margins
        max_width = width - 2 * margin
        max_height = height - 2 * margin

        # Maintain aspect ratio
        img_width, img_height = img.size
        aspect = img_width / img_height

        if layout == 'horizontal':
            # Image height fits page height minus margins
            display_height = max_height
            display_width = display_height * aspect
            # If width too large, scale down
            if display_width > max_width:
                display_width = max_width
                display_height = display_width / aspect
            # Center image horizontally and vertically
            x = (width - display_width) / 2
            y = (height - display_height) / 2
        else:
            # vertical layout: Image width fits page width minus margins
            display_width = max_width
            display_height = display_width / aspect
            # If height too large, scale down
            if display_height > max_height:
                display_height = max_height
                display_width = display_height * aspect
            # Center image horizontally and vertically
            x = (width - display_width) / 2
            y = (height - display_height) / 2

        img_reader = ImageReader(img)
        c.drawImage(img_reader, x, y, width=display_width, height=display_height)

        c.showPage()

    c.save()
    buffer.seek(0)
    return buffer

@app.route('/', methods=['GET'])
def home():
    return "Image to PDF Converter Backend is running."

@app.route('/convert', methods=['POST'])
def convert_to_pdf():
    if 'images' not in request.files:
        return jsonify({'error': 'No images part in the request'}), 400

    images = request.files.getlist('images')
    image_list = []

    for img_file in images:
        if img_file and img_file.filename:
            try:
                img = Image.open(img_file)
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                image_list.append(img)
            except Exception as e:
                return jsonify({'error': f"Invalid image uploaded: {str(e)}"}), 400

    if not image_list:
        return jsonify({'error': 'No valid images uploaded'}), 400

    layout = request.form.get('layout', 'vertical').lower()
    if layout not in ['vertical', 'horizontal']:
        layout = 'vertical'

    pdf_buffer = create_pdf_with_layout(image_list, layout)

    pdf_filename = f"{uuid.uuid4().hex}.pdf"
    pdf_path = os.path.join(app.config['UPLOAD_FOLDER'], pdf_filename)

    with open(pdf_path, 'wb') as f:
        f.write(pdf_buffer.read())

    return jsonify({'pdf_url': f"/download/{pdf_filename}"}), 200

@app.route('/download/<filename>', methods=['GET'])
def download_pdf(filename):
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)

    if not os.path.exists(filepath):
        return jsonify({'error': 'File not found'}), 404

    def generate():
        with open(filepath, 'rb') as f:
            while True:
                chunk = f.read(8192)
                if not chunk:
                    break
                yield chunk
        try:
            os.remove(filepath)
            print(f"Deleted file after download: {filename}")
        except Exception as e:
            print(f"Error deleting file: {e}")

    response = Response(generate(), mimetype='application/pdf')
    response.headers['Content-Disposition'] = f'attachment; filename={filename}'
    return response

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get("PORT", 5000)))
