#!/bin/bash

start_time=`date +%s`
cat /opt/mapreduce/access_log | python2 /opt/mapreduce/mapper.py | sort | python2 /opt/mapreduce/reducer.py && echo run time is $(expr `date +%s` - $start_time)s
