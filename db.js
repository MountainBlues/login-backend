const MongoClient = require('mongodb').MongoClient;

let dbInstance;

module.exports = {
    connectToDb: function(callback) {
        MongoClient.connect(
            "mongodb+srv://aniket:aniket@007@aniket1990.c2hoe.mongodb.net/simplilearn?retryWrites=true&w=majority",
            { useUnifiedTopology: true },
            function(err, db) {
            if(err) {
                console.dir(err);
                callback(err)
                return
            }
            dbInstance = db
        })
    },
    getDBInstance: function() {
        return dbInstance
    }
}
