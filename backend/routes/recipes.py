from flask import Blueprint
from . import base

blueprint = Blueprint('recipes', __name__, url_prefix='/recipes')

blueprint.route("", methods=["GET", "POST"])(
    base.generate_route(base.all_records, table='recipes')
)

blueprint.route('/<string:record_id>', methods=['GET', 'PUT', 'DELETE'])(
    base.generate_route(base.specific_record, table='recipes')
)