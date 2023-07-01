from flask import Blueprint, request, abort, jsonify
from utils import verify_token, get_datetime, load_data, save_data
import time
import uuid

blueprint = Blueprint('shoppingItems', __name__, url_prefix='/shoppingItems')

@blueprint.route("", methods=["GET", "POST"])
def all_shopping_items():
    '''
    Endpoint for all shoppingItems.

    - GET returns list of all shoppingItems
    - POST creates new shoppingItem from data in request body
    '''

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

@blueprint.route("/all/onlyNames", methods=["GET"])
def all_shopping_items_names():
    '''
    Endpoint for the names of all shoppingItems.

    - GET returns list of the names of all shoppingItems
    '''

    # TODO: decide wether this route will be used or not, if so make it use query filters
    # authorize client
    if not verify_token(request):
        print("Wrong token.")
        abort(401)

    print(f"{get_datetime()} -- Retrieving all shoppingItem name records...")
    
    data = load_data()["shoppingItems"]
    return jsonify([data[id]["name"] for id in data])

@blueprint.route("/<string:id>", methods=["GET", "PUT"])
def specific_shopping_item(id):
    '''
    Endpoint for specific shoppingItems.

    - GET returns the shoppingItem with the provided id
    - PUT replaces shoppingItem with the provided id with the data provided in
    the request body
    '''

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