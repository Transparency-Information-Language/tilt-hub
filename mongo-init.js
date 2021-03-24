cfg = {
    _id: "rs0" ,
    members: [
        {
            _id: 0,
            host: "localhost:27017"
        }
    ] 
};
rs.initiate(cfg);

db.auth('root', 'SuperSecret')

// db = db.getSiblingDB('tilt')

db.tilt.insertOne( { msg: "tilt" } );

db.createUser(
        {
            user: "admin",
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