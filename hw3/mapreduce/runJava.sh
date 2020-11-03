#!/bin/bash
cd /opt/mapreduce
export HADOOP_CLASSPATH=${JAVA_HOME}/lib/tools.jar
#compile java
hadoop com.sun.tools.javac.Main LogCount.java
jar cf  wc.jar LogCount*.class
#run mapreduce
hadoop fs -rm -r -f /logcount/output
start_time=`date +%s`
hadoop jar wc.jar LogCount /logcount/access_log /logcount/output && echo run time is $(expr `date +%s` - $start_time)s
hdfs dfs -get /logcount/output/part-r-00000 ./java.log
