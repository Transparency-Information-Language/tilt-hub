db.auth('root', 'password')

db = db.getSiblingDB('tilt')

db.createUser(
    {
    user: "tilt-user",
    pwd: "tilt-password",
    roles: [
        {
            role: "readWrite",
            db: "tilt"
        }
    ]
})

console.log('################################')
rs.initiate({_id:"rs0", members: [{"_id": 0, "host": "127.0.0.1:27017"}]})

