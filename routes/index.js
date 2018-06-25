var express = require('express');

var router = express.Router();

var path = require('path');

const login = require('./login');
const register = require('./register');
const passenger = require('./passengerBC');
const tripHistory = require('./tripHistory');
const manageCards = require('./manageCards');

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
    console.log('path: ' + path.join(__dirname, '../public/index.html'));
});


router.post('/login', login.login);
router.post('/register', register.register);
router.post('/breezecardNums', passenger.getBreezecardNums);
router.post('/stations', passenger.getStations);
router.post('/endStations', passenger.getEndStations);
router.post('/startTrip', passenger.startTrip);
router.post('/endTrip', passenger.endTrip);
router.post('/addNewCard', manageCards.addNewBreezecard);

router.get('/tripHistory', tripHistory.tripHistory);



module.exports = router;
