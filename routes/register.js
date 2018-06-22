const md5 = require('md5');
const db = require('../databases/dbconnection'); 

const sql_insert_breezecard = 'INSERT INTO Breezecard(BreezecardNum, Value, BelongsTo) Values(?, ?, ?);';
const sql_query_passenger_username = 'SELECT * FROM Passenger WHERE Username = ?;';
const sql_query_passenger_email = 'SELECT * FROM Passenger WHERE Email = ?;';
const sql_insert_user = 'INSERT INTO User(Username, Password, IsAdmin) VALUES(?, ?, ?);';
const sql_insert_passenger = 'INSERT INTO Passenger(Username, Email) VALUES(?, ?);';
const sql_query_breezecard = 'SELECT * FROM Breezecard WHERE BreezecardNum = ?;';
const sql_insert_conflict = 'INSERT INTO Conflict(Username, BreezecardNum) VALUE(?, ?);';
const sql_update_breezecard = 'UPDATE Breezecard SET BelongsTo = ? WHERE BreezecardNum = ?;';


module.exports.register = function(req, res){
    var user = {
        'username': req.body.username,
        'password': req.body.password,
        'email': req.body.email,
        'breeze_card_switch': req.body.breeze_card_switch,
        'breezecard_num': req.body.breezecard_num
    };
    
    Promise
        .all([checkUsername(user.username),
            checkEmail(user.email)])
        .then(function(results){
            formValidation(results, res);
        })
        .then(function(){
            registerUserAndPassenger(user.username, user.password, user.email);
        })
        .then(function() {
            if (user.breeze_card_switch === undefined) {
                getNewCard(user.username, res, 'OK');
            } else {
                breezecard_process(user.username, user.breezecard_num, res);
            } 
        })
        .catch(function(err) {
            if (err.message === 'abort promise chain') {
                console.log('this is what I want');
            }
        });

};

function breezecard_process(username, breezecard_num, res) {
    var breezecard_query = new Promise(function(resolve){
        db.query(sql_query_breezecard, breezecard_num, function(err, rows) {
            if (rows.length > 0) {
                return resolve({
                    'cardUsing': true,
                    'belongsTo': rows[0].BelongsTo
                });
            }
            return resolve({
                'cardUsing': false,
                'belongsTo': null
            });
        });
    });

    breezecard_query.then(function(result) {
        if(result.cardUsing) {
            if (result.belongsTo != null) {
                var codeStatus = 'CONFLICT';
                db.query(sql_insert_conflict, [username, breezecard_num], function (err) {
                    if(err) codeStatus = 'CONFLICT_AGAIN';
                    getNewCard(username, res, codeStatus);
                });
            } else {
                db.query(sql_update_breezecard, [username, breezecard_num], function(err) {
                    if(err) throw err;
                    sendBack(res, 200, 'OK');
                });
            }
        } else {
            db.query(sql_insert_breezecard, [breezecard_num, 0.0, username], function(err) {
                if(err) throw err;
                sendBack(res, 200, 'OK');
            });
        }
    });
}

function sendBack(res, code, statusCode) {
    res.send({
        'code': code,
        'statusCode': statusCode
    });
}


function formValidation(results, res) {
    if(results[0] && results[1]) {
        res.send({
            'code': 200,
            'statusCode': 'USERNAME_AND_EMAIL_ALREADY_EXIST'
        }).end();
        throw new Error('abort promise chain');
    }else if(results[0]) {
        res.send({
            'code': 200,
            'statusCode': 'USERNAME_ALREADY_EXIST'
        }).end();
        throw new Error('abort promise chain');
    }else if(results[1]) {
        res.send({
            'code': 200,
            'statusCode': 'EMAIL_ALREADY_EXIST'
        }).end();
        throw new Error('abort promise chain');
    }
}

function registerUserAndPassenger(username, password, email) {
    var registerUser = new Promise(function (resolve) {
        db.query(sql_insert_user, [username, md5(password), 0]);
        return resolve(true);
    });

    registerUser.then(function(){
        db.query(sql_insert_passenger, [username, email]);
    });
}


function checkUsername(username) {
    return new Promise(function(resolve){
        db.query(sql_query_passenger_username, username, 
            function(err, rows) {
                if (rows.length > 0) {
                    return resolve(true);
                }
                return resolve(false);
            });
    });
}

function checkEmail(Email) {
    return new Promise(function(resolve) {
        db.query(sql_query_passenger_email, Email, 
            function(err, rows) {
                if (rows.length > 0) {
                    console.log('exist');
                    return resolve(true);
                }
                return resolve(false);
            });
    });
}



function getNewCard(username, res, statusCode) {
    var card_number = randomString(16);

    db.query(sql_query_breezecard, card_number, function(err, rows) {
        if(rows.length > 0) {
            getNewCard(username, res, statusCode);
        } else {
            db.query(sql_insert_breezecard, [card_number, 0.0, username], function(err) {
                if (err) {
                    console.error(err);
                    throw err;
                }
                res.send({
                    'code': 200,
                    'statusCode': statusCode
                }).end();
            });
        }

    });
}

function randomString(length) {
    var result = '';
    for(var i = 0; i < length; i++) {
        result += Math.floor((Math.random() * 10));
    }
    return result;
}