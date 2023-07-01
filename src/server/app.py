from flask import Flask
from flask_cors import CORS
from routes import blueprints
import logging
import time

SIM_DELAY = 0.0

logging.basicConfig(
    level=logging.INFO,
    filename="flask.log",
    format="%(asctime)s %(levelname)s: %(message)s",
    datefmt="%d/%b/%Y %H:%M:%S"
)

app = Flask(__name__)
CORS(app)

for blueprint in blueprints:
    app.register_blueprint(blueprint)

@app.route("/", methods=["GET"])
def landing_page():
    return "<h1>Welcome to the backend webapi of my household dashboard application!</h1>\n"

@app.after_request
def add_header(response):
    
    # simulate a slow network
    time.sleep(SIM_DELAY)

    return response

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)