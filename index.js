const express = require("express")
const db = require("./db")
const app = express()
const bodyParser = require('body-parser')

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

db.connectToDb(function(error){
    if (error) {
        console.log("Some error occurred", error)
        return
    }
    console.log("DB conncted successfully")
})

app.get('/healthCheck', (request, response) => {
    response.status(200).send({})
})

app.post('/register', (request, response) => {
    const dbInstance = db.getDBInstance()
    if (dbInstance && dbInstance.db) {
        try {
            dbInstance.db().collection("users", function(error, collection) {
                if (error) {
                    throw new Error({ message: "Error accessing collection "})
                }
                collection.insertOne(request.body, function(error, data) {
                    if (error) {
                        throw new Error(error)
                    }
                    console.log("Success data", data.ops[0])
                    response.status(201).send({ id: data.ops[0]._id })
                })
            })
        } catch (error) {
            console.log("Error", error)
            response.status(500).send({ status: "failed" })
        }
    }
})

app.post('/login', (request, response) => {
    const dbInstance = db.getDBInstance()
    if (dbInstance && dbInstance.db) {
        try {
            dbInstance.db().collection("users", function(error, collection) {
                if (error) {
                    throw new Error({ message: "Error accessing collection "})
                }
                const query = { firstname: request.body.firstname }
                collection.findOne(query, function(error, data) {
                    if (error) {
                        throw new Error({ message: "User not found" })
                    } else if (data) {
                        response.status(200).send(data)
                    } else {
                        response.status(403).send({ status: "Authorization failed" })
                    }
                })
            })
        } catch (error) {
            console.log("Error", error)
            response.status(500).send({ status: "failed" })
        }
    }
})

app.listen(3000, () => console.log("Server is running"))