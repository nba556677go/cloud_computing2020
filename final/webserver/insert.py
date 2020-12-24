from datetime import datetime
from time import sleep
import urllib.request, json 
from pymongo import MongoClient

MONGOIP = "172.19.0.20"
URL = "https://tcgbusfs.blob.core.windows.net/blobyoubike/YouBikeTP.json"

#maximum records stored in db
MAXFILECNT = 7

def insert(fileID):
    try:
        client = MongoClient(MONGOIP, username='root', password='root', authSource='admin', authMechanism='SCRAM-SHA-1')
    except:
        print("connection error!")
        exit()

    db = client["myDB"]
    collection_Youbike = db['Youbike']

    
    #fileID = find_max_fileID()
    #fileID += 1
    print(f"assign current fileID = {fileID}...")
    # if fileID exceeds 20, delete old ones!
  
    print(f"inserting data #{fileID}...")
    with urllib.request.urlopen(URL) as url:
        data = json.loads(url.read().decode())
        
        for k,v in data["retVal"].items():
            data = {
                "time" : v["mday"] ,
                "fileID" : fileID,
                "stationID" : v["sno"],
                "chineseId" : v["sna"],
                "totalBike" : int(v["tot"]),
                "availBike" : int(v["sbi"]),
                "district" : v["sarea"]
            }
            #j_data = json.dumps(data)
            collection_Youbike.insert_one(data)
    print(f"finish #{fileID} insertion!")


        
def find_max_fileID():
    try:
        client = MongoClient(MONGOIP,
                            username='root',
                            password='root',
                            authSource='admin',
                            authMechanism='SCRAM-SHA-1')
    except:
        print("connection error!")
        exit()    
    db = client["myDB"]
    collection_Youbike = db['Youbike']

    pipeline = [
        {"$group": { "_id": "$stationID", "fileID": { "$max":"$fileID" }}}
       
    ]
    #cursor = collection_Youbike.find({"fileID": ID})
    cursor = list(collection_Youbike.aggregate(pipeline))
    #for i in cursor:
    #    print(i)
    #print(cursor)
    if len(cursor) == 0:# init DB
        print("initDB")
        fileID = 1
    else:
        fileID = cursor[0]["fileID"]
        fileID += 1
    #print(len(cursor))
    #print(fileID) 
    return fileID   

def delete(maxfileNum):
    client = MongoClient(MONGOIP, username='root', password='root', authSource='admin', authMechanism='SCRAM-SHA-1')
    db = client["myDB"]
    collection_Youbike = db['Youbike']

    #find how many files in file len, then delete the first len(files) - maxfilenum
    pipeline = [
        {"$group": { "_id": "$fileID"}},
        {"$sort": {"_id": 1}} 
    ]
    cursor = list(collection_Youbike.aggregate(pipeline))
    if (len(cursor) == 1 and cursor[0]['_id'] == 'None') : 
        return
    if len(cursor) < maxfileNum:
        print(f"less than {maxfileNum}, 0 documents deleted")
        return 
    delete_fileIDs = [i["_id"] for i in cursor[: (len(cursor) - maxfileNum)]]
    #print(delete_fileIDs)

    deletecnt = 0
    for deleteID in delete_fileIDs:
        deletequery =  {"fileID": deleteID}
        try:
            result = collection_Youbike.delete_many(deletequery)
            deletecnt += result.deleted_count
            #print(result.deleted_count, "documents deleted")
        except Exception as error:
            print(error)
            exit()
    print(deletecnt, "documents deleted")


def dropDB():
    try:
        client = MongoClient(MONGOIP,
                        username='root',
                        password='root',
                        authSource='admin',
                        authMechanism='SCRAM-SHA-1')
    except:
        print("connection error!")
        exit()
    print("start dropping...")
    dbnames = client.list_database_names()
    if "myDB" in dbnames:
        client.drop_database("myDB")
        print("drop db successful!!")

#thread for counting time
def run(fileID):
    #fileID = 1
    #while datetime.now().minute not in {0, 15, 30, 45}:  # Wait 1 second until we are synced up with the 'every 15 minutes' clock
    #    sleep(1)

    def task(fileID):
        # Your task goes here
        # Functionised because we need to call it twice
        insert(fileID)
        delete(MAXFILECNT)
    #print(datetime.now())
    #task(fileID)
    #fileID += 1

    while True:
        print(datetime.now())
        task(fileID)
        fileID += 1
        sleep(60)  # Wait for 1 minute
        
        
    
if __name__ == "__main__":
    #dropDB()
    fileID= find_max_fileID()
    run(fileID)
   #insert(2)
   #delete(2)
   
    
