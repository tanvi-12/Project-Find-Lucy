import os
from flask import Flask, request, redirect, url_for, send_from_directory, render_template
import json
from flask import jsonify
from flask import Response,json
# from flask_cors import CORS, cross_origin
#from pymongo import MongoClient
from flask_pymongo import PyMongo
from keras.preprocessing.image import ImageDataGenerator, load_img, img_to_array
from tensorflow.keras.preprocessing import image
from keras.models import Sequential, load_model
from werkzeug.utils import secure_filename
from tensorflow.keras.models import Sequential
import numpy as np
from keras.models import load_model
from cv2 import cv2

app = Flask(__name__)

#################################################
# Database Setup / flask_pymongo
#################################################
dbname = 'Final_project'
# client = MongoClient(f"mongodb+srv://TanZee:MonashBootcamp@cluster0.at4ok.mongodb.net/{dbname}?retryWrites=true&w=majority")
# lucy_db = client.get_database('Final_project')
# prediction_collection = lucy_db.predictions.find({},{'_id': False})
# prediction_collection = mongo.db.mars_collection.find_one()

mongo = PyMongo(app, uri=f"mongodb+srv://TanZee:MonashBootcamp@cluster0.at4ok.mongodb.net/{dbname}?retryWrites=true&w=majority")
prediction_collection = mongo.db.predictions


############################################33

ALLOWED_EXTENSIONS = set(['jpg', 'jpeg', 'png'])
IMAGE_SIZE = (224, 224)
UPLOAD_FOLDER = 'uploads'
#vgg16 = load_model('model/model_cat_dog.h5')
LABEL = ''
IMG_SOURCE = "/static/img/funny.gif"

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS
  

def predict(file):
   
    model = load_model('model/model_cat_dog.h5')
    model.compile(loss='binary_crossentropy',
                optimizer='rmsprop',
                metrics=['accuracy'])
    #Load image
    img = cv2.imread(file)
    img = cv2.resize(img,(224, 224))
    img = np.reshape(img,[1,224, 224,3])

    #Predict if it cat or dog
    classes = model.predict_classes(img)
    if classes[0] == 0:
        class_ ="Cat"
    elif classes[0] == 1:
        class_ ="Dog"
    
    #Percentage
    img = image.load_img(file)
    img_sm = image.load_img(file,target_size=(224,224))
    img_arr = image.img_to_array(img_sm)
    img_arr = img_arr.reshape((1,224,224,3))
    cat_score,dog_score = model.predict(img_arr).reshape((2,))
    
    output = class_, "Cat : " + str(round(cat_score*100,2))+"%", "Dog : " + str(round(dog_score*100,2))+"%"
    output2 = {"class": class_, "Cat" : (round(cat_score*100,2)), "Dog": round(dog_score*100,2)}
    
    # prediction_collection.insert_many(output)
    prediction_collection.insert(output2)
    
    # print("*******************************************************************")
    # print(output)
    # print("*******************************************************************")

    return output


app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

#################################################
# Flask Routes
#################################################

@app.route("/")
def template_test():
    
    global LABEL
    global IMG_SOURCE

    return render_template('index.html', label=LABEL, imagesource=IMG_SOURCE)

@app.route("/about")
def about_funct():

    return render_template('about.html')

@app.route("/log")
def log_funct():

    return render_template('log.html')

@app.route("/model")
def model_funct():

    return render_template('model.html')


@app.route("/predictions", methods=['GET'])
def get_predictions():
    
    destination_data = mongo.db.predictions.find()
    
    data = []
    for dictionary in destination_data:   
        
        new = {}
        new["class_item"] = dictionary["class"]
        new["dog"] = dictionary["Dog"]
        new["cat"] = dictionary["Cat"] 
        
        data.append(new)
    
    # return jsonify(data)
    return json.dumps(data)

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
            output = predict(file_path)
            
            LABEL = output
            IMG_SOURCE = file_path
    
    # return render_template("index.html", label=output, imagesource=file_path)
    return redirect(url_for('template_test'))
    #return redirect('/')

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    
    return send_from_directory(app.config['UPLOAD_FOLDER'],
                               filename)



if __name__ == "__main__":
    app.run(debug=False, threaded=False)