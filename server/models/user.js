const mongoose = require('mongoose');
const validator = require('validator')
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value);
            },
            // Could also be written as:
            // validator: validator.isEmail;
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    // The array syntax here tells mongoose to store the tokens array
    // withing the User document.
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

// Override
// Called when a mongoose model instance is converted to a JSON value.
// We only want _id and e-mail returned to the user.
UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

// Cannot use arrow function because it would not bind the 'this' keyword
// which is necessary for instance methods.
UserSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({
        _id: user._id.toHexString(),
        access: access
    }, 'abc123');

    user.tokens.push({
        access: access,
        token: token
    })

    // Returning the Promise so that the caller (server.js) can
    // chain onto the Promise and access the token.
    return user.save().then(() => {
        return token;
    });
};

// User model
// email: required, trim, type = string, minlength=1
var User = mongoose.model('User', UserSchema);



module.exports = {
    User: User
}