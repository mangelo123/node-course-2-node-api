var {User} =  require('./../models/user');

var authenticate = (req, res, next) => {
    var token = req.header('x-auth');

    User.findByToken(token).then((user) => {
        if (!user) {
            // Rather than copy the code in the catch block, just 'reject'
            // and the catch block will get executed.
            return Promise.reject();
        }

        // Modify the request object vs res.send
        req.user = user;
        req.token = token;
        next();
    })
    .catch((e) => {
        res.status(401).send();
        // Don't want to call next() here because we don't want the subsequent
        // code to execute.
    });
};

module.exports = {
    authenticate
}