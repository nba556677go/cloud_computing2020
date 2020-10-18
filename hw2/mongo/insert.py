from pymongo import MongoClient
import json
import os, sys


try:
    client = MongoClient('172.18.0.3',
                        username='root',
                        password='root',
                        authSource='admin',
                        authMechanism='SCRAM-SHA-1')
except:
    print("connection error!")
    exit()

dbnames = client.list_database_names()
if "country" in dbnames:
    client.drop_database("country")

db = client["country"]
collection_country = db['country_info']

with open(os.path.join('.', sys.argv[1])) as f:
    file_data = json.load(f)


result = collection_country.insert_many(file_data)


print("dbnames: ", client.list_database_names())
#print("ids: ",  result.inserted_ids)
print("insert data successful!")
client.close()
