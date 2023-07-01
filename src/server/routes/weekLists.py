from flask import Blueprint, request, abort, jsonify
from utils import verify_token, load_data, save_data, get_datetime, archive_data
import uuid
import time

blueprint = Blueprint('weekLists', __name__, url_prefix='/weekLists')

@blueprint.route("", methods=["GET", "POST"])
def all_week_lists():
    '''
    Endpoint for all weekLists.

    - GET returns list of all weekList
    - POST creates new weekList from data in request body
    '''

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

@blueprint.route("/<string:arg>", methods=["GET", "PUT", "DELETE"])
def specific_week_list(arg):
    '''
    Endpoint for specific weekLists.

    - GET returns the weekList with the provided id
    - PUT replaces weekList with the provided id with the data provided in
    the request body
    - DELETE weekList from `db.json`, archive it to `archive.json`
    '''

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

@blueprint.route("/<string:weekListId>/shoppingList/<string:index>", methods=["GET", "PATCH"])
def shoppingListItem(weekListId, index):
    '''
    Endpoint for specific shoppingListItems.

    - GET returns the shoppingListItem at the provided index of the weekList with
    the provided id
    - PATCH update the shoppingListItem at the provided index of the weekList with
    the provided id with the data from the request body
    '''

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