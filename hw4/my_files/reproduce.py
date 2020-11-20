# Add Spark Python Files to Python Path
import sys
import os
SPARK_HOME = "/opt/bitnami/spark" # Set this to wherever you have compiled Spark
os.environ["SPARK_HOME"] = SPARK_HOME # Add Spark path
#os.environ["SPARK_LOCAL_IP"] = "spark-master" # Set Local IP
sys.path.append( SPARK_HOME + "/python") # Add python executable files to Python Path
MASTER_URL = "spark://spark-master:7077"
from pyspark.mllib.classification import LogisticRegressionWithSGD
from pyspark.mllib.regression import LabeledPoint
import numpy as np
from pyspark import SparkConf, SparkContext

def getSparkContext():
    """
    Gets the Spark Context
    """
    conf = (SparkConf()
         .setMaster("local") # run on master/local
         .setAppName("Logistic Regression") # Name of App
         .set("spark.executor.memory", "1g")) # Set 1 gig of memory
    sc = SparkContext(conf = conf) 
    return sc

try:
    sc = getSparkContext()
except Exception as error:
    print("Sparkcontext error:", str(error))
    sys.exit()
# Load and parse the data
data = sc.textFile(os.path.join("file://",SPARK_HOME, "my_files/data_banknote_authentication.txt"))
#print(data)
def mapper(line):
    """
    Mapper that converts an input line to a feature vector
    """    
    feats = line.strip().split(",") 
    # labels must be at the beginning for LRSGD, it's in the end in our data, so 
    # putting it in the right place
    label = feats[len(feats) - 1] 
    feats = feats[: len(feats) - 1]
    feats.insert(0,label)
    features = [ float(feature) for feature in feats ] # need floats
    return LabeledPoint(label, features)

parsedData = data.map(mapper)

# Train model
model = LogisticRegressionWithSGD.train(parsedData)

# Predict the first elem will be actual data and the second 
# item will be the prediction of the model
labelsAndPreds = parsedData.map(lambda point: (int(point.label), 
        model.predict(point.features)))
       
# Evaluating the model on training data
#test = []
#for x in labelsAndPreds.collect():
#    test.append(x)
#print(len(test))
#print(len([i for i in test if i[0]!= i[1]]))
trainErr = (labelsAndPreds.filter(lambda kv: kv[0] != kv[1]).count() )/ (float(parsedData.count()))
# Print some stuff
print("Training Error = " + str(trainErr))