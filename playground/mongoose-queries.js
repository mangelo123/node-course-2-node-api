const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '592a2fde5080102c789c995b';

// if (!ObjectID.isValid(id)) {
//     console.log('ID is not valid', id);
// }

// Todo.find({
//     // Mongoose will convert the ID to an ObjectID
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos);
// });

// Todo.findOne({
//     // Mongoose will convert the ID to an ObjectID
//     _id: id
// }).then((todo) => {
//     console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log('Id not found');
//     }
//     console.log('Todo By Id', todo);
// }).catch((err) => {
//     console.log(err);
// });

// User.findById
var userId = '592a1578dcce75331428c660';

User.findById(userId).then((user) => {
    if (!user) {
        return console.log('User not found');
    }

    console.log('User By Id', user);
}).catch((err) => {
    console.log(err);
});