from flask import Flask, request, send_file
from PIL import Image
import io
from flask_cors import CORS


app = Flask(__name__)
CORS(app)  # ✅ This allows requests from any frontend


def compress_and_resize_image(img, target_kb):
    target_bytes = target_kb * 1024
    quality = 95
    min_quality = 10
    resize_factor = 0.9  # Reduce dimensions by 10% each time
    output = io.BytesIO()

    # Ensure compatibility with JPEG
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")

    while True:
        temp_output = io.BytesIO()
        img.save(temp_output, format='JPEG', quality=quality)
        size = temp_output.tell()

        if size <= target_bytes:
            output = temp_output
            break

        # Reduce quality until min
        if quality > min_quality:
            quality -= 5
        else:
            # Resize image if quality already too low
            width, height = img.size
            if width < 300 or height < 300:
                # Too small, stop
                output = temp_output
                break

            new_width = int(width * resize_factor)
            new_height = int(height * resize_factor)
            img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)

    output.seek(0)
    return output

@app.route('/reduce', methods=['POST'])
def reduce_image():
    if 'image' not in request.files:
        return {"error": "No image provided"}, 400
    
    file = request.files['image']
    try:
        target_kb = int(request.form.get('target_kb', 100))
    except ValueError:
        return {"error": "Invalid target_kb value"}, 400

    img = Image.open(file.stream)
    output = compress_and_resize_image(img, target_kb)

    return send_file(
        output,
        mimetype='image/jpeg',
        as_attachment=True,
        download_name='reduced.jpg'
    )

if __name__ == '__main__':
    app.run(debug=True)
