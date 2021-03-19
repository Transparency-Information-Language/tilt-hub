from mongotriggers import MongoTrigger
from pymongo import MongoClient

from datetime import datetime

from tilt import tilt

def notify_manager(op_document):
    print ('Document change occured!')
    try:
        t = tilt.from_dict(op_document)
        print(tilt.meta.name)
    except:
        print('Could not create tilt object.')


try:
    client = MongoClient('mongodb://tilt-user:SuperSecret@mongo/?authSource=tilt&authMechanism=SCRAM-SHA-256')
    # client = MongoClient('mongodb://root:SuperSecret@mongo:27017/?authSource=admin&authMechanism=SCRAM-SHA-256&replicaSet=rs0')

    triggers = MongoTrigger(client)

    # triggers on any change ('op')

    #triggers.register_op_trigger(notify_manager, 'tilt', 'tilt')
    try:
        triggers.register_insert_trigger(notify_manager, 'tilt', 'tilt')
    except:
        print('Failed to register trigger!')

    print('Tailing oplog...')    
    triggers.tail_oplog()

    try:
        print('Validating document...')
        # Action that should be performed
        client['tilt']['tilt-python-triggers'].insert_one({"validation" : datetime.timestamp(datetime.now()), "validation_result": "completed"})
    except:
        print('Failed to validate document!')

    print('Stopping tot tail oplog...')    
    triggers.stop_tail()


except Exception as e:
    print(e)
    print('Failed to connect to MongoDB!')



# adapted from example application: https://github.com/drorasaf/mongotriggers