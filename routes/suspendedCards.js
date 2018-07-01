const db = require('../databases/dbconnection');

const sql_query_conflict = 'SELECT C.BreezecardNum, C.Username, C.DateTime, B.BelongsTo FROM' 
                            + ' Conflict AS C LEFT JOIN Breezecard AS B ON C.BreezecardNum = B.BreezecardNum';
const sql_query_breezecardbyBelongsTo = 'SELECT * FROM Breezecard WHERE BelongsTo = ?';
const sql_query_breezecard = 'SELECT * FROM Breezecard WHERE BreezecardNum = ?;';

const sql_insert_breezecard = 'INSERT INTO Breezecard(BreezecardNum, Value, BelongsTo) Values(?, ?, ?);';

const sql_update_breezecard = 'UPDATE Breezecard SET BelongsTo = ? WHERE BreezecardNum = ?;';

const sql_delete_conflict = 'DELETE FROM Conflict WHERE BreezecardNum = ?';




module.exports.getCards = function(req, res) {

    db.query(sql_query_conflict, function(err, rows) {
        if(err) throw err;

        var data = JSON.stringify(rows);

        res.send(data).end();
    });
};

module.exports.assignCardsToNew = function(req, res) {

    var breezecardNum = req.body.breezecardNum;
    var newOwner = req.body.newOwner;
    var oldOwner = req.body.oldOwner;
    
    console.log(req.body);

    Promise
        .all([queryOldOwnerCards(oldOwner), deleteConflict(breezecardNum)])
        .then(function(results) {
            var result = results[0];
            if(result.length == 1) {

                return getNewCard(oldOwner);

            }else if(result.length < 1) {
                throw new Error('the old Owner has no card before');
            } else {
                return 'OK';
            }
        })
        .then(function() {
            return updateBreezecard(newOwner, breezecardNum);
        })
        .then(function(result) {
            res.send(result).end();
        })
        .catch(function(err) {
            console.log(err);
        });
};

module.exports.assignCardsToOld = function(req, res) {

    var breezecardNum = req.body.breezecardNum;
    var newOwner = req.body.newOwner;
    var oldOwner = req.body.oldOwner;
    
    console.log(req.body);

    Promise
        .all([queryNewOwnerCards(newOwner), deleteConflict(breezecardNum)])
        .then(function(results) {
            var result = results[0];
            if(result.length == 1) {

                return getNewCard(newOwner);

            }else if(result.length < 1) {
                throw new Error('the old Owner has no card before');
            } else {
                return 'OK';
            }
        })
        .then(function() {
            return updateBreezecard(oldOwner, breezecardNum);
        })
        .then(function(result) {
            res.send(result).end();
        })
        .catch(function(err) {
            console.log(err);
        });
};




var queryOldOwnerCards = function(name) {

    return new Promise(function(resolve) {
        db.query(sql_query_breezecardbyBelongsTo, name, function(err, rows) {
            if(err) throw err;
            resolve(rows);
        });
    });
};


var queryNewOwnerCards = function(name) {
    return new Promise(function(resolve) {
        db.query(sql_query_breezecardbyBelongsTo, name, function(err, rows) {
            if(err) throw err;
            resolve(rows);
        });
    });
};

var updateBreezecard = function(newOwner, BreezecardNum) {
    
    return new Promise(function(resolve) {

        db.query(sql_update_breezecard, [newOwner, BreezecardNum], function(err) {
            if(err) throw err;
            resolve('update success');
        });
    });
};

var deleteConflict = function(breezecardNum) {

    return new Promise(function(resolve) {
        db.query(sql_delete_conflict, breezecardNum, function(err) {
            if(err) throw err;
            resolve('OK');
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




