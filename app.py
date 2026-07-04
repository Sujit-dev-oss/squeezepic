from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from PIL import Image
import io

app = Flask(__name__)
CORS(app)  # इससे फ्रंटएंड और बैकएंड बिना किसी एरर के बात कर पाएंगे

@app.route('/compress', methods=['POST'])
def compress():
    try:
        file = request.files['image']
        quality = int(request.form.get('quality', 80))
        
        img = Image.open(file.stream)
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
            
        output = io.BytesIO()
        img.save(output, format="JPEG", quality=quality)
        output.seek(0)
        
        return send_file(output, mimetype='image/jpeg', as_attachment=True, download_name='compressed.jpg')
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/convert', methods=['POST'])
def convert():
    try:
        file = request.files['image']
        target_format = request.form.get('format', 'png').lower()
        
        img = Image.open(file.stream)
        output = io.BytesIO()
        
        if target_format == 'png':
            img.save(output, format='PNG')
            mimetype = 'image/png'
            ext = 'png'
        else:
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            img.save(output, format='JPEG')
            mimetype = 'image/jpeg'
            ext = 'jpg'
            
        output.seek(0)
        return send_file(output, mimetype=mimetype, as_attachment=True, download_name=f'converted.{ext}')
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/pdf', methods=['POST'])
def to_pdf():
    try:
        file = request.files['image']
        img = Image.open(file.stream)
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
            
        output = io.BytesIO()
        img.save(output, format='PDF')
        output.seek(0)
        
        return send_file(output, mimetype='application/pdf', as_attachment=True, download_name='document.pdf')
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
