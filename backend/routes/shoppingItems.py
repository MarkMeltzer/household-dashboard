from flask import Blueprint, request, abort, jsonify
from utils import verify_token, get_datetime, load_data, save_data
import time
import uuid
from . import base

blueprint = Blueprint('shoppingItems', __name__, url_prefix='/shoppingItems')

blueprint.route("", methods=["GET", "POST"])(
    base.generate_route(base.all_records, table='shoppingItems')
)

blueprint.route('/<string:record_id>', methods=['GET', 'PUT', 'DELETE'])(
    base.generate_route(base.specific_record, table='shoppingItems')
)

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
