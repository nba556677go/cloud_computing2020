import os, sys
from pymongo import MongoClient

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
print("start dropping...")
dbnames = client.list_database_names()
if "myDB" in dbnames:
    client.drop_database("myDB")
    print("drop db successful!!")
