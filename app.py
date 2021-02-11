import os
from flask import Flask, request, redirect, url_for, send_from_directory, render_template
from keras.preprocessing.image import ImageDataGenerator, load_img, img_to_array
from keras.models import Sequential, load_model
from werkzeug.utils import secure_filename
import numpy as np



ALLOWED_EXTENSIONS = set(['jpg', 'jpeg', 'png'])
IMAGE_SIZE = (224, 224)
UPLOAD_FOLDER = 'uploads'
vgg16 = load_model('model/model_cat_dog.h5')
LABEL = ''
IMG_SOURCE = 'file://null'

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS


def predict(file):
    img  = load_img(file, target_size=IMAGE_SIZE)
    img = img_to_array(img)/255.0
    img = np.expand_dims(img, axis=0)
    probs = vgg16.predict(img)[0]
    output = {'Cat:': probs[0], 'Dog': probs[1]}
    return output

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route("/")
def template_test():
    global LABEL
    global IMG_SOURCE

    return render_template('index.html', label=LABEL, imagesource=IMG_SOURCE)


@app.route('/', methods=['GET', 'POST'])
def upload_file():
    global LABEL
    global IMG_SOURCE
    
    if request.method == 'POST':
        file = request.files['file']
        
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            # output = predict(file_path)
            
            LABEL = "test"
            IMG_SOURCE = file_path
    
    # return render_template("index.html", label=output, imagesource=file_path)
    return redirect(url_for('template_test'))

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'],
                               filename)

if __name__ == "__main__":
    app.run(debug=False, threaded=False)