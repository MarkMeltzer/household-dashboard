'''
This module contains functions that can be used to dynamically generate some
basic resource routes for getting all records of a type, creating new records,
updating records etc.
'''

from flask import request, abort, jsonify
from utils import verify_token, get_datetime
from database import Database
from functools import partial, update_wrapper

def generate_route(route, *args, **kwargs):
    '''
    Takes view function `route` as argument and return said function with
    all arguments and keywordarguments set. This can then be set as route
    on a blueprint.

    Example usage:

    ```
    blueprint = Blueprint('posts', __name__, url_prefix='/posts')
    blueprint.route('/<string:record_id>', methods=['GET', 'PUT', 'DELETE'])(
        base.generate_route(base.specific_record, table='blogs')
    )
    ```
    '''

    partial_function = partial(route, *args, **kwargs)

    # update wrapper so that resulting object has same attributes as original
    # function has, such as __name__
    return update_wrapper(partial_function, route)

def all_records(table: str):
    '''
    Endpoint for all records in `table`.

    - GET returns list of all records in `table`
    - POST creates new record in `table` from data in request body
    '''

    # authorize client
    if not verify_token(request):
        print("Wrong token.")
        abort(401)

    db = Database()

    if request.method == "GET":
        print(f"{get_datetime()} -- Retrieving all {table} records...")

        return jsonify(db.get_all_records(table))
    elif request.method == "POST":
        # add a new record
        print(f"{get_datetime()} -- Adding new {table} record...")

        record_id = db.add_record(table, request.json)
        
        return jsonify({"id" : record_id})
    
def specific_record(table: str, record_id: str):
    '''
    Endpoint for specific records in `table`.

    Endpoint url needs to provide `<string:record_id>` parameter

    - GET returns the record in `table` with the provided id
    - PUT replaces record in `table` with the provided id with the data provided in
    the request body
    - DELETE record in `table` from `db.json`, archive it to `archive.json`
    '''

    # authorize client
    if not verify_token(request):
        print("Wrong token.")
        abort(401)

    db = Database()

    if not db.record_exists(table, record_id):
        abort(404)

    if request.method == "GET":
        # get existing record
        print(
            f"{get_datetime()} -- Retrieving {table} record with id: "
            f"{record_id}..."
        )

        return jsonify(db.get_record(table, record_id))
    elif request.method == "PUT":
        # change existing record
        print(
            f"{get_datetime()} -- Changing existing {table} record with id: "
            f"{record_id}..."
        )

        db.update_record(table, record_id, request.json)

        return jsonify({"id" : record_id})
    elif request.method == "DELETE":
        # delete existing record
        print(
            f"{get_datetime()} -- Deleting {table} record with id: "
            f"{record_id}..."
        )

        db.delete_record(table, record_id)

        return jsonify({"id" : record_id})