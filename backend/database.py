import json
import time
import copy
import uuid

class Database():
    def __init__(self, db_path: str = './data/db.json'):
        self.db_path = db_path
        self._load_data()

    def _load_data(self):
        with open(self.db_path, "r") as f:
            self.data = json.load(f)
        
    def _save_data(self):
        with open(self.db_path, "w+") as f:
            json.dump(self.data, f, indent=4)

    def _get_current_time(self) -> str:
        now = time.localtime()
        return time.strftime("%A %e %b %Y - %H:%M", now)

    def get_record(self, table: str, id: str) -> dict:
        return self.data[table][id]

    def get_all_records(self, table) -> dict:
        return self.data[table]

    def add_record(self, table: str, data: dict, add_creation_date: bool = True) -> str:
        '''
        Add new database record to `table`. Assumes `data` is validated.

        Generates id to save record under and returns said id.

        Setting `add_creation_date` adds `creationDate` field with current time.
        '''

        record_data = copy.deepcopy(data)

        if add_creation_date:
            record_data['creationDate'] = self._get_current_time()

        id = uuid.uuid4().hex
        self.data[table][id] = record_data

        self._save_data()

        return id
   
    def update_record(self, table: str, id: str, data: dict) -> str:
        # TODO: write docstring
        raise NotImplementedError
    
    def delete_record(self, table: str, id: str):
        '''
        Bla bla, archive record
        '''

        # TODO: write docstring
        raise NotImplementedError