from flask import Blueprint, abort, request, jsonify
from . import base
from utils import get_user_by_token
from database import Database
from http import HTTPStatus
import uuid

blueprint = Blueprint('shops', __name__, url_prefix='/shops')

blueprint.route('', methods=['GET'])(
    base.generate_route(base.all_records, table='shops', add_creation_date=False)
)


@blueprint.route('/<string:shop_id>/locations', methods=['POST'])
def all_locations(shop_id: str):
    # authorize client
    if not get_user_by_token(request):
        abort(HTTPStatus.UNAUTHORIZED)

    new_location_id = uuid.uuid4().hex

    # add location to shop
    db = Database()
    shop = db.get_record('shops', shop_id)
    shop['locations'][new_location_id] = request.json
    db.update_record('shops', shop_id, shop)

    # add location to all shopOrderings for this shop
    users_db = Database(db_path='./data/users.json')
    users = users_db.get_all_records('users')

    for user_id, user in users.items():
        user['settings']['shopOrder'][shop_id].append(new_location_id)

        users_db.update_record('users', user_id, users[user_id])

    return jsonify({'id': new_location_id})


@blueprint.route('/<string:shop_id>/locations/<string:location_id>', methods=['DELETE'])
def specific_location(shop_id: str, location_id: str):
    # authorize client
    if not get_user_by_token(request):
        abort(HTTPStatus.UNAUTHORIZED)

    # remove location from shop
    db = Database()
    shop = db.get_record('shops', shop_id)
    shop['locations'].pop(location_id)
    db.update_record('shops', shop_id, shop)

    # remove location from all shoppingItems with this location
    shopping_items = db.get_all_records('shoppingItems')
    for shopping_item_id, shopping_item in shopping_items.items():
        if 'location' in shopping_item and shopping_item['location'] == location_id:
            shopping_item.pop('location')

            db.update_record('shoppingItems', shopping_item_id, shopping_item)

    # remove location from all shopOrderings for this shop
    users_db = Database(db_path='./data/users.json')
    users = users_db.get_all_records('users')

    for user_id, user in users.items():
        user['settings']['shopOrder'][shop_id].remove(location_id)

        users_db.update_record('users', user_id, users[user_id])

    return jsonify({'id': location_id})
