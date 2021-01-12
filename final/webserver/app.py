
from flask import Flask, request, render_template, jsonify, Response
import threading
#from flask_classful import FlaskView,route
from flask_cors import CORS
import json
import pprint

#import function
from api import MongoAPI

##########################################################################
#mongo inserting thread
MONGOIP = "172.19.0.3"
URL = "https://tcgbusfs.blob.core.windows.net/blobyoubike/YouBikeTP.json"

#maximum records stored in db
MAXFILECNT = 20
########################################################################
app = Flask(__name__)
CORS(app)


@app.route('/')
def my_form():

    #return jsonify(data)
    return 'This is my API server'

# @app.route('/getdata')
# def getdata():
#     mongo = MongoAPI(IP="172.18.0.3", DBname="myDB", collection="Youbike")
#     data = mongo.getDBdata()
#     #text = request.form['text']
#     #api_response = send_lambda_request(text.upper())
#     #result = get_result(api_response)
#     #print("got input text:", processed_text)
#     return Response(data, mimetype="application/json", status=200)

#http://140.112.28.115:5000/getdata?id=龍山國小
@app.route('/getdata')
def getdata():
    station_id = request.args.get('id')
    #print(station_id)
    #print(type(station_id))
    mongo = MongoAPI(IP="mongo", DBname="myDB", collection="Youbike")
    data = mongo.queryDBdata(station_id)
    print(data)
    return data
#http://140.112.28.115:5000/getdistrict?district=信義區
@app.route('/getdistrict')
def getdistrict():
    district = request.args.get('district')
    mongo = MongoAPI(IP="mongo", DBname="myDB", collection="Youbike")
    data = mongo.queryDistrict(district)
    print(data)
    return data  


@app.route('/test/<iid>')
def test(iid):
    print(iid)

    return {'Hello': 'World'}

@app.route('/getallChID')
def getallChID():
    mongo = MongoAPI(IP="mongo", DBname="myDB", collection="Youbike")
    data = mongo.getallChID()
    print(data)
    return data
#http://140.112.28.115:5001/getmapMarkers?latitude=25.021644799999997&&longtitude=121.5463424
@app.route('/getmapMarkers')
def getLatestData():
    latitude = float(request.args.get('latitude', None))
    longtitude = float(request.args.get('longtitude', None))
    #print(latitude, longtitude)
    mongo = MongoAPI(IP="mongo", DBname="myDB", collection="Youbike")
    data = mongo.getLatestData(latitude, longtitude)
    print("return map marker length", len(data['stationName']))

    return data


if __name__ == "__main__":
    #DBinsert = threading.Thread(target=run)
    #DBinsert.start()
    app.run(host='0.0.0.0', port = 5000, debug=True)
