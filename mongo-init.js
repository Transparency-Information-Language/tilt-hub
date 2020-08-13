db.createUser(
        {
            user: "tilt-user",
            pwd: "SuperSecret",
            roles: [
                {
                    role: "readWrite",
                    db: "tilt"
                }
            ]
        }
);

db.tilt.insertOne( { msg: "tilt" } );
