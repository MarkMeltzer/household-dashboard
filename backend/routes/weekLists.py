from flask import Blueprint, request, abort, jsonify
from utils import verify_token, get_datetime
from database import Database

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

    db = Database()

    if request.method == "GET":
        print(f"{get_datetime()} -- Retrieving all weekList records...")

        return jsonify(db.get_all_records('weekLists'))
    elif request.method == "POST":
        # add a new weeklist record
        print(f"{get_datetime()} -- Adding new weekList record...")

        record_id = db.add_record('weekLists', request.json)
        
        return jsonify({"id" : record_id})
    else:
        print(request.method + " not implemented for this route!")
        abort(405)

@blueprint.route("/<string:record_id>", methods=["GET", "PUT", "DELETE"])
def specific_week_list(record_id):
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

    db = Database()

    if not db.record_exists('weekLists', record_id):
        abort(404)

    if request.method == "GET":
        # get existing weeklist record
        print(
            f"{get_datetime()} -- Retrieving weekList record with id: "
            f"{record_id}..."
        )

        return jsonify(db.get_record('weekLists', record_id))
    elif request.method == "PUT":
        # change existing weeklist record
        print(
            f"{get_datetime()} -- Changing existing weeklist record with id: "
            f"{record_id}..."
        )

        db.update_record('weekLists', record_id, request.json)

        return jsonify({"id" : record_id})
    elif request.method == "DELETE":
        # delete existing weeklist record
        print(
            f"{get_datetime()} -- Deleting weeklist record with id: "
            f"{record_id}..."
        )

        db.delete_record('weekLists', record_id)

        return jsonify({"id" : record_id})
    else:
        print(request.method + " not implemented for this route!")
        # TODO: make enum for HTTP status codes
        abort(405)

@blueprint.route(
    "/<string:weekListId>/shoppingList/<int:index>",
    methods=["GET", "PATCH"],
)
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
    db = Database()
    weekList = db.get_record('weekLists', weekListId)

    if index > len(weekList['shoppingList']) - 1:
        abort(400)
    
    item = weekList["shoppingList"][index]

    if request.method == "GET":
        print(
            f"{get_datetime()} -- Retrieving shoppingList item record: "
            f"index {index} from weekList {weekListId}..."
        )
        
        return jsonify(item)
    elif request.method == "PATCH":
        print(
            f"{get_datetime()} -- Patching shoppingList item record: "
            f"index {index} from weekList {weekListId}..."
        )

        # TODO: I should split the shoppingList into it's own relational table
        # then I can just use the db.delta_update_function
        for key in request.json:
            if key not in item:
                abort(400)

            item[key] = request.json[key]

        weekList['shoppingList'][int(index)] = item

        db.update_record('weekLists', weekListId, weekList)
        
        return "", 204

    abort(405)