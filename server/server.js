require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middlewear/authenticate');

var app = express();

const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res
        .status(400)
        .send(err);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({
            // Sending back the array as an object member makes it
            // more flexible to add other properties later.
            todos: todos
        })
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({
            todo: todo
        });
    }, (err) => {
        res.status(400).send();
    }).catch((err) => {
        res.status(400).send();
    })
});

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.status(200).send({
            todo: todo
        });
    }).catch((err) => {
        res.status(400).send();
    });
});

// Update a Todo
app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;

    // Use Lodash to only pull off the properties that we want.
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    }
    else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({todo});
    })
    .catch((err) => {
        res.status(400).send();
    });
});

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    // Alternate syntax because body has all of the properties:
    // var user = new User(body);
    //
    var user = new User({
        email: body.email,
        password: body.password
    });

    user.save().then(() => {
        return user.generateAuthToken();
    })
    .then((token) => {
        // Headers that begin with 'x-' indicate a custom header
        res.header('x-auth', token).send(user);    
    })
    .catch((err) => {
        res.status(400)
           .send(err);
    });
});



// Private route
// To become a middlewear function
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

// POST /users/login - pass in { email, password }
app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then( (token) => {
            res.header('x-auth', token).send(user);    
        });
    }).catch((e) => {
        res.status(400).send();
    });

});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {
    app: app
}