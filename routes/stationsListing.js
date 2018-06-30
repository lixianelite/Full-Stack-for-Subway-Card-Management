const db = require('../databases/dbconnection');


const sql_query_stations = 'SELECT Name, StopID, EnterFare, ClosedStatus FROM Station';
const sql_query_station_id = 'SELECT * FROM Station WHERE StopID = ?';
const sql_query_intersection = 'SELECT Intersection From BusStation WHERE StopID = ?';
const sql_update_fare = 'UPDATE Station SET EnterFare = ? WHERE StopID = ?';
const sql_update_status = 'UPDATE Station SET ClosedStatus = ? WHERE StopID = ?';


module.exports.getStations = function(req, res) {

    db.query(sql_query_stations, function(err, rows) {
        if(err) throw err;

        var data = JSON.stringify(rows);

        res.send(data).end();

    });

};

module.exports.getStationById = function(req, res) {

    var stopID = req.param('StopID');

    stationByIdQuery(stopID, res)
        .then(intersectionQuery, dataWrapUp);

};


module.exports.updateFare = function(req, res) {

    var fare = req.body.fare;

    var stopID = req.body.StopID;

    db.query(sql_update_fare, [fare, stopID], function(err) {
        if(err) throw err;

        res.send('Success').end();

    });
};

module.exports.updateStatus = function(req, res) {

    var status = req.body.status;
    var stopID = req.body.stopID;

    var value = status == 'true' ? 0 : 1;


    db.query(sql_update_status, [value, stopID], function(err) {

        if(err) throw err;

        res.send('success').end();

    });

};

var stationByIdQuery = function(stopID, res) {

    return new Promise(function(resolve, reject) {
        db.query(sql_query_station_id, stopID, function(err, rows) {
            if(err) throw err;

            var value = {
                'data': rows[0],
                'res': res
            };
            if(!rows[0].IsTrain) {
                resolve(value);
            }else{
                reject(value);
            }
        });
    });
};

var intersectionQuery = function(result) {

    var stationInfo = result.data;

    var res = result.res;

    var StopID = stationInfo.StopID;

    console.log('StopID: ' + StopID);

    db.query(sql_query_intersection, StopID, function(err, rows) {
        if(err) throw err;

        console.log(rows);

        var station = JSON.stringify(stationInfo);

        var data = {
            'stationInfo': station,
            'intersectionInfo': rows[0].Intersection
        };

        res.send(data).end();

    });
};

var dataWrapUp = function(result) {
    var stationInfo = result.data;

    var res = result.res;

    var station = JSON.stringify(stationInfo);
    
    var data = {
        'stationInfo': station,
        'intersectionInfo': ''
    };

    res.send(data).end();

};