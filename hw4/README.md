## start sparkcluster 
```docker-compose up```  
this spark cluster includes 1 master and two workers
## init  
```
docker exec -it spark-master bash  
bash my_files/init.sh 
```
## reproduce results
```
docker exec -it spark-master bash  
cd my_files  
python reproduce.py data_banknote_authentication.txt
```

## my gradient descend
python my_gradient_descent.py [input data] [iteration]  
```
docker exec -it spark-master bash  
cd my_files  
python my_gradient_descent.py data_banknote_authentication.txt 100
```
 
