
from flask import Flask, request, render_template, jsonify, Response
#from flask_classful import FlaskView,route
from flask_cors import CORS
import json
import pprint

from api import MongoAPI

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
def querydata():
    station_id = request.args.get('id')
    #print(station_id)
    #print(type(station_id))
    mongo = MongoAPI(IP="172.18.0.3", DBname="myDB", collection="Youbike")
    data = mongo.queryDBdata(station_id)
    print(data)
    return data



@app.route('/test/<iid>')
def test(iid):
    print(iid)

    return {'Hello': 'World'}

@app.route('/getallChID')
def getallChID():
    mongo = MongoAPI(IP="172.18.0.3", DBname="myDB", collection="Youbike")
    data = mongo.getallChID()
    print(data)
    return data


if __name__ == "__main__":
    app.run(host='0.0.0.0', port = 5000, debug=True)
