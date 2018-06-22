var express = require('express');

var router = express.Router();

var path = require('path');

const login = require('./login');
const register = require('./register');

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
    console.log('path: ' + path.join(__dirname, '../public/index.html'));
});

router.post('/login', login.login);

router.post('/register', register.register);


module.exports = router;
