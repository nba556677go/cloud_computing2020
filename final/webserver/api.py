from pymongo import MongoClient
import logging as log
from bson.json_util import dumps, loads 
from flask import jsonify
import json
import codecs
import sys
import math
import geopy.distance

class MongoAPI:
    def __init__(self, IP, USER='root', PASSWORD='root', DBname = "myDB", collection = "Youbike"):
        log.basicConfig(level=log.DEBUG, format='%(asctime)s %(levelname)s:\n%(message)s\n')
        # self.client = MongoClient("mongodb://localhost:27017/")  # When only Mongo DB is running on Docker.
        try: 
            self.client = MongoClient(IP,
                        username=USER,
                        password=PASSWORD,
                        authSource='admin',
                        authMechanism='SCRAM-SHA-1')     # When both Mongo and This application is running on
                                                                    # Docker and we are using Docker Compose
        
        except Exception as error:
            print(error)
            sys.exit()
        
        self.doc = self.client[DBname][collection]

    def getDBdata(self, DBname = "myDB", collection = "Youbike"):
        try:
            #db = self.client[DBname]
            #self.doc = db[collection]
            cursor = self.doc.find({})
        except Exception as error:
            print(error)
            sys.exit()
        self.data = []
        for d in cursor:
            self.data.append(d)
        #print(len(self.data))
        return self.data

    def queryDBdata(self, ID):
        try:
            #db = self.client[DBname]
            #self.doc = db[collection]
            cursor = list(self.doc.find({"chineseId": ID}).sort("time", 1))
            #list_cursor =  list(cursor)
        except Exception as error:
            print(error)
            sys.exit()
        #response schema
        response = {"stationID" : "",
                    "chineseID" : "", 
                    "time": [],  
                    "totalBike" :"", 
                    "availBike" : [],
                    "district" : ""
                    }
        #output every 15 minutes
        print("record counts", len(cursor))
        print(cursor[-1])
        if len(cursor) < 15:
            for entry in cursor:
                response["stationID"] = entry["stationID"]
                response["chineseID"] = entry["chineseId"]
                #response["time"].append(entry["time"][:4]+'/'+entry["time"][4:6]+'/'+entry["time"][6:8]+"-"+entry["time"][8:10]+":"+entry["time"][10:12])
                response["totalBike"] = entry["totalBike"]
                #response["availBike"].append(entry["availBike"])
                response["availBike"].append({"time" : int(entry["time"]), 
                                                "availBike" : int(entry["availBike"])})
                response["district"] = entry["district"]
            #response["availBike"] = sorted(response["availBike"], key = lambda k : k["time"])
            response["time"] = [str(i["time"])[:4]+'/'+str(i["time"])[4:6]+'/'+str(i["time"])[6:8]+"-"+str(i["time"])[8:10]+":"+str(i["time"])[10:12] 
                                for i in response["availBike"]]
        else :
            for entry in range(0, len(cursor), 15):
                response["stationID"] = cursor[entry]["stationID"]
                response["chineseID"] = cursor[entry]["chineseId"]
                #response["time"].append(entry["time"][:4]+'/'+entry["time"][4:6]+'/'+entry["time"][6:8]+"-"+entry["time"][8:10]+":"+entry["time"][10:12])
                response["totalBike"] = cursor[entry]["totalBike"]
                #response["availBike"].append(entry["availBike"])
                response["availBike"].append({"time" : int(cursor[entry]["time"]), 
                                                "availBike" : int(cursor[entry]["availBike"])})
                response["district"] = cursor[entry]["district"]
            #response["availBike"] = sorted(response["availBike"], key = lambda k : k["time"])
            response["time"] = [str(i["time"])[:4]+'/'+str(i["time"])[4:6]+'/'+str(i["time"])[6:8]+"-"+str(i["time"])[8:10]+":"+str(i["time"])[10:12] 
                                for i in response["availBike"]]            
        
        #print(response)
        #encode chinese
        #encoded_data = codecs.encode(list_cursor)
        #json_data = json.dumps(response)
       # json_data = dumps(list_cursor)
        #print(len(self.data))
        return response
    def queryDistrict(self, dist):
        try:
            pipeline = [
                {"$match" :  { "district": dist}},
                {"$sort" : {"time" : -1 }},
                #{"$match" :  { "time": { "$max":"$time" }}}
                {"$group": {  "_id": "$chineseId",
                 "time": { "$first":"$time" }, "availBike": { "$first":"$availBike" } }},
                {"$sort" : {"availBike" : -1 }}
            ]

            cursor = list(self.doc.aggregate(pipeline))
            #list_cursor =  list(cursor)
        except Exception as error:
            print(error)
            sys.exit()

        response = {
            "stationID" : [], 
            "time": [],  
            #"totalBike" : 0, 
            "availBike" : []
        }
        #print(len(cursor))
        for entry in cursor[:10]:
            response["stationID"].append(entry["_id"])
            response["time"].append(entry["time"][:4]+'/'+ entry["time"][4:6]+'/'+entry["time"][6:8]+"-"+entry["time"][8:10]+":"+entry["time"][10:12])
            response["availBike"].append(entry["availBike"])

        return response
    def getallChID(self):
        try:
            cursor = self.doc.find({})
        except Exception as error:
            print(error)
            sys.exit()
        chList = []
        for entry in cursor:
            chList.append(entry["chineseId"])
        chList = list(set(chList))
        print(len(chList))
        return{"chineseID" : chList}

    # for map - get latest data
    def getLatestData(self, latitude, longtitude):
        def getNearStations(stationList, latitude, longtitude):
            #loc[latitude]
            distanceList = []
            for i, station in enumerate(stationList):
                #d = math.sqrt((station["lat"] - latitude)** 2 + (station["lng"] - longtitude) ** 2)
                d = geopy.distance.distance((station["lat"], station["lng"]), (latitude, longtitude)).km*1000
                #print(d)
                distanceList.append((i, d))
            distanceList = sorted(distanceList, key=lambda tup: tup[1])[:10]
            #print(distanceList)
            response ={
                "stationID" : [],
                "stationName" : [], 
                #"time": [],  
                "totalBike" : [], 
                "availBike" : [],
                "latitude" :[],
                "longtitude" : [],
                "near" : [],#{}
                "MaxDistance": distanceList[9][1]
            }   
            distanceDict = dict(distanceList)
            #print(distanceDict)
            #add near flag in each data
            for idx in range(len(stationList)):
                response["stationID"].append(int(stationList[idx]["stationID"]))
                response["stationName"].append(stationList[idx]["chineseId"])
                #response["time"].append(stationList[idx]["time"])
                response["totalBike"].append(stationList[idx]["totalBike"])
                response["availBike"].append(stationList[idx]["availBike"])
                response["latitude"].append(stationList[idx]["lat"])
                response["longtitude"].append(stationList[idx]["lng"])
                if idx in [t[0] for t in distanceList]:
                    #stationList[idx]["near"] = 1
                    response["near"].append({"near": 1, "distance": distanceDict[idx]})
                    print("near station", response["stationName"][idx])
                    #print(stationList[idx])
                else :
                    response["near"].append({"near": 0, "distance": -1})
            #print(response)
            return response
        try:
            stationNum = 400
            cursor = list(self.doc.find().sort("fileID", -1).limit(stationNum))
            near_station_tagged = getNearStations(cursor, latitude, longtitude)
            #list_cursor =  list(cursor)
        except Exception as error:
            print(error)
            sys.exit()
        
        return near_station_tagged
        

if __name__ == "__main__":
    api = MongoAPI(IP = "172.19.0.20")
    #data = api.queryDBdata("捷運內湖站(1號出口)")
    #data = api.queryDistrict("信義區")
    #data = api.getDBdata()
    #data = api.getallChID()
    data = api.getLatestData(25.021644799999997, 121.5463424)
    #print(data)

        