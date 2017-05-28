var env = process.env.NODE_ENV || 'development';

if (env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
}
else if (env === 'test') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}
else {
    // production
    
    // Had to override the Heroku setting due to a credit card requirement
    // for free accounts.
    process.env.MONGODB_URI = 'mongodb://mangelo:malip7557@ds155811.mlab.com:55811/mangelo-todoapp';
}
