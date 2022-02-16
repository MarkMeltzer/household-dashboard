# from crypt import methods
from audioop import cross
# from crypt import methods
from flask import Flask, jsonify, abort, request
from flask_cors import CORS, cross_origin
import json
import time
import uuid
import bcrypt
import logging

SIM_DELAY = 0.0

# load data
def load_data():
    with open("./data/db.json", "r") as f:
        return json.load(f)

# save data
def save_data(data):
    with open("./data/db.json", "w+") as f:
        json.dump(data, f, indent=4)

# verify token
def verify_token(request):
    if not "Authorization" in request.headers:
        return False

    token = request.headers["Authorization"].split(" ")[1]

    with open("./data/users.json", "r") as f:
        content = json.load(f)
    
    for user in content:
        if token in content[user]["login_tokens"]:
            return True
    return False

logging.basicConfig(
    level=logging.INFO,
    filename="flask.log",
    format="%(asctime)s %(levelname)s: %(message)s",
    datefmt="%d/%b/%Y %H:%M:%S"
)
app = Flask(__name__)
CORS(app)

@app.route("/", methods=["GET"])
@cross_origin()
def landing_page():
    return "<h1>Welcome to the backend webapi of my househould dashboard application!</h1>"

#####
# WeekLists
#####

@app.route("/weekLists", methods=["GET", "POST"])
@cross_origin()
def all_week_lists():
    # TODO: split this into all weeklist and update week list and new weeklist
    # with routes /weekLists/all (GET), /weekLists/<id> (PUT) and /weekLists/new (POST) respectively

    # authorize client
    if not verify_token(request):
        print("Wrong token.")
        abort(401)

    data = load_data()

    if request.method == "GET":
        return jsonify(data["weekLists"])
    elif request.method == "POST":
        if "id" in request.json:
            # change an existing record (should be moved to a PUT method)
            print("Changing existing record...")

            weekList = data["weekLists"][request.json["id"]]
            weekList["meals"] = request.json["meals"]
            weekList["shoppingList"] = request.json["shoppingList"]
            
            data["weekLists"][request.json["id"]] = weekList
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
            data["weekLists"][id] = weekList
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

    data = load_data()["weekLists"]
    if arg in data:
        return jsonify(data[arg])
    else:
        abort(404)

#####
# Shopping items
#####

@app.route("/shoppingItems/all", methods=["GET"])
@cross_origin()
def all_shopping_items():
    # authorize client
    if not verify_token(request):
        print("Wrong token.")
        abort(401)

    # simulate slow network
    # TODO: remove this
    time.sleep(2)

    data = load_data()["shoppingItems"]
    return jsonify(data)

@app.route("/shoppingItems/all/onlyNames", methods=["GET"])
@cross_origin()
def all_shopping_items_names():
    # authorize client
    if not verify_token(request):
        print("Wrong token.")
        abort(401)
    
    data = load_data()["shoppingItems"]
    return jsonify([data[id]["name"] for id in data])

@app.route("/shoppingItems/<string:id>", methods=["GET"])
@cross_origin()
def specific_shopping_item(id):
    # authorize client
    if not verify_token(request):
        print("Wrong token.")
        abort(401)

    data = load_data()

    if id in data["shoppingItems"]:
        return jsonify(data["shoppingItems"][id])
    else:
        abort(404)

@app.route("/shoppingItems", methods=["POST"])
@cross_origin()
def new_shoppingItem():
    # authorize client
    if not verify_token(request):
        print("Wrong token.")
        abort(401)

    data = load_data()
    
    shoppingItem = request.json
    id = uuid.uuid4().hex
    data["shoppingItems"][id] = shoppingItem
    save_data(data)
    return jsonify({"id" : id})

#####
# Login
#####

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

    users_data[username]["login_tokens"].append(token)
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
    app.run(host="0.0.0.0", port=5000)