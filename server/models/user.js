var mongoose = require('mongoose');

// User model
// email: required, trim, type = string, minlength=1
var User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    }
});

module.exports = {
    User: User
}