const mongoose = require('mongoose');
const validator = require('validator')
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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
// Instance method
// Called when a mongoose model instance is converted to a JSON value.
// We only want _id and e-mail returned to the user.
UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

// Instance method
// Cannot use arrow function because it would not bind the 'this' keyword
// which is necessary for instance methods.
UserSchema.methods.generateAuthToken = function() {
    // 'this' is bound to the user instance.
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

// Instance method
UserSchema.methods.removeToken = function(token) {
    var user = this;

    return user.update({
        $pull: {
            tokens: {
                token: token
            }
        }
    })
};

// Model method
UserSchema.statics.findByToken = function(token) {
    // 'this' is bound to model.
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
    }
    catch (e) {
        // return new Promise((resolve, reject) => {
        //     reject();
        // });
        // 
        // Simplified: reject([some value used as 'e' arg in the caller])
        return Promise.reject();
    }

    // Successful decoded the token at this point.

    // Return the promise
    // Single quotes are required on the left when using dot (.) notation to get 
    // to a specific property. (Not required on _id, but used for consistency).
    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.statics.findByCredentials = function(email, password) {

    var User = this;

    return User.findOne({email}).then( (user) => {
        if (!user) {
            return Promise.reject();
        }

        return new Promise(( resolve, reject) => {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                   resolve(user);
                }
                else {
                   reject();
                }
            });            
        });
    });


};

UserSchema.pre('save', function(next) {
    var user = this;

    // Check to see if the password has changed.
    // If this check is not made, the hashed password would be hashed again.
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                // This must go here and not after bcrypt.genSalt.
                next();
            });
        });
    }
    else {
        next();
    }
});

// User model
// email: required, trim, type = string, minlength=1
var User = mongoose.model('User', UserSchema);



module.exports = {
    User: User
}