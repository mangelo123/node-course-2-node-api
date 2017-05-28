// const MongoClient = require('mongodb').MongoClient;

// Uses destructuring - ES6
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5929f02fc19467eea8e7cd0f')
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }, {
    //     returnOriginal: false
    // })
    // .then((result) => {
    //     console.log(result);
    // });

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5929f171c19467eea8e7cd10')
    }, {
        $set: {
            name: 'Michael'
        },
        $inc: {
            age: 1
        }
    }, {
        returnOriginal: false
    })
    .then((result) => {
        console.log(result);
    })


    // db.close();
});