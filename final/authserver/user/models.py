from flask import Flask, jsonify, request, session, redirect
from passlib.hash import pbkdf2_sha256
from app import db
import uuid

class User:

    def start_session(self, user):
        del user['password'] # delete the password of this user before we start a session
        session['logged_in'] = True
        session['user'] = user
        return jsonify(user), 200

    def signup(self):
        print(request.form)
        
        # Create te user object
        user = {
            "_id": uuid.uuid4().hex,
            "name": request.form.get('name'),
            "location": request.form.get('location'),
            "email": request.form.get('email'),
            "password": request.form.get('password')
        }

        # Encrypt the password
        user['password'] = pbkdf2_sha256.encrypt(user['password'])

        # Check for existing email address
        if db.users.find_one({"email" : user['email']}):
            # it will return the error JSON string with error code 400
           return jsonify({"error": "Email address already in use"}), 400

        # db.users is a branch in current db, change the name if you wnat to add one branch
        # e.g., db.users, db.users2, etc
        # if it inserts successfully, it returns the successful code
        if db.users.insert_one(user):
            return self.start_session(user) # since start_session will return error message
            # return jsonify(user), 200
 
        # otherwise, return the error string and error code
        return jsonify({"error": "Signup failed"}), 400

    def signout(self):
        session.clear() # clear the all information in session, so the logged_in state will disapear
        return redirect('/')

    def login(self):
        user = db.users.find_one({
            "email" : request.form.get('email')
        })
        
        if user:
            return self.start_session(user)
        
        return jsonify({"error" : "Invalid login credentials"}), 401

    def login_frontend(self):
        user = db.users.find_one({
            "email" : request.form.get('email')
        })
        
        if user:
            return self.start_session(user)
        
        return jsonify({"error" : "Invalid login frontend credentials"}), 402