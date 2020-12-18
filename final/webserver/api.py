from pymongo import MongoClient
import logging as log
from bson.json_util import dumps, loads 
from flask import jsonify
import json
import codecs
import sys
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
            cursor = self.doc.find({"chineseId": ID}).sort("time", 1)
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
        return{"chineseID" : chList}
        
        

if __name__ == "__main__":
    api = MongoAPI(IP = "172.19.0.20")
    #data = api.queryDBdata("捷運內湖站(1號出口)")
    data = api.queryDistrict("信義區")
    #data = api.getDBdata()
    print(data)

        