from http import HTTPStatus
from flask import Blueprint, request, abort, jsonify
from utils import get_user_by_token, get_datetime
from database import Database
from . import base

blueprint = Blueprint('weekLists', __name__, url_prefix='/weekLists')

blueprint.route('', methods=['GET', 'POST'])(
    base.generate_route(base.all_records, table='weekLists')
)

blueprint.route('/<string:record_id>', methods=['GET', 'PUT', 'DELETE'])(
    base.generate_route(base.specific_record, table='weekLists')
)

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
    if not get_user_by_token(request):
        print("Wrong token.")
        abort(HTTPStatus.UNAUTHORIZED)    

    # load dat and get shoppingList item
    db = Database()
    weekList = db.get_record('weekLists', weekListId)

    if index > len(weekList['shoppingList']) - 1:
        abort(HTTPStatus.BAD_REQUEST)
    
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
                abort(HTTPStatus.BAD_REQUEST)

            item[key] = request.json[key]

        weekList['shoppingList'][int(index)] = item

        db.update_record('weekLists', weekListId, weekList)
        
        return "", HTTPStatus.NO_CONTENT

    abort(HTTPStatus.METHOD_NOT_ALLOWED)