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
