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

#client = MongoClient('mongodb://tilt-user:SuperSecret@mongo/?authSource=tilt&authMechanism=SCRAM-SHA-256')
client = MongoClient('mongodb://root:SuperSecret@mongo/?authSource=admin&authMechanism=SCRAM-SHA-256&replicaSet=rs0')

triggers = MongoTrigger(client)

# triggers on any change ('op')


#triggers.register_op_trigger(notify_manager, 'tilt', 'tilt')
triggers.register_insert_trigger(notify_manager, 'tilt', 'tilt')

triggers.tail_oplog()

    # Action that should be performed
client['tilt']['tilt-python-triggers'].insert_one({"validation" : datetime.timestamp(datetime.now()), "validation_result": "completed"})

triggers.stop_tail()



# adapted from example application: https://github.com/drorasaf/mongotriggers