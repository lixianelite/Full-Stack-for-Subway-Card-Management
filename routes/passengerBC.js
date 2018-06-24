const db = require('../databases/dbconnection');


const sql_select_nosuspend_card = 'SELECT * FROM Breezecard WHERE BreezecardNum' 
                        + ' NOT IN (SELECT C.BreezecardNum from Conflict AS C) AND BelongsTo=?';
const sql_select_all_stations = 'SELECT * FROM Station';
const sql_select_end_stations = 'SELECT Name FROM Station AS S WHERE S.IsTrain = ?;';
const sql_select_on_trip_card = 'SELECT T.StartTime, T.BreezecardNum, T.StartsAt, S.Name, S.EnterFare FROM Trip AS T, Station AS S'
                                + ' WHERE T.BreezecardNum IN' 
                                + ' (SELECT B.BreezecardNum FROM Breezecard AS B WHERE B.BreezecardNum NOT IN (SELECT C.BreezecardNum FROM Conflict AS C) AND BelongsTo = ?)'
                                + ' AND T.EndsAt is NULL'
                                + ' AND T.StartsAt = S.StopID;';
const sql_insert_trip = 'INSERT INTO TRIP(BreezeCardNum, Tripfare, StartsAt) Values(?, ?, (SELECT StopID FROM Station WHERE Name = ? AND IsTrain = ?));';
const sql_update_balance = 'UPDATE Breezecard SET Value = ? WHERE BreezecardNum = ?;';

exports.getBreezecardNums = function(req, res) {

    var username = req.body.username;

    var promise = new Promise(function(resolve) {
        db.query(sql_select_nosuspend_card, username, function(err, rows) {
            if(err) throw err;
            var json = '';
            if(rows.length > 0) {
                json = JSON.stringify(rows);
            }
            return resolve(json);
        });
    });

    promise.then(function(result) {
        console.log(sql_select_on_trip_card);
        db.query(sql_select_on_trip_card, username, function(err, rows) {
            if(err) throw err;
            var json = '';
            if(rows.length > 0){
                json = JSON.stringify(rows);
            }
            res.send({
                'breezecardsInfo': result,
                'tripInfo': json
            }).end();

        });

    });

};

module.exports.startTrip = function(req, res) {

    var body = req.body;

    console.log(body);

    var type = body.type === 'Train' ? 1 : 0;

    var promise = new Promise(function(resolve) {
        db.query(sql_insert_trip, [body.cardNum, body.tripFare, body.startsAt, type], function(err) {
            if(err) throw err;
            console.log('executed');
            return resolve();
        });
    });

    promise.then(function() {
        db.query(sql_update_balance, [body.balance, body.cardNum], function(err) {
            if(err) throw err;
            res.send({
                statusCode: 'START_TRIP'
            }).end();
            return;
        });
    });
};

module.exports.getStations = function(req, res) {
    db.query(sql_select_all_stations, function(err, rows) {
        if(err) throw err;
        var json = '';
        if(rows.length > 0) {
            json = JSON.stringify(rows);
        }
        res.send(json).end();
    });
};

module.exports.getEndStations = function(req, res) {
    if(req.body == undefined) {
        res.send({
            'code': 200,
            'statusCode': 'No_PARAMETER_FOUND'
        }).end();
        return;
    }

    console.log(req.body);

    var type = req.body.type == 'Train' ? 1 : 0;

    db.query(sql_select_end_stations, [type], function(err, rows) {
        if(err) throw err;
        var json = '';
        if(rows.length > 0) {
            json = JSON.stringify(rows);
        }
        res.send({
            'code': 200,
            'statusCode': 'OK',
            'body': json
        }).end();
    });
};