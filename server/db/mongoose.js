var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// MONGODB_URI is set on Heroku
let db = {
    localhost: 'mongodb://localhost:27017/TodoApp',
    mlab: 'mongodb://mangelo:malip7557@ds155811.mlab.com:55811/mangelo-todoapp'
};

mongoose.connect(process.env.PORT ? db.mlab : db.localhost );

module.exports = {
    mongoose: mongoose
}