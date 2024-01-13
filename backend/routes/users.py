from flask import Blueprint
from flask import request, jsonify, abort
from http import HTTPStatus
from utils import get_user_by_token, get_datetime

blueprint = Blueprint('users', __name__, url_prefix='/users')


@blueprint.route('/me/settings', methods=['GET'])
def get_user_settings():
    user = get_user_by_token(request)

    if not user:
        abort(HTTPStatus.UNAUTHORIZED)

    print(f"{get_datetime()} -- Retrieving all settings records for user...")

    return jsonify(user['settings'])
