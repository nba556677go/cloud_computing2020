from flask import Flask, render_template, session, redirect
from functools import wraps
import pymongo
app = Flask(__name__)
app.secret_key = b'Y\xf3\xee\x8fKm\xbc\xfb\xd8\xf8\xb4Uik\xa7\xc6'

# Database
client = pymongo.MongoClient('mongo',
                        username='root',
                        password='root',
                        authSource='admin',
                        authMechanism='SCRAM-SHA-1')
db = client.my_test_db2 # modify the client end and it adds new database right away

# Routes, to let the app.py know the routes.py
from user import routes


def login_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if 'logged_in' in session:
            return f(*args, **kwargs)
        else:
            return redirect('/')
    return wrap

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/dashboard/')
@login_required
def dashboard():
    return render_template('dashboard.html')

if __name__ == "__main__":
    #DBinsert = threading.Thread(target=run)
    #DBinsert.start()
    app.run(host='0.0.0.0', port = 5000, debug=True)

