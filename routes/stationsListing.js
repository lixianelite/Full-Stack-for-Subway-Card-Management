const db = require('../databases/dbconnection');


const sql_query_stations = 'SELECT Name, StopID, EnterFare, ClosedStatus FROM Station';
const sql_query_station_id = 'SELECT * FROM Station WHERE StopID = ?';
const sql_query_intersection = 'SELECT Intersection From BusStation WHERE StopID = ?';
const sql_query_station_name = 'SELECT * FROM Station WHERE Name = ? AND IsTrain = ?';

const sql_update_fare = 'UPDATE Station SET EnterFare = ? WHERE StopID = ?';
const sql_update_status = 'UPDATE Station SET ClosedStatus = ? WHERE StopID = ?';

const sql_create_station = 'INSERT INTO Station(StopID, Name, EnterFare, ClosedStatus, IsTrain) VALUES(?, ?, ?, ?, ?)';
const sql_create_intersection = 'INSERT INTO BusStation(StopID, Intersection) VALUES(?, ?)';


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

module.exports.createStation = function(req, res) {

    var data = req.body;

    var name = data.name;
    var stopID = data.stopID;
    var fare = data.fare;
    var isTrain = data.isTrain;
    var closedStatus = data.closeStatus;
    var intersection = data.intersection;

    Promise
        .all([checkStopId(stopID), checkStationName(name, isTrain)])
        .then(function(results) {
            var queryResult1 = results[0];
            var queryResult2 = results[1];

            if(queryResult1.length == 0 && queryResult2.length == 0) {
                return createNewStation(stopID, name, fare, closedStatus, isTrain, intersection);
            }else if (queryResult1.length != 0){
                throw new Error('StopID should be Unique');
            }else if (queryResult2.length != 0) {
                throw new Error('Name and type should be unique');
            }
        })
        .then(function() {
            if (isTrain == '0' && intersection != '') {
                return createIntersection(stopID, intersection);
            }else {
                return 'success';
            }
        }).then(function(result){
            res.send(result).end();
        }) 
        .catch(function(err) {
            console.log(err);
            res.send(err.message).end();
        });

};


var createNewStation = function(stopID, name, fare, closeStatus, isTrain) {

    return new Promise(function(resolve) {
        db.query(sql_create_station, [stopID, name, fare, closeStatus, isTrain], function(err) {
            if(err) throw err;
            resolve('success');
        });
    });
};


var createIntersection = function(stopID, intersection) {
    return new Promise(function(resolve) {
        db.query(sql_create_intersection, [stopID, intersection], function(err) {
            if(err) {
                resolve('duplicate');
            }
            resolve('success');
        });
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

var checkStopId = function(StopID) {
    return new Promise(function(resolve) {
        db.query(sql_query_station_id, StopID, function(err, rows) {
            if(err) throw err;

            resolve(rows);
        });
    });
};

var checkStationName = function(name, type) {
    return new Promise(function(resolve) {

        db.query(sql_query_station_name, [name, type], function(err, rows) {
            if(err) throw err;
            resolve(rows);
        });
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