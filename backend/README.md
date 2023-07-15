# Backend

Contains source code for the Flask backend. All data is saved in a new, innovative, blazingly-fast, quantum-AI-based based database called `JustAJSONFile`<sup>TM</sup>. This is currently read/modified and saved back on each call to the backend (not great).

For authentication a long-lasting token is generated on login if the username and password hash of a user matches and this token is stored in `users.json`. On each request to the backend the token in the `Authorization` header is compared to the tokens saved for the user and, if present, the user is authenticated (all of this is also not great).

Routes are split into multiple files using [Flask blueprints](https://flask.palletsprojects.com/en/latest/blueprints/) (that's pretty nice).

There is currently no proper data validation using schema's and changes to database structures are ad-hoc scripts I have laying around (both of which I intend to change at some point).

# Directory structure (roughly)

```
.
├── data
|   ├── db.json         # the main database
|   ├── users.json      # contains user and login information
|   └── archive.json    # used for storing "deleted" records (so that accidental deletes can be restored)
|
├── routes              # containes the routes split across multiple files
└── app.py              # main application code lives here
```
