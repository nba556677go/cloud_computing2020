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



countrydb = client["country"]['country_info']

print(countrydb.find_one({"city" : "HAMPDEN"}))