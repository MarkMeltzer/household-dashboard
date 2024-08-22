from http import HTTPStatus

from flask import Blueprint, abort, jsonify, request

from database import Database
from utils import get_datetime, get_user_by_token

blueprint = Blueprint('users', __name__, url_prefix='/users')


@blueprint.route('/me/settings', methods=['GET', 'PUT'])
def get_user_settings():
    user = get_user_by_token(request)

    if not user:
        abort(HTTPStatus.UNAUTHORIZED)

    if request.method == 'GET':
        print(f"{get_datetime()} -- Retrieving all settings records for user {user['id']}...")

        return jsonify(user['settings'])
    if request.method == 'PUT':
        print(f"{get_datetime()} -- Changing settings for user {user['id']}...")

        user_id = user.pop('id')
        user['settings'].update(request.json)

        users_db = Database(db_path='./data/users.json')
        users_db.update_record('users', user_id, user)

        return jsonify({'id': user_id})
