db.auth('root', 'SuperSecret')

// db = db.getSiblingDB('tilt')

db.tilt.insertOne( { msg: "tilt" } );


db.createUser(
        {
            user: "tilt-user",
            pwd: "SuperSecret",
            roles: [
                {
                    role: "readWrite",
                    db: "tilt"
                },
                {
                    role: "readWrite",
                    db: "admin"
                }
            ],
            //otherDBRoles: {
            //    local: [ "readWrite" ]
            //}
        }
);


console.print('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
rs.initiate({_id:"rs0", members: [{"_id": 0, "host": "127.0.0.1:27017"}]})
