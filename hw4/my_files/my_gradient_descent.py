# Add Spark Python Files to Python Path
from __future__ import print_function
import sys, math
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
from pyspark.sql import SparkSession
#global
D = 5

class myGD:
    def __init__(self, train_data, SPARK = True):
        #print(train_data)
        self.spark = SPARK
        
        if self.spark:
            #extract from scratch
            if isinstance(train_data, str):
                def getSparkContext():
                    conf = (SparkConf()
                        .setMaster("local") # run on local
                        .setAppName("Logistic Regression") # Name of App
                        .set("spark.executor.memory", "1g")) # Set 1 gig of memory
                    sc = SparkContext(conf = conf) 
                    return sc

                try:
                    self.sc = getSparkContext()
                    
                except Exception as error:
                    print("Sparkcontext error:", str(error))
                    sys.exit()

                self.train_spark = self.feature_extraction(train_data)
            else:#load from serialized data  
                self.train_spark = train_data
            
        else:    #not spark
            self.train_x, self.train_y = self.feature_extraction(train_data)
    @staticmethod
    def sigmoid(z):
        res = 1 / (1.0 + np.exp(-z))
        return np.clip(res, 1e-8, 1-(1e-8))
    

        
    def feature_extraction(self, train_data):
    #if self.spark:
        """
        data = sc.textFile(train_data) 
        def mapper(line):
        
            feats = line.strip().split(",") 
            # labels must be at the beginning for LRSGD, it's in the end in our data, so 
            # putting it in the right place
            label = feats[len(feats) - 1] 
            feats = feats[: len(feats) - 1]
            feats.insert(0,label)
            #insert bias = 1
            feats.insert(1, 1)
            features = [ float(feature) for feature in feats ] # need floats
            return LabeledPoint(label, features)
        
        parsedData = data.map(mapper)
        #for x in parsedData.collect():
        #    print(x)

        return parsedData
        """
        features, labels = [], []
        
            #feature = train_x, labels = train_y(ans)
        with open(os.path.join(".",train_data)) as f:
            for line in f.readlines():
                row = line.strip().split(",")
                label =  float(row[len(row) - 1])
                labels.append(label)
                #put label as first feature
                row = row[:len(row) - 1]
                feats = [float(i) for i in row]
                #print(feats)
                feats.insert(0, label)
                features.append(feats)
        features = np.array(features)

        labels = np.array(labels)
        #add bias
        #features = np.concatenate( (np.ones((features.shape[0] , 1)) , features), axis = 1)
        print(features.shape)
        self.feature_size = features.shape[1]
        #print(labels.shape)
        print(features[0])
            #print(labels[0])
        

        if self.spark:
            #create feature RDD
            features = self.sc.parallelize(features)
            #print(features.count())
                        
            #labels = self.sc.parallelize(labels)
            a = np.array(features.collect())
            print(a.shape)
            #b = np.array(labels.collect())
            #print(b)
            #input()


            return features

        return features, labels


        
        
    def train(self, l_rate = 0.1, iteration = 2, regularize = 0.0):
        #init para
        iteration = int(iteration)
        if self.spark:
            #get feature size
            print("shape", np.array(self.train_spark.collect()).shape)
            self.feature_size = np.array(self.train_spark.collect()).shape[2]
            #input()

            self._lambdda = regularize
            w = np.zeros(self.feature_size - 1)# - label
            for i in range(1, iteration + 1):
                w = self.train_spark.map(lambda _data: myGD.Sparkstep(_data, w, l_rate)).reduce(myGD.add)
                #Sparkstep()
                if (i % 20 == 0):
                    #err = self.train_spark.map(lambda d: self.Sparkpredict(d, w)).reduce(myGD.add)
                    err = self.Sparkpredict(w)
                    print('[iteration {:5d}] - training loss: {:.5f}, error_rate: {:.18f}'.format(i, self._loss, err))
            #final prediction
            print("final prediction...")
            #np.save("logistic"+str(iteration)+"-regularize-"+str(self._lambdda)+".npy" , self._w)
            err = self.Sparkpredict(w)
            print('[iteration {:5d}] - training loss: {:.5f}, error_rate: {:.18f}'.format(iteration, self._loss, err))                 
            print("final w:", w)
        else:
            # init para
            self._lambdda = regularize
            self.l_rate = l_rate
            self._w = np.zeros(self.train_x.shape[1])
            self._sgrad = np.zeros(self.train_x.shape[1])
            #training
            for i in range(1, iteration + 1):
                self.step(self.train_x , self.train_y)
                if (i % 20 == 0):
                    err = self.predict(self.train_x , self.train_y)
                    print('[iteration {:5d}] - training loss: {:.5f}, error_rate: {:.18f}'.format(i, self._loss, err))
            #final prediction
            print("final prediction...")
            #np.save("logistic"+str(iteration)+"-regularize-"+str(self._lambdda)+".npy" , self._w)
            err = self.predict(self.train_x , self.train_y)
            print('[iteration {:5d}] - training loss: {:.5f}, error_rate: {:.18f}'.format(iteration, self._loss, err))            
    
    
    def step(self , x , y):
        func = self.sigmoid(np.dot(x , self._w))
        self.update(x , y , func)
    
    def update(self ,x , y , func):
        grad = -np.dot(x.transpose(), (y - func)) 
        #print("hypo :" , hypo.shape)
        #print("w:", self._w)
        #print("gradient:", grad)
        self._sgrad += grad**2
        ada = np.sqrt(self._sgrad)
        self._w = self._w - self.l_rate * grad / ada
        
    def cross_entropy(self , x , y , func):
        regular = np.sum(self._w**2)
        return -np.mean(y * np.log(func + 1e-20) + (1 - y) * np.log(1 - func + 1e-20))+ np.mean(self._lambdda*0.5*regular)
    
    def Spark_cross_entropy(self , x , y, w , func):
        regular = np.sum(w**2)
        return -np.mean(y * np.log(func + 1e-20) + (1 - y) * np.log(1 - func + 1e-20))

    def predict(self , x , y):
        
        self._loss = self.cross_entropy(x , y , self.sigmoid(np.dot(x , self._w)))
        pred = self.sigmoid(np.dot(x , self._w))
        p = pred
        p[pred < 0.5] = 0.0
        p[pred >= 0.5] = 1.0
        return np.mean(np.abs(y - p))    

    @staticmethod
    def Sparkstep(data, w, l_rate):
        #print("insparkstep", data.shape)
        #print("datashape", data.shape)
        x = data[:, 1:] 
        y = data[:, 0]
        #print("x", x)
        #print("w", w)
        func = myGD.sigmoid(np.dot(x , w))
        grad = -np.dot(x.transpose(), (y - func))
        w = w - l_rate*grad
        #print("w after update:", w)
        return w

    @staticmethod
    def add(x, y):
        x += y
        return x

    def Sparkpredict(self, w):
        
        data = np.array(self.train_spark.collect())
        x = data[0, :, 1:] 
        y = data[0, :, 0]
         
        #res = 1 / (1.0 + np.exp(-np.dot(x , w)))
        #func = np.clip(res, 1e-8, 1-(1e-8))
        self._loss = self.Spark_cross_entropy(x ,y , w , self.sigmoid(np.dot(x , w)))
        pred = self.sigmoid(np.dot(x , w))
        p = pred
        p[pred < 0.5] = 0.0
        p[pred >= 0.5] = 1.0
        return np.mean(np.abs(y - p))    

