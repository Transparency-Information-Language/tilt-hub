# tilt-hub: Transparency Information Language Document Hub

**tilt-hub** is a document storage for transparency information specified in the *Transparency Information Language* and is part of the _Transparency Information Language and Toolkit_.

This document storage comprises five services in order to perform CRUD operations on transparency information documents and serves for clients, that either only want plain information about GDPR compliance of a data controller or carry out arbitrary complex research/statistics/analysis tasks.

![](docs/tilt-hub.png)


## Development Server 
[Hosted on AWS](http://ec2-3-64-237-95.eu-central-1.compute.amazonaws.com:8080/)

## Usage

1. Create a MongoDB keyfile via
```bash
# Create secret
openssl rand -base64 756 > mongodb.keyfile
# Protect file
chmod 400 mongodb.keyfile
# Set owner
sudo chown systemd-coredump mongodb.keyfile 
# Check if permissions look like this
ls -la mongodb.keyfile 
-r-------- 1 systemd-coredump docker 1024 Feb 22 12:11 mongodb.keyfile
```


2. Run (`-d` for running in the background)
```bash
docker-compose up [-d]
```

3. After some startup time, there will be the following five containers. You're done!
```bash
docker-compose ps

    Name                   Command               State                                      Ports
    ---
mongo           docker-entrypoint.sh --con ...   Up      0.0.0.0:27017->27017/tcp, 0.0.0.0:27018->27018/tcp, 0.0.0.0:27019->27019/tcp
mongo-express   tini -- /docker-entrypoint ...   Up      0.0.0.0:8081->8081/tcp
mongoke         dumb-init -- /entrypoint.s ...   Up      0.0.0.0:8082->80/tcp
restheart       java -Dfile.encoding=UTF-8 ...   Up      4443/tcp, 8009/tcp, 0.0.0.0:8080->8080/tcp
triggers        docker-entrypoint.sh node  ...   Up
```

(Optionally, in case of trouble) 

1. Stop and delete all running containers `docker compose down` and `docker rm $(docker ps -aq)` (attention, this deletes _all_ containers!).
2. Check if there is an empty `volumes/mongo` directory.
3. Again, create a fresh keyfile (see above).
4. Run only the mongo container via `docker compose up mongo --force-recreate`.
5. Follow the steps below to enable the MongoDB replica set.
6. Start all remaining containers `docker compose up`.


### Mongo DB 

Follow these steps to enable the MongoDB replica set
```bash
# Login into the container
docker exec -it mongo bin/bash
# Login to mongo shell
mongo
# Change current database
use admin
# Authenticate to the admin database
db.auth("root", "SuperSecret")
# Initiate replica set with one member (localhost)
rs.initiate({_id:"rs0", members: [{"_id": 0, "host": "localhost:27017"}]})
# Close mongo shell
exit
# Exit container shell
exit
```



The mongo database is available via [mongodb://root:SuperSecret@mongo](). A client application written in Python could look like:

```python
from pymongo import MongoClient
from pprint import pprint

client = MongoClient('mongodb://root:SuperSecret@mongo:27017/?authSource=admin&readPreference=primary')


filter={
    'controller.name': 'Green Company'
}

result = client['tilt']['tilt'].find(
  filter=filter
)

for document in result:
    pprint(document)
```

### Mongo Express
A graphical interface to the database can be reached under [http://localhost:8081/]().
```
Username: admin
Password: SuperSecret
```
![](docs/mongo-express.png)

### REST API
In order to retrieve all documents from the database `tilt` and collection `tilt`.
```bash
http GET "localhost:8080/tilt/tilt" -a admin:secret


HTTP/1.1 200 OK
Content-Type: application/json
Date: Sun, 16 Aug 2020 21:36:05 GMT
...

[
    {
        "_etag": {
            "$oid": "5f39a2cb5937e6719cbb3bed"
        },
        "_id": {
            "$oid": "5f39a2cb8f9a233727fb7fa2"
        },
        "accessAndDataPortability": {
            "administrativeFee": {
                "amount": 0,
                "currency": "EUR"
            },
...
```

Or retrieve a specific document using its id:

```bash
http GET "http://localhost:8080/tilt/tilt/6053f42d0da4272ad0d52e8a" -a admin:secret
```

New documents can be created by `POST`ing a valid TILT document to http://localhost:8080/tilt/tilt (don't forget to authorize with Basic Auth).

**See [here](https://restheart.org/docs/v3/quick-reference/) for all query possibilites.**

Some examples for `GET`ing documents:

```bash
GET "http://localhost:8080/tilt/tilt/605bc9b783990f850a9cf492"
single tilt document by id 605…

GET "http://localhost:8080/tilt/tilt"
all tilt documents

GET "http://localhost:8080/tilt/tilt?filter={'meta.name' : 'Blue'}"
all tilt documents where meta.name equals 'Blue'

GET "http://localhost:8080/tilt/tilt?filter={'meta.status': 'inactive', 'dataDisclosed.recipients.name': 'Red'}"
all controllers that send data to the Red company and whose document status is inactive

GET "http://localhost:8080/tilt/tilt?keys={'controller.name' : 1}"
all tilt documents but only the controller.name attribute (0 for all but controller.name)
```

You can use `filter` to have all MongoDB’s queries power.
Don't forget to authorize using Basic Auth (User: admin, Password: secret).


### GraphQL API
Use the _GraphiQL_ interface running at [http://localhost:8082]() to perform GraphQL operations. To return the `meta.name` field of all documents run:
```graphql
{
  TiltNodes(first: 1000) {
    edges {
      node {
        meta {
          name
        }
      }
    }
  }
}
```

In Python, you could retrieve the same information like this:

```python
from graphqlclient import GraphQLClient

client = GraphQLClient('http://tilt-hub-host.com:8082/')

result = client.execute('''
query {
  TiltNodes {
    edges {
      node {
        meta {
          name
        }
      }
    }
  }
}
''')

print(result)
```


### Triggers
In this basic scenario there will be a JavaScript trigger microservice which validates all documents on every change that occurs using the [tilt-schema](https://github.com/Transparency-Information-Language/schema).

The output of the validation can be obtained directly from the logs:

```bash
docker-compose logs -f triggers

triggers         | Downloaded schema from https://raw.githubusercontent.com/Transparency-Information-Language/schema/master/tilt-schema.json
triggers         | Trigger on tilt collection initialized successfully!
triggers         | Document changes detected!
triggers         | tilt schema validation successful!
```

Similarly, there could by a Python based trigger which is located [here](./triggers/python). In order to use it, configure the [docker-compose.yml](./docker-compose.yml) accordingly.


## Author
Elias Grünewald

## License
[MIT License](LICENSE)
