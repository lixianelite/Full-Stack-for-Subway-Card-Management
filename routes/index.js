var express = require('express');

var router = express.Router();

var path = require('path');

const login = require('./login');
const register = require('./register');
const passenger = require('./passengerBC');

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
    console.log('path: ' + path.join(__dirname, '../public/index.html'));
});

router.post('/login', login.login);
router.post('/register', register.register);
router.post('/breezecardNums', passenger.getBreezecardNums);
router.post('/stations', passenger.getStations);
router.post('/endStations', passenger.getEndStations);


module.exports = router;
