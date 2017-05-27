// const MongoClient = require('mongodb').MongoClient;

// Uses destructuring - ES6
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    // deleteMany
    // db.collection('Todos').deleteMany({text: 'Eat Lunch'})
    //     .then((result) => {
    //         console.log(result);
    //     });

    //deleteOne
    // db.collection('Todos').deleteOne({text: 'Eat Lunch'})
    //     .then((result) => {
    //         console.log(result);
    //     });

    // findOneAndDelete
    // db.collection('Todos').findOneAndDelete({completed: false})
    //     .then((result) => {
    //         console.log(result);
    //     })

    db.collection('Users').deleteMany({name: 'Andrew'})
        .then((result) => {
            console.log(result);
        });

    db.collection('Users').findOneAndDelete({_id: new ObjectID("5929f184c19467eea8e7cd11")})
        .then((result) => {
            console.log(result);
        });

    // db.close();
});