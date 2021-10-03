from logging import log
import re
from flask import Flask, jsonify, abort, request
from werkzeug.exceptions import RequestEntityTooLarge
from flask_cors import CORS, cross_origin
import json
import time
import uuid
import bcrypt

SIM_DELAY = 0.0

# load data
def load_data():
    with open("./data/db.json", "r") as f:
        return json.load(f)

# save data
def save_data(data):
    with open("./data/db.json", "w") as f:
        json.dump(data, f, indent=4)

# verify token
def verify_token(request):
    if not "Authorization" in request.headers:
        return False

    token = request.headers["Authorization"].split(" ")[1]

    with open("./data/users.json", "r") as f:
        content = json.load(f)
    
    for user in content:
        if content[user]["login_token"] == token:
            return True
    return False

app = Flask(__name__)
CORS(app)

@app.route("/weekLists", methods=["GET", "POST"])
@cross_origin()
def all_week_lists():
    # authorize client
    if not verify_token(request):
        print("Wrong token.")
        abort(401)

    data = load_data()

    if request.method == "GET":
        return jsonify(data)
    elif request.method == "POST":
        if "id" in request.json:
            # change an existing record (should be moved to a PUT method)
            print("Changing existing record...")

            weekList = data[request.json["id"]]
            weekList["meals"] = request.json["meals"]
            weekList["shoppingItems"] = request.json["shoppingItems"]
            
            data[request.json["id"]] = weekList
            save_data(data)

            return jsonify({"id" : request.json["id"]})
        else:
            # add a new record
            print("Adding new record...")

            weekList = request.json
            now = time.localtime()
            nowStr = time.strftime("%A %e %b %Y - %H:%M", now)
            weekList["creationDate"] = nowStr
            
            id = uuid.uuid4().hex
            data[id] = weekList
            save_data(data)
            
            return jsonify({"id" : id})
    else:
        print(request.method + " not implemented for this route!")
        abort(404)

@app.route("/weekLists/<string:arg>", methods=["GET"])
@cross_origin()
def specific_week_list(arg):
    # authorize client
    if not verify_token(request):
        print("Wrong token.")
        abort(401)

    data = load_data()
    if arg in data:
        return jsonify(data[arg])
    else:
        abort(404)

@app.route("/getLoginToken", methods=["POST"])
@cross_origin()
def getLoginToken():
    username = request.json["username"]
    password = request.json["password"]

    # get login data
    with open("./data/users.json", "r") as f:
        users_data = json.load(f)
    
    if username not in users_data:
        print(f"User {username} not found.")
        abort(401)

    # verify password
    hashed_pw = bcrypt.hashpw(
        password.encode(),
        users_data[username]["salt"].encode()
    )
    if hashed_pw != users_data[username]["pw_hash"].encode():
        print("Wrong password!")
        abort(401)
    
    # generate, save and send login token
    print("Login succesful!")
    token = uuid.uuid4().hex

    users_data[username]["login_token"] = token
    with open("./data/users.json", "w") as f:
        json.dump(users_data, f, indent=4)

    return jsonify({"token" : token})

@app.after_request
def add_header(response):
    # avoid cors errors
    response.headers['Access-Control-Allow-Origin'] = '*'
    
    # simulate a slow network
    time.sleep(SIM_DELAY)

    return response

if __name__ == "__main__":
    app.run()