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

db.tilt.insertOne( { msg: "tilt" } );

console.print('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
rs.initiate({_id:"rs0", members: [{"_id": 0, "host": "127.0.0.1:27017"}]})
