const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log("Hash", hash);
    });
});

var hashedPassword = '$2a$10$Fwhh.l6gRQI6Oc8xWHMJQuTpf7IlPP9KI6e..b2TENei9pHk3/aJG';

bcrypt.compare(password, hashedPassword, (err, result) => {
    console.log("Password compare", result);
});

var data = {
    id: 10
};

// jwt takes the data and the secret.
var token = jwt.sign(data, '123abc');
console.log(token);

var decoded = jwt.verify(token, '123abc');
console.log(decoded);

// var message = 'I am user number 3';
// var hash = SHA256(message).toString();

// console.log(`Message:: ${message}`);
// console.log(`Hash: ${hash}`);

// var data = {
//     id: 4
// };

// // This process is a standard known as as the JSON Web Token
// var token = {
//     data: data,
//     // 'somesecret' would be the salt
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };

// // Example of an unexpected modification. The salt was not available
// // to the indruder to it will not pass our checke.
// //
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if (resultHash === token.hash) {
//     console.log('Data was not changed');
// }
// else {
//     console.log('Data was changed. Do not trust!');
// }

