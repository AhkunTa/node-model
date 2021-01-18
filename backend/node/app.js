const MongoClient = require("mongodb").MongoClient;
const assert = require("assert").strict;
const defaultConfig = require("../../config.js");

// let config = app.locals.config = Object.assign({}, defaultConfig)

let { dbPort, dbName, dbCollection } = defaultConfig;
// Connection URL
const url = `mongodb://localhost:${dbPort}`;

// Database Name
// const dbName = "myproject";
// Use connect method to connect to the server
MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
  if (err) {
    console.log(err);
    return;
  }
  console.log("Connected successfully to server");
  const db = client.db(dbName);
});

const insertDocuments = function (db, callback) {
  const collection = db.collection(dbCollection);
  collection.insertMany([{ a: 1 }, { a: 2 }, { a: 3 }], function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    console.log(result);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
};

const findDocuments = function (db, callback) {
  const collection = db.collection(dbCollection);
  collection.find({}).toArray(function (err, docs) {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Found the following records");
    callback(docs);
  });
};

const updateDocuments = function (db, callback) {
  const collection = db.collection(dbCollection);
  collection.find({}).toArray(function (err, docs) {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Found the following records");
    callback(docs);
  });
};
