from flask import Blueprint
from . import base

blueprint = Blueprint('shops', __name__, url_prefix='/shops')

blueprint.route('', methods=['GET', 'POST'])(
    base.generate_route(base.all_records, table='shops', add_creation_date=False)
)

blueprint.route('/<string:record_id>', methods=['GET', 'PUT', 'DELETE'])(
    base.generate_route(base.specific_record, table='shops')
)
