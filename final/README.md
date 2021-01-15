## IMPORTANT: api URL in frontend/src/containers/myDBselect.js, frontend/src/containers/maps/Mymap.js is set to current server location. It means that if you want to start service on localhost, please replace staic IP with localhost in these file!!!

## If you don't have docker installed, checkout init.sh for instructions

## start backend
```docker-compose up --build``` 

## start frontend
```
cd frontend
npm install
npm start
http://localhost:3000
```
## See mongoDB webUI(mongo express)
```http://localhost:8081``` 

## See frontend
```http://localhost:3000```

## See Nginx
```
http://localhost:8800
```

