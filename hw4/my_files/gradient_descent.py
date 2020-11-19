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

class myGD:
    def __init__(self, train_data, lr, epoch):
        