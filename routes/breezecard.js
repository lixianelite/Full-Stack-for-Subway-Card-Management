const db = require('../databases/dbconnection');

const sql_query_breezecards = 'SELECT * FROM Breezecard';
const sql_query_breezecard_byName = 'SELECT * FROM Breezecard WHERE BelongsTo = ?';
const sql_query_breezecard = 'SELECT * FROM Breezecard WHERE BreezecardNum = ?;';
const sql_query_conflict = 'SELECT BreezecardNum FROM Conflict';
const sql_query_user_byName = 'SELECT * FROM User WHERE Username = ?';

const sql_insert_breezecard = 'INSERT INTO Breezecard(BreezecardNum, Value, BelongsTo) Values(?, ?, ?);';

const sql_update_breezecard = 'UPDATE Breezecard SET Value = ? WHERE BreezecardNum = ?';
const sql_update_breezecardName = 'UPDATE Breezecard SET BelongsTo = ? WHERE BreezecardNum = ?';

const sql_delete_conflict = 'DELETE FROM Conflict WHERE BreezecardNum = ?';


module.exports.getBreezecards = function(req, res) {

    Promise
        .all([queryBreezecards(), getConflictNum()])
        .then(function(results) {
            var result1 = JSON.stringify(results[0]);
            var result2 = JSON.stringify(results[1]);

            var data = {
                'breezecards': result1,
                'conflictNum': result2
            };
            res.send(data).end();
        });
};

module.exports.updateBreezecardValue = function(req, res) {

    var breezecardNum = req.body.breezecardNum;

    var value = req.body.value;

    db.query(sql_update_breezecard, [value, breezecardNum], function(err) {
        if(err) throw err;

        res.send('success').end();

    });

};

module.exports.transferCard = function(req, res) {
    var breezecardNum = req.body.breezecardNum;
    var owner = req.body.owner;
    var new_owner = req.body.new_owner;

    Promise
        .all([queryBreezecardByName(owner), queryUserByName(new_owner), deleteConflictByNumber(breezecardNum)])
        .then(function(results) {
            if(results[1].length == 0 || results[1][0].IsAdmin == 1) {
                throw new Error('the account is not exist or the account is an admin account');
            }
            if(results[0].length == 1) {
                return getNewCard(owner);
            }
            return 'OK';
        })
        .then(function() {
            return updateBreezecard(breezecardNum, new_owner);
        })
        .then(function(result) {
            if(result == 'OK') {
                res.send(result).end();
            }
        })
        .catch(function(err) {
            res.send(err.message).end();
        });
};

var queryBreezecardByName = function(name) {

    return new Promise(function(resolve) {
        db.query(sql_query_breezecard_byName, name, function(err, rows) {
            if(err) throw err;

            resolve(rows);
        });
    });
};

var updateBreezecard = function(breezecardNum, new_owner) {
    
    return new Promise(function(resolve) {
        db.query(sql_update_breezecardName, [new_owner, breezecardNum], function(err) {
            if(err) throw err;
            resolve('OK');
        });
    });
};

var queryUserByName = function(name) {
    
    return new Promise(function(resolve) {
        db.query(sql_query_user_byName, name, function(err, rows) {
            if(err) throw err;
            resolve(rows);
        });
    });
};

var deleteConflictByNumber = function(breezecardNum) {

    return new Promise(function(resolve) {
        db.query(sql_delete_conflict, breezecardNum, function(err) {
            if(err) throw err;
            resolve('OK');
        });
    });
};


var queryBreezecards = function() {

    return new Promise(function(resolve) {
        db.query(sql_query_breezecards, function(err, rows) {
            if(err) throw err;
            resolve(rows);
        });
    });

};

var getConflictNum = function() {

    return new Promise(function(resolve) {
        db.query(sql_query_conflict, function(err, rows) {
            if(err) throw err;
            resolve(rows);
        });
    });

};

var randomString = function(length) {
    var result = '';
    for(var i = 0; i < length; i++) {
        result += Math.floor((Math.random() * 10));
    }
    return result;
};

var getNewCard = function(username) {
    var card_number = randomString(16);

    return new Promise(function(resolve) {
        db.query(sql_query_breezecard, card_number, function(err, rows) {
            if(rows.length > 0) {
                getNewCard(username);
            } else {
                db.query(sql_insert_breezecard, [card_number, 0.0, username], function(err) {
                    if (err) {
                        console.error(err);
                        throw err;
                    }
                    resolve('OK');
                });
            }
        });
    });
};