from flask import Blueprint, request, abort, jsonify
import json
import bcrypt
import uuid

# TODO: in future I probably want more user related options, this should be 
# generalised to /users
blueprint = Blueprint('getLoginToken', __name__, url_prefix='/getLoginToken')

@blueprint.route("", methods=["POST"])
def getLoginToken():
    '''
    Endpoint logging in.

    - POST takes username and password from request body, checks them against
    `users.json` and if correct generates token. Finally it saves said token
    to `users.json` and returns it.
    '''

    username = request.json["username"]
    password = request.json["password"]

    # get login data
    with open("./data/users.json", "r") as f:
        users_data = json.load(f)['users']
    
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