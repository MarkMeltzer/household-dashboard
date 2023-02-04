from audioop import cross
#from crypt import methods
from flask import Flask, jsonify, abort, request
from flask_cors import CORS, cross_origin
import json
import time
from datetime import datetime
import uuid
import bcrypt
import logging

SIM_DELAY = 0.3

def load_data():
    with open("./data/db.json", "r") as f:
        return json.load(f)

def save_data(data):
    with open("./data/db.json", "w+") as f:
        json.dump(data, f, indent=4)

def archive_data(data, type=None):
    with open("./data/archive.json", "r+") as f:
        content = json.load(f)
        content["deleted_records"].append(
            {
                "type": type,
                "deleted_date": get_datetime(),
                "record": data
            }
        )

        f.truncate(0)
        f.seek(0)
        json.dump(content, f, indent=4)

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

# get current time in nice format
def get_datetime():
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

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
    return "<h1>Welcome to the backend webapi of my household dashboard application!</h1>\n"

#####
# WeekLists
#####

@app.route("/weekLists", methods=["GET", "POST"])
@cross_origin()
def all_week_lists():
    # authorize client
    if not verify_token(request):
        print("Wrong token.")
        abort(401)

    data = load_data()

    if request.method == "GET":
        print(f"{get_datetime()} -- Retrieving all weekList records...")

        return jsonify(data["weekLists"])
    elif request.method == "POST":
        # add a new weeklist record
        print(f"{get_datetime()} -- Adding new weekList record...")

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

@app.route("/weekLists/<string:arg>", methods=["GET", "PUT", "DELETE"])
@cross_origin()
def specific_week_list(arg):
    # authorize client
    if not verify_token(request):
        print("Wrong token.")
        abort(401)

    data = load_data()

    if request.method == "GET":
        # get existing weeklist record
        print(f"{get_datetime()} -- Retrieving weekList record with id: {arg}...")

        if arg in data["weekLists"]:
            return jsonify(data["weekLists"][arg])
        else:
            abort(404)
    elif request.method == "PUT":
        # change existing weeklist record
        print(f"{get_datetime()} -- Changing existing weeklist record with id: {arg}...")

        if arg not in data["weekLists"]:
            abort(404)

        weekList = data["weekLists"][arg]
        weekList["meals"] = request.json["meals"]
        weekList["shoppingList"] = request.json["shoppingList"]
        
        data["weekLists"][arg] = weekList
        save_data(data)

        return jsonify({"id" : arg})
    elif request.method == "DELETE":
        # delete existing weeklist record
        print(f"{get_datetime()} -- Deleting weeklist record with id: {arg}...")

        if arg not in data["weekLists"]:
            abort(404)

        # archive the data in case of accidental deletion
        weekList = data["weekLists"].pop(arg)
        archive_data({ arg: weekList }, "weekList")
        save_data(data)

        return "", 204
    else:
        print(request.method + " not implemented for this route!")
        abort(404)

@app.route("/weekLists/<string:weekListId>/shoppingList/<string:index>", methods=["GET", "PATCH"])
@cross_origin()
def shoppingListItem(weekListId, index):
    # authorize client
    if not verify_token(request):
        print("Wrong token.")
        abort(401)    

    # load dat and get shoppingList item
    data = load_data()
    shoppingList = data["weekLists"][weekListId]["shoppingList"]
    item = shoppingList[int(index)]

    if request.method == "GET":
        print(f"{get_datetime()} -- Retrieving shoppingList item record: index {index} from weekList {weekListId}...")
        
        return jsonify(item)
    elif request.method == "PATCH":
        print(f"{get_datetime()} -- Patching shoppingList item record: index {index} from weekList {weekListId}...")


        for key in request.json:
            if key not in item:
                abort(400)

            item[key] = request.json[key]

        data["weekLists"][weekListId]["shoppingList"][int(index)] = item
        save_data(data)
        return "", 204

    abort(405)

#####
# Shopping items
#####

@app.route("/shoppingItems", methods=["GET", "POST"])
@cross_origin()
def all_shopping_items():
    # authorize client
    if not verify_token(request):
        print("Wrong token.")
        abort(401)

    # simulate slow network
    # TODO: remove this
    time.sleep(0)

    if request.method == "GET":
        # get all shoppingItem records
        print(f"{get_datetime()} -- Retrieving all shoppingItem records...")

        data = load_data()["shoppingItems"]
        return jsonify(data)
    elif request.method == "POST":
        # add a new shoppingItem record
        print(f"{get_datetime()} -- Adding new shoppingItem record...")

        id = uuid.uuid4().hex
        shoppingItem = request.json
        data = load_data()
        data["shoppingItems"][id] = shoppingItem
        save_data(data)
        return jsonify({"id" : id})
    else:
        print(request.method + " not implemented for this route!")
        abort(404)

@app.route("/shoppingItems/all/onlyNames", methods=["GET"])
@cross_origin()
def all_shopping_items_names():
    # TODO: decide wether this route will be used or not
    # authorize client
    if not verify_token(request):
        print("Wrong token.")
        abort(401)

    print(f"{get_datetime()} -- Retrieving all shoppingItem name records...")
    
    data = load_data()["shoppingItems"]
    return jsonify([data[id]["name"] for id in data])

@app.route("/shoppingItems/<string:id>", methods=["GET", "PUT"])
@cross_origin()
def specific_shopping_item(id):
    # authorize client
    if not verify_token(request):
        print("Wrong token.")
        abort(401)

    if request.method == "GET":
        # get specific shoppingItem record
        print(f"{get_datetime()} -- Retrieving shoppingItem record with id: {id}...")

        data = load_data()
        if id in data["shoppingItems"]:
            return jsonify(data["shoppingItems"][id])
        else:
            # TODO: this check has to be done for either verb, so move it outside
            abort(404)
    elif request.method == "PUT":
        # get specific shoppingItem record
        print(f"{get_datetime()} -- Changing existing shoppingItem record with id: {id}...")

        data = load_data()
        data["shoppingItems"][id] = request.json
        save_data(data)

        return "", 204
    else:
        print(request.method + " not implemented for this route!")
        abort(404)

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