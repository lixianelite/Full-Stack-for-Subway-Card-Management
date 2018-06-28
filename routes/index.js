var express = require('express');

var router = express.Router();

var path = require('path');

const login = require('./login');
const register = require('./register');
const passenger = require('./passengerBC');
const tripHistory = require('./tripHistory');
const manageCards = require('./manageCards');
const flowReport = require('./flowReport');

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
router.post('/addValue', manageCards.addValue);
router.post('/removecard', manageCards.removeCard);

router.get('/tripHistory', tripHistory.tripHistory);
router.get('/flowReport', flowReport.flowReport);



module.exports = router;
