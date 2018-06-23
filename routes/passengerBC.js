const db = require('../databases/dbconnection');


const sql_select_nosuspend_card = 'SELECT * FROM Breezecard WHERE BreezecardNum' 
                        + ' NOT IN (SELECT C.BreezecardNum from Conflict AS C) AND BelongsTo=?';
const sql_select_all_stations = 'SELECT * FROM Station';
const sql_select_end_stations = 'SELECT Name FROM Station AS S WHERE S.IsTrain = (SELECT IsTrain FROM Station AS C WHERE C.Name = ?) AND S.Name != ?;';

exports.getBreezecardNums = function(req, res) {

    var username = req.body.username;

    db.query(sql_select_nosuspend_card, username, function(err, rows) {
        if(err) throw err;
        var json = '';
        if(rows.length > 0) {
            json = JSON.stringify(rows);
        }
        res.send(json).end();
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
    console.log(sql_select_end_stations);
    db.query(sql_select_end_stations, [req.body.startsAt, req.body.startsAt], function(err, rows) {
        //console.log(sql_select_end_stations);
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