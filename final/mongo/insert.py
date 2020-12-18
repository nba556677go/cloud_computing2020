from pymongo import MongoClient
import json
import os, sys

#https://tcgbusfs.blob.core.windows.net/blobyoubike/YouBikeTP.json
try:
    client = MongoClient('172.19.0.3',
                        username='root',
                        password='root',
                        authSource='admin',
                        authMechanism='SCRAM-SHA-1')
except:
    print("connection error!")
    exit()
print("start insertion...")
dbnames = client.list_database_names()
if "myDB" in dbnames:
    client.drop_database("myDB")

db = client["myDB"]
collection_Youbike = db['Youbike']
#argv1: folder
files  = os.listdir(sys.argv[1])

for i in files:
    with open(os.path.join('.', sys.argv[1], i)) as f:
        file_data = json.load(f)
        for k,v in file_data["retVal"].items():
            data = {
                "time" : v["mday"] ,
                "stationID" : v["sno"],
                "chineseId" : v["sna"],
                "totalBike" : v["tot"],
                "availBike" : v["sbi"]
            }
            #j_data = json.dumps(data)
            collection_Youbike.insert_one(data)
        
        


#result = collection_Youbike.insert_one(file_data)


print("dbnames: ", client.list_database_names())
#print("ids: ",  result.inserted_ids)
print("insert data successful!")
client.close()
