const db = require('../databases/dbconnection');

module.exports.flowReport = function(req, res) {

    var startTime = req.query.startTime;
    var endTime = req.query.endTime;
    console.log(startTime);
    console.log(endTime);

    var constraint = '';

    if(startTime != undefined && startTime != '') {
        constraint += ' WHERE ';
        constraint += `StartTime >= '${startTime}'`;
    }

    if(endTime != undefined && endTime != '') {
        if(constraint == '') {
            constraint += ' WHERE ';
        }else {
            constraint += ' AND ';
        }
        constraint += `StartTime <= '${endTime}'`;
    }

    console.log(constraint);

    var sql = `SELECT ST.Name, ST.IsTrain, F.passengersIn, F.passengersOut, F.Flow, F.Tripfare FROM 
    (SELECT IFNULL(M.StartsAt, M.EndsAt) AS StartsAt, M.passengersIn, M.passengersOut, (M.passengersIn - M.passengersOut) AS Flow, M.Tripfare 
    FROM (
        SELECT X.StartsAt, X.EndsAt, IFNULL(X.passengersIn, 0) AS passengersIn, IFNULL(X.passengersOut, 0) AS passengersOut, IFNULL(X.Tripfare, 0) AS Tripfare 
        FROM (
            SELECT* FROM (SELECT StartsAt, count(*) AS passengersIn, SUM(Tripfare) AS Tripfare 
            FROM Trip 
            ${constraint} 
            GROUP BY StartsAt) AS S 
        LEFT JOIN (
            SELECT EndsAt, count(*) AS passengersOut 
            FROM Trip 
            ${constraint} 
            GROUP BY EndsAt) AS E 
        ON S.StartsAt = E.EndsAt 
    UNION 
    SELECT * 
    FROM (
        SELECT StartsAt, COUNT(*) AS passengersIn, SUM(Tripfare) AS Tripfare 
        FROM Trip 
        ${constraint} 
        GROUP BY StartsAt) AS S 
    RIGHT JOIN (
        SELECT EndsAt, count(*) AS passengersOut 
        FROM Trip 
        ${constraint} 
        GROUP BY EndsAt) AS E 
    ON S.StartsAt = E.EndsAt) AS X 
        WHERE X.StartsAt IS NOT NULL OR X.EndsAt IS NOT NULL) AS M) AS F, Station AS ST WHERE F.StartsAt = ST.StopID;`;

    db.query(sql, function(err, rows) {
        if (err) throw err;

        console.log(rows);
        res.send(JSON.stringify(rows))
            .end();
    });

};