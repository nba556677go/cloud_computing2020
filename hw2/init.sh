sudo apt-get update
sudo apt-get install -y python3-pip docker.io docker-compose
pip3 install pymongo
sudo chmod 777 /var/run/docker.sock
sudo systemctl start docker
sudo systemctl enable docker
docker-compose up --build -d
sleep 10
python3 mongo/insert.py mongo/cut.json
