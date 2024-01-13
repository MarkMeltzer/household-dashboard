from datetime import datetime
from flask import Request
from database import Database


def get_user_by_token(request: Request):
    if "Authorization" not in request.headers:
        return None
    token = request.headers["Authorization"].split(" ")[1]

    db = Database(db_path='./data/users.json')
    users = db.get_all_records('users')

    for user in users:
        if token in users[user]['login_tokens']:
            return users[user]

# get current time in nice format
def get_datetime():
    # TODO: figure out which date-time format to use, this or the pretty version and if so change the frontend to match and write migration
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")
