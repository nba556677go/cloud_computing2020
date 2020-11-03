## build hadoop images
```./build-images.sh```

## start hadoop cluster
need sudo to start docker-compose because volume requires superuser previlege to access 
```sudo docker-compose up --build```
this hadoop cluster includes 1 master and two workers, container names are as follow:  
hdfs-namenode - master  
hdfs-datanode-1 - worker1  
hdfs-datanode-2 - worker2  

## add access_log file into cluster
enter hdfs-namenode container, and add the access_log from /opt/mapreduce
```docker exec -it hdfs-namenode bash```
```hdfs dfs -put /opt/mapreduce/logs/access_log /logcount```

## (a) run mapreduce code in python 
```cd /opt/mapreduce```
```bash runPython.sh```
the output file will be in /logcount/output directory. this script will get output file from hdfs and store in /opt/mapreduce/python.log, so if you want to see the output, just type in
```cat python.log```

## (b) run mapreduce in java
```cd /opt/mapreduce```
```bash runJava.sh```
same as (a), output will store in /logcount/output directory. this script will get output file from hdfs and store in /opt/mapreduce/java.log. See the log with following command
'''cat java.log'''
you can diff both file. Output should be the same