def readPointBatch(iterator):
        strs = list(iterator)
        matrix = np.zeros((len(strs), D + 1))
        for i, s in enumerate(strs):
            matrix[i] = np.fromstring(s.replace(',', ' '), dtype=np.float32, sep=' ')
        return [matrix]

def read_norm_feature(train_data):

    spark = SparkSession\
        .builder\
        .appName("PythonLR")\
        .getOrCreate()

    points = spark.read.text(train_data).rdd.map(lambda r: r[0])\
    .mapPartitions(readPointBatch).cache()
    
    return points

def preprocess(textfile, outfile = "processed.txt"):
    features, labels = [], []
    
        #feature = train_x, labels = train_y(ans)
    with open(os.path.join(".",textfile)) as f:
        for line in f.readlines():
            row = line.strip().split(",")
            label =  row[len(row) - 1]
            labels.append(label)
            #put label as first feature
            feats = row[:len(row) - 1]
            feats = [float(i) for i in feats]
            #print(feats)
            #feats.insert(0, label)
            features.append(feats)
    assert(len(features) == len(labels))
    #normalization
    features = np.array(features)
    mean = np.mean(features, axis = 0)
    std = np.std(features, axis = 0)
    #print(mean)
    #print(std)
    for i in range(features.shape[0]):
        for j in range(features.shape[1]):
            if not std[j] == 0 :
                features[i][j] = (features[i][j]- mean[j]) / std[j]

    with open(outfile, 'w') as f:
        for i in range(features.shape[0]):
            f.write(labels[i])
            for j in range(features.shape[1]):
                f.write(','+ str(features[i][j]))
            #add bias
            f.write(",1")
            if i != features.shape[0] - 1:
                f.write("\n")
    return outfile

def main():
    processed_file = preprocess(sys.argv[1])
    data = read_norm_feature(processed_file)
    #gd = myGD(train_data = sys.argv[1], SPARK = True) 
    gd = myGD(train_data = data, SPARK = True) 
    gd.train(iteration = sys.argv[2])
    

if __name__ == "__main__":
    main()
    
