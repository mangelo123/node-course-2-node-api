const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Does not return removed Todo
// Todo.remove({}).then((result) => {
//     console.log(result);
// });

// Todo.findOneAndRemove()
// Todo.findByIdAndRemove

Todo.findOneAndRemove({_id: '592a59e5c19467eea8e7cd16'}).then((todo) => {
   console.log(todo); 
});

Todo.findByIdAndRemove('592a59e5c19467eea8e7cd16').then((todo) => {
    console.log(todo);
});