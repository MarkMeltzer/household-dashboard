import json
import time
from datetime import datetime
import copy
import uuid

class Database():
    def __init__(self, db_path: str = './data/db.json', archive_path: str = './data/archive.json'):
        self.archive_path = archive_path
        self.db_path = db_path
        self._load_data()

    def _load_data(self):
        with open(self.db_path, 'r') as f:
            self.data = json.load(f)
        
    def _save_data(self):
        with open(self.db_path, 'w+') as f:
            json.dump(self.data, f, indent=4)

    def _get_current_time(self) -> str:
        now = time.localtime()
        return time.strftime('%A %e %b %Y - %H:%M', now)

    def _archive_data(self, data: dict, record_type: str = None):
        with open(self.archive_path, 'w+') as f:
            try:
                content = json.load(f)
            except ValueError:
                content = {'deleted_records': []}

            content['deleted_records'].append(
                {
                    'type': record_type,
                    'deleted_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                    'record': data
                }
            )
            json.dump(content, f, indent=4)

    def record_exists(self, table: str, id: str) -> bool:
        return id in self.data[table]

    def get_record(self, table: str, id: str) -> dict:
        return self.data[table][id]

    def get_all_records(self, table: str) -> dict:
        return self.data[table]

    def add_record(self, table: str, data: dict, add_creation_date: bool = True) -> str:
        '''
        Add new database record to `table`. Assumes `data` is validated.

        Setting `add_creation_date` adds `creationDate` field with current time.

        Generates id to save record under and returns said id.
        '''

        record_data = copy.deepcopy(data)

        if add_creation_date:
            record_data['creationDate'] = self._get_current_time()

        id = uuid.uuid4().hex
        self.data[table][id] = record_data

        self._save_data()

        return id
   
    def update_record(self, table: str, id: str, data: dict) -> str:
        '''
        Replaces data of record under `id` in `table` with values from `data`.

        Ignores the value of `creationDate` field.

        Returns id of updated object.
        '''

        record_data = copy.deepcopy(data)

        record_data.pop('creationDate', None)

        # add creationDate field to record if it existed before
        creation_date = self.data[table][id].get('creationDate')
        if creation_date:
            record_data['creationDate'] = creation_date

        # oh no I loose creationDate of original record
        self.data[table][id] = record_data

        self._save_data()

        return id
    
    def delta_update_record(self, table: str, id: str, data: dict) -> str:
        '''
        Perform a delta update on the record with `id` in `table`.

        For each key present in `data` the same key in the record will be changed
        to the corresponding value from `data`. If a key from `data` is not present
        in the record an error will be raised.

        Returns the id of the updated record.
        '''

        record = self.data[table][id]

        for key in data:
            record[key] = data[key]

        self._save_data()
    
    def delete_record(self, table: str, id: str) -> str:
        '''
        Remove database record from `table`. 

        Will not delete archive completely
        immediately, but rather archive the record to a separate file, this archive
        is not guaranteed to stick around for long but can be used to recover
        accidentally deleted records.
        
        Returns id of deleted record.
        '''

        record = self.data[table].pop(id)
        record_type = table.removesuffix('s')

        self._archive_data({ id: record }, record_type)

        self._save_data()

        return id
