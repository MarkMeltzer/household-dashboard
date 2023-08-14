from flask import Blueprint, request, abort, jsonify
from utils import verify_token, load_data, save_data, get_datetime, archive_data
import uuid
import time

blueprint = Blueprint('recipes', __name__, url_prefix='/recipes')

@blueprint.route("", methods=["GET", "POST"])
def all_recipes():
    '''
    Endpoint for all recipes.

    - GET returns list of all recipes
    - POST creates new recipe from data in request body
    '''

    # authorize client
    if not verify_token(request):
        print("Wrong token.")
        abort(401)

    data = load_data()

    if request.method == "GET":
        print(f"{get_datetime()} -- Retrieving all recipe records...")

        return jsonify(data["recipes"])
    elif request.method == "POST":
        # add a new weeklist record
        print(f"{get_datetime()} -- Adding new recipe record...")

        recipe = request.json
        now = time.localtime()
        nowStr = time.strftime("%A %e %b %Y - %H:%M", now)
        recipe["creationDate"] = nowStr
        
        id = uuid.uuid4().hex
        data["recipes"][id] = recipe
        save_data(data)
        
        return jsonify({"id" : id})
    else:
        print(request.method + " not implemented for this route!")
        abort(404)

@blueprint.route("/<string:arg>", methods=["GET", "PUT", "DELETE"])
def specific_recipes(arg):
    '''
    Endpoint for specific recipes.

    - GET returns the recipe with the provided id
    - PUT replaces recipe with the provided id with the data provided in
    the request body
    - DELETE recipe from `db.json`, archive it to `archive.json`
    '''

    # authorize client
    if not verify_token(request):
        print("Wrong token.")
        abort(401)

    data = load_data()

    if request.method == "GET":
        # get existing weeklist record
        print(f"{get_datetime()} -- Retrieving recipe record with id: {arg}...")

        if arg in data["recipes"]:
            return jsonify(data["recipes"][arg])
        else:
            abort(404)
    elif request.method == "PUT":
        # change existing weeklist record
        print(
            f"{get_datetime()} -- Changing existing weeklist record with id: "
            f"{arg}..."
        )

        if arg not in data["recipes"]:
            abort(404)

        creation_date = data["recipes"][arg]['creationDate']
        recipe = request.json
        recipe['creationDate'] = creation_date
        
        data["recipes"][arg] = recipe
        save_data(data)

        return jsonify({"id" : arg})
    elif request.method == "DELETE":
        # delete existing weeklist record
        print(f"{get_datetime()} -- Deleting weeklist record with id: {arg}...")

        if arg not in data["recipes"]:
            abort(404)

        # archive the data in case of accidental deletion
        recipe = data["recipes"].pop(arg)
        archive_data({ arg: recipe }, "recipe")
        save_data(data)

        return "", 204
    else:
        print(request.method + " not implemented for this route!")
        abort(404)