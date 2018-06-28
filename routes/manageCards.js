const db = require('../databases/dbconnection');


const sql_query_specific_card = 'SELECT * FROM Breezecard WHERE BreezecardNum = ?';
const sql_query_conflict = 'SELECT * FROM Conflict WHERE Username= ? AND BreezecardNum = ?';

const sql_insert_conflict = 'INSERT INTO Conflict(Username, BreezecardNum) VALUE(?, ?);';
const sql_insert_breezecard = 'INSERT INTO Breezecard(BreezecardNum, Value, BelongsTo) VALUES(?, ?, ?)';

const sql_update_breezecard = 'UPDATE Breezecard SET BelongsTo = ? WHERE BreezecardNum = ?';
const sql_update_breezecard_value = 'UPDATE Breezecard SET Value = ? WHERE BreezecardNum = ?';

const sql_update_breezecard_BelongsTo = 'UPDATE Breezecard SET BelongsTo = NULL WHERE BreezecardNum = ?';

module.exports.addNewBreezecard = function(req, res){
    var body = req.body;

    console.log(body.username);
    console.log(body.breezecard);

    Promise
        .all(
            [getBreezecard(body.breezecard),
                getConflictList(body.username, body.breezecard)])
        .then(function(results) {

            var breezecardResult = results[0];
            var conflictResult = results[1];

            if(breezecardResult.length == 0) {

                return insertBreezecard(body.username, body.breezecard);

            } else if(breezecardResult[0].BelongsTo != null) {

                if(conflictResult.length > 0) {
                    return { 
                        'message': 'Conflict again',
                        'value': 0.0
                    };
                }

                return insertConflict(body.username, body.breezecard);

            } else if(breezecardResult[0].BelongsTo == null) {

                return updateBreezecard(body.username, body.breezecard, breezecardResult[0]);
            }

        }).then(function(result) {
            console.log(result);
            res.send(result).end();
        });

};

module.exports.addValue = function(req, res) {
    var body = req.body;
    console.log(body.breezecardNum);
    console.log(body.value);

    db.query(sql_update_breezecard_value, [body.value, body.breezecardNum], function(err) {
        if(err) throw err;
        
        res.send('success').end();

    });

};

module.exports.removeCard = function(req, res) {
    var body = req.body;

    console.log(body);

    db.query(sql_update_breezecard_BelongsTo, body.breezecardNum, function(err) {
        if(err) throw err;

        res.send('success').end();

    });

};

var insertBreezecard = function(username, breezecard) {
    
    return new Promise(function(resolve) {
        db.query(sql_insert_breezecard, [breezecard, 0.0, username], function(err){
            if(err) throw err;
            //console.log('query executed');
            return resolve({ 
                'message': 'Insert breezecard success',
                'value': 0.0
            });
        });
    });
};

var insertConflict = function(username, breezecardNum) {
    
    return new Promise(function(resolve) {
        db.query(sql_insert_conflict, [username, breezecardNum], function(err) {
            if(err)  throw err;

            return resolve({ 
                'message': 'Insert conflict success',
                'value': 0.0
            });

        });
    });
};

var updateBreezecard = function(username, breezecardNum, breezecard) {
    return new Promise(function(resolve) {
        db.query(sql_update_breezecard, [username, breezecardNum], function(err) {
            if (err) throw err;
            return resolve({ 
                'message': 'Update breezecard',
                'value': breezecard.Value
            });
        });
    });
};

var getBreezecard = function(breezecardNum) {

    return new Promise(function(resolve) {
        db.query(sql_query_specific_card, breezecardNum, function(err, rows) {
            if(err) throw err;
            return resolve(rows);
        });
    });
};

var getConflictList = function(username, breezecardNum) {

    return new Promise(function(resolve) {
        db.query(sql_query_conflict, [username, breezecardNum], function(err, rows) {
            if(err) throw err;
            return resolve(rows);
        });
    });

};