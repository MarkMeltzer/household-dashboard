import json
from datetime import datetime

def verify_token(request):
    if "Authorization" not in request.headers:
        return False

    token = request.headers["Authorization"].split(" ")[1]

    with open("./data/users.json", "r") as f:
        content = json.load(f)
    
    for user in content:
        if token in content[user]["login_tokens"]:
            return True
    return False

def load_data():
    with open("./data/db.json", "r") as f:
        return json.load(f)
    
def save_data(data):
    with open("./data/db.json", "w+") as f:
        json.dump(data, f, indent=4)

def archive_data(data, type=None):
    with open("./data/archive.json", "r+") as f:
        content = json.load(f)
        content["deleted_records"].append(
            {
                "type": type,
                "deleted_date": get_datetime(),
                "record": data
            }
        )

        f.truncate(0)
        f.seek(0)
        json.dump(content, f, indent=4)

# get current time in nice format
def get_datetime():
    # TODO: figure out which date-time format to use, this or the pretty version and if so change the frontend to match and write migration
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")