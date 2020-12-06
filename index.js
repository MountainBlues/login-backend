const express = require("express")
const db = require("./db")
const app = express()
const bodyParser = require('body-parser')
const validate = require('express-validation')
const bcrypt = require('bcrypt')
const { login, register } = require('./validation-rules')

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "*");
  
    // Request methods you wish to allow
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
  
    // Request headers you wish to allow
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type"
    );
  
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", true);
  
    // Pass to next layer of middleware
    next();
  });

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

app.post('/register', validate(register), async (request, response) => {
    const dbInstance = db.getDBInstance()
    if (dbInstance && dbInstance.db) {
        try {
            const { password } = request.body
            const hashedPassword = await bcrypt.hash(password, 10)
            dbInstance.db().collection("users", function(error, collection) {
                if (error) {
                    response.status(500).send({ status: "Error accessing database "})
                }
                collection.insertOne({ ...request.body, password: hashedPassword }, function(err, data) {
                    if (err) {
                        response.status(400).send({ status: "User already exists" })
                    } else {
                        console.log("Success data", data.ops[0])
                        response.status(201).send({ id: data.ops[0]._id })
                    }
                })
            })
        } catch (error) {
            console.log("Error", error)
            response.status(500).send({ status: "Something went wrong" })
        }
    }
})

app.post('/login', validate(login), (request, response) => {
    const dbInstance = db.getDBInstance()
    if (dbInstance && dbInstance.db) {
        try {
            dbInstance.db().collection("users", function(error, collection) {
                if (error) {
                    response.status(500).send({ status: "Error accessing database "})
                }
                const { username, password } = request.body
                const query = { username }
                collection.findOne(query, async function(error, data) {
                    if (error) {
                        response.status(404).send({ status: "User does not exists" })
                    } else if (data) {
                        const isPasswordMatched = await bcrypt.compare(password, data.password)
                        if (isPasswordMatched) {
                            response.status(200).send(data)
                        } else {
                            response.status(403).send({ status: "Username or password is incorrect" })
                        }
                    } else {
                        response.status(404).send({ status: "User does not exists" })
                    }
                })
            })
        } catch (error) {
            console.log("Error", error)
            response.status(500).send({ status: "Something went wrong" })
        }
    }
})

app.listen(3001, () => console.log("Server is running"))