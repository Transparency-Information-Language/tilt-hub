from pymongo import MongoClient
from pprint import pprint

client = MongoClient('mongodb://root:SuperSecret@localhost:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false')


filter={
    'accessAndDataPortability.administrativeFee.currency': 'EUR'
}

result = client['tilt']['tilt'].find(
  filter=filter
)

for document in result:
    pprint(document)