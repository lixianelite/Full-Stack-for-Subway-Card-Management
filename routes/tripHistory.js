const db = require('../databases/dbconnection');

const sql_query_tripHistory_template = 'SELECT R.BreezecardNum, R.StartTime, R.Tripfare, R.Source, S1.Name AS Destination FROM (SELECT T.BreezecardNum, T.StartTime, T.Tripfare, S.Name AS Source, T.EndsAt FROM Trip AS T, Station AS S'
                              + ' WHERE T.BreezecardNum IN'
                              + ' (SELECT BreezecardNum FROM Breezecard AS B'
                              + ' WHERE B.BelongsTo = ? AND B.BreezecardNum'
                              + ' NOT IN (SELECT BreezecardNum FROM Conflict))'
                              + ' AND T.StartsAt = S.StopID) AS R, Station AS S1'
                              + ' WHERE R.EndsAt = S1.StopID';

module.exports.tripHistory = function(req, res) {

    var sql_query_tripHistory = sql_query_tripHistory_template;

    console.log(req.query);

    var startTime = req.query.starttime;
    var endTime = req.query.endtime;

    if(String(startTime) !== '') {
        sql_query_tripHistory += ` AND StartTime >= "${startTime}"`;
    }
    if(String(endTime) !== '') {
        sql_query_tripHistory += ` AND StartTime <= "${endTime}"`;
    }

    console.log(sql_query_tripHistory);

    db.query(sql_query_tripHistory, req.query.username, function(err, rows) {
        if(err) throw err;
        console.log(rows);

        res.send(JSON.stringify(rows));

    });



};
